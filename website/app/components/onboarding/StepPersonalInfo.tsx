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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateFormData({ ...formData, country: value });
    
    if (value) {
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

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Tell us about yourself
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          This information helps us tailor your experience
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Your name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.name ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <div className="mt-1">
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleCountryChange}
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.country ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue
        </button>
      </div>
    </div>
  );
} 