import { useEffect, useState } from 'react';
import { servicesAPI } from '../services/api';

const emptyService = {
  title: '',
  description: '',
  category: '',
  options: [{ name: '', price: '' }],
};

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(emptyService);
  const [newService, setNewService] = useState(emptyService);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await servicesAPI.getAllServices();
      setServices(res.data.services);
    } catch (err) {
      setError('সার্ভিস লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // --- Edit ---
  const handleEditClick = (service) => {
    setEditingId(service._id);
    setEditData({ ...service, options: service.options.map(opt => ({ ...opt })) });
    setMessage('');
    setError('');
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };
  const handleEditOptionChange = (idx, field, value) => {
    setEditData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === idx ? { ...opt, [field]: value } : opt),
    }));
  };
  const handleAddEditOption = () => {
    setEditData(prev => ({ ...prev, options: [...prev.options, { name: '', price: '' }] }));
  };
  const handleRemoveEditOption = (idx) => {
    setEditData(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));
  };
  const handleEditSave = async () => {
    try {
      await servicesAPI.updateService(editingId, editData);
      setMessage('সার্ভিস আপডেট হয়েছে!');
      setEditingId(null);
      fetchServices();
    } catch (err) {
      setError('সার্ভিস আপডেট করতে সমস্যা হয়েছে');
    }
  };
  const handleEditCancel = () => {
    setEditingId(null);
    setEditData(emptyService);
  };

  // --- Delete ---
  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত সার্ভিসটি ডিলিট করতে চান?')) return;
    try {
      await servicesAPI.deleteService(id);
      setMessage('সার্ভিস ডিলিট হয়েছে!');
      fetchServices();
    } catch (err) {
      setError('সার্ভিস ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  // --- Add ---
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };
  const handleNewOptionChange = (idx, field, value) => {
    setNewService(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === idx ? { ...opt, [field]: value } : opt),
    }));
  };
  const handleAddNewOption = () => {
    setNewService(prev => ({ ...prev, options: [...prev.options, { name: '', price: '' }] }));
  };
  const handleRemoveNewOption = (idx) => {
    setNewService(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));
  };
  const handleAddService = async (e) => {
    e.preventDefault();
    setAdding(true);
    setMessage('');
    setError('');
    // --- Validation ---
    if (!newService.title.trim() || !newService.description.trim()) {
      setError('নাম ও বর্ণনা অবশ্যই পূরণ করতে হবে');
      setAdding(false);
      return;
    }
    if (!Array.isArray(newService.options) || newService.options.length === 0) {
      setError('অন্তত ১টি অপশন দিতে হবে');
      setAdding(false);
      return;
    }
    for (const opt of newService.options) {
      if (!opt.name.trim() || !opt.price.trim()) {
        setError('সব অপশনের নাম ও দাম পূরণ করুন');
        setAdding(false);
        return;
      }
    }
    try {
      await servicesAPI.createService(newService);
      setMessage('নতুন সার্ভিস যোগ হয়েছে!');
      setNewService(emptyService);
      fetchServices();
    } catch (err) {
      setError('নতুন সার্ভিস যোগ করতে সমস্যা হয়েছে');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">সার্ভিস ম্যানেজমেন্ট</h2>
      {message && <div className="bg-green-500/20 text-green-200 p-3 rounded mb-4 text-center">{message}</div>}
      {error && <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-center">{error}</div>}

      {/* Add New Service */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-xl font-bold text-white mb-4">নতুন সার্ভিস যোগ করুন</h3>
        <form onSubmit={handleAddService} className="space-y-4">
          <div>
            <label className="block text-white mb-1">নাম</label>
            <input type="text" name="title" value={newService.title} onChange={handleNewChange} className="form-input" required />
          </div>
          <div>
            <label className="block text-white mb-1">বর্ণনা</label>
            <textarea name="description" value={newService.description} onChange={handleNewChange} className="form-input" required />
          </div>
          <div>
            <label className="block text-white mb-1">ক্যাটাগরি</label>
            <input type="text" name="category" value={newService.category} onChange={handleNewChange} className="form-input" />
          </div>
          <div>
            <label className="block text-white mb-1">অপশনসমূহ</label>
            {newService.options.map((opt, idx) => (
              <div key={idx} className="flex space-x-2 mb-2">
                <input type="text" placeholder="নাম" value={opt.name} onChange={e => handleNewOptionChange(idx, 'name', e.target.value)} className="form-input flex-1" required />
                <input type="text" placeholder="দাম" value={opt.price} onChange={e => handleNewOptionChange(idx, 'price', e.target.value)} className="form-input flex-1" required />
                {newService.options.length > 1 && (
                  <button type="button" onClick={() => handleRemoveNewOption(idx)} className="bg-red-500/20 text-red-200 px-2 rounded">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddNewOption} className="glass-button mt-2">+ অপশন যোগ করুন</button>
          </div>
          <button type="submit" className="glass-button w-full" disabled={adding}>{adding ? 'যোগ হচ্ছে...' : 'নতুন সার্ভিস যোগ করুন'}</button>
        </form>
      </div>

      {/* Service List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-white text-center">লোড হচ্ছে...</div>
        ) : services.length === 0 ? (
          <div className="text-white/80 text-center">কোনো সার্ভিস পাওয়া যায়নি।</div>
        ) : (
          services.map(service => (
            <div key={service._id} className="glass-card p-6">
              {editingId === service._id ? (
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">সার্ভিস এডিট করুন</h4>
                  <div className="mb-2">
                    <label className="block text-white mb-1">নাম</label>
                    <input type="text" name="title" value={editData.title} onChange={handleEditChange} className="form-input" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-white mb-1">বর্ণনা</label>
                    <textarea name="description" value={editData.description} onChange={handleEditChange} className="form-input" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-white mb-1">ক্যাটাগরি</label>
                    <input type="text" name="category" value={editData.category} onChange={handleEditChange} className="form-input" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-white mb-1">অপশনসমূহ</label>
                    {editData.options.map((opt, idx) => (
                      <div key={idx} className="flex space-x-2 mb-2">
                        <input type="text" placeholder="নাম" value={opt.name} onChange={e => handleEditOptionChange(idx, 'name', e.target.value)} className="form-input flex-1" />
                        <input type="text" placeholder="দাম" value={opt.price} onChange={e => handleEditOptionChange(idx, 'price', e.target.value)} className="form-input flex-1" />
                        {editData.options.length > 1 && (
                          <button type="button" onClick={() => handleRemoveEditOption(idx)} className="bg-red-500/20 text-red-200 px-2 rounded">✕</button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={handleAddEditOption} className="glass-button mt-2">+ অপশন যোগ করুন</button>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button onClick={handleEditSave} className="glass-button flex-1">সেভ করুন</button>
                    <button onClick={handleEditCancel} className="glass-button flex-1 bg-red-500/20 hover:bg-red-500/30">বাতিল</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xl font-bold text-white">{service.title}</h4>
                    <div className="space-x-2">
                      <button onClick={() => handleEditClick(service)} className="glass-button text-sm px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30">এডিট</button>
                      <button onClick={() => handleDelete(service._id)} className="glass-button text-sm px-3 py-1 bg-red-500/20 hover:bg-red-500/30">ডিলিট</button>
                    </div>
                  </div>
                  <p className="text-white/80 mb-2">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {service.options.map((opt, idx) => (
                      <span key={idx} className="inline-block bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm">{opt.name} - {opt.price}</span>
                    ))}
                  </div>
                  <p className="text-white/60 text-sm">ক্যাটাগরি: {service.category || 'N/A'}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceManagement; 