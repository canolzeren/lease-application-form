import React, { useState } from 'react';

export default function ContactDetails({ onBack, onComplete, initialData = {} }) {
  const [form, setForm] = useState({
    straat: initialData.straat || '',
    huisnummer: initialData.huisnummer || '',
    toevoeging: initialData.toevoeging || '',
    postcode: initialData.postcode || '',
    woonplaats: initialData.woonplaats || '',
    telefoon: initialData.telefoon || '',
    email: initialData.email || '',
  });
  const [touched, setTouched] = useState({});

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isValid = () => {
    return (
      form.straat.trim() &&
      form.huisnummer.trim() &&
      form.postcode.trim() &&
      form.woonplaats.trim() &&
      form.telefoon.trim() &&
      form.email.trim()
    );
  };

  return (
    <div className="lease-form-container">
      <h2>Contactgegevens</h2>
      <div className="form-section" style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="input-group">
          <label>Straatnaam *</label>
          <input type="text" value={form.straat} onChange={handleChange('straat')} onBlur={handleBlur('straat')} required />
        </div>
        <div className="input-group">
          <label>Huisnummer *</label>
          <input type="text" value={form.huisnummer} onChange={handleChange('huisnummer')} onBlur={handleBlur('huisnummer')} required />
        </div>
        <div className="input-group">
          <label>Huisnummer toevoeging</label>
          <input type="text" value={form.toevoeging} onChange={handleChange('toevoeging')} />
        </div>
        <div className="input-group">
          <label>Postcode *</label>
          <input type="text" value={form.postcode} onChange={handleChange('postcode')} onBlur={handleBlur('postcode')} required />
        </div>
        <div className="input-group">
          <label>Woonplaats *</label>
          <input type="text" value={form.woonplaats} onChange={handleChange('woonplaats')} onBlur={handleBlur('woonplaats')} required />
        </div>
        <div className="input-group">
          <label>Telefoonnummer *</label>
          <input type="text" value={form.telefoon} onChange={handleChange('telefoon')} onBlur={handleBlur('telefoon')} required />
        </div>
        <div className="input-group">
          <label>Email *</label>
          <input type="email" value={form.email} onChange={handleChange('email')} onBlur={handleBlur('email')} required />
        </div>
      </div>
      <div className="bottom-section" style={{ marginTop: 32 }}>
        <button className="secondary-button" onClick={onBack}>Terug</button>
        <button className="submit-button" disabled={!isValid()} onClick={() => onComplete(form)}>
          Volgende Stap
        </button>
      </div>
    </div>
  );
} 