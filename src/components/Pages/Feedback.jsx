import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import FeedbackForm from '../Feedback/FeedbackForm';
import Button from '../ui/Button';
import FeedbackDetails from '../Feedback/FeedbackDetails';
import FeedbackList from '../Feedback/FeedbackList';
import { useAppContext } from '../Context/AppContext';

const Feedback = () => {
  const { 
    customerFeedbacks, 
    addCustomerFeedback, 
    updateCustomerFeedback, 
    updateFeedbackStatus,
    deleteCustomerFeedback 
  } = useAppContext();
  
  const [showForm, setShowForm] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  
  const handleAddNew = () => {
    setEditingFeedback(null);
    setShowForm(true);
  };
  
  const handleEdit = (feedback) => {
    setViewingFeedback(null);
    setEditingFeedback(feedback);
    setShowForm(true);
  };
  
  const handleView = (feedback) => {
    setViewingFeedback(feedback);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer feedback?')) {
      deleteCustomerFeedback(id);
    }
  };
  
  const handleSubmit = (feedback) => {
    if (editingFeedback) {
      updateCustomerFeedback(editingFeedback.id, feedback);
    } else {
      addCustomerFeedback(feedback);
    }
    setShowForm(false);
    setEditingFeedback(null);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingFeedback(null);
  };
  
  const handleCloseDetails = () => {
    setViewingFeedback(null);
  };

  const handleStatusChange = (feedbackId, status) => {
    updateFeedbackStatus(feedbackId, status);
    if (viewingFeedback && viewingFeedback.id === feedbackId) {
      setViewingFeedback({ ...viewingFeedback, status });
    }
  };

  const handleUpdateResponse = (feedbackId, response) => {
    updateCustomerFeedback(feedbackId, { adminResponse: response });
    if (viewingFeedback && viewingFeedback.id === feedbackId) {
      setViewingFeedback({ ...viewingFeedback, adminResponse: response });
    }
  };
  
  return (
    <div className="space-y-6">
      {showForm ? (
        <FeedbackForm
          initialData={editingFeedback || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Customer Feedback</h2>
            <Button 
              onClick={handleAddNew}
              className="flex items-center"
            >
              <Plus size={18} className="mr-1" /> Add New Feedback
            </Button>
          </div>
          
          <FeedbackList
            feedbacks={customerFeedbacks}
            onViewDetails={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
      
      {viewingFeedback && (
        <FeedbackDetails
          feedback={viewingFeedback}
          onClose={handleCloseDetails}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onUpdateResponse={handleUpdateResponse}
        />
      )}
    </div>
  );
};

export default Feedback;