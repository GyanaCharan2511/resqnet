import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  MapPin,
  Users,
  Phone,
  Upload,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

export const ReportIncident = () => {
  const { addIncident, currentUser } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reporterName: currentUser?.name || '',
    contact: currentUser?.phone || '',
    type: 'Flood',
    location: 'Gajuwaka, Visakhapatnam',
    customLocation: '',
    severity: 'High',
    affectedPeople: 15,
    title: '',
    description: '',
    requiredAssistance: 'Inflatable rescue boat, drinking water and medical kit',
    imagePreview: null
  });

  const [submittedIncident, setSubmittedIncident] = useState(null);
  const [errors, setErrors] = useState({});

  const locationPresets = [
    { label: 'Gajuwaka, Visakhapatnam', coords: [17.6904, 83.2098] },
    { label: 'RK Beach Road, Visakhapatnam', coords: [17.7126, 83.3228] },
    { label: 'Autonagar Industrial Zone, Visakhapatnam', coords: [17.6975, 83.1895] },
    { label: 'Simhachalam Ghat Road, Visakhapatnam', coords: [17.7664, 83.2506] },
    { label: 'Lanka Villages, Rajahmundry', coords: [17.0005, 81.8040] },
    { label: 'NH-16 Bypass, Vijayawada', coords: [16.5062, 80.6480] },
    { label: 'Uppada Beach, Kakinada', coords: [17.0863, 82.3275] },
    { label: 'Amadalavalasa, Srikakulam', coords: [18.4167, 83.9000] },
    { label: 'Krishnapatnam Port Vicinity, Nellore', coords: [14.2833, 80.1167] },
    { label: 'Other / Custom GPS Location', coords: [17.6868, 83.2185] }
  ];

  const disasterTypes = [
    { value: 'Flood', label: '🌊 Flood & Inundation' },
    { value: 'Cyclone', label: '🌪️ Cyclone / Gale Storm' },
    { value: 'Fire', label: '🔥 Fire & Explosion' },
    { value: 'Landslide', label: '⛰️ Landslide / Rockfall' },
    { value: 'Earthquake', label: '🏚️ Earthquake / Tremor' },
    { value: 'Accident', label: '💥 Highway / Rail Accident' },
    { value: 'Other', label: '⚠️ Other Hazard' }
  ];

  const severities = [
    { value: 'Low', label: 'Low', desc: 'Minor damage, no immediate life threat', color: 'border-emerald-500 text-emerald-600' },
    { value: 'Medium', label: 'Medium', desc: 'Localized disruption, aid needed', color: 'border-amber-500 text-amber-600' },
    { value: 'High', label: 'High', desc: 'Serious danger, trapped residents', color: 'border-orange-500 text-orange-600' },
    { value: 'Critical', label: 'Critical', desc: 'Life-threatening mass emergency', color: 'border-red-500 text-red-600' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamplePhoto = () => {
    // Generate a clean canvas gradient placeholder as photo
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('DISASTER GROUND TELEMETRY PHOTO', 40, 180);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Type: ${formData.type} | Location: ${formData.location}`, 40, 220);
    setFormData(prev => ({ ...prev, imagePreview: canvas.toDataURL() }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.reporterName.trim()) errs.reporterName = 'Reporter name is required';
    if (!formData.contact.trim()) errs.contact = 'Contact phone is required';
    if (!formData.description.trim()) errs.description = 'Please provide incident description';
    if (formData.location === 'Other / Custom GPS Location' && !formData.customLocation.trim()) {
      errs.customLocation = 'Please specify custom location';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const matchedLocation = locationPresets.find(l => l.label === formData.location);
    const finalLocation = formData.location === 'Other / Custom GPS Location' ? formData.customLocation : formData.location;
    const coords = matchedLocation ? matchedLocation.coords : [17.6868 + (Math.random() - 0.5) * 0.05, 83.2185 + (Math.random() - 0.5) * 0.05];

    const incidentPayload = {
      title: formData.title.trim() || `${formData.severity} ${formData.type} Incident in ${finalLocation.split(',')[0]}`,
      type: formData.type,
      location: finalLocation,
      coordinates: coords,
      severity: formData.severity,
      affectedPeople: Number(formData.affectedPeople) || 1,
      reportedBy: formData.reporterName,
      contact: formData.contact,
      description: formData.description,
      requiredAssistance: formData.requiredAssistance,
      image: formData.imagePreview
    };

    const created = addIncident(incidentPayload);
    setSubmittedIncident(created);
  };

  const handleReset = () => {
    setFormData({
      reporterName: currentUser?.name || '',
      contact: currentUser?.phone || '',
      type: 'Flood',
      location: 'Gajuwaka, Visakhapatnam',
      customLocation: '',
      severity: 'High',
      affectedPeople: 15,
      title: '',
      description: '',
      requiredAssistance: '',
      imagePreview: null
    });
    setErrors({});
  };

  if (submittedIncident) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex items-center justify-center max-w-2xl mx-auto animate-fade-in">
        <div className="w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/20">
              Registered ID: {submittedIncident.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Incident Report Submitted!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Your report has been logged into the Emergency Operations Center queue. Responders and SDRF task forces have been notified.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Disaster Type:</span>
              <strong className="text-slate-900 dark:text-white">{submittedIncident.type}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Severity:</span>
              <strong className="text-red-500">{submittedIncident.severity}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <strong className="text-slate-900 dark:text-white">{submittedIncident.location}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <strong className="text-blue-500">{submittedIncident.status}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/incidents')}
              className="w-full sm:w-auto"
            >
              View Incidents Roster
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate(`/map?lat=${submittedIncident.coordinates[0]}&lng=${submittedIncident.coordinates[1]}`)}
              className="w-full sm:w-auto"
            >
              Locate on GIS Map
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                setSubmittedIncident(null);
                handleReset();
              }}
              className="w-full sm:w-auto"
            >
              Submit Another Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:bg-red-950/40 dark:text-red-400 text-xs font-bold border border-red-500/20">
          <Flame className="w-4 h-4" />
          Rapid Emergency Incident Intake
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display">
          Report a Disaster or Incident
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Fill in accurate details to dispatch emergency rescue squads, relief materials, and medical teams.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Disaster Category & Severity */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
              Incident Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Disaster Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Disaster Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                >
                  {disasterTypes.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Title / Short Header */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Incident Title / Headline (Optional)
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Flash Flood in Sector 4 Main Street"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Severity Cards Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Emergency Severity Level *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {severities.map(s => {
                  const isSelected = formData.severity === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, severity: s.value }))}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? `bg-slate-100 dark:bg-slate-800 ${s.color} border-2 shadow-md`
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">{s.label}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Location & Affected Scale */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
              Location & Impact Scope
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Disaster Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    {locationPresets.map(l => (
                      <option key={l.label} value={l.label}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* People Affected */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Estimated Number of Affected People *
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    name="affectedPeople"
                    value={formData.affectedPeople}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {formData.location === 'Other / Custom GPS Location' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Specify Custom Location / Street Address *
                </label>
                <input
                  type="text"
                  name="customLocation"
                  value={formData.customLocation}
                  onChange={handleChange}
                  placeholder="Enter district, village, or GPS coordinates"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                {errors.customLocation && (
                  <p className="text-xs text-red-500 mt-1">{errors.customLocation}</p>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Detailed Description & Needs */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
              Ground Situation & Requirements
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Situation Description *
              </label>
              <textarea
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what occurred, hazards present, water levels, blocked roads, fires, structural collapse..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                required
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Immediate Assistance Required
              </label>
              <input
                type="text"
                name="requiredAssistance"
                value={formData.requiredAssistance}
                onChange={handleChange}
                placeholder="e.g. Inflatable boats, food packets, medical ambulance, dry clothes"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Section 4: Photo / Media Upload */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">4</span>
                Photo / Evidence Attachment
              </h3>
              <button
                type="button"
                onClick={handleUseSamplePhoto}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Attach Demo Hazard Photo
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors">
              {formData.imagePreview ? (
                <div className="relative inline-block max-w-sm">
                  <img
                    src={formData.imagePreview}
                    alt="Hazard Evidence"
                    className="rounded-xl max-h-48 w-auto object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, imagePreview: null }))}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Upload disaster photo or telemetry snapshot
                  </p>
                  <p className="text-[11px] text-slate-400">PNG, JPG up to 10MB</p>
                  <label className="inline-block mt-2 px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors">
                    Browse File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Reporter Contact Information */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">5</span>
              Reporter Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Varma"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  required
                />
                {errors.reporterName && (
                  <p className="text-xs text-red-500 mt-1">{errors.reporterName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="+91 98480 00000"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                {errors.contact && (
                  <p className="text-xs text-red-500 mt-1">{errors.contact}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              variant="emergency"
              size="lg"
              icon={Flame}
              className="w-full sm:w-auto shadow-lg shadow-red-500/25"
            >
              Submit Emergency Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
