import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

function getCartKey(userId) {
  return userId ? `spa-cart-${userId}` : "spa-cart-guest";
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem(getCartKey(user?._id));
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
  }, [user?._id]);

  useEffect(() => {
    localStorage.setItem(getCartKey(user?._id), JSON.stringify(cartItems));
  }, [cartItems, user?._id]);

  function addToCart(product, quantity = 1) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item._id === product._id);

      if (existingItem) {
        return currentItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stockQuantity || item.quantity + quantity)
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          _id: product._id,
          productId: product._id,
          name: product.name,
          brand: product.brand,
          image: product.images?.[0],
          price: product.price,
          discountPrice: product.discountPrice || product.price,
          stockQuantity: product.stockQuantity,
          quantity
        }
      ];
    });

    toast.success("Added to cart.");
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: Math.min(quantity, item.stockQuantity || quantity)
            }
          : item
      )
    );
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) => currentItems.filter((item) => item._id !== productId));
    toast.success("Removed from cart.");
  }

  function clearCart() {
    setCartItems([]);
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedSubtotal = cartItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0
  );
  const discount = subtotal - discountedSubtotal;
  const shipping = discountedSubtotal >= 15000 || !cartItems.length ? 0 : 499;
  const total = discountedSubtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totals: {
          subtotal,
          discount,
          shipping,
          total
        }
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
