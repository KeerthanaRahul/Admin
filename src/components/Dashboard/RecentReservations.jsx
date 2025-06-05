import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import { ReservationStatusBadge } from '../ui/Badge';
import { format } from 'date-fns';
import Button from '../ui/Button';

const RecentReservations = ({ reservations }) => {
  const navigate = useNavigate();
  const sortedReservations = [...reservations]
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);
  
  return (
    <Card 
      title="Upcoming Reservations" 
      subtitle="Next 5 upcoming reservations"
      footer={
        <div className="text-right">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/reservations')}
          >
            View All Reservations
          </Button>
        </div>
      }
    >
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Party Size
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedReservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                  <div className="text-sm text-gray-500">{reservation.phone}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(reservation.date), 'MMM d, yyyy')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {reservation.time}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.partySize} people</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <ReservationStatusBadge status={reservation.status} />
                </td>
              </tr>
            ))}
            
            {sortedReservations.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-sm text-gray-500 text-center">
                  No upcoming reservations
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentReservations;