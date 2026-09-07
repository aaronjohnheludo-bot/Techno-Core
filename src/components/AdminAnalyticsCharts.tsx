import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Layers,
  ShoppingBag,
  ArrowUpRight,
  Filter,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { BookingRequest } from '../types';

interface AdminAnalyticsChartsProps {
  bookings: BookingRequest[];
}

export const AdminAnalyticsCharts: React.FC<AdminAnalyticsChartsProps> = ({ bookings }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('7d');
  const [chartView, setChartView] = useState<'overview' | 'revenue' | 'breakdown'>('overview');

  // Process booking data into daily timeline
  const chartData = useMemo(() => {
    const daysCount = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 60;
    const now = new Date();
    
    // Map of date string YYYY-MM-DD -> metrics
    const dateMap: Record<string, {
      rawDate: Date;
      dateStr: string;
      displayDate: string;
      count: number;
      rentalCount: number;
      retailCount: number;
      customCount: number;
      revenue: number;
      confirmedRevenue: number;
    }> = {};

    // Initialize recent days
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const isoKey = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      dateMap[isoKey] = {
        rawDate: d,
        dateStr: isoKey,
        displayDate,
        count: 0,
        rentalCount: 0,
        retailCount: 0,
        customCount: 0,
        revenue: 0,
        confirmedRevenue: 0
      };
    }

    // Populate actual booking data
    bookings.forEach((b) => {
      let bDate: Date;
      if (b.createdAt) {
        bDate = new Date(b.createdAt);
      } else {
        bDate = new Date();
      }

      if (isNaN(bDate.getTime())) {
        bDate = new Date();
      }

      const isoKey = bDate.toISOString().split('T')[0];

      // If booking date exists in map or add dynamically
      if (!dateMap[isoKey]) {
        const displayDate = bDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dateMap[isoKey] = {
          rawDate: bDate,
          dateStr: isoKey,
          displayDate,
          count: 0,
          rentalCount: 0,
          retailCount: 0,
          customCount: 0,
          revenue: 0,
          confirmedRevenue: 0
        };
      }

      dateMap[isoKey].count += 1;
      if (b.type === 'rental') dateMap[isoKey].rentalCount += 1;
      else if (b.type === 'retail') dateMap[isoKey].retailCount += 1;
      else dateMap[isoKey].customCount += 1;

      const price = Number(b.totalEstimatedPrice) || 0;
      dateMap[isoKey].revenue += price;
      if (b.status === 'confirmed' || b.status === 'completed') {
        dateMap[isoKey].confirmedRevenue += price;
      }
    });

    // Sort by rawDate
    const sortedList = Object.values(dateMap).sort(
      (a, b) => a.rawDate.getTime() - b.rawDate.getTime()
    );

    // Filter list according to timeframe if needed
    let filtered = sortedList;
    if (timeframe === '7d') {
      filtered = sortedList.slice(-7);
    } else if (timeframe === '30d') {
      filtered = sortedList.slice(-30);
    }

    // Compute cumulative revenue growth
    let runningCumulative = 0;
    return filtered.map((item) => {
      runningCumulative += item.revenue;
      return {
        ...item,
        cumulativeRevenue: runningCumulative
      };
    });
  }, [bookings, timeframe]);

  // Aggregate Metrics
  const totalRevenue = useMemo(() => {
    return bookings.reduce((sum, b) => sum + (Number(b.totalEstimatedPrice) || 0), 0);
  }, [bookings]);

  const avgQuoteValue = useMemo(() => {
    if (bookings.length === 0) return 0;
    return Math.round(totalRevenue / bookings.length);
  }, [bookings, totalRevenue]);

  const totalInquiries = bookings.length;

  const confirmedCount = useMemo(() => {
    return bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').length;
  }, [bookings]);

  const conversionRate = useMemo(() => {
    if (totalInquiries === 0) return 0;
    return Math.round((confirmedCount / totalInquiries) * 100);
  }, [confirmedCount, totalInquiries]);

  // Custom Recharts Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f0f0f] border border-white/20 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
          <div className="font-bold text-white uppercase border-b border-white/10 pb-1 flex items-center justify-between gap-4">
            <span>{label}</span>
            <span className="text-[10px] text-gray-400 font-mono">TechnoCore Analytics</span>
          </div>
          {payload.map((entry: any, index: number) => {
            const isMoney = entry.name.toLowerCase().includes('revenue') || entry.name.toLowerCase().includes('price');
            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4 font-mono">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}:</span>
                </span>
                <span className="font-black text-white">
                  {isMoney ? `₱${Number(entry.value).toLocaleString()}` : entry.value}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#050505] p-3.5 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
            <span>Total Value</span>
            <DollarSign className="w-3.5 h-3.5 text-[#FF1E1E]" />
          </div>
          <div className="text-xl font-black text-white mt-1">
            ₱{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400 font-bold">Pipeline Active</span>
          </div>
        </div>

        <div className="bg-[#050505] p-3.5 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
            <span>Avg Quote Size</span>
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-black text-blue-400 mt-1">
            ₱{avgQuoteValue.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Per Inquiry Average</div>
        </div>

        <div className="bg-[#050505] p-3.5 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
            <span>Total Inquiries</span>
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 mt-1">
            {totalInquiries} Quotes
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            {bookings.filter(b => b.status === 'pending').length} Pending Review
          </div>
        </div>

        <div className="bg-[#050505] p-3.5 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
            <span>Approval Rate</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {conversionRate}%
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1">{confirmedCount} Approved Quotes</div>
        </div>
      </div>

      {/* Chart Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#050505] p-3 rounded-xl border border-white/10">
        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setChartView('overview')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
              chartView === 'overview'
                ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_10px_rgba(255,30,30,0.4)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Daily Volume & Revenue</span>
          </button>

          <button
            onClick={() => setChartView('revenue')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
              chartView === 'revenue'
                ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_10px_rgba(255,30,30,0.4)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue Growth</span>
          </button>

          <button
            onClick={() => setChartView('breakdown')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
              chartView === 'breakdown'
                ? 'bg-[#FF1E1E] text-black font-black shadow-[0_0_10px_rgba(255,30,30,0.4)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Inquiry Types</span>
          </button>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10 self-end sm:self-auto">
          <span className="text-[10px] text-gray-500 font-bold uppercase px-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#FF1E1E]" />
            Range:
          </span>
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
              timeframe === '7d' ? 'bg-[#FF1E1E] text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
              timeframe === '30d' ? 'bg-[#FF1E1E] text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
              timeframe === 'all' ? 'bg-[#FF1E1E] text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="bg-[#050505] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-inner">
        <div className="h-[280px] sm:h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === 'overview' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF1E1E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF1E1E" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#222' }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#FF1E1E"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#222' }}
                  tickFormatter={(val) => `₱${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#3b82f6"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#222' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', textTransform: 'uppercase' }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="Daily Revenue (₱)"
                  fill="#FF1E1E"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="count"
                  name="Inquiries Count"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </BarChart>
            ) : chartView === 'revenue' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDailyRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF1E1E" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#FF1E1E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#222' }}
                />
                <YAxis
                  stroke="#10b981"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#222' }}
                  tickFormatter={(val) => `₱${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', textTransform: 'uppercase' }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeRevenue"
                  name="Cumulative Revenue Growth (₱)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCumulative)"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Daily Revenue (₱)"
                  stroke="#FF1E1E"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorDailyRev)"
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#222' }}
                />
                <YAxis
                  stroke="#aaa"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#222' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', textTransform: 'uppercase' }}
                />
                <Bar
                  dataKey="rentalCount"
                  name="Rental Inquiries"
                  stackId="a"
                  fill="#FF1E1E"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="retailCount"
                  name="Retail Inquiries"
                  stackId="a"
                  fill="#3b82f6"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="customCount"
                  name="Custom Inquiries"
                  stackId="a"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
