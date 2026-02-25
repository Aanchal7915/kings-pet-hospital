import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "Acceptance of Terms",
            content: "By accessing and using the services of Kings Pet Hospital, you agree to be bound by these terms and conditions. If you do not agree to all of these terms, please do not use our services."
        },
        {
            title: "Services Provided",
            content: "Kings Pet Hospital provides veterinary care, grooming, and related pet health services. While we strive for excellence, we cannot guarantee specific outcomes for medical treatments or procedures."
        },
        {
            title: "Appointments and Cancellations",
            content: "We request that you arrive 10 minutes prior to your scheduled appointment. If you need to cancel or reschedule, please provide at least 24 hours notice. Late cancellations may be subject to a fee."
        },
        {
            title: "Payment Terms",
            content: "Payment is due at the time services are rendered. We accept cash, credit/debit cards, and UPI payments. For major procedures, a deposit may be required beforehand."
        },
        {
            title: "Pet Safety and Conduct",
            content: "For the safety of all pets and staff, all dogs must be on a leash and all cats must be in a carrier. Owners are responsible for their pet's behavior while on our premises."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight uppercase">Terms of Service</h1>
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
                            If you have any questions about these Terms of Service, please contact us at kingspethospital@gmail.com
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
                        <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
                        <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TermsOfService;


