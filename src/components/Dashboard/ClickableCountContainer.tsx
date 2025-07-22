import React from 'react';

interface Props {
  icon: React.ReactNode;
  count: number;
  title: string;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

const ClickableCountContainer: React.FC<Props> = ({
  icon,
  count,
  title,
  iconBgColor = 'bg-yellow-100',
  iconColor = 'text-yellow-500',
  className = '',
}) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 flex items-center gap-4 w-full h-full max-w-sm hover:cursor-pointer transition hover:scale-[1.01] ${className}`}
    >
      <div className={`p-6 rounded-full text-5xl ${iconBgColor} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-semibold">{count.toLocaleString()}</h2>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};

export default ClickableCountContainer;
