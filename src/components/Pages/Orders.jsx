import React, { useEffect, useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';
import OrderForm from '../Orders/OrderForm';
import OrderList from '../Orders/OrderList';
import OrderDetails from '../Orders/OrderDetails';
import ErrorModal from '../ui/ErrorModal';
import SuccessModal from '../ui/SuccessModal';
import Loader from '../../CommonComponents/Loader/Loader';
import { v4 as uuidv4 } from 'uuid';

const Orders = () => {
  let apiUrl = 'http://localhost:8082/api/v1/orders';
  const { updateOrderStatus, deleteOrder } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAddOrderLoading, setIsAddOrderLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState('');
  const [isUpdateOrderLoading, setIsUpdateOrderLoading] = useState(false);
  const [isDeleteOrderLoading, setIsDeleteOrderLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  
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

  const getOrders = async() => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/getOrders`);
      const data = await res.json();
      setOrders(data?.orderList)
      } catch (error) {
      setOrdersError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  const addOrder = async (orderData) => {
    let payload = orderData;
    payload.id = uuidv4();
    setIsAddOrderLoading(true);
    try {
      const res = await fetch(`${apiUrl}/addOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if(!res.ok) {
        setErrorModal({
          isOpen: true,
          title: 'Add Failed',
          message: 'Failed to add the order. Please try again.',
          details: error instanceof Error ? res.statusText : 'Unknown error occurred'
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Order Added',
          message: `Order has been successfully added.`
        });
      }
      getOrders();
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Add Failed',
        message: 'Failed to add the order. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsAddOrderLoading(false)
    }
  }

  const updateOrder = async (id, order) => {
    let payload = order;
    payload.id = id;
    setIsUpdateOrderLoading(true);
    try {
      const res = await fetch(`${apiUrl}/editOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      getOrders();
      if(!res.ok) {
        setErrorModal({
          isOpen: true,
          title: 'Update Failed',
          message: 'Failed to update the order. Please try again.',
          details: error instanceof Error ? res.statusText : 'Unknown error occurred'
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Order Updated',
          message: `Order has been successfully updated.`
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Update Failed',
        message: 'Failed to update the order. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsUpdateOrderLoading(false)
    }
  }

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

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: '', message: '' });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: '', message: '' });
  };
  
  return (
    <div className="space-y-6">
      {(isLoading || isAddOrderLoading || isUpdateOrderLoading || isDeleteOrderLoading) && <Loader showLoader={(isLoading || isAddOrderLoading || isUpdateOrderLoading || isDeleteOrderLoading)} />}
      {showForm ? (
        <OrderForm
          initialData={editingOrder || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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
            ordersError={ordersError}
          />
        </>
      )}
      
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={handleCloseDetails}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
        />
      )}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        title={successModal.title}
        message={successModal.message}
      />
    </div>
  );
};

export default Orders;