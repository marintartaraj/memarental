import * as React from "react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
  const handleChange = (e) => {
    // Handle both onChange and onCheckedChange for compatibility
    if (onChange) {
      onChange(e);
    }
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 focus:ring-2 focus:ring-offset-2",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox } 