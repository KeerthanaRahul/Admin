import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialFoodItems, initialOrders, initialReservations } from '../data/mockData';
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
  
  const [reservations, setReservations] = useState(() => {
    const savedReservations = localStorage.getItem('reservations');
    return savedReservations ? JSON.parse(savedReservations) : initialReservations;
  });

  // Calculate dashboard stats based on current data
  const calculateDashboardStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter(order => 
      ['pending', 'preparing'].includes(order.status)).length;
    const completedOrders = orders.filter(order => 
      order.status === 'delivered').length;
    const totalReservations = reservations.length;
    const pendingReservations = reservations.filter(reservation => 
      reservation.status === 'pending').length;
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      totalReservations,
      pendingReservations
    };
  };

  const [dashboardStats, setDashboardStats] = useState(calculateDashboardStats());

  // Update dashboard stats whenever orders or reservations change
  useEffect(() => {
    setDashboardStats(calculateDashboardStats());
  }, [orders, reservations]);

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
  }, [foodItems]);
  
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);
  
  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

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

  // Reservations CRUD
  const addReservation = (reservation) => {
    const newReservation = { ...reservation, id: uuidv4() };
    setReservations([...reservations, newReservation]);
  };
  
  const updateReservation = (id, updatedReservation) => {
    setReservations(reservations.map(reservation => 
      reservation.id === id ? { ...reservation, ...updatedReservation } : reservation
    ));
  };
  
  const deleteReservation = (id) => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
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
      reservations,
      addReservation,
      updateReservation,
      deleteReservation,
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