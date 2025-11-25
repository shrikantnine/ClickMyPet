export default function TestimonialSection() {
  const testimonials = [
    {
      name: "S. Kant",
      pet: "Lado - Orange Cat",
      rating: 5,
      text: "This app works wonders! It generated some amazing poses and pics for Lado - My Orange cat. Highly recommended.",
    },
    {
      name: "Lucy",
      pet: "Pet Parent",
      rating: 5,
      text: "Amazing results. Picture quality is great and generated pics are very consistent with real ones. Only sky is the limit for your creativity.",
    },
    {
      name: "Pinto",
      pet: "Pet Enthusiast",
      rating: 5,
      text: "Really like abstract and royalty pictures. It's very hard to distinguish from real ones. Fabulous results.",
    },
    {
      name: "Stella",
      pet: "German Shepherd Owner",
      rating: 5,
      text: "Love the action, mugshot and skateboard filters. It'd be impossible to shoot those in real with my German Shephard. Quality is also amazing. I'd highly recommend it.",
    },
  ];

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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              {/* Rating Stars */}
              <div className="flex mb-4">
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

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-4 leading-relaxed flex-grow">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Author Info - At Bottom */}
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.pet}</p>
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
