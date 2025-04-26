"use client";

import { useState } from "react";

interface StepPersonalInfoProps {
  onNext: () => void;
  onPrev: () => void;
  formData: {
    name: string;
    country: string;
    [key: string]: string | string[] | boolean;
  };
  updateFormData: (data: { name: string; country: string }) => void;
}

export default function StepPersonalInfo({
  onNext,
  onPrev,
  formData,
  updateFormData,
}: StepPersonalInfoProps) {
  const [errors, setErrors] = useState<{
    name?: string;
    country?: string;
  }>({});
  
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const countries = [
    { code: "", name: "Select your country" },
    { code: "us", name: "United States" },
    { code: "uk", name: "United Kingdom" },
    { code: "ca", name: "Canada" },
    { code: "au", name: "Australia" },
    { code: "in", name: "India" },
    { code: "jp", name: "Japan" },
    { code: "cn", name: "China" },
    { code: "br", name: "Brazil" },
    { code: "fr", name: "France" },
    { code: "de", name: "Germany" },
    { code: "mx", name: "Mexico" },
    { code: "kr", name: "South Korea" },
    { code: "sa", name: "Saudi Arabia" },
    { code: "ru", name: "Russia" },
    { code: "sg", name: "Singapore" },
    { code: "es", name: "Spain" },
    { code: "it", name: "Italy" },
    // Add more countries as needed
  ];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFormData({ ...formData, name: value });
    
    if (value.trim()) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    updateFormData({ ...formData, country: countryCode });
    setIsCountryOpen(false);
    
    if (countryCode) {
      setErrors(prev => ({ ...prev, country: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; country?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }
    
    if (!formData.country) {
      newErrors.country = "Please select your country";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const getSelectedCountryName = () => {
    const found = countries.find(country => country.code === formData.country);
    return found ? found.name : "Select your country";
  };

  return (
    <div className="py-8 px-6 sm:px-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Tell us about yourself
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          This information helps us tailor your experience
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              className={`block w-full px-4 py-3 border ${
                errors.name ? "border-red-300 ring-1 ring-red-300" : "border-gray-300"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-150 ease-in-out`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <div className="mt-1 relative">
            <button
              type="button"
              className={`relative w-full bg-white border ${
                errors.country ? "border-red-300 ring-1 ring-red-300" : "border-gray-300"
              } rounded-md shadow-sm pl-4 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-150 ease-in-out`}
              onClick={() => setIsCountryOpen(!isCountryOpen)}
            >
              <span className={`block truncate ${formData.country ? 'text-gray-900' : 'text-gray-400'}`}>
                {getSelectedCountryName()}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            
            {isCountryOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                <div className="rounded-md">
                  {countries.filter(country => country.code !== "").map((country) => (
                    <div
                      key={country.code}
                      onClick={() => handleCountrySelect(country.code)}
                      className={`${
                        formData.country === country.code ? 'bg-indigo-100 text-indigo-700' : 'text-gray-900'
                      } cursor-pointer select-none relative py-3 pl-4 pr-9 transition duration-150 ease-in-out hover:bg-indigo-50`}
                    >
                      <span className="block truncate font-medium">
                        {country.name}
                      </span>
                      {formData.country === country.code && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {errors.country && (
              <p className="mt-2 text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Continue
        </button>
      </div>
    </div>
  );
} 