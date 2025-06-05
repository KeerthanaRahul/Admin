import React, { useState } from 'react';
import Card from '../ui/Card';
import { ReservationStatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { Eye, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import Select from '../ui/Select';

const ReservationList = ({
  reservations,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  
  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'upcoming', label: 'Upcoming' }
  ];
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const filteredReservations = reservations.filter(reservation => {
    // Status filter
    if (statusFilter !== 'all' && reservation.status !== statusFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      if (dateFilter === 'today' && reservation.date !== today) {
        return false;
      }
      if (dateFilter === 'tomorrow' && reservation.date !== tomorrow) {
        return false;
      }
      if (dateFilter === 'upcoming' && reservation.date < today) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort by date and time
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  return (
    <Card title="Reservations">
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full sm:w-40"
          />
          <Select
            options={dateOptions}
            value={dateFilter}
            onChange={setDateFilter}
            className="w-full sm:w-40"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredReservations.length} {filteredReservations.length === 1 ? 'reservation' : 'reservations'} found
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Party Size
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedReservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.phone}</div>
                  <div className="text-sm text-gray-500">{reservation.email}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(reservation.date), 'MMM d, yyyy')}
                  </div>
                  <div className="text-sm text-gray-500">{reservation.time}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.partySize} people</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <ReservationStatusBadge status={reservation.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(reservation)}
                      className="flex items-center"
                    >
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(reservation)}
                      className="flex items-center"
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(reservation.id)}
                      className="flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            
            {sortedReservations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-sm text-gray-500 text-center">
                  No reservations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ReservationList;