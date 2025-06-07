import React, { useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';
import OrderForm from '../Orders/OrderForm';
import OrderList from '../Orders/OrderList';

const Orders = () => {
  const { orders, addOrder, updateOrder, updateOrderStatus, deleteOrder } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setSelectedOrder(null);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingOrder(null);
    setShowForm(true);
  };
  
  const handleStatusChange = (orderId, status) => {
    updateOrderStatus(orderId, status);
    // Update the selected order if it's currently being viewed
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };
  
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const handleSubmit = (orderData) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, orderData);
    } else {
      addOrder(orderData);
    }
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOrder(null);
  };
  
  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };
  
  return (
    <div className="space-y-6">
      {showForm ? (
        <OrderForm
          initialData={editingOrder || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Orders Management</h2>
            <Button 
              onClick={handleAddNew}
              className="flex items-center"
            >
              <Plus size={18} className="mr-1" /> Create New Order
            </Button>
          </div>
          
          <OrderList
            orders={orders}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
            onDeleteOrder={handleDeleteOrder}
          />
        </>
      )}
      
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