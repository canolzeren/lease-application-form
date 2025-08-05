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
      <h2>Persoonsgegevens</h2>
      <div className="form-section" style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="input-group">
          <label>Aanhef</label>
          <select value={form.aanhef} onChange={handleChange('aanhef')}>
            <option value="">Kies aanhef</option>
            {aanhefOpties.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Voorletters *</label>
          <input type="text" value={form.voorletters} onChange={handleChange('voorletters')} onBlur={handleBlur('voorletters')} required />
        </div>
        <div className="input-group">
          <label>Achternaam *</label>
          <input type="text" value={form.achternaam} onChange={handleChange('achternaam')} onBlur={handleBlur('achternaam')} required />
        </div>
        <div className="input-group">
          <label>Geboortedatum *</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="text" placeholder="DD" maxLength={2} style={{ width: 50 }} value={form.geboortedag} onChange={handleChange('geboortedag')} onBlur={handleBlur('geboortedag')} required />
            <input type="text" placeholder="MM" maxLength={2} style={{ width: 50 }} value={form.geboortemaand} onChange={handleChange('geboortemaand')} onBlur={handleBlur('geboortemaand')} required />
            <input type="text" placeholder="JJJJ" maxLength={4} style={{ width: 80 }} value={form.geboortejaar} onChange={handleChange('geboortejaar')} onBlur={handleBlur('geboortejaar')} required />
          </div>
        </div>
        <div className="input-group">
          <label>Burgerlijke staat</label>
          <select value={form.burgerlijkeStaat} onChange={handleChange('burgerlijkeStaat')}>
            {burgerlijkeStaatOpties.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
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