import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI } from '../services/api';

const Services = ({ userBalance, setUserBalance }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAllServices();
        setServices(response.data.services);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('সার্ভিস লোড করতে সমস্যা হয়েছে।');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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

  const handleServiceClick = (service) => {
    navigate(`/service/${service.id}`);
  };

  // Service icons mapping
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

  if (loading) {
    return <p className="text-white/80 text-center">সার্ভিস লোড হচ্ছে...</p>;
  }

  if (error) {
    return <p className="text-red-300 text-center">{error}</p>;
  }

  return (
    <div className="space-y-8 py-4">
      

      {/* Services Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`relative p-4 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 
                       bg-gradient-to-br ${gradients[index % gradients.length]}
                       flex flex-col items-center justify-center text-center space-y-2 h-40 md:h-48`}
            onClick={() => handleServiceClick(service)}
          >
            <div className="text-5xl md:text-6xl text-white mb-2">
              {getServiceIcon(service.id)}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
              {service.title}
            </h3>
            {/* Optionally display a very short description or a tag if needed */}
            {/* <p className="text-white/80 text-xs leading-none">{service.description.substring(0, 30)}...</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services; 