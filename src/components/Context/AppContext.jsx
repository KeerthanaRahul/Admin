import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialFoodItems, initialOrders, initialSupportTickets, initialCustomerFeedbacks } from '../data/mockData';
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

  const [customerFeedbacks, setCustomerFeedbacks] = useState(() => {
    const savedFeedbacks = localStorage.getItem('customerFeedbacks');
    return savedFeedbacks ? JSON.parse(savedFeedbacks) : initialCustomerFeedbacks;
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
    
    // Feedback stats
    const totalFeedbacks = customerFeedbacks.length;
    const averageRating = totalFeedbacks > 0 
      ? customerFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedbacks 
      : 0;
    const recommendationRate = totalFeedbacks > 0 
      ? (customerFeedbacks.filter(feedback => feedback.wouldRecommend).length / totalFeedbacks) * 100 
      : 0;
    const newFeedbacks = customerFeedbacks.filter(feedback => feedback.status === 'new').length;
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      totalSupportTickets,
      pendingSupportTickets,
      totalFeedbacks,
      averageRating,
      recommendationRate,
      newFeedbacks
    };
  };

  const [dashboardStats, setDashboardStats] = useState(calculateDashboardStats());

  // Update dashboard stats whenever data changes
  useEffect(() => {
    setDashboardStats(calculateDashboardStats());
  }, [orders, supportTickets, customerFeedbacks]);

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

  useEffect(() => {
    localStorage.setItem('customerFeedbacks', JSON.stringify(customerFeedbacks));
  }, [customerFeedbacks]);

  // Food Items CRUD with error handling
  const addFoodItem = async (foodItem) => {
    try {
      // Simulate potential validation errors
      if (!foodItem.name || !foodItem.description || !foodItem.price) {
        throw new Error('Missing required fields: name, description, and price are required');
      }
      
      if (foodItem.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      // Check for duplicate names
      const existingItem = foodItems.find(item => 
        item.name.toLowerCase() === foodItem.name.toLowerCase()
      );
      if (existingItem) {
        throw new Error(`A menu item with the name "${foodItem.name}" already exists`);
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate random network error (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Network error: Unable to connect to server');
      }

      const newFoodItem = { ...foodItem, id: uuidv4() };
      setFoodItems([...foodItems, newFoodItem]);
    } catch (error) {
      throw error;
    }
  };
  
  const updateFoodItem = async (id, updatedFoodItem) => {
    try {
      const existingItem = foodItems.find(item => item.id === id);
      if (!existingItem) {
        throw new Error('Menu item not found');
      }

      // Validate updated data
      if (updatedFoodItem.name && !updatedFoodItem.name.trim()) {
        throw new Error('Name cannot be empty');
      }

      if (updatedFoodItem.price !== undefined && updatedFoodItem.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      // Check for duplicate names (excluding current item)
      if (updatedFoodItem.name) {
        const duplicateItem = foodItems.find(item => 
          item.id !== id && item.name.toLowerCase() === updatedFoodItem.name.toLowerCase()
        );
        if (duplicateItem) {
          throw new Error(`A menu item with the name "${updatedFoodItem.name}" already exists`);
        }
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate random network error (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Network error: Unable to connect to server');
      }

      setFoodItems(foodItems.map(item => 
        item.id === id ? { ...item, ...updatedFoodItem } : item
      ));
    } catch (error) {
      throw error;
    }
  };
  
  const deleteFoodItem = async (id) => {
    try {
      const existingItem = foodItems.find(item => item.id === id);
      if (!existingItem) {
        throw new Error('Menu item not found');
      }

      // Check if item is referenced in any orders
      const referencedInOrders = orders.some(order => 
        order.items.some(item => item.foodId === id)
      );
      
      if (referencedInOrders) {
        throw new Error('Cannot delete this item as it is referenced in existing orders');
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate random network error (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Network error: Unable to connect to server');
      }

      setFoodItems(foodItems.filter(item => item.id !== id));
    } catch (error) {
      throw error;
    }
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

  const updateOrder = (id, updatedOrder) => {
    setOrders(orders.map(order => 
      order.id === id 
        ? { ...order, ...updatedOrder, updatedAt: new Date().toISOString() } 
        : order
    ));
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

  // Customer Feedbacks CRUD
  const addCustomerFeedback = (feedback) => {
    const now = new Date().toISOString();
    const newFeedback = { 
      ...feedback, 
      id: uuidv4(), 
      createdAt: now, 
      updatedAt: now 
    };
    setCustomerFeedbacks([...customerFeedbacks, newFeedback]);
  };
  
  const updateCustomerFeedback = (id, updatedFeedback) => {
    setCustomerFeedbacks(customerFeedbacks.map(feedback => 
      feedback.id === id 
        ? { ...feedback, ...updatedFeedback, updatedAt: new Date().toISOString() } 
        : feedback
    ));
  };

  const updateFeedbackStatus = (id, status) => {
    setCustomerFeedbacks(customerFeedbacks.map(feedback => 
      feedback.id === id 
        ? { ...feedback, status, updatedAt: new Date().toISOString() } 
        : feedback
    ));
  };
  
  const deleteCustomerFeedback = (id) => {
    setCustomerFeedbacks(customerFeedbacks.filter(feedback => feedback.id !== id));
  };

  return (
    <AppContext.Provider value={{
      foodItems,
      addFoodItem,
      updateFoodItem,
      deleteFoodItem,
      orders,
      addOrder,
      updateOrder,
      updateOrderStatus,
      deleteOrder,
      supportTickets,
      addSupportTicket,
      updateSupportTicket,
      updateSupportTicketStatus,
      deleteSupportTicket,
      customerFeedbacks,
      addCustomerFeedback,
      updateCustomerFeedback,
      updateFeedbackStatus,
      deleteCustomerFeedback,
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