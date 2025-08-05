import React, { useState } from 'react';
import { supabase, isSupabaseAvailable } from '../lib/supabase';
import LeaseForm from './LeaseForm';
import FinancialDetails from './FinancialDetails';
import PersonalDetailsExtra from './PersonalDetailsExtra';
import ContactDetails from './ContactDetails';

const steps = [
  { label: 'Lease & Voertuig' },
  { label: 'Financiële gegevens' },
  { label: 'Persoonsgegevens' },
  { label: 'Contactgegevens' },
];

export default function PersonalInfo() {
  const [step, setStep] = useState(0);
  const [leaseData, setLeaseData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [personalData, setPersonalData] = useState(null);

  const handleLeaseNext = (data) => {
    setLeaseData(data);
    setStep(1);
  };

  const handleFinancialNext = (data) => {
    setFinancialData(data);
    setStep(2);
  };

  const handlePersonalNext = (data) => {
    setPersonalData(data);
    setStep(3);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  // Stap-indicator
  const StepIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 24px 0', gap: 24 }}>
      {steps.map((s, idx) => (
        <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: idx === step ? '#2563eb' : '#e5e7eb',
              color: idx === step ? 'white' : '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 16,
              border: idx < step ? '2px solid #2563eb' : '2px solid #e5e7eb',
              transition: 'all 0.2s',
            }}
          >
            {idx + 1}
          </div>
          <span style={{ fontWeight: idx === step ? 700 : 400, color: idx === step ? '#2563eb' : '#6b7280', fontSize: 15 }}>{s.label}</span>
          {idx < steps.length - 1 && <div style={{ width: 32, height: 2, background: idx < step ? '#2563eb' : '#e5e7eb' }} />}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <StepIndicator />
      {step === 0 && (
        <LeaseForm 
          leaseType="particulier" 
          onComplete={handleLeaseNext}
        />
      )}
      {step === 1 && (
        <FinancialDetails
          onBack={handleBack}
          onComplete={handleFinancialNext}
        />
      )}
      {step === 2 && (
        <PersonalDetailsExtra
          onBack={handleBack}
          onComplete={handlePersonalNext}
        />
      )}
      {step === 3 && (
        <ContactDetails
          onBack={handleBack}
          onComplete={(data) => {
            // Hier kun je alles verzamelen en versturen
            console.log({ ...leaseData, ...financialData, ...personalData, ...data });
            // Eventueel: setStep(4) voor een bevestigingsscherm
          }}
        />
      )}
    </div>
  );
} 