import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

const DatePicker = ({ 
  value, 
  onChange, 
  minDate, 
  maxDate, 
  bookedDates = [], 
  placeholder = "Select date",
  className,
  disabled = false,
  loadingBookedDates = false,
  rangeStart = null,
  rangeEnd = null,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    if (value) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return null;
  });

  // Update selected date when value prop changes
  useEffect(() => {
    if (value) {
      // Parse the date string and create a local date object
      const [year, month, day] = value.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      setSelectedDate(localDate);
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Set current month to selected date or today
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    } else {
      setCurrentMonth(new Date());
    }
  }, [selectedDate]);

  const formatDate = (date) => {
    if (!date) return '';
    // Use local date formatting to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    );
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create a copy of the date and set time to midnight for accurate comparison
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    if (dateToCheck < today) return true;
    if (minDate) {
      const minDateObj = new Date(minDate);
      minDateObj.setHours(0, 0, 0, 0);
      if (dateToCheck < minDateObj) return true;
    }
    if (maxDate) {
      const maxDateObj = new Date(maxDate);
      maxDateObj.setHours(0, 0, 0, 0);
      if (dateToCheck > maxDateObj) return true;
    }
    return false;
  };

  const isDateSelected = (date) => {
    return selectedDate && selectedDate.toDateString() === date.toDateString();
  };

  const isInRange = (date) => {
    if (!rangeStart || !rangeEnd) return false;
    const startDate = new Date(rangeStart);
    const endDate = new Date(rangeEnd);
    return date >= startDate && date <= endDate;
  };

  const isRangeStart = (date) => {
    if (!rangeStart) return false;
    return new Date(rangeStart).toDateString() === date.toDateString();
  };

  const isRangeEnd = (date) => {
    if (!rangeEnd) return false;
    return new Date(rangeEnd).toDateString() === date.toDateString();
  };

  const handleDateSelect = (date) => {
    if (isDateBooked(date) || isDateDisabled(date)) return;
    
    // Create a new date object to avoid timezone issues
    const selectedDateObj = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(selectedDateObj);
    onChange(formatDate(selectedDateObj));
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          value={formatDisplayDate(selectedDate)}
          placeholder={placeholder}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "cursor-pointer pr-10 transition-colors duration-150 hover:border-gray-400 focus:border-black focus:ring-0",
            "bg-white border-gray-300",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          {...props}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {loadingBookedDates ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
          ) : (
            <Calendar className="h-4 w-4 text-gray-400 pointer-events-none" />
          )}
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[320px] animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            
            <h3 className="font-semibold text-gray-900 text-base">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth(1)}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0 relative">
            {loadingBookedDates && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-500"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              </div>
            )}
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-10" />;
              }

              const isBooked = isDateBooked(day);
              const isDisabled = isDateDisabled(day);
              const isSelected = isDateSelected(day);
              const isToday = day.toDateString() === new Date().toDateString();
              const inRange = isInRange(day);
              const rangeStart = isRangeStart(day);
              const rangeEnd = isRangeEnd(day);

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  disabled={isBooked || isDisabled}
                  className={cn(
                    "h-10 w-full text-sm transition-colors duration-150 font-normal relative flex items-center justify-center",
                    "hover:bg-gray-100 focus:outline-none",
                    // Selected date (single selection)
                    isSelected && "bg-black text-white hover:bg-gray-800",
                    // Range selection
                    rangeStart && "bg-black text-white hover:bg-gray-800 rounded-l-full",
                    rangeEnd && "bg-black text-white hover:bg-gray-800 rounded-r-full",
                    inRange && !rangeStart && !rangeEnd && "bg-gray-100 text-black",
                    // Today
                    isToday && !isSelected && !rangeStart && !rangeEnd && "text-black font-medium",
                    // Booked dates
                    isBooked && "text-gray-400 cursor-not-allowed hover:bg-transparent line-through",
                    // Disabled dates
                    isDisabled && !isBooked && "text-gray-300 cursor-not-allowed hover:bg-transparent",
                    // Available dates
                    !isBooked && !isDisabled && !isSelected && !inRange && "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export { DatePicker };
