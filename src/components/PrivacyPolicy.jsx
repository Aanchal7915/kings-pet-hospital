import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "Information We Collect",
            content: "We collect information you provide directly to us when you book an appointment, sign up for our newsletter, or contact us. This may include your name, email address, phone number, and details about your pet."
        },
        {
            title: "How We Use Your Information",
            content: "We use the information we collect to provide and maintain our services, notify you about changes to our services, and provide customer support. Your pet's health information is used solely for medical and grooming purposes."
        },
        {
            title: "Information Sharing",
            content: "We do not sell or rent your personal information to third parties. We may share information with service providers who perform services on our behalf, or when required by law."
        },
        {
            title: "Security",
            content: "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction."
        },
        {
            title: "Your Choices",
            content: "You may update or correct your information at any time by contacting us. You can also opt-out of receiving promotional communications from us by following the instructions in those messages."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-gray-500 mb-16 text-base">Last updated: December 31, 2025</p>

                    <div className="space-y-12">
                        {sections.map((section, index) => (
                            <section
                                key={index}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
                                    {section.title}
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-lg pl-6 border-l border-gray-100">
                                    {section.content}
                                </p>
                            </section>
                        ))}
                    </div>

                    <div className="mt-24 pt-12 border-t border-gray-100 animate-fade-in">
                        <p className="text-gray-500 italic">
                            If you have any questions about this Privacy Policy, please contact us at kingspethospital@gmail.com
                        </p>
                        <Link to="/" className="mt-8 inline-block font-medium hover:underline underline-offset-4">Back to Home</Link>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-gray-100 mt-20">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                    <p>© 2025 Kings Pet Hospital. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
                        <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
