import React, { useState } from 'react';

const looptijden = [12, 24, 36, 48, 60, 72];

const dummyVoertuigen = [
    { id: '1', fields: { Merk: 'Selecteer een voertuig', Model: '', Prijs: 0 } },
    { id: '2', fields: { Merk: 'BMW', Model: 'X3 xDrive20i', Prijs: 63883 } },
    { id: '3', fields: { Merk: 'Audi', Model: 'A4 Avant', Prijs: 59000 } },
    { id: '4', fields: { Merk: 'Mercedes', Model: 'C-Klasse', Prijs: 68000 } }
];

const formatCurrency = (value) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value || 0);
};

const formatNumber = (value) => {
    return new Intl.NumberFormat('nl-NL', { useGrouping: true }).format(value || 0);
};

const InfoTooltip = ({ text }) => (
    <span className="info-tooltip" data-text={text}>?</span>
);

const CurrencyInput = ({ label, value, setValue }) => (
    <div className="input-group">
        <label>{label} <InfoTooltip text={`Stel de ${label.toLowerCase()} in.`} /></label>
        <div className="input-box">
            €
            <input
                type="text"
                value={formatNumber(value)}
                onChange={(e) => {
                    const numericValue = Number(e.target.value.replace(/\./g, '').replace(/,/g, '.'));
                    if (!isNaN(numericValue)) {
                        setValue(numericValue);
                    }
                }}
            />
        </div>
    </div>
);

export default function LeaseForm({ onComplete }) {
    const [selectedVoertuig, setSelectedVoertuig] = useState(dummyVoertuigen[0]);
    const [formData, setFormData] = useState({
        verkoopprijs: 0,
        aanbetaling: 0,
        gewenstKrediet: 0,
        looptijd: 48,
        maandbedrag: 0,
        totaalMaandbedrag: 0
    });

    const calculateGewenstKrediet = () => {
        return formData.verkoopprijs - formData.aanbetaling;
    };

    const calculateMaandlast = (looptijd = formData.looptijd) => {
        const gewenstKrediet = calculateGewenstKrediet();
        if (gewenstKrediet <= 0 || looptijd <= 0) return 0;
        
        // Eenvoudige berekening (kan later verfijnd worden)
        const rente = 0.05; // 5% rente per jaar
        const maandRente = rente / 12;
        const maandbedrag = (gewenstKrediet * maandRente * Math.pow(1 + maandRente, looptijd)) / (Math.pow(1 + maandRente, looptijd) - 1);
        
        return Math.round(maandbedrag);
    };

    React.useEffect(() => {
        const gewenstKrediet = calculateGewenstKrediet();
        const maandbedrag = calculateMaandlast();
        
        setFormData(prev => ({
            ...prev,
            gewenstKrediet,
            maandbedrag,
            totaalMaandbedrag: maandbedrag
        }));
    }, [formData.verkoopprijs, formData.aanbetaling, formData.looptijd]);

    React.useEffect(() => {
        if (selectedVoertuig && selectedVoertuig.fields.Prijs > 0) {
            setFormData(prev => ({
                ...prev,
                verkoopprijs: selectedVoertuig.fields.Prijs
            }));
        }
    }, [selectedVoertuig]);

    const handleSubmit = () => {
        const submissionData = {
            voertuig: `${selectedVoertuig.fields.Merk} ${selectedVoertuig.fields.Model}`,
            verkoopprijs: formData.verkoopprijs,
            aanbetaling: formData.aanbetaling,
            gewenstKrediet: formData.gewenstKrediet,
            looptijd: formData.looptijd,
            maandbedrag: formData.maandbedrag,
            totaalMaandbedrag: formData.totaalMaandbedrag
        };
        
        onComplete(submissionData);
    };

    return (
        <div className="lease-form-container">
            <div className="step-header">
                <h2>Voertuig Selectie</h2>
                <p className="step-description">Kies uw voertuig en configureer de lease</p>
            </div>

            <div className="form-section">
                <label>Selecteer voertuig</label>
                <select 
                    className="vehicle-select"
                    value={selectedVoertuig.id} 
                    onChange={(e) => {
                        const voertuig = dummyVoertuigen.find(v => v.id === e.target.value);
                        setSelectedVoertuig(voertuig);
                    }}
                >
                    {dummyVoertuigen.map(voertuig => (
                        <option key={voertuig.id} value={voertuig.id}>
                            {voertuig.fields.Merk} {voertuig.fields.Model} - {formatCurrency(voertuig.fields.Prijs)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="inputs-container">
                <CurrencyInput 
                    label="Verkoopprijs" 
                    value={formData.verkoopprijs} 
                    setValue={(value) => setFormData(prev => ({ ...prev, verkoopprijs: value }))} 
                />
                <CurrencyInput 
                    label="Aanbetaling" 
                    value={formData.aanbetaling} 
                    setValue={(value) => setFormData(prev => ({ ...prev, aanbetaling: value }))} 
                />
            </div>

            <div className="input-group">
                <label>Gewenst krediet</label>
                <div className="input-box" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}>
                    {formatCurrency(calculateGewenstKrediet())}
                </div>
            </div>

            <div className="form-section">
                <label>Looptijd (maanden)</label>
                <div className="looptijd-radio-group">
                    {looptijden.map(looptijd => {
                        const bedrag = calculateMaandlast(looptijd);
                        const isMeestGekozen = looptijd === 48;
                        return (
                            <label key={looptijd} className="looptijd-radio-row">
                                <input
                                    type="radio"
                                    name="looptijd"
                                    value={looptijd}
                                    checked={formData.looptijd === looptijd}
                                    onChange={() => setFormData(prev => ({ ...prev, looptijd: looptijd }))}
                                />
                                <span className="looptijd-radio-label">
                                    {looptijd} maanden
                                    {isMeestGekozen && (
                                        <span className="looptijd-badge">meest gekozen</span>
                                    )}
                                </span>
                                <span className="looptijd-radio-bedrag">
                                    {formatCurrency(bedrag)}<span className="looptijd-radio-per">/maand</span>
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            <div className="summary-card">
                <h3>Overzicht</h3>
                <div className="summary-main-amount">
                    {formatCurrency(formData.maandbedrag)}<span>/maand</span>
                </div>
                <div className="summary-details">
                    <div>
                        <span>Verkoopprijs</span>
                        <span>{formatCurrency(formData.verkoopprijs)}</span>
                    </div>
                    <div>
                        <span>Aanbetaling</span>
                        <span>{formatCurrency(formData.aanbetaling)}</span>
                    </div>
                    <div>
                        <span>Gewenst krediet</span>
                        <span>{formatCurrency(calculateGewenstKrediet())}</span>
                    </div>
                </div>
            </div>

            <div className="bottom-section">
                <div className="info-line">
                    <span className="check-icon"></span>
                    Uitslag binnen: <strong>35 minuten</strong>
                </div>
                <button 
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={selectedVoertuig.id === '1' || formData.verkoopprijs <= 0}
                >
                    Volgende stap
                </button>
            </div>
        </div>
    );
} 