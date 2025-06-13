import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import { FeedbackStatusBadge, FeedbackCategoryBadge } from '../ui/Badge';
import { format } from 'date-fns';
import Button from '../ui/Button';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const RecentFeedbacks = ({ feedbacks }) => {
  const navigate = useNavigate();
  const sortedFeedbacks = [...feedbacks]
    .sort((a, b) => {
      // Sort by status priority (new first) and then by creation date
      const statusPriority = { new: 4, reviewed: 3, responded: 2, archived: 1 };
      const statusDiff = statusPriority[b.status] - statusPriority[a.status];
      
      if (statusDiff !== 0) return statusDiff;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 5);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };
  
  return (
    <Card 
      title="Recent Customer Feedbacks" 
      subtitle="Latest 5 customer reviews and ratings"
      footer={
        <div className="text-right">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/feedback')}
          >
            View All Feedbacks
          </Button>
        </div>
      }
    >
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recommend
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedFeedbacks.map((feedback) => (
              <tr key={feedback.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{feedback.customerName}</div>
                  <div className="text-sm text-gray-500">{feedback.email}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {renderStars(feedback.rating)}
                  </div>
                  <div className="text-xs text-gray-500">{feedback.rating}/5</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <FeedbackCategoryBadge category={feedback.category} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {feedback.wouldRecommend ? (
                      <ThumbsUp size={14} className="text-green-600" />
                    ) : (
                      <ThumbsDown size={14} className="text-red-600" />
                    )}
                    <span className={`ml-1 text-xs ${feedback.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}>
                      {feedback.wouldRecommend ? 'Yes' : 'No'}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <FeedbackStatusBadge status={feedback.status} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(feedback.createdAt), 'MMM d, h:mm a')}
                  </div>
                </td>
              </tr>
            ))}
            
            {sortedFeedbacks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-sm text-gray-500 text-center">
                  No recent feedbacks
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentFeedbacks;