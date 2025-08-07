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
        <div className="lease-form">
            <div className="step-header">
                <h2>Voertuig Selectie</h2>
                <p>Kies uw voertuig en configureer de lease</p>
            </div>

            <div className="form-container">
                <div className="form-section">
                    <h3>1. Voertuig</h3>
                    <div className="input-group">
                        <label>Selecteer voertuig</label>
                        <select 
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
                </div>

                <div className="form-section">
                    <h3>2. Financiering</h3>
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
                    <div className="input-group">
                        <label>Gewenst krediet</label>
                        <div className="readonly-input">
                            {formatCurrency(calculateGewenstKrediet())}
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Looptijd (maanden)</label>
                        <select 
                            value={formData.looptijd} 
                            onChange={(e) => setFormData(prev => ({ ...prev, looptijd: Number(e.target.value) }))}
                        >
                            {looptijden.map(looptijd => (
                                <option key={looptijd} value={looptijd}>{looptijd} maanden</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-section">
                    <h3>3. Maandbedrag</h3>
                    <div className="result-box">
                        <div className="result-item">
                            <span>Maandbedrag:</span>
                            <span className="amount">{formatCurrency(formData.maandbedrag)}</span>
                        </div>
                        <div className="result-item total">
                            <span>Totaal maandbedrag:</span>
                            <span className="amount">{formatCurrency(formData.totaalMaandbedrag)}</span>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        onClick={handleSubmit}
                        className="submit-button"
                        disabled={selectedVoertuig.id === '1' || formData.verkoopprijs <= 0}
                    >
                        Volgende
                    </button>
                </div>
            </div>
        </div>
    );
} 