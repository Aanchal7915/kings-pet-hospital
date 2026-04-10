import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const defaultAboutContent = {
  hero: {
    hospitalName: 'Kings Pet Hospital',
    tagline: 'Compassionate Veterinary Care, Every Day',
    description:
      'Trusted pet healthcare center for preventive wellness, diagnostics, surgery, grooming and recovery support.',
    image: '24.jpg',
  },
  story: {
    title: 'Our Story',
    paragraphs: [
      'Kings Pet Hospital began with a mission to deliver modern, compassionate care for pets.',
      'Our team combines clinical excellence with empathy at every stage of treatment.',
    ],
    image: '18.jpg',
  },
  whyChooseUs: {
    title: 'Why Choose Us',
    items: [
      { icon: 'stethoscope', title: 'Expert Vets', description: 'Skilled veterinarians with broad expertise.' },
      { icon: 'monitor', title: 'Modern Equipment', description: 'Advanced diagnostics and treatment setup.' },
      { icon: 'clock', title: '24/7 Care', description: 'Reliable support for urgent pet care needs.' },
      { icon: 'heart', title: 'Compassionate Team', description: 'Kind and attentive care for every pet.' },
    ],
  },
  stats: {
    items: [
      { label: 'Pets Treated', value: '500+' },
      { label: 'Doctors', value: '10+' },
      { label: 'Years of Care', value: '5+' },
      { label: 'Happy Clients', value: '98%' },
    ],
  },
  facilities: {
    title: 'Our Facilities',
    images: [
      { url: '18.jpg', caption: 'Surgery and treatment area' },
      { url: '20.jpg', caption: 'Grooming and pet wellness zone' },
      { url: '24.jpg', caption: 'Consultation and diagnostics room' },
      { url: '56.jpg', caption: 'Recovery and support care section' },
    ],
  },
  contactCta: {
    title: 'Visit Kings Pet Hospital',
    description: 'Book a consultation or contact our team for personalized pet care support.',
    address: 'Faridabad, Haryana, India',
    phone: '+91 99999 99999',
    email: 'care@kingspethospital.in',
    mapLink: 'https://maps.google.com',
    buttonText: 'Get Directions',
  },
};

const defaultDoctorsHero = {
  title: 'Our Doctors',
  subtitle: 'Meet the veterinary professionals behind compassionate and evidence-based care.',
};

const emptyDoctor = {
  name: '',
  photo: '',
  designation: '',
  specializations: '',
  experience: '',
  bio: '',
  isActive: true,
  order: 0,
};

const sectionSaveLabels = {
  hero: 'Hero',
  story: 'Our Story',
  whyChooseUs: 'Why Choose Us',
  stats: 'Stats',
  facilities: 'Facilities',
  contactCta: 'Contact CTA',
};

const AdminPagesCMS = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = useMemo(() => localStorage.getItem('adminToken') || '', []);
  const authConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  const [about, setAbout] = useState(defaultAboutContent);
  const [doctorsHero, setDoctorsHero] = useState(defaultDoctorsHero);
  const [doctors, setDoctors] = useState([]);
  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [editingDoctorId, setEditingDoctorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const setFacility = (index, key, value) => {
    setAbout((prev) => {
      const nextImages = [...(prev.facilities?.images || [])];
      nextImages[index] = { ...nextImages[index], [key]: value };
      return { ...prev, facilities: { ...prev.facilities, images: nextImages } };
    });
  };

  const setWhyCard = (index, key, value) => {
    setAbout((prev) => {
      const nextItems = [...(prev.whyChooseUs?.items || [])];
      nextItems[index] = { ...nextItems[index], [key]: value };
      return { ...prev, whyChooseUs: { ...prev.whyChooseUs, items: nextItems } };
    });
  };

  const setStat = (index, key, value) => {
    setAbout((prev) => {
      const nextItems = [...(prev.stats?.items || [])];
      nextItems[index] = { ...nextItems[index], [key]: value };
      return { ...prev, stats: { ...prev.stats, items: nextItems } };
    });
  };

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [aboutRes, doctorsPageRes, doctorsRes] = await Promise.all([
        axios.get(`${API_URL}/api/pages/about`),
        axios.get(`${API_URL}/api/pages/doctors`),
        axios.get(`${API_URL}/api/doctors/admin`, authConfig),
      ]);

      const aboutMap = (aboutRes.data.data || []).reduce((acc, item) => {
        acc[item.section] = item.content;
        return acc;
      }, {});

      const doctorsMap = (doctorsPageRes.data.data || []).reduce((acc, item) => {
        acc[item.section] = item.content;
        return acc;
      }, {});

      setAbout({ ...defaultAboutContent, ...aboutMap });
      setDoctorsHero(doctorsMap.hero || defaultDoctorsHero);
      setDoctors(doctorsRes.data.data || []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.error || 'Failed to load pages CMS data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const saveAboutSection = async (section) => {
    setSavingSection(section);
    setMessage('');
    setError('');
    try {
      await axios.put(
        `${API_URL}/api/pages/about/${section}`,
        { content: about[section] || {} },
        authConfig
      );
      setMessage(`${sectionSaveLabels[section]} section updated.`);
    } catch (saveError) {
      setError(saveError.response?.data?.error || 'Failed to save section');
    } finally {
      setSavingSection('');
    }
  };

  const saveDoctorsHero = async () => {
    setSavingSection('doctorsHero');
    setMessage('');
    setError('');
    try {
      await axios.put(`${API_URL}/api/pages/doctors/hero`, { content: doctorsHero }, authConfig);
      setMessage('Doctors page heading updated.');
    } catch (saveError) {
      setError(saveError.response?.data?.error || 'Failed to save doctors heading');
    } finally {
      setSavingSection('');
    }
  };

  const submitDoctor = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      ...doctorForm,
      order: Number(doctorForm.order || 0),
      specializations: String(doctorForm.specializations || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (editingDoctorId) {
        await axios.put(`${API_URL}/api/doctors/${editingDoctorId}`, payload, authConfig);
      } else {
        await axios.post(`${API_URL}/api/doctors`, payload, authConfig);
      }
      setDoctorForm(emptyDoctor);
      setEditingDoctorId('');
      setMessage(editingDoctorId ? 'Doctor updated successfully.' : 'Doctor created successfully.');
      fetchAll();
    } catch (submitError) {
      setError(submitError.response?.data?.error || 'Failed to save doctor');
    }
  };

  const editDoctor = (doctor) => {
    setEditingDoctorId(doctor._id);
    setDoctorForm({
      name: doctor.name || '',
      photo: doctor.photo || '',
      designation: doctor.designation || '',
      specializations: (doctor.specializations || []).join(', '),
      experience: doctor.experience || '',
      bio: doctor.bio || '',
      isActive: doctor.isActive !== false,
      order: doctor.order || 0,
    });
  };

  const removeDoctor = async (id) => {
    if (!window.confirm('Delete this doctor profile?')) return;

    setMessage('');
    setError('');
    try {
      await axios.delete(`${API_URL}/api/doctors/${id}`, authConfig);
      setMessage('Doctor deleted successfully.');
      fetchAll();
    } catch (removeError) {
      setError(removeError.response?.data?.error || 'Failed to delete doctor');
    }
  };

  const seedContent = async () => {
    setMessage('');
    setError('');
    try {
      await axios.post(`${API_URL}/api/pages/seed-content`, {}, authConfig);
      setMessage('Seed content imported from baseline website copy.');
      fetchAll();
    } catch (seedError) {
      setError(seedError.response?.data?.error || 'Failed to seed content');
    }
  };

  if (loading) {
    return <div className="bg-white rounded-2xl border border-gray-100 p-6">Loading Pages CMS...</div>;
  }

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Pages CMS</h3>
            <p className="text-sm text-gray-500">Manage About and Doctors pages from admin.</p>
          </div>
          <button
            type="button"
            onClick={seedContent}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
          >
            Seed Content
          </button>
        </div>

        {message && <p className="mt-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">{message}</p>}
        {error && <p className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">{error}</p>}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
        <h4 className="text-xl font-black text-gray-900">About Page Editor</h4>

        <article className="rounded-xl border border-gray-200 p-4 space-y-3">
          <h5 className="font-black text-gray-900">Hero Section</h5>
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Hospital Name" value={about.hero?.hospitalName || ''} onChange={(e) => setAbout((prev) => ({ ...prev, hero: { ...prev.hero, hospitalName: e.target.value } }))} />
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Tagline" value={about.hero?.tagline || ''} onChange={(e) => setAbout((prev) => ({ ...prev, hero: { ...prev.hero, tagline: e.target.value } }))} />
          <textarea className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Description" value={about.hero?.description || ''} onChange={(e) => setAbout((prev) => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Hero image URL" value={about.hero?.image || ''} onChange={(e) => setAbout((prev) => ({ ...prev, hero: { ...prev.hero, image: e.target.value } }))} />
            <label className="border rounded-lg px-3 py-2 bg-gray-50 text-sm text-gray-700 flex items-center justify-between cursor-pointer">
              Upload Hero Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const image = await toDataUrl(e.target.files[0]);
                  setAbout((prev) => ({ ...prev, hero: { ...prev.hero, image } }));
                }}
              />
            </label>
          </div>
          <button type="button" onClick={() => saveAboutSection('hero')} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold" disabled={savingSection === 'hero'}>
            {savingSection === 'hero' ? 'Saving...' : 'Save Hero'}
          </button>
        </article>

        <article className="rounded-xl border border-gray-200 p-4 space-y-3">
          <h5 className="font-black text-gray-900">Our Story Section</h5>
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Story title" value={about.story?.title || ''} onChange={(e) => setAbout((prev) => ({ ...prev, story: { ...prev.story, title: e.target.value } }))} />
          <textarea className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Paragraph 1" value={about.story?.paragraphs?.[0] || ''} onChange={(e) => setAbout((prev) => ({ ...prev, story: { ...prev.story, paragraphs: [e.target.value, prev.story?.paragraphs?.[1] || ''] } }))} />
          <textarea className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Paragraph 2" value={about.story?.paragraphs?.[1] || ''} onChange={(e) => setAbout((prev) => ({ ...prev, story: { ...prev.story, paragraphs: [prev.story?.paragraphs?.[0] || '', e.target.value] } }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Story image URL" value={about.story?.image || ''} onChange={(e) => setAbout((prev) => ({ ...prev, story: { ...prev.story, image: e.target.value } }))} />
            <label className="border rounded-lg px-3 py-2 bg-gray-50 text-sm text-gray-700 flex items-center justify-between cursor-pointer">
              Upload Story Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const image = await toDataUrl(e.target.files[0]);
                  setAbout((prev) => ({ ...prev, story: { ...prev.story, image } }));
                }}
              />
            </label>
          </div>
          <button type="button" onClick={() => saveAboutSection('story')} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold" disabled={savingSection === 'story'}>
            {savingSection === 'story' ? 'Saving...' : 'Save Story'}
          </button>
        </article>

        <article className="rounded-xl border border-gray-200 p-4 space-y-3">
          <h5 className="font-black text-gray-900">Why Choose Us</h5>
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Section title" value={about.whyChooseUs?.title || ''} onChange={(e) => setAbout((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, title: e.target.value } }))} />
          {(about.whyChooseUs?.items || []).map((item, index) => (
            <div key={`why-${index}`} className="rounded-lg border border-gray-200 p-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              <input className="border rounded px-2 py-1" placeholder="Icon key" value={item.icon || ''} onChange={(e) => setWhyCard(index, 'icon', e.target.value)} />
              <input className="border rounded px-2 py-1" placeholder="Title" value={item.title || ''} onChange={(e) => setWhyCard(index, 'title', e.target.value)} />
              <input className="border rounded px-2 py-1" placeholder="Description" value={item.description || ''} onChange={(e) => setWhyCard(index, 'description', e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={() => saveAboutSection('whyChooseUs')} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold" disabled={savingSection === 'whyChooseUs'}>
            {savingSection === 'whyChooseUs' ? 'Saving...' : 'Save Why Choose Us'}
          </button>
        </article>

        <article className="rounded-xl border border-gray-200 p-4 space-y-3">
          <h5 className="font-black text-gray-900">Stats Bar</h5>
          {(about.stats?.items || []).map((item, index) => (
            <div key={`stats-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input className="border rounded px-2 py-1" placeholder="Value" value={item.value || ''} onChange={(e) => setStat(index, 'value', e.target.value)} />
              <input className="border rounded px-2 py-1" placeholder="Label" value={item.label || ''} onChange={(e) => setStat(index, 'label', e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={() => saveAboutSection('stats')} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold" disabled={savingSection === 'stats'}>
            {savingSection === 'stats' ? 'Saving...' : 'Save Stats'}
          </button>
        </article>

        <article className="rounded-xl border border-gray-200 p-4 space-y-3">
          <h5 className="font-black text-gray-900">Facilities Gallery</h5>
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Section title" value={about.facilities?.title || ''} onChange={(e) => setAbout((prev) => ({ ...prev, facilities: { ...prev.facilities, title: e.target.value } }))} />
          {(about.facilities?.images || []).map((item, index) => (
            <div key={`fac-${index}`} className="rounded-lg border border-gray-200 p-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              <input className="border rounded px-2 py-1" placeholder="Image URL" value={item.url || ''} onChange={(e) => setFacility(index, 'url', e.target.value)} />
              <input className="border rounded px-2 py-1" placeholder="Caption" value={item.caption || ''} onChange={(e) => setFacility(index, 'caption', e.target.value)} />
              <label className="border rounded px-2 py-1 bg-gray-50 text-sm text-gray-700 flex items-center justify-between cursor-pointer">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (!e.target.files?.[0]) return;
                    const image = await toDataUrl(e.target.files[0]);
                    setFacility(index, 'url', image);
                  }}
                />
              </label>
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button" onClick={() => setAbout((prev) => ({ ...prev, facilities: { ...prev.facilities, images: [...(prev.facilities?.images || []), { url: '', caption: '' }] } }))} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-bold">
              + Add Facility Image
            </button>
            <button type="button" onClick={() => saveAboutSection('facilities')} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold" disabled={savingSection === 'facilities'}>
              {savingSection === 'facilities' ? 'Saving...' : 'Save Facilities'}
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 p-4 space-y-3">
          <h5 className="font-black text-gray-900">Location / Contact CTA</h5>
          <input className="w-full border rounded-lg px-3 py-2" placeholder="CTA title" value={about.contactCta?.title || ''} onChange={(e) => setAbout((prev) => ({ ...prev, contactCta: { ...prev.contactCta, title: e.target.value } }))} />
          <textarea className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="CTA description" value={about.contactCta?.description || ''} onChange={(e) => setAbout((prev) => ({ ...prev, contactCta: { ...prev.contactCta, description: e.target.value } }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input className="border rounded px-2 py-1" placeholder="Address" value={about.contactCta?.address || ''} onChange={(e) => setAbout((prev) => ({ ...prev, contactCta: { ...prev.contactCta, address: e.target.value } }))} />
            <input className="border rounded px-2 py-1" placeholder="Phone" value={about.contactCta?.phone || ''} onChange={(e) => setAbout((prev) => ({ ...prev, contactCta: { ...prev.contactCta, phone: e.target.value } }))} />
            <input className="border rounded px-2 py-1" placeholder="Email" value={about.contactCta?.email || ''} onChange={(e) => setAbout((prev) => ({ ...prev, contactCta: { ...prev.contactCta, email: e.target.value } }))} />
            <input className="border rounded px-2 py-1" placeholder="Map link" value={about.contactCta?.mapLink || ''} onChange={(e) => setAbout((prev) => ({ ...prev, contactCta: { ...prev.contactCta, mapLink: e.target.value } }))} />
            <input className="border rounded px-2 py-1 md:col-span-2" placeholder="Button text" value={about.contactCta?.buttonText || ''} onChange={(e) => setAbout((prev) => ({ ...prev, contactCta: { ...prev.contactCta, buttonText: e.target.value } }))} />
          </div>
          <button type="button" onClick={() => saveAboutSection('contactCta')} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold" disabled={savingSection === 'contactCta'}>
            {savingSection === 'contactCta' ? 'Saving...' : 'Save Contact CTA'}
          </button>
        </article>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
        <h4 className="text-xl font-black text-gray-900">Doctors Page CMS</h4>

        <article className="rounded-xl border border-gray-200 p-4 space-y-3">
          <h5 className="font-black text-gray-900">Doctors Page Heading</h5>
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Page title" value={doctorsHero.title || ''} onChange={(e) => setDoctorsHero((prev) => ({ ...prev, title: e.target.value }))} />
          <textarea className="w-full border rounded-lg px-3 py-2" rows={2} placeholder="Page subtitle" value={doctorsHero.subtitle || ''} onChange={(e) => setDoctorsHero((prev) => ({ ...prev, subtitle: e.target.value }))} />
          <button type="button" onClick={saveDoctorsHero} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold" disabled={savingSection === 'doctorsHero'}>
            {savingSection === 'doctorsHero' ? 'Saving...' : 'Save Doctors Heading'}
          </button>
        </article>

        <article className="rounded-xl border border-gray-200 p-4">
          <h5 className="font-black text-gray-900 mb-3">Manage Doctors</h5>

          <form onSubmit={submitDoctor} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input className="border rounded px-3 py-2" placeholder="Name" value={doctorForm.name} onChange={(e) => setDoctorForm((prev) => ({ ...prev, name: e.target.value }))} required />
              <input className="border rounded px-3 py-2" placeholder="Designation" value={doctorForm.designation} onChange={(e) => setDoctorForm((prev) => ({ ...prev, designation: e.target.value }))} required />
              <input className="border rounded px-3 py-2" placeholder="Specializations (comma separated)" value={doctorForm.specializations} onChange={(e) => setDoctorForm((prev) => ({ ...prev, specializations: e.target.value }))} required />
              <input className="border rounded px-3 py-2" placeholder="Experience (e.g. 8+ years)" value={doctorForm.experience} onChange={(e) => setDoctorForm((prev) => ({ ...prev, experience: e.target.value }))} required />
              <input className="border rounded px-3 py-2" placeholder="Display order" type="number" value={doctorForm.order} onChange={(e) => setDoctorForm((prev) => ({ ...prev, order: e.target.value }))} />
              <label className="border rounded px-3 py-2 bg-gray-50 text-sm text-gray-700 flex items-center justify-between cursor-pointer">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (!e.target.files?.[0]) return;
                    const image = await toDataUrl(e.target.files[0]);
                    setDoctorForm((prev) => ({ ...prev, photo: image }));
                  }}
                />
              </label>
              <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Photo URL" value={doctorForm.photo} onChange={(e) => setDoctorForm((prev) => ({ ...prev, photo: e.target.value }))} required />
              <textarea className="border rounded px-3 py-2 md:col-span-2" rows={3} placeholder="Short bio" value={doctorForm.bio} onChange={(e) => setDoctorForm((prev) => ({ ...prev, bio: e.target.value }))} required />
            </div>

            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input type="checkbox" checked={doctorForm.isActive} onChange={(e) => setDoctorForm((prev) => ({ ...prev, isActive: e.target.checked }))} />
              Active
            </label>

            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold">
                {editingDoctorId ? 'Update Doctor' : 'Add Doctor'}
              </button>
              {editingDoctorId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingDoctorId('');
                    setDoctorForm(emptyDoctor);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {doctors.map((doctor) => (
              <article key={doctor._id} className="rounded-lg border border-gray-200 p-3">
                {doctor.photo?.trim() ? (
                  <img
                    src={doctor.photo?.trim() || '/logo.jpg'}
                    alt={doctor.name}
                    className="w-full h-40 object-cover rounded-md bg-gray-100"
                  />
                ) : (
                  <div className="w-full h-40 rounded-md bg-gray-100 flex items-center justify-center text-sm text-gray-500">No Photo</div>
                )}
                <h6 className="mt-2 font-black text-gray-900">{doctor.name}</h6>
                <p className="text-sm text-blue-700 font-semibold">{doctor.designation}</p>
                <p className="text-xs text-gray-600 mt-1">{(doctor.specializations || []).join(', ')}</p>
                <p className="text-xs text-gray-500 mt-1">{doctor.experience}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => editDoctor(doctor)} className="px-3 py-1 rounded bg-amber-500 text-white text-xs font-bold">Edit</button>
                  <button type="button" onClick={() => removeDoctor(doctor._id)} className="px-3 py-1 rounded bg-red-600 text-white text-xs font-bold">Delete</button>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminPagesCMS;
