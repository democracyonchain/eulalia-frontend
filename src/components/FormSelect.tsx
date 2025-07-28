import React from 'react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: { label: string; value: string }[];
}

const FormSelect: React.FC<FormSelectProps> = ({ label, id, options, ...props }) => (
  <div>
    <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <select
      id={id}
      {...props}
      className="input-field bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5
        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default FormSelect;
