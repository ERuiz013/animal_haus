import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config';


const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('animal_haus_cart');
      if (savedCart && savedCart !== 'undefined' && savedCart !== 'null') {
        return JSON.parse(savedCart);
      }
      return [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  });

  // Guardar en localStorage cuando el carrito cambie
  useEffect(() => {
    localStorage.setItem('animal_haus_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    // Sincronizar carrito con la base de datos al cargar (para actualizar precios y stock)
    if (cartItems.length > 0) {
      const API_URL = API_BASE_URL;

      fetch(`${API_URL}/getProductos.php`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCartItems(prev => {
              const updated = prev.map(item => {
                const dbProduct = data.find(p => String(p.id) === String(item.id));
                if (dbProduct) {
                  const stock = dbProduct.stock !== undefined && dbProduct.stock !== null ? Number(dbProduct.stock) : Infinity;
                  if (stock <= 0) return null; // Eliminar si ya no hay stock
                  const newQuantity = Math.min(item.quantity, stock);
                  return { ...item, ...dbProduct, quantity: newQuantity };
                }
                return item; // Mantener si no se encontró en esta consulta (ej: es de otra API o endpoint)
              }).filter(Boolean);
              
              // Solo actualizar si hubo cambios para evitar ciclos infinitos
              if (JSON.stringify(updated) !== JSON.stringify(prev)) {
                return updated;
              }
              return prev;
            });
          }
        })
        .catch(err => console.error("Error syncing cart items:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const stock = product.stock !== undefined ? Number(product.stock) : Infinity;

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const cappedQuantity = Math.min(newQuantity, stock);
        if (cappedQuantity === existingItem.quantity) {
          // If we hit the limit, you might want to dispatch an event, but for now we just return prevItems
          window.dispatchEvent(new CustomEvent('cartStockLimit', { detail: { name: product.nombre, stock } }));
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: cappedQuantity } : item
        );
      }
      
      const newQuantity = Math.min(quantity, stock);
      if (newQuantity === 0 && stock === 0) {
        window.dispatchEvent(new CustomEvent('cartStockLimit', { detail: { name: product.nombre, stock } }));
        return prevItems;
      }
      
      return [...prevItems, { ...product, quantity: newQuantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (existingItem) {
        const stock = existingItem.stock !== undefined ? Number(existingItem.stock) : Infinity;
        const cappedQuantity = Math.min(newQuantity, stock);
        
        if (newQuantity > stock) {
          window.dispatchEvent(new CustomEvent('cartStockLimit', { detail: { name: existingItem.nombre, stock } }));
        }

        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: cappedQuantity } : item
        );
      }
      return prevItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.precio) * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
