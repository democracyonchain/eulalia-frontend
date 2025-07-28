import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        {label}
      </label>
      <input
        id={id}
        className="w-full p-2.5 border border-gray-300 rounded-lg"
        {...props}
      />
    </div>
  );
};

export default FormInput;