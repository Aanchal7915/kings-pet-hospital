import React, { useState } from 'react';
import Footer from './Footer';
import BookingForm from './BookingForm';

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

const whatsappNumber = '918222993333';

function openWhatsApp(serviceName) {
    const message = encodeURIComponent(
        `Hello Kings Pet Hospital, I would like to book an appointment for: ${serviceName}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
}

const PetsCareLanding = () => {
    const [showAllServices, setShowAllServices] = useState(false);

    const visibleServices = showAllServices ? services : services.slice(0, 6);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-blue-100 selection:text-blue-900">
            {/* Navbar with Navigation Links */}
            <a href="/" className="block bg-slate-900 py-4 shadow-md hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.jpg"
                            alt="Kings Pet Hospital"
                            className="h-10 w-auto rounded-sm bg-white/90 p-1 shadow-sm"
                        />
                        <span className="text-xl md:text-2xl font-bold text-white tracking-wide">
                            Kings Pet Hospital
                        </span>
                    </div>
                </div>
            </a>

            <main className="relative overflow-hidden">
                {/* Background Decor - Subtle gradient consistent with user's 'white/blue' preference but kept clean like the image */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-blue-50/50 to-white -z-10"></div>

                {/* Decorative blob similar to image if any, or just clean space. Keeping it clean as per "Avani" reference which is quite clean. */}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                        {/* Left Side: Content & Metrics (Matching the reference layout) */}
                        <div className="lg:col-span-7 flex flex-col space-y-5 lg:space-y-8 animate-slide-in-left text-center lg:text-left pt-2 lg:pt-0">

                            {/* Top Badge/Tagline */}
                            <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-amber-600 font-semibold uppercase tracking-wider text-xs md:text-sm">
                                <span className="text-lg">✨</span>
                                <span>Trusted Pet Care Since 2018</span>
                            </div>

                            {/* Main Headline - Updated to use Playfair Display (Serif) to match the reference */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
                                Ensure <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Healthier Lives</span> & accelerate recovery with smart <span className="italic text-slate-700">treatments</span>
                            </h1>

                            {/* Description */}
                            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                We provide high-quality veterinary services and amplify them with strategic medical management, advanced diagnostics, and compassionate care for your furry companions.
                            </p>

                            {/* Stats/Metrics Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2 border-t border-gray-100 mt-2">
                                <div>
                                    <h3 className="text-3xl font-bold text-blue-600">1500+</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">Happy Pets</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-green-600">2000+</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">Surgeries Done</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-amber-500">98%</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">Success Rate</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-purple-600">10+</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">Years Exp.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Booking Form */}
                        <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
                            {/* Form container - making sure it mimics the 'card' look in the image but using our existing component */}
                            <div className="w-full max-w-md relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-100/50 rounded-full blur-3xl -z-10 opacity-60"></div>
                                <BookingForm />
                            </div>
                        </div>

                    </div>
                </div>

                {/* About Us Section */}
                <section id="about" className="py-20 bg-white relative overflow-hidden">
                    <div id="team" className="absolute top-0"></div>
                    <div id="gallery" className="absolute top-0"></div>
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 transform translate-x-20"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Centered Header */}
                        <div className="text-center mb-16 max-w-4xl mx-auto">
                            <div className="inline-block px-5 py-2 bg-blue-50 text-blue-600 font-bold rounded-full text-sm mb-6 tracking-wide uppercase">
                                About Us
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight">
                                Committed to <span className="text-blue-600">Excellence</span> in <br className="hidden md:block" /> Veterinary Medicine
                            </h2>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-16">

                            {/* Left Side: Images */}
                            <div className="lg:w-1/2 relative group">
                                <div className="absolute inset-0 bg-blue-600 rounded-2xl transform rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-500"></div>
                                <img
                                    src="50.jpg"
                                    alt="Veterinarian with dog"
                                    className="relative rounded-2xl shadow-xl w-full object-cover h-[500px] transform transition-transform duration-500 group-hover:-translate-y-2"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=2070'; }}
                                />
                                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-xs animate-float">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Customer Review</p>
                                            <div className="flex text-yellow-400 text-sm">★★★★★</div>
                                            <p className="text-xs text-gray-400 mt-1">"The best care for my puppy!"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Content */}
                            <div className="lg:w-1/2 space-y-8">
                                {/* Header removed from here */}

                                <p className="text-lg text-slate-600 leading-relaxed font-light">
                                    At Kings Pet Hospital, we combine compassion with cutting-edge technology to provide the highest standard of care for your beloved pets. Our team of experienced veterinarians and dedicated staff treat every patient as if they were their own, ensuring a stress-free and healing environment.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { title: 'Modern Facilities', desc: 'State-of-the-art diagnostic and surgical equipment.' },
                                        { title: 'Expert Team', desc: 'Highly qualified veterinarians with specialized training.' },
                                        { title: 'Emergency Care', desc: 'Available for urgent medical attention when you need it.' },
                                        { title: 'Holistic Approach', desc: 'Personalized treatment plans for total well-being.' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 text-indigo-600">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{item.title}</h4>
                                                <p className="text-sm text-slate-500 leading-snug mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>

                        </div>
                    </div>
                </section>





                {/* Services Section */}
                <section id="services" className="py-20 bg-white relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-3">Our Premium Services</h2>
                            <p className="text-slate-600 text-base max-w-2xl mx-auto">Comprehensive care and treatments designed for your pet's well-being</p>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
                        </div>

                        {/* Compact Grid with smaller gap */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visibleServices.map((service, index) => (
                                <div
                                    key={service.name}
                                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col transform hover:-translate-y-1"
                                >
                                    {/* Compact Image Height */}
                                    <div className="relative h-40 overflow-hidden">
                                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/0 transition-colors z-10"></div>
                                        <img
                                            src={service.imageUrl}
                                            alt={service.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.jpg'; }}
                                        />
                                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-0.5 rounded-full text-[10px] font-bold text-blue-800 shadow-sm z-20">
                                            {service.price}
                                        </div>
                                    </div>

                                    {/* Compact Padding */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">{service.name}</h3>
                                        <p className="text-slate-500 text-xs mb-3 leading-relaxed flex-grow line-clamp-2">{service.description}</p>

                                        <div className="space-y-1.5 pt-3 border-t border-slate-100">
                                            {service.features.slice(0, 3).map((feature, idx) => (
                                                <div key={idx} className="flex items-start text-[11px] text-slate-600">
                                                    <svg className="w-3.5 h-3.5 text-green-500 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => openWhatsApp(service.name)}
                                            className="mt-4 w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                                        >
                                            Book Service
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* View More Button */}
                        <div className="mt-10 text-center">
                            <button
                                onClick={() => setShowAllServices(!showAllServices)}
                                className="px-8 py-3 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
                            >
                                {showAllServices ? 'Show Less' : 'View More Services'}
                                <svg className={`w-4 h-4 transition-transform duration-300 ${showAllServices ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </section>



                {/* Gallery Section */}


                {/* Booking Section */}
                <section id="booking" className="py-20 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="text-center text-white">
                                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 py-4 leading-relaxed">
                                    Ready to Schedule <br /> a <span className="text-blue-400">Visit?</span>
                                </h2>
                                <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                                    Book an appointment online for your pet's checkup, vaccination, or grooming session. Expert care is just a click away.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <div className="flex items-center gap-3 bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm border border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm text-slate-400">Response Time</p>
                                            <p className="font-bold">Instant</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm border border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm text-slate-400">Availability</p>
                                            <p className="font-bold">24/7 Support</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full max-w-md mx-auto relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative">
                                    <BookingForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                            <p className="text-slate-600 text-lg">Common questions about our services and care.</p>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-6 rounded-full"></div>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    q: "How can I book an appointment?",
                                    a: "You can book an appointment easily through our website using the booking form, or by clicking the 'Book Service' button on any service card. You can also contact us directly via WhatsApp."
                                },
                                {
                                    q: "Do you offer emergency services?",
                                    a: "Yes, we provide emergency care for critical cases. Please contact our emergency hotline immediately if your pet requires urgent attention."
                                },
                                {
                                    q: "What types of pets do you treat?",
                                    a: "We primarily treat dogs and cats, but our experienced team is equipped to handle various other small household pets. Please contact us for specific inquiries."
                                },
                                {
                                    q: "Do you provide grooming services?",
                                    a: "Yes, we offer premium grooming services including baths, haircuts, nail trimming, and ear cleaning to keep your pet looking and feeling their best."
                                },
                                {
                                    q: "What should I bring for my pet's first visit?",
                                    a: "Please bring your pet's vaccination records, any previous medical history, and a list of current medications. If your pet is anxious, bringing their favorite toy or blanket can help."
                                }
                            ].map((faq, index) => {
                                // We can use a local variable inside the map for state logic if we implement it,
                                // but we need the state at the component level to allow only one open at a time (accordion style).
                                // Since I cannot easily add the state variable 'activeFaq' in the same tool call without potentially breaking the file structure logic visually for the tool,
                                // I will use a simple details/summary approach? No, custom is requested "avani" style.
                                // I will use a simple inline state hook approach if possible or just assume I can add the state in the next step.
                                // Actually, I'll attempt to add the state in a subsequent step or use a "self-contained" uncontrolled component approach?
                                // No, controlled is better.
                                // I will use a 'details' element for native accordion behavior which requires no React state! 
                                // But styling 'details' to look exactly like the custom reference is harder.
                                // I'll stick to adding the state in the component. 

                                // WAIT. I CANNOT add state in `multi_replace` easily if line numbers are far apart? 
                                // Yes I can.
                                return null;
                            })}
                            {/* Retrying approach: I will just render the list here and use a temporary local state solution or just 'details' tag styled nicely. 
                                'details' with 'marker:content-none' and custom icons works great. 
                             */}
                            {[
                                {
                                    q: "How can I book an appointment?",
                                    a: "You can book an appointment easily through our website using the booking form, or by clicking the 'Book Service' button on any service card. You can also contact us directly via WhatsApp."
                                },
                                {
                                    q: "Do you offer emergency services?",
                                    a: "Yes, we provide emergency care for critical cases. Please contact our emergency hotline immediately if your pet requires urgent attention."
                                },
                                {
                                    q: "What types of pets do you treat?",
                                    a: "We primarily treat dogs and cats, but our experienced team is equipped to handle various other small household pets. Please contact us for specific inquiries."
                                },
                                {
                                    q: "Do you provide grooming services?",
                                    a: "Yes, we offer premium grooming services including baths, haircuts, nail trimming, and ear cleaning to keep your pet looking and feeling their best."
                                },
                                {
                                    q: "What should I bring for my pet's first visit?",
                                    a: "Please bring your pet's vaccination records, any previous medical history, and a list of current medications. If your pet is anxious, bringing their favorite toy or blanket can help."
                                }
                            ].map((faq, index) => (
                                <details key={index} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                        <h3 className="text-lg font-bold text-slate-800 pr-8">{faq.q}</h3>
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 transition-all duration-300 group-open:rotate-180 group-open:bg-blue-600 group-open:text-white flex-shrink-0">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </summary>
                                    <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-fade-in">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

            </main >

            <Footer />
        </div >
    );
};

export default PetsCareLanding;
