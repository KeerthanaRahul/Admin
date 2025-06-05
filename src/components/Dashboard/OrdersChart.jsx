import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from '../ui/Card';
import { format, startOfDay, subDays, isWithinInterval } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrdersChart = ({ orders }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Orders',
        data: [],
        backgroundColor: 'rgba(121, 85, 72, 0.6)',
      },
      {
        label: 'Revenue ($)',
        data: [],
        backgroundColor: 'rgba(244, 128, 36, 0.6)',
      },
    ],
  });
  
  useEffect(() => {
    const days = 7;
    const today = startOfDay(new Date());
    const dateLabels = Array.from({ length: days }, (_, i) => {
      return format(subDays(today, i), 'MMM d');
    }).reverse();
    
    const orderCounts = Array(days).fill(0);
    const revenues = Array(days).fill(0);
    
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      
      for (let i = 0; i < days; i++) {
        const dayStart = startOfDay(subDays(today, days - 1 - i));
        const dayEnd = startOfDay(subDays(today, days - 2 - i));
        
        if (isWithinInterval(orderDate, { start: dayStart, end: dayEnd })) {
          orderCounts[i]++;
          revenues[i] += order.totalAmount;
        }
      }
    });
    
    setChartData({
      labels: dateLabels,
      datasets: [
        {
          label: 'Orders',
          data: orderCounts,
          backgroundColor: 'rgba(121, 85, 72, 0.6)',
        },
        {
          label: 'Revenue ($)',
          data: revenues.map(rev => parseFloat(rev.toFixed(2))),
          backgroundColor: 'rgba(244, 128, 36, 0.6)',
        },
      ],
    });
  }, [orders]);
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  return (
    <Card title="Orders & Revenue (Last 7 Days)">
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default OrdersChart;