import React, { useState } from 'react';

const services = [
  {
    name: 'Vaccination',
    description: 'Protect your furry friend with our comprehensive vaccination packages. We offer core and lifestyle vaccines administered by experienced veterinarians.',
    imageUrl: '15.jpg',
    price: 'Starting from ₹500',
    features: ['Core vaccines available', 'Pet vaccination record', 'Free consultation']
  },
  {
    name: 'Major Surgery',
    description: 'Comprehensive surgical care for complex and critical conditions with advanced anesthesia and monitoring.',
    imageUrl: '31.jpeg',
    price: 'Consultation required',
    features: ['Pre-operative evaluation', 'Advanced anesthesia', 'ICU-level post-op care']
  },
  {
    name: 'Soft Tissue Surgery',
    description: 'Procedures involving skin, muscles, and internal organs including spay/neuter, mass removal, and more.',
    imageUrl: '32.jpg',
    price: 'Consultation required',
    features: ['Spay/Neuter', 'Wound reconstruction', 'Abdominal procedures']
  },
  {
    name: 'Orthopaedic Surgery',
    description: 'Bone and joint surgeries for fractures, ligament injuries, and developmental conditions.',
    imageUrl: '33.jpeg',
    price: 'Consultation required',
    features: ['Fracture repair', 'Cruciate ligament (TPLO/ELSS)', 'Joint stabilization']
  },
  {
    name: 'Minor Surgery',
    description: 'Quick outpatient procedures performed under local or short anesthesia.',
    imageUrl: '4.jpg',
    price: 'From ₹2,000',
    features: ['Laceration repair', 'Abscess drainage', 'Simple lump removal']
  },
  {
    name: 'Tumor Removal',
    description: 'Mass and tumor excision with histopathology and comprehensive follow-up care.',
    imageUrl: '35.jpeg',
    price: 'Consultation required',
    features: ['Pre-op staging', 'Wide-margin excision', 'Biopsy & lab reports']
  },
  {
    name: 'Surgery',
    description: 'State-of-the-art surgical facilities with advanced monitoring equipment and experienced surgical team.',
    imageUrl: '7.jpg',
    price: 'Consultation required',
    features: ['Pre-surgery assessment', 'Modern equipment', 'Post-op care']
  },
  {
    name: 'Grooming',
    description: 'Premium grooming services to keep your dog looking and feeling their absolute best. From basic baths to full makeovers.',
    imageUrl: '25.jpg',
    price: 'From ₹699',
    features: ['Bath & brush', 'Nail trimming', 'Ear cleaning']
  },
  {
    name: 'Premium Dog Feed',
    description: 'High-quality, nutritionally balanced dog food for all life stages. We carry top brands and prescription diets.',
    imageUrl: '18.jpg',
    price: 'Various options',
    features: ['Premium brands', 'Prescription diets', 'Nutritional advice']
  },
  {
    name: 'Luxury Leash & Collar',
    description: 'Stylish and durable accessories for your dog. From everyday wear to special occasions.',
    imageUrl: '27.jpeg',
    price: 'From ₹2,000',
    features: ['Quality materials', 'Various sizes', 'Custom fitting']
  },
  {
    name: 'Veterinary Medicine',
    description: "Full-service pharmacy with prescription and over-the-counter medications for all your pet's needs.",
    imageUrl: '28.jpeg',
    price: 'Varies by prescription',
    features: ['Prescription filling', 'OTC medications', 'Expert advice']
  },
  {
    name: 'Dental Scaling',
    description: "Professional dental cleaning services to maintain your dog's oral health and prevent dental diseases.",
    imageUrl: '2.jpg',
    price: 'From ₹3999',
    features: ['Ultrasonic cleaning', 'Polishing', 'Dental check-up']
  },
  {
    name: 'Physiotherapy',
    description: 'Specialized rehabilitation services for injured or recovering pets. Customized treatment plans.',
    imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500&auto=format',
    price: 'From ₹1000/session',
    features: ['Custom treatment plans', 'Progress tracking', 'Home exercise plans']
  },
  {
    name: 'Medical Treatment',
    description: 'Comprehensive medical care for various conditions, from routine check-ups to specialized treatments.',
    imageUrl: '12.jpg',
    price: 'Consultation required',
    features: ['Expert diagnosis', 'Treatment plans', 'Follow-up care']
  },
  {
    name: 'Blood Tests',
    description: 'Advanced diagnostic testing with quick and accurate results for better healthcare decisions.',
    imageUrl: '16.jpg',
    price: 'From ₹6,999',
    features: ['Quick results', 'Complete analysis', 'Expert interpretation']
  },
  {
    name: 'Blood Pressure Check',
    description: 'Non-invasive blood pressure monitoring for early detection and management of hypertension in pets.',
    imageUrl: '3.jpg',
    price: 'From ₹299',
    features: ['Oscillometric method', 'Hypertension screening', 'Report with vet advice']
  },
];

const whatsappNumber = '918222993333'; // Use country code, e.g., 91 for India

function openWhatsApp(serviceName) {
  const message = encodeURIComponent(
    `Hello Kings Pet Hospital, I would like to book an appointment for: ${serviceName}`
  );
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
}

const Services = () => {
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_COUNT = 6;
  const visibleServices = showAll ? services : services.slice(0, VISIBLE_COUNT);
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="services">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-gradient-animate animate-text-reveal">
            Our Premium Pet Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-text-slide text-hover-glow" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Providing top-quality care for your beloved furry friends with our comprehensive range of services
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
          {visibleServices.map((service, index) => (
            <div
              key={service.name}
              className="bg-white rounded-lg md:rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 mb-4 md:mb-0 group cursor-pointer"
              style={{
                opacity: 0,
                animation: `fadeInUp 0.6s ease-out ${index * 0.08}s forwards`,
                transform: 'translateY(30px)'
              }}
            >
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  loading="lazy"
                  className="w-full h-32 md:h-48 lg:h-56 object-cover transition-transform duration-700 group-hover:scale-125"
                />
                <div className="absolute top-0 right-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-bl-lg text-xs md:text-sm font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  {service.price}
                </div>
              </div>
              <div className="p-3 md:p-5 lg:p-6">
                <h3 className="text-sm md:text-xl lg:text-2xl font-semibold text-gray-800 mb-2 md:mb-3 transition-all duration-300 hover:text-blue-600 text-hover-glow underline-animate">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm lg:text-base leading-relaxed transition-all duration-300 hover:text-gray-800">
                  {service.description}
                </p>
                <div className="border-t pt-2 md:pt-3 lg:pt-4">
                  <ul className="space-y-1 md:space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-600">
                        <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-blue-500 mr-1 md:mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs md:text-sm leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="w-full mt-3 md:mt-5 lg:mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-full text-xs md:text-sm lg:text-base font-semibold transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform active:scale-95"
                  onClick={() => openWhatsApp(service.name)}
                >
                  <span className="flex items-center justify-center gap-2">
                    Book Now
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
        {services.length > VISIBLE_COUNT && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95"
            >
              <span className="flex items-center gap-2">
                {showAll ? 'View Less' : 'View More'}
                <svg className={`w-5 h-5 transform transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services; 