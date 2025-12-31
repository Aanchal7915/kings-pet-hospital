import React from 'react';
import Header from './Header';
import Footer from './Footer';

const contactInfo = [
    {
        title: 'Visit Us',
        details: 'Near Sheela Cineplex, Sonipat Road, Rohtak, Haryana,124021',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    },
    {
        title: 'Call Us',
        details: '+91 8930333373',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        )
    },
    {
        title: 'Email Us',
        details: 'kingspethospital@gmail.com',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        )
    }
];

const ContactPage = () => {
    // Scroll to top when component mounts
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            <Header showHero={false} />

            {/* Enhanced Hero Section */}
            <div className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                {/* Animated background elements */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm font-semibold mb-4 backdrop-blur-sm animate-bounce-in">
                        👋 We are always ready to help
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up">
                        We're Here for <span className="text-blue-400 bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient text-hover-glow">You & Your Pet</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed animate-fade-in-up text-hover-glow" style={{ animationDelay: '0.2s' }}>
                        Expert veterinary care is just a call or visit away. Reach out to us for appointments, emergencies, or general inquiries.
                    </p>
                </div>
            </div>

            <main className="pt-16 pb-0 relative z-10 -mt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mb-0">
                        {/* Left Side: "Sir's Image" */}
                        <div className="w-full lg:w-4/12 flex-shrink-0">
                            <div className="sticky top-24">
                                <div className="relative rounded-2xl shadow-2xl overflow-hidden border-4 border-white group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <img
                                        src="50.jpg"
                                        alt="Dr. Mohit Bazzad - Kings Pet Hospital"
                                        className="w-full object-cover aspect-[3/4] transform transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.currentTarget.src = '/logo.jpg'; }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="font-bold text-lg">Dr. Mohit Bazzad</p>
                                        <p className="text-sm text-blue-200">Senior Veterinarian</p>
                                    </div>
                                </div>
                                <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                                    <h3 className="text-xl font-bold text-gray-800">Complete Pet Care</h3>
                                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                                        Dedicated to providing the best veterinary services with love and compassion for your beloved pets.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Contact Details & Hours */}
                        <div className="w-full lg:w-8/12 space-y-8">
                            {/* Contact Grid */}
                            <div className="grid md:grid-cols-2 gap-5">
                                {contactInfo.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-start p-6 bg-white rounded-xl shadow-md border hover:border-blue-300 hover:shadow-xl transition-all duration-500 group transform hover:-translate-y-2 hover:scale-105 cursor-pointer ${index === 0 ? 'md:col-span-2 bg-gradient-to-r from-blue-50 to-white border-blue-100' : 'border-gray-100'}`}
                                        style={{
                                            opacity: 0,
                                            animation: `fadeInUp 0.6s ease-out ${index * 0.15}s forwards`
                                        }}
                                    >
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-5 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6 ${index === 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-bold mb-1 transition-all duration-300 text-hover-glow underline-animate ${index === 0 ? 'text-blue-900' : 'text-gray-800 group-hover:text-blue-600'}`}>{item.title}</h3>
                                            <p className={`transition-all duration-300 ${index === 0 ? 'text-blue-700 font-medium' : 'text-gray-600 text-sm group-hover:text-gray-800'}`}>{item.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Hospital Hours Card */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Hospital Hours
                                    </h3>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">Open Today</span>
                                </div>
                                <div className="p-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center group">
                                            <span className="text-gray-600 font-medium group-hover:text-blue-600 transition-colors">Monday - Saturday</span>
                                            <span className="text-gray-900 font-bold bg-gray-50 px-3 py-1 rounded-md group-hover:bg-blue-50 transition-colors">9:00 AM - 8:00 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center group">
                                            <span className="text-gray-600 font-medium group-hover:text-blue-600 transition-colors">Sunday</span>
                                            <span className="text-gray-900 font-bold bg-gray-50 px-3 py-1 rounded-md group-hover:bg-blue-50 transition-colors">10:00 AM - 2:00 PM</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 p-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center gap-4 text-white shadow-lg transform hover:-translate-y-1 transition-transform">
                                        <div className="p-2 bg-white/20 rounded-full">
                                            <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Emergency?</p>
                                            <p className="text-blue-100 text-sm">24/7 Services Available</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer showMap={true} />
        </div>
    );
};

export default ContactPage;
