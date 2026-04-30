import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheck, FaPaw, FaDog, FaVenusMars, FaBirthdayCake, FaHeart, FaShieldAlt, FaSyringe, FaMapMarkerAlt } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const isValidImage = (s) => typeof s === 'string' && (s.startsWith('http') || s.startsWith('data:') || s.startsWith('/'));

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) { resolve(true); return; }
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const PetListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/petlistings/${id}`);
        setPet(data.data);
      } catch (_) { setPet(null); } finally { setLoading(false); }
    })();
  }, [id]);

  const openBook = () => {
    let prefill = { name: '', email: '' };
    try {
      const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
      prefill.name = info?.name || '';
      prefill.email = info?.email || '';
    } catch (_) {}
    setForm({ name: prefill.name, phone: '', email: prefill.email, address: '', city: '', message: '' });
    setErrors({});
    setSuccess(null);
    setOpen(true);
  };
  const closeBook = () => { setOpen(false); setSuccess(null); };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setForm(p => ({ ...p, address: 'Fetching location...' }));
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (res.data && res.data.display_name) {
          const city = res.data.address?.city || res.data.address?.town || res.data.address?.state_district || form.city;
          setForm(p => ({ ...p, address: res.data.display_name, city }));
          setErrors(p => ({ ...p, address: '' }));
        } else {
          setForm(p => ({ ...p, address: `${latitude}, ${longitude}` }));
        }
      } catch (err) {
        setForm(p => ({ ...p, address: `${position.coords.latitude}, ${position.coords.longitude}` }));
      }
    }, () => {
      setForm(p => ({ ...p, address: '' }));
      alert('Unable to retrieve your location');
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(form.phone.trim())) nextErrors.phone = 'Phone must be 10 digits';
    if (Object.keys(nextErrors).length > 0) { setErrors(nextErrors); return; }
    setSubmitting(true);
    try {
      const orderRes = await axios.post(`${API_URL}/api/petorders/create-razorpay-order`, {
        orderType: 'pet', itemId: pet._id, quantity: 1,
      });
      const orderData = orderRes.data?.data;
      if (!orderData) throw new Error('Failed to create payment order');

      const ok = await loadRazorpay();
      if (!ok) {
        alert('Unable to load Razorpay checkout');
        setSubmitting(false);
        return;
      }

      const userToken = localStorage.getItem('userToken');
      const config = userToken ? { headers: { Authorization: `Bearer ${userToken}` } } : {};

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Kings Pet Hospital',
        description: pet.name,
        prefill: { name: form.name, contact: form.phone, email: form.email },
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${API_URL}/api/petorders`, {
              orderType: 'pet', itemId: pet._id, message: form.message,
              customer: { name: form.name, phone: form.phone, email: form.email, address: form.address, city: form.city },
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, config);
            setSuccess(verifyRes.data.data);
          } catch (verifyErr) {
            alert(verifyErr.response?.data?.error || 'Payment verification failed');
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to start payment');
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50"><Header showHero={false} />
      <main className="pt-28 pb-16 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div></main>
    <Footer /></div>
  );

  if (!pet) return (
    <div className="min-h-screen bg-gray-50"><Header showHero={false} />
      <main className="pt-28 pb-16 text-center"><p className="text-gray-500 mb-4">Pet listing not found.</p><Link to="/pets-for-sale" className="text-blue-600 font-bold">Back to Pets For Sale</Link></main>
    <Footer /></div>
  );

  const remainingAmount = Math.max(Number(pet.price) - Number(pet.bookingAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHero={false} />
      <main className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate('/pets-for-sale')} className="text-sm text-blue-600 font-bold mb-6 inline-flex items-center gap-1 hover:underline">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Back to Pets For Sale
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
              {/* Left Side: Image & Description */}
              <div className="flex flex-col bg-gray-50/50 border-r border-gray-100">
                <div className="relative flex items-start justify-center min-h-[250px] md:min-h-[300px] overflow-hidden">
                  {isValidImage(pet.image)
                    ? <img src={pet.image} alt={pet.name} className="w-full max-h-[350px] object-cover"/>
                    : <FaPaw size={80} className="text-gray-200"/>}
                  {/* Health badges overlay */}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {pet.vaccinated && <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><FaSyringe size={10}/>Vaccinated</span>}
                    {pet.dewormed && <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><FaShieldAlt size={10}/>Dewormed</span>}
                  </div>
                </div>

                {pet.description && (
                  <div className="p-8 mt-4">
                    <h3 className="text-sm font-black text-gray-800 mb-2">About this pet</h3>
                    <p className={`text-sm text-gray-600 leading-relaxed break-words whitespace-pre-wrap ${!descExpanded ? 'line-clamp-3' : ''}`}>{pet.description}</p>
                    {pet.description.length > 150 && (
                      <button onClick={() => setDescExpanded(!descExpanded)} className="text-xs font-bold text-blue-600 mt-2 hover:underline focus:outline-none">
                        {descExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="py-6 pl-10 pr-6 md:py-8 md:pl-14 md:pr-8 flex flex-col">
                <span className="inline-block self-start text-[10px] uppercase font-bold bg-violet-100 text-violet-700 px-3 py-1 rounded-full mb-3">{pet.petType}</span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-gradient-animate underline-animate leading-tight mb-1">{pet.name}</h1>
                {pet.breed && <p className="text-sm text-gray-500 mb-3">{pet.breed}{pet.gender && pet.gender !== 'Unknown' ? ` • ${pet.gender}` : ''}{pet.age ? ` • ${pet.age}` : ''}{pet.color ? ` • ${pet.color}` : ''}</p>}

                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl font-black text-blue-700">₹{Number(pet.price).toLocaleString('en-IN')}</span>
                </div>
                {Number(pet.bookingAmount) > 0 && (
                  <p className="text-sm text-emerald-700 font-semibold mb-4">✅ Booking: ₹{Number(pet.bookingAmount).toLocaleString('en-IN')} (₹{remainingAmount.toLocaleString('en-IN')} remaining on pickup)</p>
                )}

                {/* Info tiles */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {pet.breed && <div className="bg-violet-50 rounded-xl p-3 flex items-center gap-2"><FaDog className="text-violet-500 shrink-0" size={13}/><div><p className="text-[9px] text-gray-500 uppercase font-bold">Breed</p><p className="text-sm font-black text-gray-800">{pet.breed}</p></div></div>}
                  {pet.age && <div className="bg-orange-50 rounded-xl p-3 flex items-center gap-2"><FaBirthdayCake className="text-orange-500 shrink-0" size={13}/><div><p className="text-[9px] text-gray-500 uppercase font-bold">Age</p><p className="text-sm font-black text-gray-800">{pet.age}</p></div></div>}
                  {pet.gender && pet.gender !== 'Unknown' && <div className="bg-pink-50 rounded-xl p-3 flex items-center gap-2"><FaVenusMars className="text-pink-500 shrink-0" size={13}/><div><p className="text-[9px] text-gray-500 uppercase font-bold">Gender</p><p className="text-sm font-black text-gray-800">{pet.gender}</p></div></div>}
                  {pet.color && <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2"><FaHeart className="text-blue-500 shrink-0" size={13}/><div><p className="text-[9px] text-gray-500 uppercase font-bold">Color</p><p className="text-sm font-black text-gray-800">{pet.color}</p></div></div>}
                </div>



                <div className="border-t border-gray-100 pt-4 mb-6">
                  <h3 className="text-sm font-black text-gray-800 mb-2">Health & Details</h3>
                  <ul className="space-y-1.5">
                    {pet.vaccinated && <li className="flex items-center gap-2 text-sm text-gray-700"><FaCheck className="text-emerald-500 shrink-0" size={11}/>Fully vaccinated</li>}
                    {pet.dewormed && <li className="flex items-center gap-2 text-sm text-gray-700"><FaCheck className="text-emerald-500 shrink-0" size={11}/>Dewormed & vet-checked</li>}
                    {pet.breed && <li className="flex items-center gap-2 text-sm text-gray-700"><FaCheck className="text-blue-500 shrink-0" size={11}/>Purebred {pet.breed}</li>}
                    <li className="flex items-center gap-2 text-sm text-gray-700"><FaCheck className="text-blue-500 shrink-0" size={11}/>Booking valid for 7 days</li>
                    <li className="flex items-center gap-2 text-sm text-gray-700"><FaCheck className="text-blue-500 shrink-0" size={11}/>Kings Pet Hospital certified</li>
                  </ul>
                </div>

                <button onClick={openBook}
                  className="mt-auto w-full py-3 rounded-xl text-white font-black text-base flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 transition-colors">
                  <FaPaw size={16}/>Book This Pet
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {success ? (
              <div className="p-8 text-center">
                <div className="inline-flex w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-4">
                  <svg className="w-9 h-9 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900">Booking Received!</h3>
                <p className="text-gray-600 mt-2">Booking ID: <span className="font-bold">{success.orderId}</span></p>
                <p className="text-gray-600 mt-3">We will contact you on your phone with confirmation and pickup details.</p>
                <p className="text-gray-700 font-semibold mt-2">Booking will be valid for 7 days.</p>
                <button onClick={closeBook} className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold">Close</button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div><h3 className="text-base font-black text-gray-900">Book: {pet.name}</h3><p className="text-xs text-gray-500">{pet.breed} • ₹{Number(pet.price).toLocaleString('en-IN')}</p></div>
                  <button type="button" onClick={closeBook} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div><label className="text-[11px] font-bold text-gray-700">Your Name *</label><input className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" value={form.name} onChange={(e)=>{setErrors(p=>({...p,name:''}));setForm(p=>({...p,name:e.target.value}))}}/>{errors.name&&<p className="text-[11px] text-rose-600">{errors.name}</p>}</div>
                  <div><label className="text-[11px] font-bold text-gray-700">Phone *</label><input className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" value={form.phone} onChange={(e)=>{setErrors(p=>({...p,phone:''}));setForm(p=>({...p,phone:e.target.value.replace(/[^0-9]/g,'').slice(0,10)}))}}/>{errors.phone&&<p className="text-[11px] text-rose-600">{errors.phone}</p>}</div>
                  <div className="md:col-span-2"><label className="text-[11px] font-bold text-gray-700">Email</label><input type="email" className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" value={form.email} onChange={(e)=>setForm(p=>({...p,email:e.target.value}))}/></div>
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="text-[11px] font-bold text-gray-700">Address</label>
                      <button type="button" onClick={getLocation} className="text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline">
                        <FaMapMarkerAlt /> Use my location
                      </button>
                    </div>
                    <textarea className="w-full border rounded-md px-2 py-1 text-sm" rows={2} value={form.address} onChange={(e)=>setForm(p=>({...p,address:e.target.value}))}/>
                  </div>
                  <div className="md:col-span-2"><label className="text-[11px] font-bold text-gray-700">City</label><input className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" value={form.city} onChange={(e)=>setForm(p=>({...p,city:e.target.value}))}/></div>
                  <div className="md:col-span-2"><label className="text-[11px] font-bold text-gray-700">Message (optional)</label><textarea className="w-full border rounded-md px-2 py-1 text-sm mt-0.5" rows={1} value={form.message} onChange={(e)=>setForm(p=>({...p,message:e.target.value}))} placeholder="Any specific questions?"/></div>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 text-xs"><p>Total: <span className="font-black text-blue-700">₹{Number(pet.price).toLocaleString('en-IN')}</span></p>{Number(pet.bookingAmount)>0&&<p className="text-[11px] text-gray-600">Booking: ₹{Number(pet.bookingAmount).toLocaleString('en-IN')} (₹{remainingAmount.toLocaleString('en-IN')} on pickup)</p>}</div>
                <button type="submit" disabled={submitting} className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-black disabled:opacity-60">{submitting?'Submitting...':'Submit Booking Request'}</button>
                <p className="text-[10px] text-gray-500 text-center">Booking valid 7 days. Our team will contact you shortly.</p>
              </form>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PetListingDetailPage;
