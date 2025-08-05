import { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import VehicleInfo from './VehicleInfo';
import FinancialInfo from './FinancialInfo';

const REQUEST_TYPES = {
  KOOP: 'koop',
  ABONNEMENT: 'abonnement',
  PRIVATE_LEASE: 'private_lease',
  FINANCIAL_LEASE: 'financial_lease'
};

const REQUEST_TYPE_LABELS = {
  [REQUEST_TYPES.KOOP]: 'Koop',
  [REQUEST_TYPES.ABONNEMENT]: 'Abonnement',
  [REQUEST_TYPES.PRIVATE_LEASE]: 'Private Lease',
  [REQUEST_TYPES.FINANCIAL_LEASE]: 'Financial Lease'
};

const RequestForm = () => {
  const [formData, setFormData] = useState({
    requestType: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      postalCode: '',
      city: ''
    },
    vehicleInfo: {
      brand: '',
      model: '',
      year: '',
      mileage: '',
      price: ''
    },
    financialInfo: {
      monthlyBudget: '',
      downPayment: '',
      leaseTerm: '',
      annualMileage: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRequestTypeChange = (type) => {
    setFormData(prev => ({ ...prev, requestType: type }));
    setShowSuccess(false);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuleer een API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Scroll naar boven
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderRequestTypeFields = () => {
    switch (formData.requestType) {
      case REQUEST_TYPES.KOOP:
        return (
          <>
            <PersonalInfo data={formData.personalInfo} onChange={(field, value) => handleInputChange('personalInfo', field, value)} />
            <VehicleInfo data={formData.vehicleInfo} onChange={(field, value) => handleInputChange('vehicleInfo', field, value)} />
            <FinancialInfo 
              data={formData.financialInfo} 
              onChange={(field, value) => handleInputChange('financialInfo', field, value)}
              showFields={['monthlyBudget', 'downPayment']}
            />
          </>
        );
      case REQUEST_TYPES.ABONNEMENT:
        return (
          <>
            <PersonalInfo data={formData.personalInfo} onChange={(field, value) => handleInputChange('personalInfo', field, value)} />
            <VehicleInfo data={formData.vehicleInfo} onChange={(field, value) => handleInputChange('vehicleInfo', field, value)} />
            <FinancialInfo 
              data={formData.financialInfo} 
              onChange={(field, value) => handleInputChange('financialInfo', field, value)}
              showFields={['monthlyBudget', 'leaseTerm', 'annualMileage']}
            />
          </>
        );
      case REQUEST_TYPES.PRIVATE_LEASE:
      case REQUEST_TYPES.FINANCIAL_LEASE:
        return (
          <>
            <PersonalInfo data={formData.personalInfo} onChange={(field, value) => handleInputChange('personalInfo', field, value)} />
            <VehicleInfo data={formData.vehicleInfo} onChange={(field, value) => handleInputChange('vehicleInfo', field, value)} />
            <FinancialInfo 
              data={formData.financialInfo} 
              onChange={(field, value) => handleInputChange('financialInfo', field, value)}
              showFields={['monthlyBudget', 'leaseTerm', 'annualMileage', 'downPayment']}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Aanvraagformulier</h1>
        <p className="text-gray-600">Vul het formulier in om uw aanvraag te starten</p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Uw aanvraag is succesvol verzonden!
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">Type aanvraag</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(REQUEST_TYPES).map(([key, value]) => (
            <button
              key={value}
              onClick={() => handleRequestTypeChange(value)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                formData.requestType === value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {REQUEST_TYPE_LABELS[value]}
            </button>
          ))}
        </div>
      </div>

      {formData.requestType && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          {renderRequestTypeFields()}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSubmitting ? 'animate-pulse' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verzenden...
                </span>
              ) : (
                'Versturen'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RequestForm; 