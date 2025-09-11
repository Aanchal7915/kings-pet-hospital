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

const whatsappNumber = '8930333373'; // Use country code, e.g., 91 for India

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Premium Pet Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Providing top-quality care for your beloved furry friends with our comprehensive range of services
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleServices.map((service, index) => (
            <div 
              key={service.name}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ 
                opacity: 0, 
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                transform: 'translateY(20px)'
              }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={service.imageUrl} 
                  alt={service.name} 
                  loading="lazy"
                  className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-bl-lg font-semibold">
                  {service.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3 transition-colors duration-300 hover:text-blue-600">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="border-t pt-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => openWhatsApp(service.name)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
        {services.length > VISIBLE_COUNT && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              {showAll ? 'View Less' : 'View More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services; 