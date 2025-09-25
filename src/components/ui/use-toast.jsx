import React, { useState, useEffect, createContext, useContext } from "react"

const TOAST_LIMIT = 1

let count = 0
function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const ToastContext = createContext()

// Global toast function that will be set by the provider
let globalToast = null

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const toast = ({ ...props }) => {
    const id = generateId()

    const update = (newProps) =>
      setToasts((prevToasts) =>
        prevToasts.map((t) =>
          t.id === id ? { ...t, ...newProps } : t
        )
      )

    const dismiss = () => setToasts((prevToasts) =>
      prevToasts.filter((t) => t.id !== id)
    )

    setToasts((prevToasts) => [
      { ...props, id, dismiss },
      ...prevToasts,
    ].slice(0, TOAST_LIMIT))

    return {
      id,
      dismiss,
      update,
    }
  }

  // Set the global toast function
  useEffect(() => {
    globalToast = toast
    return () => {
      globalToast = null
    }
  }, [toast])

  useEffect(() => {
    const timeouts = []

    toasts.forEach((toast) => {
      if (toast.duration === Infinity) {
        return
      }

      const timeout = setTimeout(() => {
        toast.dismiss()
      }, toast.duration || 5000)

      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [toasts])

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Direct export for backward compatibility
export const toast = ({ ...props }) => {
  if (globalToast) {
    return globalToast({ ...props })
  }
  
  // Fallback if called outside of provider
  console.warn('Toast called outside of ToastProvider. Make sure ToastProvider is wrapping your app.')
  const id = generateId()
  
  return {
    id,
    dismiss: () => {},
    update: (newProps) => {},
  }
}