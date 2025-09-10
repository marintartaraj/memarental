import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  
  // Memoize selected date to avoid unnecessary re-renders
  const selectedDate = useMemo(() => {
    if (!value) return null;
    try {
      const [year, month, day] = value.split('-').map(Number);
      if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
      return new Date(year, month - 1, day);
    } catch (error) {
      console.warn('Invalid date format:', value);
      return null;
    }
  }, [value]);

  // Update current month when selected date changes
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    } else {
      setCurrentMonth(new Date());
    }
  }, [selectedDate]);

  // Helper function to normalize dates for comparison
  const normalizeDate = useCallback((date) => {
    if (!date) return null;
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }, []);

  // Helper function to format date as YYYY-MM-DD
  const formatDate = useCallback((date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Helper function to format date for display
  const formatDisplayDate = useCallback((date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  // Memoize booked dates for performance
  const normalizedBookedDates = useMemo(() => {
    return bookedDates.map(date => normalizeDate(date)).filter(Boolean);
  }, [bookedDates, normalizeDate]);

  // Check if a date is booked
  const isDateBooked = useCallback((date) => {
    const normalizedDate = normalizeDate(date);
    if (!normalizedDate) return false;
    
    return normalizedBookedDates.some(bookedDate => 
      bookedDate.getTime() === normalizedDate.getTime()
    );
  }, [normalizedBookedDates, normalizeDate]);

  // Check if a date is disabled
  const isDateDisabled = useCallback((date) => {
    const normalizedDate = normalizeDate(date);
    if (!normalizedDate) return true;
    
    const today = normalizeDate(new Date());
    
    // Check if date is in the past
    if (normalizedDate < today) return true;
    
    // Check minDate constraint
    if (minDate) {
      const minDateObj = normalizeDate(new Date(minDate));
      if (minDateObj && normalizedDate < minDateObj) return true;
    }
    
    // Check maxDate constraint
    if (maxDate) {
      const maxDateObj = normalizeDate(new Date(maxDate));
      if (maxDateObj && normalizedDate > maxDateObj) return true;
    }
    
    return false;
  }, [minDate, maxDate, normalizeDate]);

  // Check if a date is unavailable (booked or disabled)
  const isDateUnavailable = useCallback((date) => {
    return isDateBooked(date) || isDateDisabled(date);
  }, [isDateBooked, isDateDisabled]);

  // Check if a date is selected
  const isDateSelected = useCallback((date) => {
    if (!selectedDate) return false;
    const normalizedDate = normalizeDate(date);
    const normalizedSelected = normalizeDate(selectedDate);
    return normalizedDate && normalizedSelected && 
           normalizedDate.getTime() === normalizedSelected.getTime();
  }, [selectedDate, normalizeDate]);

  // Range selection helpers
  const isInRange = useCallback((date) => {
    if (!rangeStart || !rangeEnd) return false;
    const normalizedDate = normalizeDate(date);
    const normalizedStart = normalizeDate(new Date(rangeStart));
    const normalizedEnd = normalizeDate(new Date(rangeEnd));
    
    if (!normalizedDate || !normalizedStart || !normalizedEnd) return false;
    return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
  }, [rangeStart, rangeEnd, normalizeDate]);

  const isRangeStart = useCallback((date) => {
    if (!rangeStart) return false;
    const normalizedDate = normalizeDate(date);
    const normalizedStart = normalizeDate(new Date(rangeStart));
    return normalizedDate && normalizedStart && 
           normalizedDate.getTime() === normalizedStart.getTime();
  }, [rangeStart, normalizeDate]);

  const isRangeEnd = useCallback((date) => {
    if (!rangeEnd) return false;
    const normalizedDate = normalizeDate(date);
    const normalizedEnd = normalizeDate(new Date(rangeEnd));
    return normalizedDate && normalizedEnd && 
           normalizedDate.getTime() === normalizedEnd.getTime();
  }, [rangeEnd, normalizeDate]);

  // Handle date selection
  const handleDateSelect = useCallback((date) => {
    if (isDateUnavailable(date)) return;
    
    const selectedDateObj = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    onChange(formatDate(selectedDateObj));
    setIsOpen(false);
  }, [isDateUnavailable, onChange, formatDate]);

  // Navigate between months
  const navigateMonth = useCallback((direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  }, []);

  // Memoize calendar generation for performance
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
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
  }, [currentMonth]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          value={formatDisplayDate(selectedDate)}
          placeholder={placeholder}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!disabled) setIsOpen(!isOpen);
            }
          }}
          className={cn(
            "cursor-pointer pr-10 transition-colors duration-150 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            "bg-white border-gray-300 rounded-lg",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          aria-label={placeholder}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          role="combobox"
          {...props}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {loadingBookedDates ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" aria-label="Loading dates"></div>
          ) : (
            <Calendar className="h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
          )}
        </div>
      </div>

      {isOpen && !disabled && (
        <div 
          className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 sm:p-6 w-auto sm:w-[420px] max-w-[calc(100vw-2rem)] sm:max-w-none animate-in fade-in-0 zoom-in-95 duration-200"
          role="dialog"
          aria-label="Date picker"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="h-10 w-10 sm:h-8 sm:w-8 p-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center group touch-manipulation"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5 sm:h-4 sm:w-4 text-gray-600 group-hover:text-gray-900" />
            </button>
            
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg" id="calendar-month-year">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth(1)}
              className="h-10 w-10 sm:h-8 sm:w-8 p-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center group touch-manipulation"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5 sm:h-4 sm:w-4 text-gray-600 group-hover:text-gray-900" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 sm:gap-0 mb-2" role="row">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2" role="columnheader">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 relative" role="grid" aria-labelledby="calendar-month-year">
            {loadingBookedDates && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-500"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              </div>
            )}
            {calendarData.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-10 sm:h-12" />;
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
                    "h-10 sm:h-12 w-full text-sm transition-all duration-200 font-normal relative flex items-center justify-center group touch-manipulation",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                    // Selected date (single selection)
                    isSelected && "bg-blue-500 text-white hover:bg-blue-600 rounded-full shadow-sm",
                    // Range selection
                    rangeStart && "bg-blue-500 text-white hover:bg-blue-600 rounded-l-full shadow-sm",
                    rangeEnd && "bg-blue-500 text-white hover:bg-blue-600 rounded-r-full shadow-sm",
                    inRange && !rangeStart && !rangeEnd && "bg-blue-100 text-blue-800",
                    // Today
                    isToday && !isSelected && !rangeStart && !rangeEnd && !isUnavailable && "text-blue-600 font-semibold bg-blue-50 rounded-full",
                    // Unavailable dates (clean styling)
                    isUnavailable && "text-gray-400 cursor-not-allowed hover:bg-transparent relative",
                    // Available dates
                    !isUnavailable && !isSelected && !inRange && "text-gray-700 hover:bg-gray-100 hover:rounded-full active:bg-gray-200",
                    // Hover effects for available dates
                    !isUnavailable && !isSelected && !inRange && "hover:shadow-sm"
                  )}
                  role="gridcell"
                  aria-label={`${day.getDate()} ${monthNames[day.getMonth()]} ${day.getFullYear()}${isBooked ? ', booked' : isDisabled ? ', not available' : isSelected ? ', selected' : ''}`}
                  aria-selected={isSelected}
                  aria-disabled={isUnavailable}
                  title={isBooked ? "This date is already booked" : isDisabled ? "This date is not available" : ""}
                >
                  <span className="relative z-10">{day.getDate()}</span>
                  {/* Unavailable date indicator */}
                  {isUnavailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" aria-hidden="true" />
                      </div>
                    </div>
                  )}
                  {/* Booked date indicator */}
                  {isBooked && !isDisabled && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" aria-hidden="true" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center sm:space-x-6 gap-3 sm:gap-0 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm" aria-hidden="true"></div>
                <span className="font-medium">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-100 rounded-full border border-blue-200" aria-hidden="true"></div>
                <span className="font-medium">Range</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 rounded-full flex items-center justify-center" aria-hidden="true">
                  <X className="h-2 w-2 text-gray-400" />
                </div>
                <span className="font-medium">Unavailable</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-100 rounded-full flex items-center justify-center" aria-hidden="true">
                  <X className="h-2 w-2 text-red-400" />
                </div>
                <span className="font-medium">Booked</span>
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
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          tabIndex={-1}
        />
      )}
    </div>
  );
};

export { DatePicker };
