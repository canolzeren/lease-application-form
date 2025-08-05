const FinancialInfo = ({ data, onChange, showFields }) => {
  const allFields = [
    { 
      name: 'monthlyBudget', 
      label: 'Maandbudget', 
      type: 'number', 
      required: true,
      min: 0,
      placeholder: '500'
    },
    { 
      name: 'downPayment', 
      label: 'Aanbetaling', 
      type: 'number', 
      required: false,
      min: 0,
      placeholder: '5000'
    },
    { 
      name: 'leaseTerm', 
      label: 'Leaseperiode (maanden)', 
      type: 'number', 
      required: false,
      min: 12,
      max: 60,
      placeholder: '36'
    },
    { 
      name: 'annualMileage', 
      label: 'Jaarlijks aantal kilometers', 
      type: 'number', 
      required: false,
      min: 0,
      placeholder: '15000'
    }
  ];

  const fields = allFields.filter(field => showFields.includes(field.name));

  const handleInputChange = (name, value) => {
    // Basis validatie
    if (name === 'leaseTerm') {
      const months = parseInt(value);
      if (months < 12) value = '12';
      if (months > 60) value = '60';
    }
    
    if (name === 'monthlyBudget' || name === 'downPayment' || name === 'annualMileage') {
      // Verwijder negatieve waarden
      if (parseInt(value) < 0) value = '0';
    }

    onChange(name, value);
  };

  const formatNumber = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('nl-NL').format(value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Financiële gegevens
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ name, label, type, required, min, max, placeholder }) => (
          <div key={name} className="col-span-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type={type}
                id={name}
                name={name}
                value={data[name]}
                onChange={(e) => handleInputChange(name, e.target.value)}
                required={required}
                min={min}
                max={max}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {name === 'monthlyBudget' && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€/mnd</span>
                </div>
              )}
              {name === 'downPayment' && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
              )}
              {name === 'annualMileage' && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">km</span>
                </div>
              )}
              {required && data[name] && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            {name === 'leaseTerm' && (
              <p className="mt-1 text-xs text-gray-500">
                Tussen {min} en {max} maanden
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialInfo; 