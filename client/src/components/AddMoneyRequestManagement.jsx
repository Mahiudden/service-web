import React, { useState, useEffect } from 'react';
import { addMoneyAPI } from '../services/api';
import { adminAPI } from '../services/api';

const AddMoneyRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await addMoneyAPI.getAllRequests();
      setRequests(response.data.requests);
    } catch (err) {
      setError('রিকোয়েস্ট লোড করতে সমস্যা হয়েছে: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus, userId, amount) => {
    try {
      await addMoneyAPI.updateRequestStatus(requestId, newStatus);
      if (newStatus === 'approved') {
        // Optionally, update user balance on frontend, or re-fetch user data
        // For now, we rely on backend to handle balance update
        // And just refresh requests
      }
      fetchRequests(); // Refresh requests after update
      alert(`রিকোয়েস্ট ${newStatus === 'approved' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত'} হয়েছে`);
    } catch (err) {
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="text-white text-center py-8">রিকোয়েস্ট লোড হচ্ছে...</div>;
  }

  if (error) {
    return <div className="text-red-300 text-center py-8">এরর: {error}</div>;
  }

  return (
    <div className="p-4 glass-card">
      <h2 className="text-2xl font-bold text-white mb-6">এড মানি রিকোয়েস্ট ম্যানেজমেন্ট</h2>
      
      {requests.length === 0 ? (
        <p className="text-white/70 text-center">কোন এড মানি রিকোয়েস্ট পাওয়া যায়নি।</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-glass-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-white/20">
                <th className="py-3 px-4 text-left text-white">ইউজার</th>
                <th className="py-3 px-4 text-left text-white">পরিমাণ</th>
                <th className="py-3 px-4 text-left text-white">প্রাপকের নাম্বার</th>
                <th className="py-3 px-4 text-left text-white">ট্রানজেকশন আইডি</th>
                <th className="py-3 px-4 text-left text-white">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-left text-white">তারিখ</th>
                <th className="py-3 px-4 text-left text-white">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b border-white/10 last:border-b-0">
                  <td className="py-3 px-4 text-white/80">
                    {request.user?.name} ({request.user?.email})
                  </td>
                  <td className="py-3 px-4 text-white/80">{request.amount} টাকা</td>
                  <td className="py-3 px-4 text-white/80">{request.senderNumber}</td>
                  <td className="py-3 px-4 text-white/80">{request.transactionId}</td>
                  <td className="py-3 px-4">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${request.status === 'pending' ? 'bg-yellow-500/30 text-yellow-100' :
                          request.status === 'approved' ? 'bg-green-500/30 text-green-100' :
                          'bg-red-500/30 text-red-100'
                        }`}
                    >
                      {request.status === 'pending' ? 'পেন্ডিং' : request.status === 'approved' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white/80">{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(request._id, 'approved', request.user._id, request.amount)}
                          className="bg-green-500/30 text-green-100 px-3 py-1 rounded text-sm hover:bg-green-500/50 transition-colors"
                        >
                          অনুমোদন
                        </button>
                        <button
                          onClick={() => handleStatusChange(request._id, 'rejected')}
                          className="bg-red-500/30 text-red-100 px-3 py-1 rounded text-sm hover:bg-red-500/50 transition-colors"
                        >
                          প্রত্যাখ্যান
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddMoneyRequestManagement; 