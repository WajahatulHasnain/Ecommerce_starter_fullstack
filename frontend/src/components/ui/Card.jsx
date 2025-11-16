import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false,
  ...props 
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200
        ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${padding} ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
