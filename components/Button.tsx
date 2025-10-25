
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zanvexis-dark disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105";
  
  const variantClasses = {
    primary: "bg-zanvexis-primary hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-zanvexis-light hover:bg-gray-600 focus:ring-gray-500",
    accent: "bg-zanvexis-accent hover:bg-teal-600 focus:ring-teal-500",
  };

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
