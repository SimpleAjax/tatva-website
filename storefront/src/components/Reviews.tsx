"use client";

import React, { useState } from "react";
import { Star, Quote, X, Loader2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  defaultReviews, 
  defaultReviewConfig,
  Review,
  ReviewConfig 
} from "@/lib/content-config";

interface ReviewsProps {
  productName?: string;
  productHandle?: string;
}

const Reviews = ({ productName, productHandle }: ReviewsProps = {}) => {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const config = defaultReviewConfig;
  
  // Filter reviews by product if specified
  const filteredReviews = productHandle 
    ? reviews.filter(r => r.productHandle === productHandle)
    : reviews;
  
  // Calculate average rating
  const averageRating = filteredReviews.length > 0
    ? (filteredReviews.reduce((acc, r) => acc + r.rating, 0) / filteredReviews.length).toFixed(1)
    : "0";

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const text = formData.get("text") as string;
    
    if (rating === 0) {
      setSubmitError("Please select a rating");
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReview: Review = {
      id: Date.now().toString(),
      name,
      rating,
      text,
      product: productName || "TATVA Store",
      productHandle: productHandle || "",
      date: new Date().toLocaleDateString("en-IN", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      }),
      verified: false, // Would be verified based on purchase history
      helpful: 0,
    };
    
    setReviews([newReview, ...reviews]);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form after delay
    setTimeout(() => {
      setIsDialogOpen(false);
      setSubmitSuccess(false);
      setRating(0);
    }, 2000);
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    ));
  };

  if (!config.enabled) return null;

  return (
    <section className="py-24 bg-[#FEF9F9] overflow-hidden relative">
      {/* Decorative Quote Icon Background */}
      <Quote className="absolute top-12 left-12 w-32 h-32 text-primary/5 -rotate-12" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary text-[10px] lg:text-[11px] font-bold tracking-[0.4em] uppercase">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-serif text-primary italic">
            {productName ? `Reviews for ${productName}` : "What the Tribe Says"}
          </h2>
          
          {/* Rating Summary */}
          {filteredReviews.length > 0 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">{averageRating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-5 h-5 ${
                        idx < Math.round(Number(averageRating)) 
                          ? "text-primary fill-primary" 
                          : "text-zinc-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                Based on {filteredReviews.length} {filteredReviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>

        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredReviews.slice(0, 6).map((review) => (
              <div 
                key={review.id} 
                className="bg-white p-8 lg:p-10 shadow-sm border border-border flex flex-col space-y-6 hover:shadow-md transition-shadow"
              >
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < review.rating 
                          ? "text-primary fill-primary" 
                          : "text-zinc-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-zinc-600 leading-relaxed italic text-lg">&ldquo;{review.text}&rdquo;</p>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{review.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        {review.date}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest hidden lg:block">
                      {review.verified ? "Verified Buyer" : "Customer"}
                    </div>
                  </div>
                  
                  {/* Product Name */}
                  {!productName && review.product && (
                    <p className="text-xs text-muted-foreground mb-3">
                      Reviewed: <span className="text-primary">{review.product}</span>
                    </p>
                  )}
                  
                  {/* Helpful Button */}
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write a Review Button */}
        <div className="mt-16 text-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white border border-primary text-primary hover:bg-primary hover:text-white transition-all px-10 py-3 tracking-widest uppercase font-bold text-xs"
              >
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-serif italic text-2xl">
                  Write a Review
                </DialogTitle>
              </DialogHeader>
              
              {submitSuccess ? (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    Thank you for your review! It will be published shortly.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 mt-4">
                  {submitError && (
                    <Alert variant="destructive">
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Rating Selection */}
                  <div className="space-y-2">
                    <Label>Your Rating *</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= (hoveredRating || rating)
                                ? "text-primary fill-primary"
                                : "text-zinc-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="text">Your Review *</Label>
                    <Textarea
                      id="text"
                      name="text"
                      placeholder="Share your experience with this product..."
                      required
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    By submitting, you agree to our review guidelines
                  </p>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
