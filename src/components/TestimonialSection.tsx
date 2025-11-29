
"use client";
import { useState, useEffect, useRef } from "react";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "S. Kant",
      pet: "Lado - Orange Cat",
      rating: 5,
      text: "This app generated some amazing poses and pics for Lado - My Orange cat. Highly recommended.",
    },
    {
      name: "Lucy",
      pet: "Pet Parent",
      rating: 5,
      text: "Amazing results. Picture quality and color depth are impressive. Only sky is the limit for your creativity.",
    },
    {
      name: "Pinto",
      pet: "Pet Parent",
      rating: 5,
      text: "I liked the anime style and royalty pictures. Fabulous results.",
    },
    {
      name: "Stella",
      pet: "German Shepherd Owner",
      rating: 5,
      text: "Love the action, mugshot and skateboard filters. It'd be impossible to shoot those in real with my German Shepherd.",
    },
  ];

  // Mobile carousel state
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance every 5s on mobile, with progress bar
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    // Progress bar: update every 50ms
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 50);

    // Slide change every 5s
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
      setProgress(0);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
    // eslint-disable-next-line
  }, [current]);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Pet Parents Worldwide
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of happy customers who transformed their pet photos into art
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-700 font-semibold">4.8/5 from 2,847 reviews</span>
          </div>
        </div>

        {/* Mobile: Carousel */}
        <div className="block md:hidden">
          <div className="flex flex-col items-center">
            <div
              className="w-full max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col relative overflow-hidden"
              style={{
                backgroundImage: `url('/testimonial/Click My Pet Testimonial ${testimonials[current].name.replace(/\./g, '').replace(/ /g, '%20')}.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '340px',
              }}
            >
              <div className="absolute inset-0 bg-white/80" />
              <div className="relative z-10 flex flex-col h-full">
                {/* Testimonial Text */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &quot;{testimonials[current].text}&quot;
                </p>
                <div className="flex-grow" />
                {/* Bottom section: border, stars, name, pet */}
                <div className="border-t border-gray-200 pt-4 mt-auto w-full">
                  <div className="flex flex-col items-start">
                    <div className="flex mb-2">
                      {[...Array(testimonials[current].rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="font-semibold text-gray-900">{testimonials[current].name}</p>
                    <p className="text-sm text-gray-500">{testimonials[current].pet}</p>
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="absolute left-0 right-0 bottom-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all duration-100 linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col relative overflow-hidden"
              style={{
                backgroundImage: `url('/testimonial/Click My Pet Testimonial ${testimonial.name.replace(/\./g, '').replace(/ /g, '%20')}.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '340px',
              }}
            >
              <div className="absolute inset-0 bg-white/80" />
              <div className="relative z-10 flex flex-col h-full">
                {/* Testimonial Text */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex-grow" />
                {/* Bottom section: border, stars, name, pet */}
                <div className="border-t border-gray-200 pt-4 mt-auto w-full">
                  <div className="flex flex-col items-start">
                    <div className="flex mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.pet}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-purple-600">50K+</p>
            <p className="text-gray-600">Photos Generated</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">2,847</p>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">4.9/5</p>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">100%</p>
            <p className="text-gray-600">Satisfaction Guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
}
