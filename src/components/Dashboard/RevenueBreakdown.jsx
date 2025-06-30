import React from 'react';
import Card from '../ui/Card';
import { DollarSign, TrendingUp, Calendar, Target, BarChart3 } from 'lucide-react';
import { format, startOfDay, subDays, isWithinInterval } from 'date-fns';

function convertSecondsToDate(seconds) {
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);
  return date.toDateString();
}

const RevenueBreakdown = ({ orders }) => {
  // Calculate daily revenue for the last 7 days
  const today = startOfDay(new Date());
  const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const dayRevenue = orders
      .filter(order => {
        const orderDate = new Date(convertSecondsToDate(order.createdAt?._seconds));
        return isWithinInterval(orderDate, { 
          start: date, 
          end: new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1) 
        });
      })
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    return {
      date: format(date, 'MMM d'),
      revenue: dayRevenue
    };
  });

  // Calculate revenue metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const todayRevenue = dailyRevenue[6]?.revenue || 0;
  const yesterdayRevenue = dailyRevenue[5]?.revenue || 0;
  const revenueChange = yesterdayRevenue > 0 
    ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
    : 0;

  // Calculate average order value
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Calculate peak revenue day
  const peakDay = dailyRevenue.reduce((max, day) => 
    day.revenue > max.revenue ? day : max, dailyRevenue[0] || { date: 'N/A', revenue: 0 }
  );

  // Calculate revenue growth (comparing first 3 days vs last 3 days)
  const firstHalfRevenue = dailyRevenue.slice(0, 3).reduce((sum, day) => sum + day.revenue, 0);
  const secondHalfRevenue = dailyRevenue.slice(4, 7).reduce((sum, day) => sum + day.revenue, 0);
  const weeklyGrowth = firstHalfRevenue > 0 
    ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100 
    : 0;

  return (
    <Card 
      title="Revenue Analytics" 
      subtitle="Comprehensive revenue insights and trends"
      className="bg-gradient-to-br from-green-50 to-emerald-50"
    >
      <div className="space-y-6">
        {/* Key Revenue Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <p className="text-lg font-bold text-green-600">₹{totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-600">Total Revenue</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <p className="text-lg font-bold text-blue-600">₹{todayRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-600">Today's Revenue</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <Target size={20} className="text-purple-600" />
            </div>
            <p className="text-lg font-bold text-purple-600">₹{avgOrderValue.toFixed(2)}</p>
            <p className="text-xs text-gray-600">Avg Order Value</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp size={20} className={weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'} />
            </div>
            <p className={`text-lg font-bold ${weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {weeklyGrowth >= 0 ? '+' : ''}{weeklyGrowth.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600">Weekly Growth</p>
          </div>
        </div>

        {/* Revenue Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <BarChart3 size={16} className="mr-2 text-green-600" />
              Peak Performance
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Best Day</span>
                <span className="text-sm font-medium text-gray-900">{peakDay.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peak Revenue</span>
                <span className="text-sm font-medium text-green-600">₹{peakDay.revenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Daily Change</span>
                <span className={`text-sm font-medium ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Target size={16} className="mr-2 text-blue-600" />
              Revenue Targets
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Daily Target</span>
                <span className="text-sm font-medium text-gray-900">₹500.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Achievement</span>
                <span className={`text-sm font-medium ${todayRevenue >= 500 ? 'text-green-600' : 'text-amber-600'}`}>
                  {((todayRevenue / 500) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    todayRevenue >= 500 ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min((todayRevenue / 500) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Revenue Trend */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-3">7-Day Revenue Trend</h4>
          <div className="space-y-2">
            {dailyRevenue.map((day, index) => {
              const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue));
              const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              const isToday = index === dailyRevenue.length - 1;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className={`text-sm w-16 ${isToday ? 'font-medium text-green-600' : 'text-gray-600'}`}>
                    {day.date}
                  </span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isToday ? 'bg-green-600' : 'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-sm w-16 text-right ${isToday ? 'font-bold text-green-600' : 'font-medium text-gray-900'}`}>
                    ${day.revenue.toFixed(0)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RevenueBreakdown;