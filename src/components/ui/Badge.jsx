import React from 'react';

const Badge = ({ 
  variant = 'primary', 
  children, 
  className = '' 
}) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-gray-100 text-gray-800',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const OrderStatusBadge = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'ready': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  };
  
  const getLabel = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
};

export const ReservationStatusBadge = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  };
  
  const getLabel = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
};

export default Badge;