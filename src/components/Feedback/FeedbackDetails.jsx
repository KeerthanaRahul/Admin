import React, { useState } from 'react';
import Card from '../ui/Card';
import { FeedbackStatusBadge, FeedbackCategoryBadge } from '../ui/Badge';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import { format } from 'date-fns';
import { X, User, Mail, Hash, Star, MessageSquare, ThumbsUp, ThumbsDown, Clock, Send } from 'lucide-react';


const FeedbackDetails = ({
  feedback,
  onClose,
  onEdit,
  onStatusChange,
  onUpdateResponse,
}) => {
  const [adminResponse, setAdminResponse] = useState(feedback.adminResponse || '');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  const handleStatusChange = () => {
    onStatusChange(feedback.id, e.target.value);
  };

  const handleSubmitResponse = async () => {
    if (!adminResponse.trim()) return;
    
    setIsSubmittingResponse(true);
    try {
      onUpdateResponse(feedback.id, adminResponse);
      onStatusChange(feedback.id, 'responded');
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={20}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'food-quality': 'Food Quality',
      'service': 'Service',
      'ambiance': 'Ambiance',
      'value': 'Value',
      'cleanliness': 'Cleanliness',
      'overall': 'Overall Experience'
    };
    return labels[category] || category;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X size={20} />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Customer Feedback Details
                  </h3>
                  <div className="flex space-x-2">
                    <FeedbackCategoryBadge category={feedback.category} />
                    <FeedbackStatusBadge status={feedback.status} />
                  </div>
                </div>
                
                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <User size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Customer</p>
                        <p className="text-sm text-gray-900">{feedback.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{feedback.customerEmail}</p>
                      </div>
                    </div>
                    
                    {feedback.orderNumber && (
                      <div className="flex items-center">
                        <Hash size={18} className="text-amber-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Order Number</p>
                          <p className="text-sm text-gray-900">{feedback.orderNumber}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Clock size={18} className="text-amber-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Submitted</p>
                        <p className="text-sm text-gray-900">
                          {format(new Date(feedback.createdAt._seconds), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating and Recommendation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white border border-gray-200 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Rating</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(feedback.rating)}
                      </div>
                      <span className="text-lg font-bold text-gray-900">{feedback.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Category: {getCategoryLabel(feedback.category)}</p>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendation</h4>
                    <div className="flex items-center space-x-2">
                      {feedback.wouldRecommend ? (
                        <ThumbsUp size={20} className="text-green-600" />
                      ) : (
                        <ThumbsDown size={20} className="text-red-600" />
                      )}
                      <span className={`font-medium ${feedback.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}>
                        {feedback.wouldRecommend ? 'Would Recommend' : 'Would Not Recommend'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Management */}
                {/* <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
                  <p className="text-sm text-gray-900">{feedback.status}</p>
                  <select
                    value={feedback.status}
                    onChange={handleStatusChange}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="responded">Responded</option>
                    <option value="archived">Archived</option>
                  </select>
                </div> */}
                
                {/* Feedback Content */}
                <div className="mb-4">
                  <div className="flex items-start">
                    <MessageSquare size={18} className="text-amber-600 mr-2 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-2">Customer Feedback</p>
                      <div className="bg-white border border-gray-200 rounded-md p-3">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{feedback.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                {feedback.suggestions && (
                  <div className="mb-4">
                    <div className="flex items-start">
                      <MessageSquare size={18} className="text-blue-600 mr-2 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-2">Customer Suggestions</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{feedback.suggestions}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Response */}
                {/* <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Admin Response</p>
                  {feedback.adminResponse ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{feedback.adminResponse}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Responded on {format(new Date(feedback.updatedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  ) : null}
                  
                  <TextArea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Write your response to the customer..."
                    rows={4}
                    fullWidth
                    className="mb-2"
                  />
                  
                  <Button
                    onClick={handleSubmitResponse}
                    disabled={!adminResponse.trim() || isSubmittingResponse}
                    size="sm"
                    className="flex items-center"
                  >
                    <Send size={16} className="mr-1" />
                    {isSubmittingResponse ? 'Sending...' : 'Send Response'}
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {/* <Button
              variant="primary"
              onClick={() => onEdit(feedback)}
              className="w-full sm:w-auto sm:ml-3"
            >
              Edit Feedback
            </Button> */}
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full mt-3 sm:mt-0 sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetails;