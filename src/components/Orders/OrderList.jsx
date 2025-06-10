import React, { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Trash2, Edit } from 'lucide-react';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Card from '../ui/Card';

const OrderList = ({
  orders,
  onViewDetails,
  onEdit,
  onStatusChange,
  onDeleteOrder,
  ordersError,
  onCancelOrder,
  onReOrder
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
  ];
  
  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );
  
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
  
  const handleStatusChange = (orderId, newStatus) => {
    onStatusChange(orderId, newStatus);
  };

  function convertSecondsToDate(seconds) {
    const milliseconds = seconds * 1000;
    const date = new Date(milliseconds);
    return date.toDateString();
  }
  
  return (
    <Card title="Orders">
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full sm:w-40"
          />
          <Select
            options={sortOptions}
            value={sortOrder}
            onChange={(value) => setSortOrder(value)}
            className="w-full sm:w-40"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Table
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
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
            {sortedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-amber-700">
                    {order.id.substring(0, 8)}...
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Table {order.tableNumber}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {convertSecondsToDate(order.createdAt?._seconds)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {convertSecondsToDate(order.createdAt?._seconds)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(order)}
                      className="flex items-center"
                    >
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                    { (order.status !== 'delivered' && order.status !== 'ready' && order.status !== 'cancelled') && <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(order)}
                      className="flex items-center"
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Button> }
                    { (order.status !== 'delivered' && order.status !== 'ready' && order.status !== 'cancelled') && <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeleteOrder(order.id)}
                      className="flex items-center"
                      style={{ display: 'none' }}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button> }
                    {(order.status !== 'delivered' && order.status !== 'cancelled') && <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onCancelOrder(order.id)}
                      className="flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Cancel
                    </Button>}
                    {(order.status === 'delivered' || order.status === 'cancelled') && <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onReOrder(order)}
                      className="flex items-center"
                    >
                      <Edit size={16} className="mr-1" /> Re-Order
                    </Button>}
                  </div>
                </td>
              </tr>
            ))}
            
            {ordersError?.length > 0 || sortedOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-sm text-gray-500 text-center">
                  {ordersError?.length > 0 ? ordersError : 'No orders found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default OrderList;