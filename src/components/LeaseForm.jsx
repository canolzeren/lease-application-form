import React, { useState, useEffect } from 'react';

const AIRTABLE_TOKEN = 'patlA8VoCdqHS9GkQ.63999c29a21d80a36c4617805edcd765fc4d87d1397ea34f0fa03e698f5b98bf';
const BASE_ID = 'appWGgRPKQ3yvx3zd';
const TABLE_NAME = 'Voertuigen';

const looptijden = [12, 24, 36, 48, 60, 72];

// Custom hook voor het ophalen van voertuigen uit Airtable
const useVoertuigen = () => {
    const [voertuigen, setVoertuigen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchVoertuigen() {
            try {
                setLoading(true);
                setError(null);
                
                const res = await fetch(
                    `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
                    {
                        headers: {
                            Authorization: `Bearer ${AIRTABLE_TOKEN}`,
                        },
                    }
                );
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                setVoertuigen(data.records || []);
            } catch (err) {
                console.error('Error fetching voertuigen:', err);
                setError('Fout bij het laden van voertuigen');
                // Fallback naar dummy data bij fout
                setVoertuigen([
                    { id: '1', fields: { Merk: 'Selecteer een voertuig', Model: '', Prijs: 0 } },
                    { id: '2', fields: { Merk: 'BMW', Model: 'X3 xDrive20i', Prijs: 63883 } },
                    { id: '3', fields: { Merk: 'Audi', Model: 'A4 Avant', Prijs: 59000 } },
                    { id: '4', fields: { Merk: 'Mercedes', Model: 'C-Klasse', Prijs: 68000 } }
                ]);
            } finally {
                setLoading(false);
            }
        }
        
        fetchVoertuigen();
    }, []);

    return { voertuigen, loading, error };
};

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
    const [selectedVoertuig, setSelectedVoertuig] = useState(null);
    const [leaseType, setLeaseType] = useState('financial'); // Default to financial lease
    const [formData, setFormData] = useState({
        verkoopprijs: 0,
        aanbetaling: 0,
        gewenstKrediet: 0,
        looptijd: 48,
        maandbedrag: 0,
        totaalMaandbedrag: 0
    });

    const { voertuigen, loading, error } = useVoertuigen();

    const calculateGewenstKrediet = () => {
        return formData.verkoopprijs - formData.aanbetaling;
    };

    const calculateMaandlast = (looptijd = formData.looptijd) => {
        const gewenstKrediet = calculateGewenstKrediet();
        if (gewenstKrediet <= 0 || looptijd <= 0) return 0;
        
        // Verschillende berekeningen per lease type
        switch (leaseType) {
            case 'financial':
                // Financial lease: lagere rente, eigendom na looptijd
                const renteFinancial = 0.045; // 4.5%
                const maandRenteFinancial = renteFinancial / 12;
                const maandbedragFinancial = (gewenstKrediet * maandRenteFinancial * Math.pow(1 + maandRenteFinancial, looptijd)) / (Math.pow(1 + maandRenteFinancial, looptijd) - 1);
                return Math.round(maandbedragFinancial);
                
            case 'private':
                // Private lease: hogere rente, geen eigendom
                const rentePrivate = 0.065; // 6.5%
                const maandRentePrivate = rentePrivate / 12;
                const maandbedragPrivate = (gewenstKrediet * maandRentePrivate * Math.pow(1 + maandRentePrivate, looptijd)) / (Math.pow(1 + maandRentePrivate, looptijd) - 1);
                return Math.round(maandbedragPrivate);
                
            case 'operational':
                // Operational lease: hoogste rente, flexibele looptijd
                const renteOperational = 0.075; // 7.5%
                const maandRenteOperational = renteOperational / 12;
                const maandbedragOperational = (gewenstKrediet * maandRenteOperational * Math.pow(1 + maandRenteOperational, looptijd)) / (Math.pow(1 + maandRenteOperational, looptijd) - 1);
                return Math.round(maandbedragOperational);
                
            default:
                return 0;
        }
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
    }, [formData.verkoopprijs, formData.aanbetaling, formData.looptijd, leaseType]);

    React.useEffect(() => {
        if (selectedVoertuig && selectedVoertuig.fields && selectedVoertuig.fields.Prijs > 0) {
            setFormData(prev => ({
                ...prev,
                verkoopprijs: selectedVoertuig.fields.Prijs
            }));
        }
    }, [selectedVoertuig]);

    const handleSubmit = () => {
        if (!selectedVoertuig || !selectedVoertuig.fields) {
            return;
        }
        
        const submissionData = {
            leaseType: leaseType,
            voertuig: `${selectedVoertuig.fields.Merk} ${selectedVoertuig.fields.Model}`,
            verkoopprijs: formData.verkoopprijs,
            aanbetaling: formData.aanbetaling,
            gewenstKrediet: formData.gewenstKrediet,
            looptijd: formData.looptijd,
            maandbedrag: formData.maandbedrag,
            totaalMaandbedrag: formData.totaalMaandbedrag
        };

        // Voeg lease-specifieke data toe
        if (leaseType === 'private') {
            submissionData.kenteken = formData.kenteken || '';
            submissionData.merk = selectedVoertuig.fields.Merk;
            submissionData.type = selectedVoertuig.fields.Model;
        }
        
        onComplete(submissionData);
    };

    return (
        <div className="lease-form-container">
            <div className="step-header">
                <h2>Voertuig Selectie</h2>
                <p className="step-description">Kies uw voertuig en configureer de lease</p>
            </div>

            {/* Lease Type Tabs */}
            <div className="form-section">
                <label>Lease Type</label>
                <div className="lease-type-tabs">
                    <button
                        type="button"
                        className={`lease-type-tab ${leaseType === 'financial' ? 'active' : ''}`}
                        onClick={() => setLeaseType('financial')}
                    >
                        Financial Lease
                    </button>
                    <button
                        type="button"
                        className={`lease-type-tab ${leaseType === 'private' ? 'active' : ''}`}
                        onClick={() => setLeaseType('private')}
                    >
                        Private Lease
                    </button>
                    <button
                        type="button"
                        className={`lease-type-tab ${leaseType === 'operational' ? 'active' : ''}`}
                        onClick={() => setLeaseType('operational')}
                    >
                        Operational Lease
                    </button>
                </div>
            </div>

            <div className="form-section">
                <label>Selecteer voertuig</label>
                {loading ? (
                    <p>Laden van voertuigen...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <select 
                        className="vehicle-select"
                        value={selectedVoertuig ? selectedVoertuig.id : ''} 
                        onChange={(e) => {
                            if (e.target.value === '') {
                                setSelectedVoertuig(null);
                            } else {
                                const voertuig = voertuigen.find(v => v.id === e.target.value);
                                setSelectedVoertuig(voertuig);
                            }
                        }}
                    >
                        <option value="">Selecteer een voertuig</option>
                        {voertuigen.map(voertuig => (
                            <option key={voertuig.id} value={voertuig.id}>
                                {voertuig.fields.Merk} {voertuig.fields.Model} - {formatCurrency(voertuig.fields.Prijs)}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {leaseType === 'private' ? (
                // Private Lease: Uitgebreide financiering sectie
                <div>
                    <div className="form-section">
                        <label>Financiering</label>
                        <div className="inputs-container">
                            <CurrencyInput 
                                label="Verkoopprijs" 
                                value={formData.verkoopprijs} 
                                setValue={(value) => setFormData(prev => ({ ...prev, verkoopprijs: value }))} 
                            />
                            <CurrencyInput 
                                label="Aanbetaling/inruil bedrag" 
                                value={formData.aanbetaling} 
                                setValue={(value) => setFormData(prev => ({ ...prev, aanbetaling: value }))} 
                            />
                        </div>

                        <div className="input-group">
                            <label>Uw gewenst krediet</label>
                            <div className="input-box" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                                {formatCurrency(calculateGewenstKrediet())}
                            </div>
                        </div>
                    </div>

                    {/* Voertuiggegevens sectie voor Private Lease */}
                    <div className="form-section">
                        <label>Voertuiggegevens</label>
                        <div className="inputs-container">
                            <div className="input-group">
                                <label>Merk</label>
                                <div className="input-box" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                                    {selectedVoertuig?.fields?.Merk || 'Niet geselecteerd'}
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Type</label>
                                <div className="input-box" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                                    {selectedVoertuig?.fields?.Model || 'Niet geselecteerd'}
                                </div>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Kenteken van voertuig (optioneel)</label>
                            <input 
                                type="text" 
                                className="vehicle-select"
                                placeholder="Bijv. 12-ABC-3"
                                value={formData.kenteken || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, kenteken: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                // Financial/Operational Lease: Standaard financiering
                <div className="form-section">
                    <label>Financiering</label>
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
                        <div className="input-box" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                            {formatCurrency(calculateGewenstKrediet())}
                        </div>
                    </div>
                </div>
            )}

            <div className="form-section">
                <label>{leaseType === 'private' ? "Gewenste looptijd in maanden" : "Looptijd (maanden)"}</label>
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
                        <span>{leaseType === 'private' ? "Aanbetaling/inruil" : "Aanbetaling"}</span>
                        <span>{formatCurrency(formData.aanbetaling)}</span>
                    </div>
                    <div>
                        <span>Gewenst krediet</span>
                        <span>{formatCurrency(calculateGewenstKrediet())}</span>
                    </div>
                    {leaseType === 'private' && selectedVoertuig && (
                        <>
                            <div>
                                <span>Merk</span>
                                <span>{selectedVoertuig.fields.Merk}</span>
                            </div>
                            <div>
                                <span>Type</span>
                                <span>{selectedVoertuig.fields.Model}</span>
                            </div>
                            {formData.kenteken && (
                                <div>
                                    <span>Kenteken</span>
                                    <span>{formData.kenteken}</span>
                                </div>
                            )}
                        </>
                    )}
                    {leaseType === 'financial' && (
                        <div>
                            <span>Eigendom na looptijd</span>
                            <span>✓</span>
                        </div>
                    )}
                    {leaseType === 'private' && (
                        <div>
                            <span>Altijd eigendom leasemaatschappij</span>
                            <span>✓</span>
                        </div>
                    )}
                    {leaseType === 'operational' && (
                        <div>
                            <span>Flexibele looptijd</span>
                            <span>✓</span>
                        </div>
                    )}
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
                    disabled={selectedVoertuig === null || formData.verkoopprijs <= 0}
                >
                    {leaseType === 'financial' ? 'Volgende stap' : 
                     leaseType === 'private' ? 'Persoonsgegevens invullen' : 
                     'Extra opties bekijken'}
                </button>
            </div>
        </div>
    );
} 