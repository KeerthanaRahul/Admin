import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Edit, Trash2 } from 'lucide-react';

const FoodItemCard = ({ foodItem, onEdit, onDelete }) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48 mb-4 -mx-6 -mt-4 overflow-hidden rounded-t-lg">
        <img 
          src={foodItem.image || 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg'} 
          alt={foodItem.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {!foodItem.available && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Not Available</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Badge variant={foodItem.available ? 'success' : 'danger'}>
            {foodItem.available ? 'Available' : 'Unavailable'}
          </Badge>
          {foodItem.isFeatured && (
            <Badge variant="warning">Featured</Badge>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{foodItem.name}</h3>
          <span className="text-lg font-bold text-amber-700">${foodItem.price.toFixed(2)}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="info">{foodItem.category}</Badge>
          <Badge variant={foodItem.isVegetarian ? 'success' : 'primary'}>
            {foodItem.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
          </Badge>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{foodItem.description}</p>

        {(foodItem.moods || []).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {(foodItem.moods || []).map(mood => (
              <span key={mood} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {mood}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(foodItem.id)}
          className="flex items-center"
        >
          <Edit size={16} className="mr-1" /> Edit
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => onDelete(foodItem.id)}
          className="flex items-center"
        >
          <Trash2 size={16} className="mr-1" /> Delete
        </Button>
      </div>
    </Card>
  );
};

export default FoodItemCard;