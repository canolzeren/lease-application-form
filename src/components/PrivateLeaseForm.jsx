import React, { useState } from 'react';

const PrivateLeaseForm = ({ onComplete, onBack, leaseData }) => {
  const [formData, setFormData] = useState({
    // 1. Financiering
    verkoopprijs: leaseData?.selectedVoertuig?.fields?.Prijs || 0,
    aanbetaling: 0,
    gewenstKrediet: 0,
    looptijd: 48,
    
    // 2. Voertuiggegevens
    merk: leaseData?.selectedVoertuig?.fields?.Merk || '',
    type: leaseData?.selectedVoertuig?.fields?.Model || '',
    kenteken: '',
    
    // 3. Persoonsgegevens
    aanhef: 'Dhr.',
    voorletters: '',
    achternaam: '',
    geboortedatum: '',
    burgerlijkeStaat: 'Alleenstaand',
    
    // 4. Contactgegevens
    straatnaam: '',
    huisnummer: '',
    huisnummerToevoeging: '',
    postcode: '',
    woonplaats: '',
    telefoonnummer: '',
    email: '',
    
    // 5. Financiële gegevens
    dienstverband: 'Vast',
    beroep: '',
    ingangsdatumDienstverband: '',
    einddatumDienstverband: '',
    brutoInkomen: 0,
    woonsituatie: 'Koopwoning',
    maandelijkseWoonlast: 0,
    
    // Voorwaarden
    voorwaardenGeaccepteerd: false
  });

  const [errors, setErrors] = useState({});

  const looptijden = [12, 24, 36, 48, 60, 72];
  const aanhefOpties = ['Dhr.', 'Mevr.'];
  const burgerlijkeStaatOpties = ['Alleenstaand', 'Gehuwd', 'Samenwonend', 'Gescheiden', 'Weduwe/Weduwnaar'];
  const dienstverbandOpties = ['Vast', 'Tijdelijk', 'Zelfstandig', 'Pensioen', 'Uitkering'];
  const woonsituatieOpties = ['Koopwoning', 'Huurwoning', 'Huurwoning sociale sector', 'Bij ouders', 'Anders'];

  const calculateGewenstKrediet = () => {
    return formData.verkoopprijs - formData.aanbetaling;
  };

  const calculateMaandlast = () => {
    const krediet = calculateGewenstKrediet();
    const rente = 0.05; // 5% jaarlijkse rente
    const maandelijkseRente = rente / 12;
    const aantalMaanden = formData.looptijd;
    
    if (krediet > 0 && aantalMaanden > 0) {
      return (krediet * maandelijkseRente * Math.pow(1 + maandelijkseRente, aantalMaanden)) / 
             (Math.pow(1 + maandelijkseRente, aantalMaanden) - 1);
    }
    return 0;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Verplichte velden
    if (!formData.voorletters) newErrors.voorletters = 'Voorletters zijn verplicht';
    if (!formData.achternaam) newErrors.achternaam = 'Achternaam is verplicht';
    if (!formData.geboortedatum) newErrors.geboortedatum = 'Geboortedatum is verplicht';
    if (!formData.straatnaam) newErrors.straatnaam = 'Straatnaam is verplicht';
    if (!formData.huisnummer) newErrors.huisnummer = 'Huisnummer is verplicht';
    if (!formData.postcode) newErrors.postcode = 'Postcode is verplicht';
    if (!formData.woonplaats) newErrors.woonplaats = 'Woonplaats is verplicht';
    if (!formData.telefoonnummer) newErrors.telefoonnummer = 'Telefoonnummer is verplicht';
    if (!formData.email) newErrors.email = 'Email is verplicht';
    if (!formData.voorwaardenGeaccepteerd) newErrors.voorwaardenGeaccepteerd = 'U moet de voorwaarden accepteren';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete({
        ...formData,
        gewenstKrediet: calculateGewenstKrediet(),
        maandlast: calculateMaandlast()
      });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('nl-NL', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value || 0);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Private Lease Aanvraag</h2>
      
      {/* 1. Financiering */}
      <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>1. Financiering</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>Verkoopprijs</label>
            <input
              type="number"
              value={formData.verkoopprijs}
              onChange={(e) => setFormData({...formData, verkoopprijs: Number(e.target.value)})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label>Aanbetaling/inruil bedrag</label>
            <input
              type="number"
              value={formData.aanbetaling}
              onChange={(e) => setFormData({...formData, aanbetaling: Number(e.target.value)})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label>Uw gewenst krediet</label>
            <input
              type="number"
              value={calculateGewenstKrediet()}
              disabled
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: '#f5f5f5' }}
            />
          </div>
          <div>
            <label>Gewenste looptijd in maanden</label>
            <select
              value={formData.looptijd}
              onChange={(e) => setFormData({...formData, looptijd: Number(e.target.value)})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {looptijden.map(lt => (
                <option key={lt} value={lt}>{lt} maanden</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f8ff', borderRadius: '4px' }}>
          <strong>Maandlast vanaf: {formatCurrency(calculateMaandlast())}</strong>
        </div>
      </div>

      {/* 2. Voertuiggegevens */}
      <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>2. Voertuiggegevens</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>Merk</label>
            <input
              type="text"
              value={formData.merk}
              onChange={(e) => setFormData({...formData, merk: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label>Type</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label>Kenteken van voertuig</label>
            <input
              type="text"
              value={formData.kenteken}
              onChange={(e) => setFormData({...formData, kenteken: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>
      </div>

      {/* 3. Persoonsgegevens */}
      <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>3. Persoonsgegevens</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>Aanhef</label>
            <select
              value={formData.aanhef}
              onChange={(e) => setFormData({...formData, aanhef: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {aanhefOpties.map(optie => (
                <option key={optie} value={optie}>{optie}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Voorletters *</label>
            <input
              type="text"
              value={formData.voorletters}
              onChange={(e) => setFormData({...formData, voorletters: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: errors.voorletters ? '1px solid #ff0000' : '1px solid #ddd', 
                borderRadius: '4px' 
              }}
            />
            {errors.voorletters && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.voorletters}</span>}
          </div>
          <div>
            <label>Achternaam *</label>
            <input
              type="text"
              value={formData.achternaam}
              onChange={(e) => setFormData({...formData, achternaam: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: errors.achternaam ? '1px solid #ff0000' : '1px solid #ddd', 
                borderRadius: '4px' 
              }}
            />
            {errors.achternaam && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.achternaam}</span>}
          </div>
          <div>
            <label>Geboortedatum *</label>
            <input
              type="date"
              value={formData.geboortedatum}
              onChange={(e) => setFormData({...formData, geboortedatum: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: errors.geboortedatum ? '1px solid #ff0000' : '1px solid #ddd', 
                borderRadius: '4px' 
              }}
            />
            {errors.geboortedatum && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.geboortedatum}</span>}
          </div>
          <div>
            <label>Burgerlijke staat</label>
            <select
              value={formData.burgerlijkeStaat}
              onChange={(e) => setFormData({...formData, burgerlijkeStaat: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {burgerlijkeStaatOpties.map(optie => (
                <option key={optie} value={optie}>{optie}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Contactgegevens */}
      <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>4. Contactgegevens</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>Straatnaam *</label>
            <input
              type="text"
              value={formData.straatnaam}
              onChange={(e) => setFormData({...formData, straatnaam: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: errors.straatnaam ? '1px solid #ff0000' : '1px solid #ddd', 
                borderRadius: '4px' 
              }}
            />
            {errors.straatnaam && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.straatnaam}</span>}
          </div>
          <div>
            <label>Huisnummer *</label>
            <input
              type="text"
              value={formData.huisnummer}
              onChange={(e) => setFormData({...formData, huisnummer: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: errors.huisnummer ? '1px solid #ff0000' : '1px solid #ddd', 
                borderRadius: '4px' 
              }}
            />
            {errors.huisnummer && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.huisnummer}</span>}
          </div>
          <div>
            <label>Huisnummer toevoeging</label>
            <input
              type="text"
              value={formData.huisnummerToevoeging}
              onChange={(e) => setFormData({...formData, huisnummerToevoeging: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label>Postcode *</label>
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) => setFormData({...formData, postcode: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: errors.postcode ? '1px solid #ff0000' : '1px solid #ddd', 
                borderRadius: '4px' 
              }}
            />
            {errors.postcode && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.postcode}</span>}
          </div>
          <div>
            <label>Woonplaats *</label>
            <input
              type="text"
              value={formData.woonplaats}
              onChange={(e) => setFormData({...formData, woonplaats: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: errors.woonplaats ? '1px solid #ff0000' : '1px solid #ddd', 
                borderRadius: '4px' 
              }}
            />
            {errors.woonplaats && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.woonplaats}</span>}
          </div>
          <div>
            <label>Telefoonnummer *</label>
            <input
              type="tel"
              value={formData.telefoonnummer}
              onChange={(e) => setFormData({...formData, telefoonnummer: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: errors.telefoonnummer ? '1px solid #ff0000' : '1px solid #ddd', 
                borderRadius: '4px' 
              }}
            />
            {errors.telefoonnummer && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.telefoonnummer}</span>}
          </div>
          <div>
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: errors.email ? '1px solid #ff0000' : '1px solid #ddd', 
                borderRadius: '4px' 
              }}
            />
            {errors.email && <span style={{ color: '#ff0000', fontSize: '12px' }}>{errors.email}</span>}
          </div>
        </div>
      </div>

      {/* 5. Financiële gegevens */}
      <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>5. Financiële gegevens</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>Dienstverband</label>
            <select
              value={formData.dienstverband}
              onChange={(e) => setFormData({...formData, dienstverband: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {dienstverbandOpties.map(optie => (
                <option key={optie} value={optie}>{optie}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Beroep</label>
            <input
              type="text"
              value={formData.beroep}
              onChange={(e) => setFormData({...formData, beroep: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label>Ingangsdatum dienstverband</label>
            <input
              type="date"
              value={formData.ingangsdatumDienstverband}
              onChange={(e) => setFormData({...formData, ingangsdatumDienstverband: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label>Einddatum dienstverband</label>
            <input
              type="date"
              value={formData.einddatumDienstverband}
              onChange={(e) => setFormData({...formData, einddatumDienstverband: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label>Bruto inkomen</label>
            <input
              type="number"
              value={formData.brutoInkomen}
              onChange={(e) => setFormData({...formData, brutoInkomen: Number(e.target.value)})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label>Woonsituatie</label>
            <select
              value={formData.woonsituatie}
              onChange={(e) => setFormData({...formData, woonsituatie: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {woonsituatieOpties.map(optie => (
                <option key={optie} value={optie}>{optie}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Maandelijkse woonlast</label>
            <input
              type="number"
              value={formData.maandelijkseWoonlast}
              onChange={(e) => setFormData({...formData, maandelijkseWoonlast: Number(e.target.value)})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>
      </div>

      {/* Voorwaarden */}
      <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            checked={formData.voorwaardenGeaccepteerd}
            onChange={(e) => setFormData({...formData, voorwaardenGeaccepteerd: e.target.checked})}
            style={{ width: '20px', height: '20px' }}
          />
          <label>Ik ga akkoord met de voorwaarden *</label>
        </div>
        {errors.voorwaardenGeaccepteerd && (
          <span style={{ color: '#ff0000', fontSize: '12px', marginLeft: '30px' }}>
            {errors.voorwaardenGeaccepteerd}
          </span>
        )}
      </div>

      {/* Navigatie knoppen */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              border: '1px solid #d846b4',
              background: 'white',
              color: '#d846b4',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Terug
          </button>
        )}
        <button
          onClick={handleSubmit}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: '#d846b4',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Aanvraag versturen
        </button>
      </div>
    </div>
  );
};

export default PrivateLeaseForm; 