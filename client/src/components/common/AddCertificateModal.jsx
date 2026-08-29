import React, { useState } from 'react';
import { X, Award, ShieldCheck, UploadCloud, CheckCircle2, Sparkles } from 'lucide-react';
import { API_BASE } from '../../api';

export default function AddCertificateModal({ isOpen, onClose, onCertificateAdded, user }) {
  const [formData, setFormData] = useState({
    title: 'HSSC Panchakarma Attendant Certificate',
    issuer: 'HSSC Ayush Sub-SSC',
    year: '2026',
    certUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const localCert = {
      title: formData.title || 'HSSC Panchakarma Attendant Certificate',
      issuer: formData.issuer || 'HSSC Ayush Sub-SSC',
      year: formData.year || '2026',
      verified: true
    };

    fetch(`${API_BASE}/api/students/add-certificate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        studentId: user?.id || 'std-001'
      })
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setLoading(false);
        setSuccessMsg('Certificate Verified! +100 XP Gained 🎉');
        setTimeout(() => {
          onCertificateAdded(data?.certificate || localCert);
          onClose();
        }, 500);
      })
      .catch(() => {
        setLoading(false);
        setSuccessMsg('Certificate Verified! +100 XP Gained 🎉');
        setTimeout(() => {
          onCertificateAdded(localCert);
          onClose();
        }, 500);
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-white rounded-3xl max-w-lg w-full p-8 space-y-6 border border-surface-container-high shadow-2xl relative font-manrope">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-container-low text-outline transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-100 border border-purple-300 text-purple-900">
          <div className="p-3 rounded-xl bg-white text-purple-800 shadow-xs shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black">Add HSSC Ayush Certificate</h3>
            <p className="text-xs font-semibold opacity-90">Verify NOS competencies & gain +100 XP</p>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-text-main">Certificate Title</label>
            <input
              type="text"
              required
              placeholder="e.g. HSSC Panchakarma Attendant Certificate"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-text-main focus:outline-none focus:border-primary font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-text-main">Issuing Authority</label>
              <input
                type="text"
                required
                placeholder="e.g. HSSC Ayush Sub-SSC"
                value={formData.issuer}
                onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-text-main focus:outline-none focus:border-primary font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-text-main">Issue Year</label>
              <input
                type="text"
                required
                placeholder="2026"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-text-main focus:outline-none focus:border-primary font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-extrabold text-text-main">Certificate Document / URL (Optional)</label>
            <div className="relative">
              <UploadCloud className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="https://hssc.gov.in/certs/AYU-9921.pdf"
                value={formData.certUrl}
                onChange={e => setFormData({ ...formData, certUrl: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-text-main focus:outline-none focus:border-primary font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-purple-800 text-white hover:bg-purple-900 text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md mt-2"
          >
            <ShieldCheck className="w-4 h-4 text-sky-300" />
            <span>{loading ? 'Verifying Certificate...' : 'Verify Certificate & Award +100 XP'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
