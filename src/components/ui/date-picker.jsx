import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
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
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);

  // Update selected date when value prop changes
  useEffect(() => {
    setSelectedDate(value ? new Date(value) : null);
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
    // Use European timezone (CET/CEST) for date formatting
    const europeanDate = new Date(date.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
    const year = europeanDate.getFullYear();
    const month = String(europeanDate.getMonth() + 1).padStart(2, '0');
    const day = String(europeanDate.getDate()).padStart(2, '0');
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
    return bookedDates.some(bookedDate => {
      // Compare dates in European timezone
      const europeanBooked = new Date(bookedDate.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
      const europeanDate = new Date(date.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
      return europeanBooked.toDateString() === europeanDate.toDateString();
    });
  };

  const isDateUnavailable = (date) => {
    return isDateBooked(date) || isDateDisabled(date);
  };

  const isDateDisabled = (date) => {
    // Get today's date in European timezone
    const today = new Date();
    const europeanToday = new Date(today.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
    europeanToday.setHours(0, 0, 0, 0);
    
    if (date < europeanToday) return true;
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    // Compare dates in European timezone
    const europeanSelected = new Date(selectedDate.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
    const europeanDate = new Date(date.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
    return europeanSelected.toDateString() === europeanDate.toDateString();
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
    if (isDateUnavailable(date)) return;
    
    setSelectedDate(date);
    onChange(formatDate(date));
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
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6 min-w-[340px] animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center group"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
            </button>
            
            <h3 className="font-semibold text-gray-900 text-lg">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth(1)}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center group"
            >
              <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-0 mb-3">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 relative">
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
                return <div key={index} className="h-11" />;
              }

              const isBooked = isDateBooked(day);
              const isDisabled = isDateDisabled(day);
              const isUnavailable = isDateUnavailable(day);
              const isSelected = isDateSelected(day);
              const isToday = day.toDateString() === new Date().toDateString();
              const inRange = isInRange(day);
              const rangeStart = isRangeStart(day);
              const rangeEnd = isRangeEnd(day);

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  disabled={isUnavailable}
                  className={cn(
                    "h-11 w-full text-sm transition-all duration-200 font-normal relative flex items-center justify-center group",
                    "focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1",
                    // Selected date (single selection)
                    isSelected && "bg-yellow-500 text-white hover:bg-yellow-600 rounded-full shadow-sm",
                    // Range selection
                    rangeStart && "bg-yellow-500 text-white hover:bg-yellow-600 rounded-l-full shadow-sm",
                    rangeEnd && "bg-yellow-500 text-white hover:bg-yellow-600 rounded-r-full shadow-sm",
                    inRange && !rangeStart && !rangeEnd && "bg-yellow-100 text-yellow-800",
                    // Today
                    isToday && !isSelected && !rangeStart && !rangeEnd && !isUnavailable && "text-yellow-600 font-semibold bg-yellow-50 rounded-full",
                    // Unavailable dates (Airbnb style)
                    isUnavailable && "text-gray-300 cursor-not-allowed hover:bg-transparent relative",
                    // Available dates
                    !isUnavailable && !isSelected && !inRange && "text-gray-700 hover:bg-gray-100 hover:rounded-full",
                    // Hover effects for available dates
                    !isUnavailable && !isSelected && !inRange && "hover:shadow-sm"
                  )}
                  title={isBooked ? "This date is already booked" : isDisabled ? "This date is not available" : ""}
                >
                  <span className="relative z-10">{day.getDate()}</span>
                  {/* Unavailable date indicator */}
                  {isUnavailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <X className="h-3 w-3 text-gray-300" />
                    </div>
                  )}
                  {/* Booked date strikethrough */}
                  {isBooked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-px bg-gray-300 transform rotate-12"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-8 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                <span className="font-medium">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-100 rounded-full border border-yellow-200"></div>
                <span className="font-medium">Range</span>
              </div>
              <div className="flex items-center space-x-2">
                <X className="h-3 w-3 text-gray-400" />
                <span className="font-medium">Unavailable</span>
              </div>
            </div>
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
