import React, { useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import Button from '../ui/Button';
import ReservationList from '../Reservations/ReservationList';
import ReservationForm from '../Reservations/ReservationForm';
import ReservationDetails from '../Reservations/ReservationDetails';
import { Plus } from 'lucide-react';

const Reservations = () => {
  const { reservations, addReservation, updateReservation, deleteReservation } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [viewingReservation, setViewingReservation] = useState(null);
  
  const handleAddNew = () => {
    setEditingReservation(null);
    setShowForm(true);
  };
  
  const handleEdit = (reservation) => {
    setViewingReservation(null);
    setEditingReservation(reservation);
    setShowForm(true);
  };
  
  const handleView = (reservation) => {
    setViewingReservation(reservation);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      deleteReservation(id);
    }
  };
  
  const handleSubmit = (reservation) => {
    if (editingReservation) {
      updateReservation(editingReservation.id, reservation);
    } else {
      addReservation(reservation);
    }
    setShowForm(false);
    setEditingReservation(null);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingReservation(null);
  };
  
  const handleCloseDetails = () => {
    setViewingReservation(null);
  };
  
  return (
    <div className="space-y-6">
      {showForm ? (
        <ReservationForm
          initialData={editingReservation || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Reservations</h2>
            <Button 
              onClick={handleAddNew}
              className="flex items-center"
            >
              <Plus size={18} className="mr-1" /> Add New Reservation
            </Button>
          </div>
          
          <ReservationList
            reservations={reservations}
            onViewDetails={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
      
      {viewingReservation && (
        <ReservationDetails
          reservation={viewingReservation}
          onClose={handleCloseDetails}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default Reservations;