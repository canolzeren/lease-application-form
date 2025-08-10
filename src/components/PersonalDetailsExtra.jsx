import React, { useState } from 'react';

const aanhefOpties = ['Dhr.', 'Mevr.', 'Mx.'];
const burgerlijkeStaatOpties = [
  'Alleenstaand',
  'Gehuwd',
  'Samenwonend',
  'Gescheiden',
  'Weduwnaar/weduwe'
];

export default function PersonalDetailsExtra({ onBack, onComplete, initialData = {} }) {
  const [form, setForm] = useState({
    aanhef: initialData.aanhef || '',
    voorletters: initialData.voorletters || '',
    achternaam: initialData.achternaam || '',
    geboortedag: initialData.geboortedag || '',
    geboortemaand: initialData.geboortemaand || '',
    geboortejaar: initialData.geboortejaar || '',
    burgerlijkeStaat: initialData.burgerlijkeStaat || 'Alleenstaand',
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
      form.voorletters.trim() &&
      form.achternaam.trim() &&
      form.geboortedag && form.geboortemaand && form.geboortejaar
    );
  };

  return (
    <div className="lease-form-container">
      <div className="step-header">
        <h2>Persoonsgegevens</h2>
        <p className="step-description">Vul uw persoonlijke gegevens in</p>
      </div>

      <div className="form-section">
        <div className="input-group">
          <label>Aanhef</label>
          <select 
            className="vehicle-select"
            value={form.aanhef} 
            onChange={handleChange('aanhef')}
          >
            <option value="">Kies aanhef</option>
            {aanhefOpties.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Voorletters *</label>
          <input 
            type="text" 
            className="input-box"
            value={form.voorletters} 
            onChange={handleChange('voorletters')} 
            onBlur={handleBlur('voorletters')} 
            required 
          />
        </div>
        <div className="input-group">
          <label>Achternaam *</label>
          <input 
            type="text" 
            className="input-box"
            value={form.achternaam} 
            onChange={handleChange('achternaam')} 
            onBlur={handleBlur('achternaam')} 
            required 
          />
        </div>
        <div className="input-group">
          <label>Geboortedatum *</label>
          <div className="inputs-container">
            <input 
              type="text" 
              placeholder="DD" 
              maxLength={2} 
              className="input-box"
              style={{ width: '100%' }}
              value={form.geboortedag} 
              onChange={handleChange('geboortedag')} 
              onBlur={handleBlur('geboortedag')} 
              required 
            />
            <input 
              type="text" 
              placeholder="MM" 
              maxLength={2} 
              className="input-box"
              style={{ width: '100%' }}
              value={form.geboortemaand} 
              onChange={handleChange('geboortemaand')} 
              onBlur={handleBlur('geboortemaand')} 
              required 
            />
            <input 
              type="text" 
              placeholder="JJJJ" 
              maxLength={4} 
              className="input-box"
              style={{ width: '100%' }}
              value={form.geboortejaar} 
              onChange={handleChange('geboortejaar')} 
              onBlur={handleBlur('geboortejaar')} 
              required 
            />
          </div>
        </div>
        <div className="input-group">
          <label>Burgerlijke staat</label>
          <select 
            className="vehicle-select"
            value={form.burgerlijkeStaat} 
            onChange={handleChange('burgerlijkeStaat')}
          >
            {burgerlijkeStaatOpties.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      <div className="bottom-section">
        <button className="secondary-button" onClick={onBack}>Terug</button>
        <button 
          className="submit-button" 
          disabled={!isValid()} 
          onClick={() => onComplete(form)}
        >
          Contactgegevens invullen
        </button>
      </div>
    </div>
  );
} 