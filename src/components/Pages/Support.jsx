import React, { useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import { Plus } from 'lucide-react';
import SupportTicketForm from '../Support/SupportTicketForm';
import SupportTicketList from '../Support/SupportTicketList';
import SupportTicketDetails from '../Support/SupportTicketDetails';
import Button from '../ui/Button';

const Support = () => {
  const { 
    supportTickets, 
    addSupportTicket, 
    updateSupportTicket, 
    updateSupportTicketStatus,
    deleteSupportTicket 
  } = useAppContext();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [viewingTicket, setViewingTicket] = useState(null);
  
  const handleAddNew = () => {
    setEditingTicket(null);
    setShowForm(true);
  };
  
  const handleEdit = (ticket) => {
    setViewingTicket(null);
    setEditingTicket(ticket);
    setShowForm(true);
  };
  
  const handleView = (ticket) => {
    setViewingTicket(ticket);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this support ticket?')) {
      deleteSupportTicket(id);
    }
  };
  
  const handleSubmit = (ticket) => {
    if (editingTicket) {
      updateSupportTicket(editingTicket.id, ticket);
    } else {
      addSupportTicket(ticket);
    }
    setShowForm(false);
    setEditingTicket(null);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingTicket(null);
  };
  
  const handleCloseDetails = () => {
    setViewingTicket(null);
  };

  const handleStatusChange = (ticketId, status) => {
    updateSupportTicketStatus(ticketId, status);
    // Update the viewing ticket if it's currently being viewed
    if (viewingTicket && viewingTicket.id === ticketId) {
      setViewingTicket({ ...viewingTicket, status });
    }
  };
  
  return (
    <div className="space-y-6">
      {showForm ? (
        <SupportTicketForm
          initialData={editingTicket || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Customer Support</h2>
            <Button 
              onClick={handleAddNew}
              className="flex items-center"
            >
              <Plus size={18} className="mr-1" /> Create New Ticket
            </Button>
          </div>
          
          <SupportTicketList
            tickets={supportTickets}
            onViewDetails={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
      
      {viewingTicket && (
        <SupportTicketDetails
          ticket={viewingTicket}
          onClose={handleCloseDetails}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default Support;