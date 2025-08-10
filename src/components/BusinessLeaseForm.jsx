import React, { useState } from 'react';
import BusinessInfo from './BusinessInfo';
import LeaseForm from './LeaseForm';
import FinancialDetails from './FinancialDetails';

export default function BusinessLeaseForm({ leaseType }) {
  const [step, setStep] = useState(0);
  const [leaseData, setLeaseData] = useState(null);
  const [financialData, setFinancialData] = useState(null);

  const handleLeaseNext = (data) => {
    setLeaseData(data);
    setStep(1);
  };

  const handleFinancialNext = (data) => {
    setFinancialData(data);
    setStep(2);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div>
      {step === 0 && (
        <LeaseForm 
          leaseType={leaseType} 
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
        <BusinessInfo
          onBack={handleBack}
          leaseData={{ ...leaseData, ...financialData }}
        />
      )}
    </div>
  );
} 