import React, { useState } from 'react';

const petServices = [
    'Vaccination',
    'Surgery',
    'Grooming',
    'Dental Care',
    'Health Checkup',
    'Emergency Care',
    'Other Services'
];

const whatsappNumber = '+918222993333';

const BookingForm = () => {
    const [formData, setFormData] = useState({
        petOwnerName: '',
        phone: '',
        email: '',
        service: [],
        preferredDate: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

    const validateField = (name, value) => {
        let error = '';

        if (name === 'petOwnerName' && value.trim().length < 2) {
            error = 'Name must be at least 2 characters';
        }

        if (name === 'phone') {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value)) {
                error = 'Please enter a valid 10-digit phone number';
            }
        }

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = 'Please enter a valid email address';
            }
        }

        if (name === 'service' && value.length === 0) {
            error = 'Please select at least one service';
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const toggleService = (serviceName) => {
        setFormData(prev => {
            const currentServices = prev.service;
            let newServices;
            if (currentServices.includes(serviceName)) {
                newServices = currentServices.filter(s => s !== serviceName);
            } else {
                newServices = [...currentServices, serviceName];
            }
            validateField('service', newServices);
            return { ...prev, service: newServices };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateField('petOwnerName', formData.petOwnerName);
        const isPhoneValid = validateField('phone', formData.phone);
        const isEmailValid = validateField('email', formData.email);
        const isServiceValid = validateField('service', formData.service);

        if (!isNameValid || !isPhoneValid || !isEmailValid || !isServiceValid) {
            return;
        }

        setIsSubmitting(true);

        // Create WhatsApp message
        const message = `
🐾 *New Appointment Request*

*Owner Name:* ${formData.petOwnerName}
*Phone:* ${formData.phone}
*Email:* ${formData.email}
*Services:* ${formData.service.join(', ')}
${formData.preferredDate ? `*Preferred Date:* ${formData.preferredDate}` : ''}
${formData.notes ? `*Notes:* ${formData.notes}` : ''}
    `.trim();

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

        // Reset form
        setTimeout(() => {
            setFormData({
                petOwnerName: '',
                phone: '',
                email: '',
                service: [],
                preferredDate: '',
                notes: ''
            });
            setErrors({});
            setIsSubmitting(false);
            setIsServiceDropdownOpen(false);
        }, 1000);
    };

    return (
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 border-2 border-blue-100 max-w-lg mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 -mx-4 -mt-4 md:-mx-6 md:-mt-6 rounded-t-lg p-3 mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                    📅 Book Appointment
                </h3>
                <p className="text-blue-100 text-center text-xs mt-0.5">
                    Quick & Easy Booking
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Pet Owner Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Your Name *
                        </label>
                        <input
                            type="text"
                            name="petOwnerName"
                            value={formData.petOwnerName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
                        />
                        {errors.petOwnerName && (
                            <p className="text-red-500 text-[10px] mt-0.5">{errors.petOwnerName}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="10-digit Mobile"
                            maxLength="10"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-[10px] mt-0.5">{errors.phone}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Email ID */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Email ID *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>
                        )}
                    </div>

                    {/* Service Selection - Multi Select */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Select Services *
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-gray-800 bg-white text-left flex justify-between items-center"
                        >
                            <span className="truncate">
                                {formData.service.length > 0
                                    ? `${formData.service.length} Selected`
                                    : 'Choose...'}
                            </span>
                            <svg className={`w-4 h-4 transition-transform ${isServiceDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isServiceDropdownOpen && (
                            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {petServices.map((service) => (
                                    <label key={service} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                                        <input
                                            type="checkbox"
                                            checked={formData.service.includes(service)}
                                            onChange={() => toggleService(service)}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-gray-700">{service}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {errors.service && (
                            <p className="text-red-500 text-[10px] mt-0.5">{errors.service}</p>
                        )}
                    </div>
                </div>

                {/* Selected Services Tags */}
                {formData.service.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {formData.service.map(s => (
                            <span key={s} className="bg-blue-100 text-blue-800 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center">
                                {s}
                                <button
                                    type="button"
                                    onClick={() => toggleService(s)}
                                    className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Preferred Date */}
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                        Preferred Date (Optional)
                    </label>
                    <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
                    />
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                        Notes (Optional)
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Special requirements..."
                        rows="2"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-gray-800 resize-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-md font-bold text-base transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Book Now
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-[10px] text-gray-500 mt-3">
                🔒 Information secured & sent via WhatsApp
            </p>
        </div>
    );
};

export default BookingForm;
