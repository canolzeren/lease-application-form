import React, { useState } from 'react';
import LeaseForm from './LeaseForm';
import FinancialDetails from './FinancialDetails';
import PersonalDetailsExtra from './PersonalDetailsExtra';
import ContactDetails from './ContactDetails';

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

  return (
    <div>
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