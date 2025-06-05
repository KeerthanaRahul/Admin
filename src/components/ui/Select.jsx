import React from 'react';

const Select = ({
  label,
  options,
  error,
  fullWidth = false,
  onChange,
  className = '',
  ...props
}) => {
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500';
  
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div className={`mb-4 ${widthClass}`}>
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <select
        className={`shadow-sm bg-gray-50 border ${errorClass} rounded-md focus:ring-2 focus:ring-opacity-50 py-2 px-3 text-gray-700 ${className}`}
        onChange={handleChange}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;