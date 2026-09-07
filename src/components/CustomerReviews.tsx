import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User } from 'lucide-react';
import { CustomerReview } from '../types';
import { reviewsHelpers } from '../lib/firebase';

interface CustomerReviewsProps {
  productId?: string; // Optional: if provided, filters reviews by product ID
}

export function CustomerReviews({ productId }: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewsHelpers.getReviews();
        // Optional filtering by productId if provided
        const filtered = productId ? data.filter(r => r.productId === productId) : data;
        // Sort by newest first
        setReviews(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-[#FF1E1E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null; // Return null if there are no reviews to show
  }

  return (
    <section className="py-16 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">
            Customer <span className="text-[#FF1E1E]">Reviews</span>
          </h2>
          <div className="w-24 h-1 bg-[#FF1E1E] mx-auto mb-6 rounded-full" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            See what our clients are saying about our equipment and services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF1E1E]/20 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#FF1E1E]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{review.customerName}</div>
                    <div className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-[10px] font-bold text-[#FF1E1E] uppercase tracking-wider bg-[#FF1E1E]/10 px-2 py-1 rounded">
                  {review.productName}
                </span>
              </div>
              
              <div className="flex-1 text-gray-300 text-sm italic">
                "{review.testimonial}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
