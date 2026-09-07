import nodemailer from 'nodemailer';
import { BookingRequest, EmailStatus } from '../src/types';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@technocoredavao.com';
const SENDER_EMAIL = process.env.SMTP_FROM || '"Techno Core Davao" <no-reply@technocoredavao.com>';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Development / Fallback JSON Transport (Logs emails safely without crashing when SMTP is unconfigured)
  return nodemailer.createTransport({
    jsonTransport: true
  });
}

/**
 * Format currency to PHP
 */
function formatPhp(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

/**
 * Generates HTML template for Customer Quote Confirmation
 */
function generateCustomerEmailHtml(booking: BookingRequest): string {
  const itemsHtml = booking.selectedItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #222; color: #fff; font-size: 13px;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #222; color: #aaa; font-size: 13px; text-align: center;">x${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #222; color: #FF1E1E; font-size: 13px; text-align: right; font-weight: bold;">${formatPhp(item.price * item.quantity)}</td>
      </tr>
    `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Techno Core Quote Request Confirmation</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e5e5e5;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #0d0d0d; border: 1px solid #222; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
      
      <!-- Header -->
      <div style="background-color: #000; padding: 25px; text-align: center; border-bottom: 3px solid #FF1E1E;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
          TECHNO <span style="color: #FF1E1E;">CORE</span>
        </h1>
        <p style="margin: 5px 0 0 0; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
          Pro Audio • Stage Lighting • LED Video Walls • Davao City
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 30px;">
        <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Quote Request Received!</h2>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
          Madiyaw na adlaw, <strong>${booking.customerName}</strong>! Thank you for requesting an event quotation from Techno Core. Our technical production team is reviewing your requested gear specifications.
        </p>

        <!-- Booking Overview Box -->
        <div style="background-color: #141414; border: 1px solid #262626; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 4px 0; color: #888; width: 40%;">Reference No:</td>
              <td style="padding: 4px 0; color: #fff; font-weight: bold;">#${booking.id}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #888;">Inquiry Type:</td>
              <td style="padding: 4px 0; color: #FF1E1E; font-weight: bold; text-transform: uppercase;">${booking.type}</td>
            </tr>
            ${booking.eventDate ? `
            <tr>
              <td style="padding: 4px 0; color: #888;">Event Date:</td>
              <td style="padding: 4px 0; color: #fff;">${booking.eventDate}</td>
            </tr>` : ''}
            ${booking.venueLocation ? `
            <tr>
              <td style="padding: 4px 0; color: #888;">Venue Location:</td>
              <td style="padding: 4px 0; color: #fff;">${booking.venueLocation}</td>
            </tr>` : ''}
            ${booking.guestCount ? `
            <tr>
              <td style="padding: 4px 0; color: #888;">Guest Capacity:</td>
              <td style="padding: 4px 0; color: #fff;">${booking.guestCount}</td>
            </tr>` : ''}
          </table>
        </div>

        <!-- Line Items Table -->
        <h3 style="color: #ffffff; font-size: 15px; margin-bottom: 10px; border-left: 3px solid #FF1E1E; padding-left: 8px;">Requested Line Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #111; border-radius: 6px; overflow: hidden;">
          <thead>
            <tr style="background-color: #1a1a1a; text-align: left; font-size: 11px; text-transform: uppercase; color: #888;">
              <th style="padding: 10px;">Item / Service</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Est. Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #181818;">
              <td colspan="2" style="padding: 12px 10px; color: #fff; font-weight: bold; font-size: 14px; text-align: right;">Estimated Total:</td>
              <td style="padding: 12px 10px; color: #FF1E1E; font-weight: 900; font-size: 16px; text-align: right;">${formatPhp(booking.totalEstimatedPrice)}</td>
            </tr>
          </tfoot>
        </table>

        ${booking.notes ? `
        <div style="background-color: #111; border-left: 3px solid #666; padding: 10px 15px; margin-bottom: 20px;">
          <span style="color: #888; font-size: 11px; font-weight: bold; text-transform: uppercase;">Your Special Notes:</span>
          <p style="color: #ddd; font-size: 13px; margin: 4px 0 0 0;">${booking.notes}</p>
        </div>` : ''}

        <!-- Next Steps -->
        <div style="background-color: #1a0a0a; border: 1px solid #4a1010; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <h4 style="margin: 0 0 6px 0; color: #FF1E1E; font-size: 14px;">⚡ What happens next?</h4>
          <p style="margin: 0; color: #bbb; font-size: 13px; line-height: 1.5;">
            Our lead technician will contact you via <strong>${booking.phone}</strong> or email shortly to confirm technical logistics, generator sizing, and transport details.
          </p>
        </div>

        <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">
          Need immediate support? Call our Davao Hotline: <strong>0917-123-4567</strong> (Globe) or <strong>0919-888-9999</strong> (Smart).
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #050505; padding: 15px; text-align: center; border-top: 1px solid #222; font-size: 11px; color: #666;">
        © ${new Date().getFullYear()} Techno Core Pro Audio & Event Solutions. Davao City, Philippines.
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Generates HTML template for Admin Notification
 */
function generateAdminEmailHtml(booking: BookingRequest): string {
  const itemsHtml = booking.selectedItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #222; color: #fff; font-size: 12px;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #222; color: #aaa; font-size: 12px; text-align: center;">x${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #222; color: #FF1E1E; font-size: 12px; text-align: right;">${formatPhp(item.price * item.quantity)}</td>
      </tr>
    `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>New Quote Inquiry Alert</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #050505; font-family: sans-serif; color: #e5e5e5;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #0f0f0f; border: 1px solid #FF1E1E; border-radius: 12px; overflow: hidden;">
      
      <div style="background-color: #FF1E1E; padding: 15px 20px; color: #000; font-weight: 900; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
        🚨 NEW QUOTE & BOOKING INQUIRY
      </div>

      <div style="padding: 20px;">
        <h3 style="color: #ffffff; margin-top: 0;">Client: ${booking.customerName}</h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; background-color: #141414; padding: 10px; border-radius: 6px;">
          <tr>
            <td style="padding: 6px; color: #888;">Ref ID:</td>
            <td style="padding: 6px; color: #fff; font-weight: bold;">${booking.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px; color: #888;">Phone Number:</td>
            <td style="padding: 6px; color: #00ffcc; font-weight: bold;">${booking.phone}</td>
          </tr>
          <tr>
            <td style="padding: 6px; color: #888;">Email:</td>
            <td style="padding: 6px; color: #fff;">${booking.email || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 6px; color: #888;">Inquiry Category:</td>
            <td style="padding: 6px; color: #FF1E1E; font-weight: bold; text-transform: uppercase;">${booking.type}</td>
          </tr>
          <tr>
            <td style="padding: 6px; color: #888;">Event Type / Date:</td>
            <td style="padding: 6px; color: #fff;">${booking.eventType || 'N/A'} • ${booking.eventDate || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 6px; color: #888;">Venue Location:</td>
            <td style="padding: 6px; color: #fff;">${booking.venueLocation || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 6px; color: #888;">Estimated Budget:</td>
            <td style="padding: 6px; color: #fff;">${booking.budgetRange || 'N/A'}</td>
          </tr>
        </table>

        <h4 style="color: #fff; margin-bottom: 8px;">Selected Gear & Services (${booking.selectedItems.length} items)</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; background: #111;">
          <thead>
            <tr style="background-color: #222; color: #888; font-size: 10px; text-transform: uppercase;">
              <th style="padding: 6px; text-align: left;">Item</th>
              <th style="padding: 6px; text-align: center;">Qty</th>
              <th style="padding: 6px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 16px; font-weight: bold; color: #FF1E1E; margin-bottom: 20px;">
          Total Quote Estimate: ${formatPhp(booking.totalEstimatedPrice)}
        </div>

        ${booking.notes ? `
        <div style="background-color: #1a1a1a; padding: 10px; border-left: 3px solid #FF1E1E; font-size: 12px; color: #ccc; margin-bottom: 20px;">
          <strong>Notes:</strong> ${booking.notes}
        </div>` : ''}

        <div style="text-align: center; margin-top: 25px;">
          <a href="${process.env.APP_URL || 'http://localhost:3000'}" style="display: inline-block; background-color: #FF1E1E; color: #000; padding: 12px 24px; font-weight: 900; text-decoration: none; border-radius: 4px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">
            Open Admin CMS Portal
          </a>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Sends quote confirmation emails to both customer and admin
 */
export async function sendQuoteConfirmationEmails(booking: BookingRequest): Promise<EmailStatus> {
  const transporter = getTransporter();
  const recipientEmails: string[] = [ADMIN_EMAIL];

  if (booking.email && booking.email.trim().length > 0) {
    recipientEmails.push(booking.email.trim());
  }

  const isRealSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  let customerEmailSent = false;
  let adminEmailSent = false;
  let details = '';

  try {
    // 1. Send Admin Email
    const adminMailOptions = {
      from: SENDER_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[NEW QUOTE REQUEST] #${booking.id} - ${booking.customerName} (${booking.type.toUpperCase()})`,
      html: generateAdminEmailHtml(booking)
    };

    const adminResult = await transporter.sendMail(adminMailOptions);
    adminEmailSent = true;
    console.log(`[EMAIL LOG] Admin notification sent/logged for #${booking.id}:`, adminResult.messageId || 'dispatched');

    // 2. Send Customer Email if customer provided email
    if (booking.email && booking.email.includes('@')) {
      const customerMailOptions = {
        from: SENDER_EMAIL,
        to: booking.email.trim(),
        subject: `Techno Core Davao - Quote Confirmation #${booking.id}`,
        html: generateCustomerEmailHtml(booking)
      };

      const customerResult = await transporter.sendMail(customerMailOptions);
      customerEmailSent = true;
      console.log(`[EMAIL LOG] Customer confirmation sent/logged to ${booking.email}:`, customerResult.messageId || 'dispatched');
    } else {
      console.log(`[EMAIL LOG] No customer email provided for #${booking.id}. Skipped customer copy.`);
    }

    details = isRealSmtp
      ? `Live SMTP emails sent to ${recipientEmails.join(', ')}`
      : `Emails formatted and logged for ${recipientEmails.join(', ')} (Dev mode: configure SMTP env vars for external relay)`;
  } catch (err: any) {
    console.error(`[EMAIL ERROR] Failed sending emails for #${booking.id}:`, err);
    details = `Email dispatch partial error: ${err.message || String(err)}`;
  }

  return {
    customerEmailSent,
    adminEmailSent,
    dispatchedAt: new Date().toISOString(),
    recipientEmails,
    details
  };
}

/**
 * Sends an alert to the admin about low-stock / high-demand items
 */
export async function sendLowStockAlertEmail(criticalItems: { name: string, stock: number, activeQuotes: number }[]): Promise<void> {
  const transporter = getTransporter();
  
  const itemsHtml = criticalItems.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #222; color: #fff;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #222; color: #FF1E1E; text-align: center;">${item.stock} left</td>
      <td style="padding: 8px; border-bottom: 1px solid #222; color: #f59e0b; text-align: center;">${item.activeQuotes} pending</td>
    </tr>
  `).join('');

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="margin: 0; padding: 0; background-color: #050505; font-family: sans-serif; color: #e5e5e5;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #0f0f0f; border: 1px solid #FF1E1E; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #FF1E1E; padding: 15px 20px; color: #000; font-weight: 900; font-size: 16px; text-transform: uppercase;">
        ⚠️ LOW STOCK & HIGH DEMAND ALERT
      </div>
      <div style="padding: 20px;">
        <p style="color: #fff;">The following items are running low on stock but have a high number of pending rental quotes:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; background: #111;">
          <thead>
            <tr style="background-color: #222; color: #888; font-size: 10px; text-transform: uppercase;">
              <th style="padding: 6px; text-align: left;">Item</th>
              <th style="padding: 6px; text-align: center;">Available Stock</th>
              <th style="padding: 6px; text-align: center;">Pending Quotes</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <p style="color: #888; font-size: 12px;">Please review the admin dashboard to manage these bookings.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: SENDER_EMAIL,
      to: ADMIN_EMAIL,
      subject: `⚠️ Alert: ${criticalItems.length} Items are Low Stock with High Demand`,
      html
    });
    console.log('[EMAIL LOG] Low stock alert sent to admin.');
  } catch (err: any) {
    console.error('[EMAIL ERROR] Failed sending low stock alert:', err);
  }
}

export async function sendStatusUpdateEmail(booking: BookingRequest, newStatus: string, messageText?: string): Promise<boolean> {
  const transporter = getTransporter();

  if (!booking.email || !booking.email.includes('@')) {
    console.log(`[EMAIL LOG] No customer email provided for #${booking.id}. Cannot send status update.`);
    return false;
  }

  const statusColors: Record<string, string> = {
    'confirmed': '#00ffcc',
    'cancelled': '#FF1E1E',
    'pending': '#f59e0b',
    'completed': '#3b82f6',
  };
  
  const color = statusColors[newStatus.toLowerCase()] || '#ffffff';

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="margin: 0; padding: 0; background-color: #050505; font-family: sans-serif; color: #e5e5e5;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #0f0f0f; border: 1px solid #333; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #111; padding: 20px; text-align: center; border-bottom: 2px solid ${color};">
        <h2 style="color: #fff; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Booking Status Update</h2>
      </div>
      
      <div style="padding: 30px 20px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hi ${booking.customerName},</p>
        
        <p style="font-size: 15px;">The status of your booking/quote (ID: <strong>${booking.id}</strong>) has been updated to:</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <span style="display: inline-block; background-color: ${color}22; color: ${color}; border: 1px solid ${color}; padding: 10px 24px; border-radius: 30px; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 2px;">
            ${newStatus}
          </span>
        </div>

        ${messageText ? `
        <div style="background-color: #1a1a1a; padding: 15px; border-left: 3px solid ${color}; color: #ccc; margin-bottom: 25px; line-height: 1.5;">
          <strong>Message from Techno Core:</strong><br><br>
          ${messageText.replace(/\n/g, '<br>')}
        </div>
        ` : ''}
        
        <p style="color: #aaa; font-size: 14px; line-height: 1.5;">If you have any questions, please reply directly to this email or contact us at our provided numbers.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #222; text-align: center; font-size: 12px; color: #666;">
          Techno Core Davao <br>
          Professional Audio, Visual, and Lighting Rentals
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    const mailOptions = {
      from: SENDER_EMAIL,
      to: booking.email.trim(),
      subject: `Booking Update: ${newStatus.toUpperCase()} - Techno Core Davao`,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL LOG] Status update sent/logged to ${booking.email} for #${booking.id}:`, result.messageId || 'dispatched');
    return true;
  } catch (err: any) {
    console.error(`[EMAIL ERROR] Failed sending status update for #${booking.id}:`, err);
    return false;
  }
}
