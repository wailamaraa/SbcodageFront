import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  titleClassName?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  titleClassName = '',
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${titleClassName}`}>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Card;