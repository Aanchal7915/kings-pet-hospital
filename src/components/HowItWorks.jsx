import React from 'react';
import { FaSearch, FaCalendarCheck, FaPaw } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: FaSearch,
      title: 'Browse Services',
      description: 'Explore our wide range of pet care services including vaccination, grooming, surgery, and medical treatments.',
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-blue-300',
    },
    {
      icon: FaCalendarCheck,
      title: 'Book Appointment',
      description: 'Select your preferred service, date, and time slot. It takes just a few minutes to schedule.',
      color: 'bg-emerald-100 text-emerald-600',
      borderColor: 'border-emerald-300',
    },
    {
      icon: FaPaw,
      title: 'Visit & Care',
      description: 'Visit our hospital and let our expert veterinarians provide the best care for your beloved pet.',
      color: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-300',
    },
  ];

  return (
    <section className="py-16 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest font-bold text-blue-600">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">How It Works</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Getting your pet the care they need is easy and straightforward</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection lines (desktop only) */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-600 to-purple-600 -z-10"></div>

          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                {/* Icon container */}
                <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg relative z-10`}>
                  <IconComponent size={40} />
                </div>

                {/* Content card */}
                <div className={`rounded-xl border-2 ${step.borderColor} bg-gray-50 p-6 text-center hover:shadow-lg transition-all duration-300`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>

                  {/* Step number */}
                  <div className="mt-4 inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
                    Step {index + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              const bookingSection = document.getElementById('booking');
              if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Start Booking Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
