import React from 'react';
import Card from '../ui/Card';

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  className = '',
}) => {
  return (
    <Card className={`${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          
          {trend && (
            <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
              <span className="ml-1 text-sm text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-amber-100 rounded-lg">
          <div className="text-amber-700">{icon}</div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;