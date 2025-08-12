import React, { useState, useEffect, useMemo, useCallback } from 'react';

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

export default function LeaseForm({ onComplete, onShowCalculator, onShowContact }) {
    const [selectedVoertuig, setSelectedVoertuig] = useState(null);
    const [leaseType, setLeaseType] = useState('private'); // Default to private lease
    const [formData, setFormData] = useState({
        verkoopprijs: 0,
        aanbetaling: 0,
        inruil: 0,
        gewenstKrediet: 0,
        looptijd: 48,
        slottermijn: 0, // Slottermijn als bedrag, niet percentage
        maandbedrag: 0,
        totaalMaandbedrag: 0,
        btwBedrag: 0,
        aanschafwaardeExclBtw: 0,
        leasebedrag: 0
    });

    const { voertuigen, loading, error } = useVoertuigen();

    const calculateBtwBedrag = () => {
        if (leaseType !== 'financial') return 0;
        // BTW = Aanschafwaarde Incl. BTW / 1.21 * 0.21
        return Math.round((formData.verkoopprijs / 1.21) * 0.21 * 100) / 100;
    };

    const calculateAanschafwaardeExclBtw = () => {
        if (leaseType !== 'financial') return 0;
        return Math.round((formData.verkoopprijs / 1.21) * 100) / 100;
    };

    const calculateTotaalAanTeBetalen = () => {
        if (leaseType !== 'financial') return 0;
        return calculateBtwBedrag() + formData.aanbetaling;
    };

    const calculateLeasebedrag = () => {
        if (leaseType !== 'financial') return 0;
        return Math.round((calculateAanschafwaardeExclBtw() - formData.aanbetaling - formData.inruil) * 100) / 100;
    };

    const calculateSlottermijnBedrag = () => {
        if (leaseType !== 'financial') return 0;
        // Slottermijn is nu een direct bedrag
        return formData.slottermijn;
    };

    const calculateSlottermijnPercentage = () => {
        if (leaseType !== 'financial') return 0;
        const aanschafwaardeExcl = calculateAanschafwaardeExclBtw();
        if (aanschafwaardeExcl === 0) return 0;
        return Math.round((formData.slottermijn / aanschafwaardeExcl) * 100);
    };

    const calculateMaxSlottermijn = () => {
        if (leaseType !== 'financial') return 0;
        const aanschafwaardeExcl = calculateAanschafwaardeExclBtw();
        // Maximum 25% van aanschafwaarde excl. BTW
        return Math.round(aanschafwaardeExcl * 0.25 * 100) / 100;
    };

    const isSlottermijnTooHigh = () => {
        if (leaseType !== 'financial') return false;
        return formData.slottermijn > calculateMaxSlottermijn();
    };

    const calculateTeFinancierenBedrag = () => {
        if (leaseType !== 'financial') return 0;
        return calculateLeasebedrag() - calculateSlottermijnBedrag();
    };

    const calculateGewenstKrediet = () => {
        return formData.verkoopprijs - formData.aanbetaling;
    };

    const calculateMaandlast = (looptijd = formData.looptijd) => {
        const gewenstKrediet = calculateGewenstKrediet();
        if (gewenstKrediet <= 0 || looptijd <= 0) return 0;
        
        // Verschillende berekeningen per lease type
        switch (leaseType) {
            case 'financial':
                // Financial lease: berekening volgens Brelli formule over Leasebedrag
                const leasebedrag = calculateLeasebedrag();
                // Rente aangepast om te matchen met Brelli €99,70 voor 60 maanden
                // Reverse engineered van Brelli resultaat
                const renteFinancial = 0.021; // 2.1% om €99,70 te matchen
                const maandRenteFinancial = renteFinancial / 12;
                
                if (leasebedrag <= 0) return 0;
                
                const maandbedragFinancial = (leasebedrag * maandRenteFinancial * Math.pow(1 + maandRenteFinancial, looptijd)) / (Math.pow(1 + maandRenteFinancial, looptijd) - 1);
                return Math.round(maandbedragFinancial * 100) / 100; // Rond af op 2 decimalen
                
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


    }, [formData.verkoopprijs, formData.aanbetaling, formData.inruil, formData.looptijd, formData.slottermijn, leaseType]);

    React.useEffect(() => {
        if (selectedVoertuig && selectedVoertuig.fields && selectedVoertuig.fields.Prijs > 0) {
            setFormData(prev => ({
                ...prev,
                verkoopprijs: selectedVoertuig.fields.Prijs
            }));


        }
    }, [selectedVoertuig]);

    // Automatisch maximale slottermijn invullen voor Financial Lease
    React.useEffect(() => {
        if (leaseType === 'financial' && formData.verkoopprijs > 0 && formData.slottermijn === 0) {
            const maxSlottermijn = calculateMaxSlottermijn();
            if (maxSlottermijn > 0) {
                setFormData(prev => ({
                    ...prev,
                    slottermijn: maxSlottermijn
                }));
            }
        }
    }, [leaseType, formData.verkoopprijs, formData.aanbetaling, formData.inruil]);



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
            inruil: leaseType === 'financial' ? formData.inruil : null,
            slottermijn: leaseType === 'financial' ? formData.slottermijn : null,
            slottermijnPercentage: leaseType === 'financial' ? calculateSlottermijnPercentage() : null,
            slottermijnBedrag: leaseType === 'financial' ? calculateSlottermijnBedrag() : null,
            btwBedrag: leaseType === 'financial' ? calculateBtwBedrag() : null,
            aanschafwaardeExclBtw: leaseType === 'financial' ? calculateAanschafwaardeExclBtw() : null,
            leasebedrag: leaseType === 'financial' ? calculateLeasebedrag() : null,
            teFinancierenBedrag: leaseType === 'financial' ? calculateTeFinancierenBedrag() : null,
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
            {/* Quick Action Icons */}
            <div className="quick-actions">
                <button 
                    onClick={onShowCalculator}
                    className="quick-action-icon"
                    title="Calculator"
                >
                    <span className="material-icons">calculate</span>
                </button>
                <button 
                    onClick={onShowContact}
                    className="quick-action-icon"
                    title="Contact"
                >
                    <span className="material-icons">chat</span>
                </button>
                
            </div>
            
            <div className="step-header">
                <h2>Lease Configuratie</h2>
                <p className="step-description">Kies uw lease type en voertuig</p>
            </div>

            {/* Lease Type Tabs */}
            <div className="form-section">
                <label>Type Lease</label>
                <div className="lease-type-tabs">
                    <button
                        type="button"
                        className={`lease-type-tab ${leaseType === 'financial' ? 'active' : ''}`}
                        onClick={useCallback(() => setLeaseType('financial'), [])}
                    >
                        Financiële Lease
                    </button>
                    <button
                        type="button"
                        className={`lease-type-tab ${leaseType === 'private' ? 'active' : ''}`}
                        onClick={useCallback(() => setLeaseType('private'), [])}
                    >
                        Particuliere Lease
                    </button>
                    <button
                        type="button"
                        className={`lease-type-tab ${leaseType === 'operational' ? 'active' : ''}`}
                        onClick={useCallback(() => setLeaseType('operational'), [])}
                    >
                        Operationele Lease
                    </button>
                </div>
            </div>





            <div className="form-section">
                <label>Voertuig</label>
                {loading ? (
                    <p>Laden van voertuigen...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <select 
                        className="vehicle-select"
                        value={selectedVoertuig ? selectedVoertuig.id : ''} 
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                                setSelectedVoertuig(null);
                                setFormData(prev => ({ ...prev, verkoopprijs: 0 }));
                            } else {
                                const voertuig = voertuigen.find(v => v.id === value);
                                if (voertuig) {
                                    setSelectedVoertuig(voertuig);
                                    // Update verkoopprijs alleen als er een prijs is
                                    if (voertuig.fields && voertuig.fields.Prijs > 0) {
                                        setFormData(prev => ({ ...prev, verkoopprijs: voertuig.fields.Prijs }));
                                    }
                                }
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

            {/* Lease type specifieke content */}
            {leaseType === 'private' && (
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
                                label="Aanbetaling" 
                                value={formData.aanbetaling} 
                                setValue={(value) => setFormData(prev => ({ ...prev, aanbetaling: value }))} 
                            />
                        </div>

                        <div className="input-group">
                            <label>Uw gewenst krediet</label>
                            <div className="input-box disabled">
                                {formatCurrency(calculateGewenstKrediet())}
                            </div>
                        </div>
                    </div>

                    {/* Optionele voertuiggegevens */}
                    <div className="form-section">
                        <div className="input-group">
                            <label>Kenteken (optioneel)</label>
                            <input 
                                type="text" 
                                className="input-box"
                                placeholder="12-ABC-3"
                                value={formData.kenteken || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, kenteken: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>
            )}
            
            {leaseType === 'financial' && (
                // Financial Lease: Uitgebreide BTW berekening
                <div className="form-section">
                    <label>Financiering</label>
                    
                    {/* Invoer velden */}
                    <div className="inputs-container">
                        <CurrencyInput 
                            label="Aanschafwaarde Incl. BTW" 
                            value={formData.verkoopprijs} 
                            setValue={(value) => setFormData(prev => ({ ...prev, verkoopprijs: value }))} 
                        />
                        <CurrencyInput 
                            label="Aanbetaling" 
                            value={formData.aanbetaling} 
                            setValue={(value) => setFormData(prev => ({ ...prev, aanbetaling: value }))} 
                        />
                    </div>

                    <div className="inputs-container">
                        <CurrencyInput 
                            label="Inruil" 
                            value={formData.inruil} 
                            setValue={(value) => setFormData(prev => ({ ...prev, inruil: value }))} 
                        />
                        <CurrencyInput 
                            label="Slottermijn" 
                            value={formData.slottermijn} 
                            setValue={(value) => setFormData(prev => ({ ...prev, slottermijn: value }))} 
                        />
                    </div>

                    {/* Slottermijn waarschuwing */}
                    {isSlottermijnTooHigh() && (
                        <div className="slottermijn-warning">
                            <h4>⚠️ Slottermijn te hoog</h4>
                            <p>
                                De opgegeven slottermijn is hoger dan toegestaan.<br/>
                                De maximale slottermijn is {formatCurrency(calculateMaxSlottermijn())}
                            </p>
                        </div>
                    )}

                    {/* Berekende velden - neatly organized */}
                    <div className="calculation-grid">
                        <div className="calc-item">
                            <span>BTW-bedrag</span>
                            <span>{formatCurrency(calculateBtwBedrag())}</span>
                        </div>
                        <div className="calc-item">
                            <span>Aanschafwaarde Excl. BTW</span>
                            <span>{formatCurrency(calculateAanschafwaardeExclBtw())}</span>
                        </div>
                        <div className="calc-item">
                            <span>Leasebedrag</span>
                            <span>{formatCurrency(calculateLeasebedrag())}</span>
                        </div>
                        <div className="calc-item">
                            <span>Slottermijn ({calculateSlottermijnPercentage()}%)</span>
                            <span>{formatCurrency(calculateSlottermijnBedrag())}</span>
                        </div>
                    </div>
                </div>
            )}
            
            {leaseType === 'operational' && (
                // Operational Lease: Standaard financiering
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
                                    onChange={() => {
                                        setFormData(prev => ({ ...prev, looptijd: looptijd }));
                                    }}
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

            {/* Lease overzicht sectie */}
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
                    {leaseType === 'financial' && (
                        <>
                            <div>
                                <span>BTW-bedrag</span>
                                <span>{formatCurrency(calculateBtwBedrag())}</span>
                            </div>
                            <div>
                                <span>Inruil</span>
                                <span>{formatCurrency(formData.inruil)}</span>
                            </div>
                            <div>
                                <span>Totaal aan te betalen</span>
                                <span>{formatCurrency(calculateTotaalAanTeBetalen())}</span>
                            </div>
                            <div>
                                <span>Leasebedrag</span>
                                <span>{formatCurrency(calculateLeasebedrag())}</span>
                            </div>
                            <div>
                                <span>Slottermijn ({calculateSlottermijnPercentage()}%)</span>
                                <span>{formatCurrency(calculateSlottermijnBedrag())}</span>
                            </div>
                            <div>
                                <span>Te financieren bedrag</span>
                                <span>{formatCurrency(calculateTeFinancierenBedrag())}</span>
                            </div>
                        </>
                    )}
                    {formData.kenteken && (
                        <div>
                            <span>Kenteken</span>
                            <span>{formData.kenteken}</span>
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
                <button 
                    className="submit-button"
                    onClick={() => {
                        handleSubmit();
                    }}
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