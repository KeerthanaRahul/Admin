import React, { useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import OrderList from '../Orders/OrderList';
import OrderDetails from '../Orders/OrderDetails';

const Orders = () => {
  const { orders, updateOrderStatus, deleteOrder } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };
  
  const handleStatusChange = (orderId, status) => {
    updateOrderStatus(orderId, status);
  };
  
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId);
    }
  };
  
  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };
  
  return (
    <div>
      <OrderList
        orders={orders}
        onViewDetails={handleViewDetails}
        onStatusChange={handleStatusChange}
        onDeleteOrder={handleDeleteOrder}
      />
      
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={handleCloseDetails}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default Orders;