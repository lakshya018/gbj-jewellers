'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Trash2, Plus, CheckCircle, Loader2 } from 'lucide-react';

export default function AddressBook() {
  const { user, loading: authLoading, getToken } = useAuth();
  const userLoaded = !authLoading;
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userLoaded && user) {
      setLoading(true);
      getToken().then(token =>
      fetch('/api/user/profile', { headers: token ? { Authorization: `Bearer ${token}` } : {} }))
        .then(res => res.json())
        .then(data => {
          if (data.savedAddresses) {
            setAddresses(data.savedAddresses);
          }
        })
        .catch(err => console.error('Failed to fetch profile:', err))
        .finally(() => setLoading(false));
    } else if (userLoaded && !user) {
      setLoading(false);
    }
  }, [user, userLoaded]);

  const deleteAddress = async (idx) => {
    const newAddresses = addresses.filter((_, i) => i !== idx);
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ savedAddresses: newAddresses }),
      });
      if (res.ok) {
        setAddresses(newAddresses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const setDefault = async (idx) => {
    const newAddresses = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === idx,
    }));
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ savedAddresses: newAddresses }),
      });
      if (res.ok) {
        setAddresses(newAddresses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-20 bg-secondary" /><div className="h-20 bg-secondary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-text">Address Book</h3>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
          <MapPin size={32} className="mx-auto text-border mb-3" />
          <p className="text-sm text-muted">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr, idx) => (
            <div key={idx} className={`p-5 border-2 transition-all relative ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary-hover" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-primary-hover">{addr.label || 'Address'}</span>
                  {addr.isDefault && <span className="text-[9px] bg-primary text-on-dark px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Default</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => deleteAddress(idx)}
                    disabled={saving}
                    className="p-1.5 text-muted hover:text-rose-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm font-semibold text-text mb-1">{addr.fullName}</p>
              <p className="text-xs text-muted leading-relaxed">
                {addr.line1}, {addr.line2 && `${addr.line2}, `}{addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-xs text-muted mt-2">{addr.phone}</p>

              {!addr.isDefault && (
                <button 
                  onClick={() => setDefault(idx)}
                  disabled={saving}
                  className="mt-4 text-[10px] font-bold tracking-widest uppercase text-primary-hover hover:text-gold-700 underline"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
