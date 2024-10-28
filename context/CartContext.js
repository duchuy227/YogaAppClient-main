// src/context/CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (yogaClass) => {
    setCartItems(prevItems => {
      const exists = prevItems.find(item => item.id === yogaClass.id);
      if (exists) {
        return prevItems;
      }
      return [...prevItems, yogaClass];
    });
  };

  const removeFromCart = (classId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== classId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}