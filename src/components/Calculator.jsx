import React, { useState, useEffect } from 'react';

const CurrencyInput = ({ label, value, setValue, tooltip }) => {
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '';
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setValue(value ? parseInt(value) : 0);
    };

    return (
        <div className="input-group">
            <label>{label} {tooltip && <span style={{ color: 'var(--muted-foreground)' }}>ℹ️</span>}</label>
            <div className="input-box">
                <span style={{ color: 'var(--muted-foreground)', marginRight: '0.5rem' }}>€</span>
                <input
                    type="text"
                    value={value ? value.toLocaleString('nl-NL') : ''}
                    onChange={handleChange}
                    placeholder="0"
                    style={{ 
                        border: 'none', 
                        outline: 'none', 
                        background: 'transparent',
                        flex: 1,
                        textAlign: 'right'
                    }}
                />
            </div>
        </div>
    );
};

const InfoTooltip = ({ text }) => (
    <span 
        title={text}
        style={{ 
            marginLeft: '0.5rem', 
            color: 'var(--muted-foreground)', 
            cursor: 'help',
            fontSize: '0.875rem'
        }}
    >
        ℹ️
    </span>
);

export default function Calculator({ onClose }) {
    const [formData, setFormData] = useState({
        verkoopprijs: 14000,
        aanbetaling: 0,
        inruil: 0,
        slottermijn: 0,
        looptijd: 60
    });

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '€ 0';
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const calculateBtwBedrag = () => {
        return Math.round((formData.verkoopprijs / 1.21) * 0.21 * 100) / 100;
    };

    const calculateAanschafwaardeExclBtw = () => {
        return Math.round((formData.verkoopprijs / 1.21) * 100) / 100;
    };

    const calculateTotaalAanTeBetalen = () => {
        return calculateBtwBedrag() + formData.aanbetaling;
    };

    const calculateLeasebedrag = () => {
        return Math.round((calculateAanschafwaardeExclBtw() - formData.aanbetaling - formData.inruil) * 100) / 100;
    };

    const calculateSlottermijnPercentage = () => {
        const aanschafwaardeExcl = calculateAanschafwaardeExclBtw();
        if (aanschafwaardeExcl === 0) return 0;
        return Math.round((formData.slottermijn / aanschafwaardeExcl) * 100);
    };

    const calculateMaxSlottermijn = () => {
        const aanschafwaardeExcl = calculateAanschafwaardeExclBtw();
        // Maximum 25% van aanschafwaarde excl. BTW
        return Math.round(aanschafwaardeExcl * 0.25 * 100) / 100;
    };

    const calculateMaandbedrag = () => {
        const leasebedrag = calculateLeasebedrag();
        const renteFinancial = 0.0899; // 8.99%
        const maandRenteFinancial = renteFinancial / 12;
        const looptijd = formData.looptijd;
        
        if (leasebedrag <= 0 || looptijd <= 0) return 0;
        
        const maandbedragFinancial = (leasebedrag * maandRenteFinancial * Math.pow(1 + maandRenteFinancial, looptijd)) / (Math.pow(1 + maandRenteFinancial, looptijd) - 1);
        return Math.round(maandbedragFinancial * 100) / 100;
    };

    // Automatisch maximale slottermijn instellen bij eerste load
    useEffect(() => {
        const maxSlottermijn = calculateMaxSlottermijn();
        if (maxSlottermijn > 0) {
            setFormData(prev => ({ ...prev, slottermijn: maxSlottermijn }));
        }
    }, []);

    // Automatisch maximale slottermijn instellen bij verandering van relevante velden
    useEffect(() => {
        const maxSlottermijn = calculateMaxSlottermijn();
        if (maxSlottermijn > 0) {
            setFormData(prev => ({ ...prev, slottermijn: maxSlottermijn }));
        }
    }, [formData.verkoopprijs, formData.aanbetaling, formData.inruil]);

    const looptijdOptions = [12, 24, 36, 48, 60, 72];

    return (
        <div className="calculator-overlay">
            <div className="calculator-modal">
                <div className="calculator-header">
                    <h2>Lease Calculator</h2>
                    <button 
                        onClick={onClose}
                        className="calculator-close"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                <div className="calculator-body">
                    {/* Input Section */}
                    <div className="calculator-inputs">
                        <div className="input-grid">
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

                        {/* Looptijd Section */}
                        <div className="looptijd-section">
                            <label>Looptijd: {formData.looptijd} maanden</label>
                            <input
                                type="range"
                                min="12"
                                max="72"
                                step="12"
                                value={formData.looptijd}
                                onChange={(e) => setFormData(prev => ({ ...prev, looptijd: parseInt(e.target.value) }))}
                                className="looptijd-slider"
                            />
                            <div className="looptijd-labels">
                                <span>12</span>
                                <span>24</span>
                                <span>36</span>
                                <span>48</span>
                                <span>60</span>
                                <span>72</span>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="calculator-results">
                        <div className="result-card">
                            <h3>Berekening</h3>
                            <div className="result-item">
                                <span>BTW-bedrag</span>
                                <span>{formatCurrency(calculateBtwBedrag())}</span>
                            </div>
                            <div className="result-item">
                                <span>Aanschafwaarde excl. BTW</span>
                                <span>{formatCurrency(calculateAanschafwaardeExclBtw())}</span>
                            </div>
                            <div className="result-item">
                                <span>Leasebedrag</span>
                                <span>{formatCurrency(calculateLeasebedrag())}</span>
                            </div>
                            <div className="result-item">
                                <span>Totaal aan te betalen</span>
                                <span>{formatCurrency(calculateTotaalAanTeBetalen())}</span>
                            </div>
                            <div className="result-main">
                                <span>Maandbedrag</span>
                                <span>{formatCurrency(calculateMaandbedrag())}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
