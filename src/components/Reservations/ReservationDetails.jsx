import React from 'react';
import Card from '../ui/Card';
import { ReservationStatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { format } from 'date-fns';
import { X, User, Phone, Mail, Calendar, Clock, Users, MessageSquare } from 'lucide-react';

const ReservationDetails = ({
  reservation,
  onClose,
  onEdit,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto\" aria-labelledby="modal-title\" role="dialog\" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity\" aria-hidden="true\" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X size={20} />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Reservation Details
                  </h3>
                  <ReservationStatusBadge status={reservation.status} />
                </div>
                
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Guest Name</p>
                        <p className="text-sm text-gray-900">{reservation.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{reservation.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{reservation.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="text-sm text-gray-900">
                          {format(new Date(reservation.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Time</p>
                        <p className="text-sm text-gray-900">{reservation.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Party Size</p>
                        <p className="text-sm text-gray-900">{reservation.partySize} people</p>
                      </div>
                    </div>
                    
                    {reservation.notes && (
                      <div className="flex items-start">
                        <MessageSquare size={18} className="text-amber-600 mr-2 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Special Requests/Notes</p>
                          <p className="text-sm text-gray-900">{reservation.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              variant="primary"
              onClick={() => onEdit(reservation)}
              className="w-full sm:w-auto sm:ml-3"
            >
              Edit Reservation
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full mt-3 sm:mt-0 sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;