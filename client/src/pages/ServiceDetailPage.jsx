import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesAPI, ordersAPI, authAPI } from '../services/api';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dynamicInputField, setDynamicInputField] = useState('');
  const [emailField, setEmailField] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loadingService, setLoadingService] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [user, setUser] = useState(null);

  const gradients = [
    'from-blue-500 to-purple-600',
    'from-red-500 to-pink-600',
    'from-green-500 to-blue-600',
    'from-yellow-500 to-orange-600',
    'from-purple-500 to-indigo-600',
    'from-teal-500 to-cyan-600',
    'from-pink-500 to-red-600',
    'from-indigo-500 to-blue-600',
    'from-orange-500 to-yellow-600',
  ];

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await servicesAPI.getServiceById(serviceId);
        setService(response.data.service);
      } catch (err) {
        console.error('Error fetching service details:', err);
        navigate('/dashboard'); // Redirect if service not found or error
      } finally {
        setLoadingService(false);
      }
    };

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchServiceDetails();
  }, [serviceId, navigate]);

  const getInputLabel = () => {
    if (!service) return 'তথ্য';
    if (service.title.includes('SIM') || service.title.includes('NUMBER')) {
      return 'নাম্বার';
    } else if (service.title.includes('NID')) {
      return 'NID নাম্বার';
    } else if (service.title.includes('IMEI')) {
      return 'IMEI নাম্বার';
    } else if (service.title.includes('LOCATION')) {
      return 'নাম্বার';
    } else {
      return 'নাম্বার';
    }
  };

  const getServiceIcon = (serviceId) => {
    const icons = {
      1: '📱', // SIM INFORMATION
      2: '📍', // LIVE LOCATION
      3: '🚫', // SIM BLOCK
      4: '🆔', // NID TO ALL NUMBER
      5: '💳', // ACCOUNT INFORMATION
      6: '🪪', // NID CARD
      7: '📞', // SIM CALL LIST
      8: '🔒', // BLOCK BIKASH ACCOUNT
      9: '📱'  // IMEI to Active number
    };
    return icons[serviceId] || '⚡';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!selectedOption) {
      newErrors.option = 'অনুগ্রহ করে একটি অপশন নির্বাচন করুন।';
    }
    if (!dynamicInputField.trim()) {
      newErrors.dynamicField = `${getInputLabel()} প্রয়োজন।`;
    }
    if (!emailField.trim()) {
      newErrors.email = 'ইমেইল প্রয়োজন।';
    } else if (!/\S+@\S+\.\S/.test(emailField)) {
      newErrors.email = 'সঠিক ইমেইল দিন।';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage('দয়া করে সকল প্রয়োজনীয় ফিল্ড পূরণ করুন।');
      return;
    }

    if (!user) {
      setMessage('অর্ডার সাবমিট করতে লগইন করুন।');
      return;
    }

    setSubmittingOrder(true);
    try {
      const orderData = {
        serviceId: service._id,
        serviceTitle: service.title,
        serviceOption: selectedOption,
        targetNumber: dynamicInputField,
        userEmail: emailField,
      };
      const response = await ordersAPI.createOrder(orderData);
      setMessage(response.data.message || 'আপনার অর্ডার সফলভাবে সাবমিট করা হয়েছে!');
      
      // Refresh user data to get updated balance
      try {
        const userResponse = await authAPI.getMe();
        const updatedUser = userResponse.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (userError) {
        console.error('Error refreshing user data:', userError);
      }
      
      setErrors({});
      setDynamicInputField('');
      setEmailField('');
      setSelectedOption(null);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে!';
      setMessage(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (loadingService) {
    return <div className="flex items-center justify-center min-h-screen text-white text-xl">Loading service details...</div>;
  }

  if (!service) {
    return <div className="flex items-center justify-center min-h-screen text-red-400 text-xl">Service not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 p-4 pt-16"> {/* Add pt-16 for header space */}
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="glass-button mb-6 flex items-center space-x-2 group fixed top-4 left-4 z-10"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>পিছনে যান</span>
      </button>

      <div className="max-w-6xl mx-auto space-y-8 py-4">
        {/* Service Description */}
        <div className="glass-card p-8 text-center mt-12"> {/* Adjust margin-top */}
          <div className="inline-block p-6 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm mb-6">
            <span className="text-5xl">{getServiceIcon(service.id)}</span>
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-4">{service.title}</h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
            {service.description}
          </p>
        </div>

        {/* Options Selection */}
        <div className="bg-white/10 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Select Operator:</h3>
          <div className="space-y-4">
            {service.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors duration-200 \
                           ${selectedOption === option ? 'bg-blue-600/30 ring-2 ring-blue-400' : 'bg-white/5 hover:bg-white/10'}\
                           relative`}
              >
                <input
                  type="radio"
                  name="serviceOption"
                  value={option.name}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                  className="form-radio h-5 w-5 text-blue-500 mr-4 focus:ring-blue-400"
                />
                <div className="flex-grow flex items-center justify-between">
                  <div className="flex items-center">
                    {/* Add operator logo if available in data */}
                    <span className="text-white text-lg font-semibold">{option.name}</span>
                  </div>
                  <span className="text-white text-lg font-bold">{option.price}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.option && (
            <p className="text-red-300 text-sm mt-2 text-center">{errors.option}</p>
          )}
        </div>

        {/* Order Form */}
        <div className="bg-white/10 rounded-xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white text-base font-medium mb-2">
                {getInputLabel()}*
              </label>
              <input
                type="text" // Or dynamic type based on service
                name="dynamicInputField"
                value={dynamicInputField}
                onChange={(e) => setDynamicInputField(e.target.value)}
                className="form-input"
                placeholder={`${getInputLabel()} দিন`}
              />
              {errors.dynamicField && (
                <p className="text-red-300 text-sm mt-1">{errors.dynamicField}</p>
              )}
            </div>
            <div>
              <label className="block text-white text-base font-medium mb-2">
                আপনার জিমেইল*
              </label>
              <input
                type="email"
                name="emailField"
                value={emailField}
                onChange={(e) => setEmailField(e.target.value)}
                className="form-input"
                placeholder="আপনার জিমেইল দিন"
              />
              {errors.email && (
                <p className="text-red-300 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {message && (
              <div className={`p-3 rounded-md text-center text-sm font-medium ${errors.general ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={submittingOrder}
              className="glass-button w-full disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {submittingOrder ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>অর্ডার সাবমিট হচ্ছে...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>✅</span>
                  <span>অর্ডার সাবমিট করুন</span>
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage; 