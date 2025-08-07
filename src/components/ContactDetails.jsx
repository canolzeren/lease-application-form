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
      <div className="step-header">
        <h2>Contactgegevens</h2>
        <p className="step-description">Vul uw contactgegevens in</p>
      </div>

      <div className="form-section">
        <div className="inputs-container">
          <div className="input-group">
            <label>Straatnaam *</label>
            <input 
              type="text" 
              className="input-box"
              value={form.straat} 
              onChange={handleChange('straat')} 
              onBlur={handleBlur('straat')} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Huisnummer *</label>
            <input 
              type="text" 
              className="input-box"
              value={form.huisnummer} 
              onChange={handleChange('huisnummer')} 
              onBlur={handleBlur('huisnummer')} 
              required 
            />
          </div>
        </div>
        <div className="input-group">
          <label>Huisnummer toevoeging</label>
          <input 
            type="text" 
            className="input-box"
            value={form.toevoeging} 
            onChange={handleChange('toevoeging')} 
          />
        </div>
        <div className="inputs-container">
          <div className="input-group">
            <label>Postcode *</label>
            <input 
              type="text" 
              className="input-box"
              value={form.postcode} 
              onChange={handleChange('postcode')} 
              onBlur={handleBlur('postcode')} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Woonplaats *</label>
            <input 
              type="text" 
              className="input-box"
              value={form.woonplaats} 
              onChange={handleChange('woonplaats')} 
              onBlur={handleBlur('woonplaats')} 
              required 
            />
          </div>
        </div>
        <div className="inputs-container">
          <div className="input-group">
            <label>Telefoonnummer *</label>
            <input 
              type="text" 
              className="input-box"
              value={form.telefoon} 
              onChange={handleChange('telefoon')} 
              onBlur={handleBlur('telefoon')} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Email *</label>
            <input 
              type="email" 
              className="input-box"
              value={form.email} 
              onChange={handleChange('email')} 
              onBlur={handleBlur('email')} 
              required 
            />
          </div>
        </div>
      </div>

      <div className="bottom-section">
        <div className="info-line">
          <span className="check-icon"></span>
          Uitslag binnen: <strong>35 minuten</strong>
        </div>
        <button className="secondary-button" onClick={onBack}>Terug</button>
        <button 
          className="submit-button" 
          disabled={!isValid()} 
          onClick={() => onComplete(form)}
        >
          Financiële gegevens invullen
        </button>
      </div>
    </div>
  );
} 