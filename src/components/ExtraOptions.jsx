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
  
  return (
    <div className="lease-form-container">
      <div className="step-header">
        <h2>Extra opties leasen</h2>
        <p className="step-description">Kies eventuele extra opties voor uw lease</p>
      </div>
      <div className="extra-options-group">
        <label className={`extra-option-row${laadpaal ? ' selected' : ''}`}> 
          <input type="checkbox" checked={laadpaal} onChange={e => setLaadpaal(e.target.checked)} />
          <span>Laadpaal leasen (+ €{laadpaalBedrag}/maand)</span>
        </label>
        <label className={`extra-option-row${zonnepanelen ? ' selected' : ''}`}> 
          <input type="checkbox" checked={zonnepanelen} onChange={e => setZonnepanelen(e.target.checked)} />
          <span>Zonnepanelen leasen (+ €{zonnepanelenBedrag}/maand)</span>
        </label>
        <label className={`extra-option-row${verzekering ? ' selected' : ''}`}> 
          <input type="checkbox" checked={verzekering} onChange={e => setVerzekering(e.target.checked)} />
          <span>Verzekering (+ €{verzekeringBedrag}/maand)</span>
        </label>
        <label className={`extra-option-row${tankpas ? ' selected' : ''}`}> 
          <input type="checkbox" checked={tankpas} onChange={e => setTankpas(e.target.checked)} />
          <span>Tankpas (+ €{tankpasBedrag}/maand)</span>
        </label>
        <label className={`extra-option-row${inrichtingBedrijfsauto ? ' selected' : ''}`}> 
          <input type="checkbox" checked={inrichtingBedrijfsauto} onChange={e => setInrichtingBedrijfsauto(e.target.checked)} />
          <span>Inrichting bedrijfsauto (€{inrichtingBedrijfsautoBedrag} eenmalig)</span>
        </label>
        <label className={`extra-option-row${autoBelettering ? ' selected' : ''}`}> 
          <input type="checkbox" checked={autoBelettering} onChange={e => setAutoBelettering(e.target.checked)} />
          <span>Auto belettering (€{autoBeletteringBedrag} eenmalig)</span>
        </label>
      </div>
      <div className="summary-card" style={{marginTop: '2em'}}>
        <h3>Overzicht</h3>
        <ul style={{paddingLeft: 0, listStyle: 'none'}}>
          <li>Leasevorm: <strong>{leaseData?.leaseType}</strong></li>
          <li>Voertuig: <strong>{leaseData?.selectedVoertuig}</strong></li>
          <li>Looptijd: <strong>{leaseData?.looptijd} maanden</strong></li>
          <li>Maandbedrag voertuig: <strong>€ {leaseData?.maandbedrag?.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong></li>
          {laadpaal && <li>Laadpaal: <strong>€ {laadpaalBedrag}/maand</strong></li>}
          {zonnepanelen && <li>Zonnepanelen: <strong>€ {zonnepanelenBedrag}/maand</strong></li>}
          {verzekering && <li>Verzekering: <strong>€ {verzekeringBedrag}/maand</strong></li>}
          {tankpas && <li>Tankpas: <strong>€ {tankpasBedrag}/maand</strong></li>}
          {inrichtingBedrijfsauto && <li>Inrichting bedrijfsauto: <strong>€ {inrichtingBedrijfsautoBedrag} eenmalig</strong></li>}
          {autoBelettering && <li>Auto belettering: <strong>€ {autoBeletteringBedrag} eenmalig</strong></li>}
        </ul>
        <div style={{marginTop: '1em', fontWeight: 600, fontSize: '1.2em'}}>
          Totaal per maand: € {(leaseData?.maandbedrag + totaalOpties).toLocaleString(undefined, {maximumFractionDigits: 0})}
        </div>
        {(inrichtingBedrijfsauto || autoBelettering) && (
          <div style={{marginTop: '0.5em', fontSize: '0.9em', color: '#666', fontStyle: 'italic'}}>
            * Eenmalige kosten worden verdeeld over de looptijd van {leaseData?.looptijd} maanden
          </div>
        )}
      </div>
      <div className="bottom-section">
        <button className="secondary-button" onClick={onBack}>Terug</button>
        <button className="submit-button" onClick={() => onComplete({
          ...leaseData, 
          laadpaal, 
          zonnepanelen, 
          verzekering, 
          tankpas, 
          inrichtingBedrijfsauto, 
          autoBelettering, 
          totaalOpties
        })}>Aanvraag indienen</button>
      </div>
    </div>
  );
} 