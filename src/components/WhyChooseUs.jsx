import React from 'react';
import { FaUserMd, FaClinicMedical, FaHeartbeat, FaClock } from 'react-icons/fa';

const items = [
  { icon: FaUserMd, title: 'Experienced Vets', text: 'Skilled veterinarians focused on evidence-based treatment.' },
  { icon: FaClinicMedical, title: 'Modern Facilities', text: 'Advanced diagnostics and clean clinical infrastructure.' },
  { icon: FaHeartbeat, title: 'Compassionate Care', text: 'Personalized care plans tailored for every pet.' },
  { icon: FaClock, title: 'Reliable Support', text: 'Structured appointment and follow-up assistance.' },
];

const WhyChooseUs = () => {
  return (
    <section className="py-8 md:py-16 bg-white" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 text-gradient-animate underline-animate mt-2">Why Choose Us</h2>
          <p className="text-gray-600 mt-2">Trusted pet healthcare with transparent processes and expert care.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-xl border border-gray-200 p-5 bg-gradient-to-b from-white to-blue-50">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                  <Icon />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
