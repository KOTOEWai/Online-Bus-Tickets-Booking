import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, User, MessageSquare, Loader2, AlertCircle, CheckCircle, Smile, Meh, Frown } from 'lucide-react';

import UserNavbar from '../components/nav';
import Footer from '../components/Footer';
import Review from '../../public/review.png';
import { containerVariants, itemVariants, messageVariants } from '../hooks/useAnimationVariants';
import type { ReviewFormData } from '../interfaces/types';
import { useReviewQuery, useSubmitReviewMutation } from '../service/apiSlice';


const ReviewPage: React.FC = () => {
  // Use RTK Query to fetch reviews
  const { data: reviews, isLoading: loadingReviews, isError: reviewsError } = useReviewQuery();
  // Use RTK Query for submitting a review
  const [submitReview, { isLoading: submitting, isSuccess, isError }] = useSubmitReviewMutation();

  const [formData, setFormData] = useState<ReviewFormData>({ rating: 0, comment: '' });

  const currentUserId = localStorage.getItem('userId') || 'dummy_user_123';
//  const currentUsername = localStorage.getItem('user_name') || 'Guest User';

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle star rating click
  const handleRatingClick = (starValue: number) => {
    
    setFormData({ ...formData, rating: starValue });
  };

  // Handle review submission using RTK Query's mutation hook
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ ...formData });
    

    if (formData.rating === 0 || formData.comment.trim() === '') {
      return;
    }

    try {
      await submitReview({ ...formData, user_id: currentUserId }).unwrap();
      // If the mutation is successful, RTK Query automatically re-fetches the reviews
      setFormData({ rating: 0, comment: '' }); // Clear form
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const getSentimentDisplay = (sentiment: 'Positive' | 'Negative' | 'Neutral') => {
    switch (sentiment) {
      case 'Positive': return <span className="flex items-center text-green-600 font-semibold"><Smile className="w-5 h-5 mr-1" /> Positive</span>;
      case 'Negative': return <span className="flex items-center text-red-600 font-semibold"><Frown className="w-5 h-5 mr-1" /> Negative</span>;
      case 'Neutral': default: return <span className="flex items-center text-gray-600 font-semibold"><Meh className="w-5 h-5 mr-1" /> Neutral</span>;
    }
  };

  // Determine submit message based on mutation status
  const submitMessage = isSuccess ? 'Your review has been submitted successfully!' : isError ? 'Failed to submit review. Please try again.' : null;
  const submitMessageType = isSuccess ? 'success' : isError ? 'error' : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      <UserNavbar />
      <div className="container mx-auto flex-grow py-8 px-4 md:px-6">
        <div className='flex items-center justify-center mb-8 gap-3'>
          <img src={Review} className='w-10 h-10 text-blue-600'/>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mt-2">Customer Reviews</h1>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Right Column: Submit Review Form */}
          <motion.div
            className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 md:p-8 h-fit"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" /> Submit Your Review
            </h2>
            <AnimatePresence>
              {submitMessage && (
                <motion.div
                  className={`p-3 rounded-lg text-sm mb-6 flex items-center gap-2 ${
                    submitMessageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {submitMessageType === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  {submitMessage}
                </motion.div>
              )}
            </AnimatePresence>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Your Rating <span className="text-red-500">*</span></label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <Star
                      key={starValue}
                      className={`w-8 h-8 cursor-pointer transition-colors ${
                        starValue <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => handleRatingClick(starValue)}
                    />
                  ))}
                </div>
              </div>
              <div className="relative">
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={4}
                  className="peer w-full p-3 pt-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 placeholder-transparent resize-y"
                  placeholder="Share your experience..."
                  required
                ></textarea>
                <label
                  htmlFor="comment"
                  className="absolute left-3 top-1 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  Your Comment <span className="text-red-500">*</span>
                </label>
                <MessageSquare className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-500" />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                variants={itemVariants}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Submit Review
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Left Column: Existing Reviews */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 md:p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" /> What Our Users Say
            </h2>
            {loadingReviews ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                <p className="text-gray-600">Loading reviews...</p>
              </div>
            ) : reviewsError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
                <p className="font-semibold">Error:</p>
                <p>{JSON.stringify(reviewsError)}</p>
              </div>
            ) : !reviews || reviews.length === 0 ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md text-sm">
                <p className="font-semibold">No reviews yet.</p>
                <p>Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.review_id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                    <div className="flex items-center mb-2">
                      <User className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-800">{review.full_name || 'Anonymous'}</span>
                      <span className="ml-auto text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((starValue) => (
                        <Star key={starValue} className={`w-5 h-5 ${starValue <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-4">{getSentimentDisplay(review.sentiment)}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewPage;