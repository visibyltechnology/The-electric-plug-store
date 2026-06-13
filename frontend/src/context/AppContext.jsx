import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [authLoading, setAuthLoading] = useState(true);
  
  // For demo, initialize with 2 items in cart and 3 in wishlist to match initial UI loosely
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Load from localStorage if available (optional, simple version first)
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch additional user metadata (like isAdmin) from Firestore
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUser({ uid: firebaseUser.uid, ...firebaseUser, ...docSnap.data() });
          } else {
            setUser({ uid: firebaseUser.uid, ...firebaseUser });
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore", error);
          setUser({ uid: firebaseUser.uid, ...firebaseUser });
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  // Cart Functions
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { ...product, qty }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  // Wishlist Functions
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const isInWishlist = (id) => {
    return wishlist.some(item => item.id === id);
  };

  const contextValue = {
    user,
    authLoading,
    logout,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    wishlist,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
