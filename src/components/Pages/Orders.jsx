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
import ConfirmationModal from '../ui/ConfirmationModal';

const Orders = () => {
  let apiUrl = 'http://localhost:8082/api/v1/orders';
  const { updateOrderStatus } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReOrder, setSelectedReOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAddOrderLoading, setIsAddOrderLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState('');
  const [isUpdateOrderLoading, setIsUpdateOrderLoading] = useState(false);
  const [isDeleteOrderLoading, setIsDeleteOrderLoading] = useState(false);
  const [isCancelOrderLoading, setIsCancelOrderLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, item: null });
  
  
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
    const item = orders.find(item => item.id === orderId);
    if (item) {
      setDeleteModal({ isOpen: true, item });
    }
  };

  const handleCancelOrder = orderId => {
    const item = orders.find(item => item.id === orderId);
    if (item) {
      setCancelModal({ isOpen: true, item });
    }
  }

  const deleteOrder = async(id) => {
    let payload = { id };
    setIsDeleteOrderLoading(true);
    try {
      const res = await fetch(`${apiUrl}/deleteOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if(!res.ok) {
        setErrorModal({
          isOpen: true,
          title: 'Delete Failed',
          message: 'Failed to delete the order. Please try again.',
          details: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Order Deleted',
          message: `Order has been successfully removed.`
        });
      }
      getOrders();
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Delete Failed',
        message: 'Failed to delete the order. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsDeleteOrderLoading(false)
    }
  }

  const cancelOrder = async (id) => {
    let payload = { id };
    setIsCancelOrderLoading(true);
    try {
      const res = await fetch(`${apiUrl}/cancelOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if(!res.ok) {
        setErrorModal({
          isOpen: true,
          title: 'Cancel Order Failed',
          message: 'Failed to cancel the order. Please try again.',
          details: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Order Cancelled',
          message: `Order has been successfully cancelled.`
        });
      }
      getOrders();
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Delete Failed',
        message: 'Failed to delete the order. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsCancelOrderLoading(false)
    }
  }

  const confirmDelete = () => {
    if (deleteModal.item) {
      deleteOrder(deleteModal.item.id);
      setDeleteModal({ isOpen: false, item: null });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, item: null });
  };

  const confirmCancel = () => {
    if (cancelModal.item) {
      cancelOrder(cancelModal.item.id);
      setCancelModal({ isOpen: false, item: null });
    }
  };

  const closeCancelModal = () => {
    setCancelModal({ isOpen: false, item: null });
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
    payload.from = 'admin';
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
        const data = await res.json();
        window.location.href = data?.data?.link_url;
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

  const handleReOrder = order => {
    setSelectedReOrder(order);
  }

  const confirmReOrder = () => {
    if (selectedReOrder) {
      let orderData = {
        ...selectedReOrder,
        status: 'pending'
      }
      addOrder(orderData)
      setSelectedReOrder(null);
    }
  };

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
    setSelectedReOrder(null);
  };

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: '', message: '' });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: '', message: '' });
  };
  
  return (
    <div className="space-y-6">
      {(isLoading || isAddOrderLoading || isUpdateOrderLoading || isDeleteOrderLoading || isCancelOrderLoading) && <Loader showLoader={(isLoading || isAddOrderLoading || isUpdateOrderLoading || isDeleteOrderLoading || isCancelOrderLoading)} />}
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
            onCancelOrder={handleCancelOrder}
            onReOrder={handleReOrder}
            ordersError={ordersError}
          />
        </>
      )}
      
      {(selectedOrder || selectedReOrder) && (
        <OrderDetails
          order={selectedReOrder || selectedOrder}
          onClose={handleCloseDetails}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          reOrder={selectedReOrder ? true : false}
          selectedReOrder={selectedReOrder}
          onReOrder={confirmReOrder}
        />
      )}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Order"
        message={
          deleteModal.item 
            ? `Are you sure you want to delete this order? This action cannot be undone and will remove the order permanently.`
            : ''
        }
        confirmText="Delete Order"
        cancelText="Cancel"
        type="danger"
      />
      <ConfirmationModal
        isOpen={cancelModal.isOpen}
        onClose={closeCancelModal}
        onConfirm={confirmCancel}
        title="Cancel Order"
        message={
          cancelModal.item 
            ? `Are you sure you want to cancel this order? This action cannot be undone and will cancel the order permanently.`
            : ''
        }
        confirmText="Cancel Order"
        cancelText="Close"
        type="danger"
      />
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