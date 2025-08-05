const VehicleInfo = ({ data, onChange }) => {
  const fields = [
    { 
      name: 'brand', 
      label: 'Merk', 
      type: 'text', 
      required: true,
      placeholder: 'BMW'
    },
    { 
      name: 'model', 
      label: 'Model', 
      type: 'text', 
      required: true,
      placeholder: '3-serie'
    },
    { 
      name: 'year', 
      label: 'Bouwjaar', 
      type: 'number', 
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
      placeholder: '2023'
    },
    { 
      name: 'mileage', 
      label: 'Kilometerstand', 
      type: 'number', 
      required: true,
      min: 0,
      placeholder: '50000'
    },
    { 
      name: 'price', 
      label: 'Prijs', 
      type: 'number', 
      required: true,
      min: 0,
      placeholder: '25000'
    }
  ];

  const handleInputChange = (name, value) => {
    // Basis validatie
    if (name === 'year') {
      const year = parseInt(value);
      if (year < 1900) value = '1900';
      if (year > new Date().getFullYear()) value = new Date().getFullYear().toString();
    }
    
    if (name === 'mileage' || name === 'price') {
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        Voertuiggegevens
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
              {name === 'price' && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
              )}
              {name === 'mileage' && (
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
            {name === 'year' && (
              <p className="mt-1 text-xs text-gray-500">
                Tussen {min} en {max}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleInfo; 