import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <textarea
      id={id}
      {...props}
      className="input-field bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5
        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>
);

export default FormTextarea;
