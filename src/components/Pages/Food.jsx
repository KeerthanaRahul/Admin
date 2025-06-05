import React, { useEffect, useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import FoodItemCard from '../Food/FoodItemCard';
import FoodForm from '../Food/FoodForm';
import { Plus, Filter } from 'lucide-react';
import Select from '../ui/Select';
import Loader from '../../CommonComponents/Loader/Loader';
import { v4 as uuidv4 } from 'uuid';

const Food = () => {
  const { updateFoodItem, deleteFoodItem } = useAppContext();
  let apiUrl = 'http://localhost:8082/api/v1/food'
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState();
  const [categoryOptions, setCategoryOptions] = useState();
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [foodItems, setFoodItems] = useState(false);
  const [foodItemsError, setFoodItemsError] = useState('');
  const [isAddFoodLoading, setIsAddFoodLoading] = useState(false);
  const [addFoodError, setAddFoodError] = useState('');


  const getFoodItems = async() => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/getFoodItems`);
      const data = await res.json();
      setFoodItems(data?.foodList)
      handleFoodData(data?.foodList);
      } catch (error) {
      setFoodItemsError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false)
    }
  }

  

  const handleFoodData = data => {
    const categories = data && ['all', ...new Set(data?.map(item => item.category))];
    const categoryOptions = data && categories?.map(cat => ({
      value: cat,
      label: cat === 'all' ? 'All Categories' : cat,
    }));
    setCategoryOptions(categoryOptions)
    handleFilters(data)
  }

  const handleFilters = (data) => {
    const filteredItems = data && data?.filter(item => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      
      if (availabilityFilter === 'available' && !item.available) {
        return false;
      }
      
      if (availabilityFilter === 'unavailable' && item.available) {
        return false;
      }
      
      return true;
    });
    setFilteredItems(filteredItems)
  }
  
  useEffect(() => {
    getFoodItems();
  }, [])
  
  
  
  
  const availabilityOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'available', label: 'Available Only' },
    { value: 'unavailable', label: 'Unavailable Only' },
  ];
  
 
  
  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };
  
  const handleEdit = (id) => {
    const item = foodItems?.find(item => item.id === id);
    if (item) {
      setEditingItem(item);
      setShowForm(true);
    }
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteFoodItem(id);
    }
  };

  const addFoodItem = async(foodItem) => {
    let payload = foodItem;
    payload.id = uuidv4();
    console.log(payload);
    setIsAddFoodLoading(true);
    try {
      await fetch(`${apiUrl}/addFood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      getFoodItems();
    } catch (error) {
      setAddFoodError('Something went wrong. Please try again later.');
      // setOpenLoginErrorDialog(true);
    } finally {
      setIsAddFoodLoading(false)
    }
  }

  const handleCategoryFilter = (e, data = foodItems) => {
    setCategoryFilter(e);
    handleFilters(data ? data : foodItems)
  }
  
  const handleSubmit = (foodItem) => {
    if (editingItem) {
      updateFoodItem(editingItem.id, foodItem);
    } else {
      addFoodItem(foodItem);
    }
    setShowForm(false);
    setEditingItem(null);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };
  
  return (
    <div className="space-y-6">
      {(isLoading || isAddFoodLoading) && <Loader showLoader={(isLoading || isAddFoodLoading)} />}
      {showForm ? (
        <FoodForm
          initialData={editingItem || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button 
              onClick={handleAddNew}
              className="flex items-center"
            >
              <Plus size={18} className="mr-1" /> Add New Item
            </Button>
          </div>
          
          <Card>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {categoryOptions && <Select
                  options={categoryOptions && categoryOptions}
                  value={categoryFilter}
                  onChange={handleCategoryFilter}
                  className="w-full sm:w-40"
                />}
                {availabilityOptions && <Select
                  options={availabilityOptions && availabilityOptions}
                  value={availabilityFilter}
                  onChange={setAvailabilityFilter}
                  className="w-full sm:w-40"
                />}
              </div>
            </div>
            
            {filteredItems?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No menu items found</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddNew}
                  className="mt-4"
                >
                  Add Your First Item
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems && filteredItems.map(item => (
                  <FoodItemCard
                    key={item.id}
                    foodItem={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Food;