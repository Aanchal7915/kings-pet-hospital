import React from 'react';
import { FaStar } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      pet: 'Max (Golden Retriever)',
      rating: 5,
      text: 'Kings Pet Hospital gave Max the best care! The staff was so friendly and professional. Highly recommended!',
      avatar: '👨‍💼'
    },
    {
      name: 'Priya Singh',
      pet: 'Whiskers (Siamese Cat)',
      rating: 5,
      text: 'Best veterinary care in Rohtak. They treated my cat like family. The cleanliness and facilities are top-notch!',
      avatar: '👩‍💼'
    },
    {
      name: 'Arjun Patel',
      pet: 'Rocky (German Shepherd)',
      rating: 5,
      text: 'Reliable, compassionate, and knowledgeable. My dog´s surgery went smoothly thanks to their expert team.',
      avatar: '👨'
    },
  ];

  return (
    <section className="py-16 bg-gray-50" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest font-bold text-blue-600">What Our Customers Say</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Happy Pet Parents</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Join thousands of satisfied customers who trust us with their pet's care</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400" size={18} />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 line-clamp-3 text-sm leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-4">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.pet}</p>
                  </div>
                </div>
              </div>

              {/* Quote mark decoration */}
              <div className="absolute -top-2 -right-2 text-6xl text-blue-100 opacity-20 font-serif">
                "
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-black text-blue-600">2000+</div>
            <p className="text-gray-600 text-sm mt-2">Happy Patients</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-blue-600">4.8★</div>
            <p className="text-gray-600 text-sm mt-2">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-blue-600">100%</div>
            <p className="text-gray-600 text-sm mt-2">Customer Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
