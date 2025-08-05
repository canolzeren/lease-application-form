import React, { useState } from 'react';

const DIENSTVERBAND_OPTIES = [
  '',
  'Vast contract',
  'Tijdelijk contract',
  'Uitzendcontract',
  'Zelfstandig ondernemer',
  'Pensioen',
  'Studerend',
  'Werkloos',
];

const WOONSITUATIE_OPTIES = [
  'Koopwoning',
  'Huurwoning',
  'Inwonend',
];

export default function FinancialDetails({ onBack, onComplete, initialData = {} }) {
  const [form, setForm] = useState({
    dienstverband: initialData.dienstverband || '',
    beroep: initialData.beroep || '',
    ingang: initialData.ingang || '',
    einde: initialData.einde || '',
    inkomen: initialData.inkomen || '',
    woonsituatie: initialData.woonsituatie || WOONSITUATIE_OPTIES[0],
    woonlast: initialData.woonlast || '',
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
      form.dienstverband &&
      form.beroep.trim() &&
      form.inkomen.trim() &&
      form.woonsituatie &&
      form.woonlast.trim()
    );
  };

  return (
    <div className="lease-form-container">
      <h2>Financiële gegevens</h2>
      <div className="form-section" style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="input-group">
          <label>Dienstverband *</label>
          <select value={form.dienstverband} onChange={handleChange('dienstverband')} onBlur={handleBlur('dienstverband')} required>
            <option value="">Maak uw keuze</option>
            {DIENSTVERBAND_OPTIES.filter(opt => opt).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Beroep *</label>
          <input type="text" value={form.beroep} onChange={handleChange('beroep')} onBlur={handleBlur('beroep')} required />
        </div>
        <div className="input-group">
          <label>Ingangsdatum dienstverband</label>
          <input type="date" value={form.ingang} onChange={handleChange('ingang')} onBlur={handleBlur('ingang')} placeholder="dd/mm/jjjj" />
        </div>
        <div className="input-group">
          <label>Einddatum dienstverband</label>
          <input type="date" value={form.einde} onChange={handleChange('einde')} onBlur={handleBlur('einde')} placeholder="dd/mm/jjjj" />
        </div>
        <div className="input-group">
          <label>Bruto inkomen *</label>
          <input type="number" min="0" step="1" value={form.inkomen} onChange={handleChange('inkomen')} onBlur={handleBlur('inkomen')} required />
        </div>
        <div className="input-group">
          <label>Woonsituatie *</label>
          <select value={form.woonsituatie} onChange={handleChange('woonsituatie')} onBlur={handleBlur('woonsituatie')} required>
            {WOONSITUATIE_OPTIES.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Maandelijkse woonlast *</label>
          <input type="number" min="0" step="1" value={form.woonlast} onChange={handleChange('woonlast')} onBlur={handleBlur('woonlast')} required />
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