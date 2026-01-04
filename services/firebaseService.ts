
import { 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  doc, 
  setDoc 
} from "firebase/firestore";
import { db, isCloudEnabled } from "../firebase";
import { MenuItem, CartItem } from "../types";
import { MENU_ITEMS as STATIC_MENU } from "../constants";

const MENU_COLLECTION = "menu";
const ORDERS_COLLECTION = "orders";
const STORAGE_KEY_MENU = "sameers_coffee_menu";
const STORAGE_KEY_ORDERS = "sameers_coffee_orders";

export type ConnectionStatus = 'cloud' | 'local' | 'error';

/**
 * Fetches the menu. 
 * Skips Firebase if credentials are not ready or if permissions are denied.
 */
export const fetchMenu = async (): Promise<{ items: MenuItem[], status: ConnectionStatus }> => {
  const localData = localStorage.getItem(STORAGE_KEY_MENU);
  const fallbackItems = localData ? JSON.parse(localData) : STATIC_MENU;

  if (!isCloudEnabled || !db) {
    return { items: fallbackItems, status: 'local' };
  }

  try {
    const menuCol = collection(db, MENU_COLLECTION);
    const menuSnapshot = await getDocs(menuCol);
    
    if (menuSnapshot.empty) {
      // Seed cloud database if empty
      for (const item of STATIC_MENU) {
        await setDoc(doc(db, MENU_COLLECTION, item.id), item);
      }
      return { items: STATIC_MENU, status: 'cloud' };
    }

    const items = menuSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as MenuItem[];
    
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(items));
    return { items, status: 'cloud' };
  } catch (error: any) {
    // If we get a permission-denied, we treat it as local mode and stop trying cloud
    if (error.code === 'permission-denied') {
      console.info("Firestore permissions required. Operating in Local Mode.");
    } else {
      console.warn("Firestore fetch error:", error.message);
    }
    return { items: fallbackItems, status: 'local' };
  }
};

/**
 * Places a new order. 
 * Skips Firebase if credentials are not ready.
 */
export const placeOrder = async (cart: CartItem[], total: number): Promise<{ id: string, status: ConnectionStatus }> => {
  const orderData = {
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  if (isCloudEnabled && db) {
    try {
      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
        ...orderData,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, status: 'cloud' };
    } catch (error: any) {
      console.warn("Cloud save failed:", error.code || error.message);
    }
  }

  // Local Storage Fallback
  const existingOrders = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS) || "[]");
  const localId = `local-${Date.now()}`;
  const localOrder = { ...orderData, id: localId };
  
  existingOrders.push(localOrder);
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(existingOrders));
  
  return { id: localId, status: 'local' };
};
