import React, { useState } from 'react';

export default function ExtraOptions({ onBack, onComplete, leaseData }) {
  const [laadpaal, setLaadpaal] = useState(false);
  const [zonnepanelen, setZonnepanelen] = useState(false);
  const [verzekering, setVerzekering] = useState(false);
  const [tankpas, setTankpas] = useState(false);
  const [inrichtingBedrijfsauto, setInrichtingBedrijfsauto] = useState(false);
  const [autoBelettering, setAutoBelettering] = useState(false);
  
  const laadpaalBedrag = 49; // vast bedrag per maand
  const zonnepanelenBedrag = 69; // vast bedrag per maand
  const verzekeringBedrag = 29; // vast bedrag per maand
  const tankpasBedrag = 19; // vast bedrag per maand
  const inrichtingBedrijfsautoBedrag = 300; // eenmalig bedrag
  const autoBeletteringBedrag = 450; // eenmalig bedrag
  
  // Bereken maandelijkse kosten (eenmalige bedragen worden verdeeld over 60 maanden)
  const maandelijkseEenmaligeKosten = ((inrichtingBedrijfsauto ? inrichtingBedrijfsautoBedrag : 0) + 
                                       (autoBelettering ? autoBeletteringBedrag : 0)) / 60;
  
  const totaalOpties = (laadpaal ? laadpaalBedrag : 0) + 
                       (zonnepanelen ? zonnepanelenBedrag : 0) + 
                       (verzekering ? verzekeringBedrag : 0) + 
                       (tankpas ? tankpasBedrag : 0) + 
                       maandelijkseEenmaligeKosten;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value || 0);
  };
  
  return (
    <div className="lease-form-container">
      <div className="step-header">
        <h2>Extra Opties</h2>
        <p className="step-description">Kies eventuele extra opties voor uw lease</p>
      </div>

      <div className="form-section">
        <label>Beschikbare opties</label>
        <div className="extra-options-group">
          <label className={`extra-option-row${laadpaal ? ' selected' : ''}`}> 
            <input type="checkbox" checked={laadpaal} onChange={e => setLaadpaal(e.target.checked)} />
            <div className="option-content">
              <span className="option-title">Laadpaal leasen</span>
              <span className="option-price">+ {formatCurrency(laadpaalBedrag)}/maand</span>
            </div>
          </label>
          <label className={`extra-option-row${zonnepanelen ? ' selected' : ''}`}> 
            <input type="checkbox" checked={zonnepanelen} onChange={e => setZonnepanelen(e.target.checked)} />
            <div className="option-content">
              <span className="option-title">Zonnepanelen leasen</span>
              <span className="option-price">+ {formatCurrency(zonnepanelenBedrag)}/maand</span>
            </div>
          </label>
          <label className={`extra-option-row${verzekering ? ' selected' : ''}`}> 
            <input type="checkbox" checked={verzekering} onChange={e => setVerzekering(e.target.checked)} />
            <div className="option-content">
              <span className="option-title">Verzekering</span>
              <span className="option-price">+ {formatCurrency(verzekeringBedrag)}/maand</span>
            </div>
          </label>
          <label className={`extra-option-row${tankpas ? ' selected' : ''}`}> 
            <input type="checkbox" checked={tankpas} onChange={e => setTankpas(e.target.checked)} />
            <div className="option-content">
              <span className="option-title">Tankpas</span>
              <span className="option-price">+ {formatCurrency(tankpasBedrag)}/maand</span>
            </div>
          </label>
          <label className={`extra-option-row${inrichtingBedrijfsauto ? ' selected' : ''}`}> 
            <input type="checkbox" checked={inrichtingBedrijfsauto} onChange={e => setInrichtingBedrijfsauto(e.target.checked)} />
            <div className="option-content">
              <span className="option-title">Inrichting bedrijfsauto</span>
              <span className="option-price">{formatCurrency(inrichtingBedrijfsautoBedrag)} eenmalig</span>
            </div>
          </label>
          <label className={`extra-option-row${autoBelettering ? ' selected' : ''}`}> 
            <input type="checkbox" checked={autoBelettering} onChange={e => setAutoBelettering(e.target.checked)} />
            <div className="option-content">
              <span className="option-title">Auto belettering</span>
              <span className="option-price">{formatCurrency(autoBeletteringBedrag)} eenmalig</span>
            </div>
          </label>
        </div>
      </div>

      <div className="summary-card">
        <h3>Overzicht</h3>
        <div className="summary-main-amount">
          {formatCurrency(leaseData?.maandbedrag + totaalOpties)}<span>/maand</span>
        </div>
        <div className="summary-details">
          <div>
            <span>Voertuig lease</span>
            <span>{formatCurrency(leaseData?.maandbedrag)}</span>
          </div>
          {laadpaal && (
            <div>
              <span>Laadpaal</span>
              <span>{formatCurrency(laadpaalBedrag)}</span>
            </div>
          )}
          {zonnepanelen && (
            <div>
              <span>Zonnepanelen</span>
              <span>{formatCurrency(zonnepanelenBedrag)}</span>
            </div>
          )}
          {verzekering && (
            <div>
              <span>Verzekering</span>
              <span>{formatCurrency(verzekeringBedrag)}</span>
            </div>
          )}
          {tankpas && (
            <div>
              <span>Tankpas</span>
              <span>{formatCurrency(tankpasBedrag)}</span>
            </div>
          )}
          {inrichtingBedrijfsauto && (
            <div>
              <span>Inrichting bedrijfsauto</span>
              <span>{formatCurrency(inrichtingBedrijfsautoBedrag)} eenmalig</span>
            </div>
          )}
          {autoBelettering && (
            <div>
              <span>Auto belettering</span>
              <span>{formatCurrency(autoBeletteringBedrag)} eenmalig</span>
            </div>
          )}
          {(inrichtingBedrijfsauto || autoBelettering) && (
            <div className="info-note">
              <span>Eenmalige kosten verdeeld over {leaseData?.looptijd} maanden</span>
            </div>
          )}
        </div>
      </div>

      <div className="bottom-section">
        <button className="secondary-button" onClick={onBack}>Terug</button>
        <button 
          className="submit-button" 
          onClick={() => onComplete({
            ...leaseData, 
            laadpaal, 
            zonnepanelen, 
            verzekering, 
            tankpas, 
            inrichtingBedrijfsauto, 
            autoBelettering, 
            totaalOpties
          })}
        >
          Persoonlijke gegevens invullen
        </button>
      </div>
    </div>
  );
} 