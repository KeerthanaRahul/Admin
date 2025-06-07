import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';


const SupportTicketForm = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [problemType, setProblemType] = useState('other');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('open');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName);
      setEmail(initialData.email);
      setTableNumber(initialData.tableNumber);
      setProblemType(initialData.problemType);
      setPriority(initialData.priority);
      setStatus(initialData.status);
      setDescription(initialData.description);
    }
  }, [initialData]);
  
  const problemTypeOptions = [
    { value: 'food-quality', label: 'Food Quality' },
    { value: 'service', label: 'Service' },
    { value: 'billing', label: 'Billing' },
    { value: 'cleanliness', label: 'Cleanliness' },
    { value: 'other', label: 'Other' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!tableNumber.trim()) {
      newErrors.tableNumber = 'Table number is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Problem description is required';
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
      tableNumber,
      problemType,
      priority,
      status,
      description,
    });
  };
  
  return (
    <Card title={initialData ? 'Edit Support Ticket' : 'Create New Support Ticket'}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Customer Name"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Full name"
            error={errors.customerName}
            fullWidth
          />
          
          <Input
            label="Table Number"
            id="tableNumber"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Table number"
            error={errors.tableNumber}
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
          <Select
            label="Problem Type"
            id="problemType"
            value={problemType}
            onChange={(value) => setProblemType(value)}
            options={problemTypeOptions}
            fullWidth
          />
          
          <Select
            label="Priority Level"
            id="priority"
            value={priority}
            onChange={(value) => setPriority(value)}
            options={priorityOptions}
            fullWidth
          />
          
          <Select
            label="Status"
            id="status"
            value={status}
            onChange={(value) => setStatus(value)}
            options={statusOptions}
            fullWidth
          />
        </div>
        
        <TextArea
          label="Problem Description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please describe the problem in detail..."
          rows={4}
          error={errors.description}
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
            {initialData ? 'Update Ticket' : 'Create Ticket'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SupportTicketForm;