import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';

const ReservationForm = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [status, setStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName);
      setEmail(initialData.email);
      setPhone(initialData.phone);
      setDate(initialData.date);
      setTime(initialData.time);
      setPartySize(initialData.partySize.toString());
      setStatus(initialData.status);
      setNotes(initialData.notes);
    } else {
      // Set default date to tomorrow for new reservations
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setTime('18:00');
    }
  }, [initialData]);
  
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  
  const validateForm = () => {
    const newErrors= {};
    
    if (!customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    if (!time) {
      newErrors.time = 'Time is required';
    }
    
    if (!partySize || parseInt(partySize) < 1) {
      newErrors.partySize = 'Valid party size is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      customerName,
      email,
      phone,
      date,
      time,
      partySize: parseInt(partySize),
      status,
      notes,
    });
  };
  
  return (
    <Card title={initialData ? 'Edit Reservation' : 'Add New Reservation'}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Guest Name"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Full name"
            error={errors.customerName}
            fullWidth
          />
          
          <Input
            label="Phone Number"
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            error={errors.phone}
            fullWidth
          />
        </div>
        
        <Input
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          error={errors.email}
          fullWidth
          className="mb-4"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Date"
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
            fullWidth
          />
          
          <Input
            label="Time"
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            error={errors.time}
            fullWidth
          />
          
          <Input
            label="Party Size"
            id="partySize"
            type="number"
            min="1"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            error={errors.partySize}
            fullWidth
          />
        </div>
        
        <Select
          label="Status"
          id="status"
          value={status}
          onChange={(value) => setStatus(value)}
          options={statusOptions}
          className="mb-4"
          fullWidth
        />
        
        <TextArea
          label="Special Requests or Notes"
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests or notes for this reservation"
          rows={3}
          fullWidth
          className="mb-4"
        />
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Reservation' : 'Create Reservation'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReservationForm;