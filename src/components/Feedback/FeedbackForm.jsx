import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import { Star } from 'lucide-react';
import { useAppContext } from '../Context/AppContext';

const FeedbackForm = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { orders } = useAppContext();
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('overall');
  const [description, setDescription] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [suggestions, setSuggestions] = useState('');
  const [status, setStatus] = useState('new');
  const [adminResponse, setAdminResponse] = useState('');
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName);
      setEmail(initialData.email);
      setOrderNumber(initialData.orderNumber || '');
      setRating(initialData.rating);
      setCategory(initialData.category);
      setDescription(initialData.description);
      setWouldRecommend(initialData.wouldRecommend);
      setSuggestions(initialData.suggestions || '');
      setStatus(initialData.status);
      setAdminResponse(initialData.adminResponse || '');
    }
  }, [initialData]);
  
  const categoryOptions = [
    { value: 'food-quality', label: 'Food Quality' },
    { value: 'service', label: 'Service' },
    { value: 'ambiance', label: 'Ambiance' },
    { value: 'value', label: 'Value for Money' },
    { value: 'cleanliness', label: 'Cleanliness' },
    { value: 'overall', label: 'Overall Experience' },
  ];

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'responded', label: 'Responded' },
    { value: 'archived', label: 'Archived' },
  ];

  const orderOptions = [
    { value: '', label: 'No specific order' },
    ...orders.map(order => ({
      value: order.id,
      label: `${order.customerName} - ${order.id.substring(0, 8)}... ($${order.totalAmount.toFixed(2)})`,
    })),
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
    
    if (!description.trim()) {
      newErrors.description = 'Feedback description is required';
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
      orderNumber: orderNumber || undefined,
      rating,
      category,
      description,
      wouldRecommend,
      suggestions: suggestions || undefined,
      status,
      adminResponse: adminResponse || undefined,
    });
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setRating(index + 1)}
        className="focus:outline-none"
      >
        <Star
          size={24}
          className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'}
        />
      </button>
    ));
  };
  
  return (
    <Card title={initialData ? 'Edit Customer Feedback' : 'Add New Customer Feedback'}>
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
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            error={errors.email}
            fullWidth
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Select
            label="Related Order (Optional)"
            id="orderNumber"
            value={orderNumber}
            onChange={setOrderNumber}
            options={orderOptions}
            fullWidth
          />
          
          <Select
            label="Feedback Category"
            id="category"
            value={category}
            onChange={(value) => setCategory(value)}
            options={categoryOptions}
            fullWidth
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {renderStars()}
              <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
            </div>
          </div>

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
          label="Feedback Description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please share your feedback about your experience..."
          rows={4}
          error={errors.description}
          fullWidth
          className="mb-4"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Would you recommend us to others?
          </label>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="recommend-yes"
                checked={wouldRecommend}
                onChange={() => setWouldRecommend(true)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="recommend-yes" className="text-sm text-gray-700">Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="recommend-no"
                checked={!wouldRecommend}
                onChange={() => setWouldRecommend(false)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="recommend-no" className="text-sm text-gray-700">No</label>
            </div>
          </div>
        </div>
        
        <TextArea
          label="Suggestions (Optional)"
          id="suggestions"
          value={suggestions}
          onChange={(e) => setSuggestions(e.target.value)}
          placeholder="Any suggestions for improvement..."
          rows={3}
          fullWidth
          className="mb-4"
        />

        {initialData && (
          <TextArea
            label="Admin Response"
            id="adminResponse"
            value={adminResponse}
            onChange={(e) => setAdminResponse(e.target.value)}
            placeholder="Response to customer feedback..."
            rows={3}
            fullWidth
            className="mb-4"
          />
        )}
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Feedback' : 'Add Feedback'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FeedbackForm;