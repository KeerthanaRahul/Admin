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
    <Card className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          
          {trend && (
            <div className="flex items-center">
              <span className={`text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
              <span className="ml-1 text-sm text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
          <div className="text-amber-700">{icon}</div>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;