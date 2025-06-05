import React from 'react';
import { useAppContext } from '../Context/AppContext';
import StatsCard from '../Dashboard/StatsCard';
import RecentOrders from '../Dashboard/RecentOrders';
import RecentReservations from '../Dashboard/RecentReservations';
import OrdersChart from '../Dashboard/OrdersChart';
import { ShoppingBag, DollarSign, Clock, CheckCircle, Calendar, Users } from 'lucide-react';

const Dashboard = () => {
  const { orders, reservations, dashboardStats } = useAppContext();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Orders"
          value={dashboardStats.totalOrders}
          icon={<ShoppingBag size={24} />}
          trend={{ value: 12, label: 'vs last week', positive: true }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${dashboardStats.totalRevenue.toFixed(2)}`}
          icon={<DollarSign size={24} />}
          trend={{ value: 8, label: 'vs last week', positive: true }}
        />
        <StatsCard
          title="Pending Orders"
          value={dashboardStats.pendingOrders}
          icon={<Clock size={24} />}
        />
        <StatsCard
          title="Completed Orders"
          value={dashboardStats.completedOrders}
          icon={<CheckCircle size={24} />}
          trend={{ value: 5, label: 'vs last week', positive: true }}
        />
        <StatsCard
          title="Reservations"
          value={dashboardStats.totalReservations}
          icon={<Calendar size={24} />}
        />
        <StatsCard
          title="Pending Reservations"
          value={dashboardStats.pendingReservations}
          icon={<Users size={24} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={orders} />
        <RecentReservations reservations={reservations} />
      </div>
      
      <OrdersChart orders={orders} />
    </div>
  );
};

export default Dashboard;