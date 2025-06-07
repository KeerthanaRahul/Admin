import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialFoodItems, initialOrders, initialSupportTickets } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState(() => {
    const savedFoodItems = localStorage.getItem('foodItems');
    return savedFoodItems ? JSON.parse(savedFoodItems) : initialFoodItems;
  });
  
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : initialOrders;
  });
  
  const [supportTickets, setSupportTickets] = useState(() => {
    const savedTickets = localStorage.getItem('supportTickets');
    return savedTickets ? JSON.parse(savedTickets) : initialSupportTickets;
  });

  // Calculate dashboard stats based on current data
  const calculateDashboardStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter(order => 
      ['pending', 'preparing'].includes(order.status)).length;
    const completedOrders = orders.filter(order => 
      order.status === 'delivered').length;
    const totalSupportTickets = supportTickets.length;
    const pendingSupportTickets = supportTickets.filter(ticket => 
      ['open', 'in-progress'].includes(ticket.status)).length;
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      totalSupportTickets,
      pendingSupportTickets
    };
  };

  const [dashboardStats, setDashboardStats] = useState(calculateDashboardStats());

  // Update dashboard stats whenever orders or support tickets change
  useEffect(() => {
    setDashboardStats(calculateDashboardStats());
  }, [orders, supportTickets]);

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
  }, [foodItems]);
  
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);
  
  useEffect(() => {
    localStorage.setItem('supportTickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  // Food Items CRUD
  const addFoodItem = (foodItem) => {
    const newFoodItem = { ...foodItem, id: uuidv4() };
    setFoodItems([...foodItems, newFoodItem]);
  };
  
  const updateFoodItem = (id, updatedFoodItem) => {
    setFoodItems(foodItems.map(item => 
      item.id === id ? { ...item, ...updatedFoodItem } : item
    ));
  };
  
  const deleteFoodItem = (id) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  // Orders CRUD
  const addOrder = (order) => {
    const now = new Date().toISOString();
    const newOrder = { 
      ...order, 
      id: uuidv4(), 
      createdAt: now, 
      updatedAt: now 
    };
    setOrders([...orders, newOrder]);
  };
  
  const updateOrderStatus = (id, status) => {
    setOrders(orders.map(order => 
      order.id === id 
        ? { ...order, status, updatedAt: new Date().toISOString() } 
        : order
    ));
  };
  
  const deleteOrder = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  // Support Tickets CRUD
  const addSupportTicket = (ticket) => {
    const now = new Date().toISOString();
    const newTicket = { 
      ...ticket, 
      id: uuidv4(), 
      createdAt: now, 
      updatedAt: now 
    };
    setSupportTickets([...supportTickets, newTicket]);
  };
  
  const updateSupportTicket = (id, updatedTicket) => {
    setSupportTickets(supportTickets.map(ticket => 
      ticket.id === id 
        ? { ...ticket, ...updatedTicket, updatedAt: new Date().toISOString() } 
        : ticket
    ));
  };

  const updateSupportTicketStatus = (id, status) => {
    setSupportTickets(supportTickets.map(ticket => 
      ticket.id === id 
        ? { ...ticket, status, updatedAt: new Date().toISOString() } 
        : ticket
    ));
  };
  
  const deleteSupportTicket = (id) => {
    setSupportTickets(supportTickets.filter(ticket => ticket.id !== id));
  };

  return (
    <AppContext.Provider value={{
      foodItems,
      addFoodItem,
      updateFoodItem,
      deleteFoodItem,
      orders,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      supportTickets,
      addSupportTicket,
      updateSupportTicket,
      updateSupportTicketStatus,
      deleteSupportTicket,
      dashboardStats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};