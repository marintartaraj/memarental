import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addCarsToDatabase } from '@/lib/addCarsToDatabase';

const AddCarsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddCars = async () => {
    setIsLoading(true);
    setMessage('Adding cars to database...');
    
    try {
      await addCarsToDatabase();
      setMessage('Cars added successfully! Check your database.');
    } catch (error) {
      setMessage('Error adding cars: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Add Sample Cars to Database</h3>
      <Button 
        onClick={handleAddCars} 
        disabled={isLoading}
        className="bg-yellow-500 hover:bg-yellow-600 text-white"
      >
        {isLoading ? 'Adding Cars...' : 'Add Cars to Database'}
      </Button>
      {message && (
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default AddCarsButton;

