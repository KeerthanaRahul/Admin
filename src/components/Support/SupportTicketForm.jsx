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
  const [customerEmail, setCustomerEmail] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [problemType, setProblemType] = useState('other');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('open');
  const [problemDesc, setProblemDesc] = useState('');
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName);
      setCustomerEmail(initialData.customerEmail);
      setTableNumber(initialData.tableNumber);
      setProblemType(initialData.problemType);
      setPriority(initialData.priority);
      setStatus(initialData.status);
      setProblemDesc(initialData.problemDesc);
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
    
    if (!customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      newErrors.customerEmail = 'Email is invalid';
    }
    
    if (!tableNumber.trim()) {
      newErrors.tableNumber = 'Table number is required';
    }
    
    if (!problemDesc.trim()) {
      newErrors.problemDesc = 'Problem problemDesc is required';
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
      customerEmail,
      tableNumber,
      problemType,
      priority,
      status,
      problemDesc,
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
          id="customerEmail"
          type="customerEmail"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="Email address"
          error={errors.customerEmail}
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
          id="problemDesc"
          value={problemDesc}
          onChange={(e) => setProblemDesc(e.target.value)}
          placeholder="Please describe the problem in detail..."
          rows={4}
          error={errors.problemDesc}
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