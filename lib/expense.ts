import { ref, set, push, remove, get, child } from 'firebase/database';
import { db } from './firebase';

export interface ExpenseItem {
  id: string;
  name: string;
  price: string;
  quantity: string;
  timestamp: number;
}

export interface ExpenseList {
  id: string;
  items: ExpenseItem[];
  totalAmount: number;
  timestamp: number;
}

export const saveExpenseList = async (userId: string, expenses: ExpenseItem[], totalAmount: number) => {
  const expensesRef = ref(db, `expenses/${userId}`);
  const newExpenseRef = push(expensesRef);
  const expenseList: ExpenseList = {
    id: newExpenseRef.key || '',
    items: expenses,
    totalAmount,
    timestamp: Date.now(),
  };
  
  await set(newExpenseRef, expenseList);
  return expenseList;
};

export const deleteExpenseList = async (userId: string, expenseListId: string) => {
  const expenseRef = ref(db, `expenses/${userId}/${expenseListId}`);
  await remove(expenseRef);
};

export const getExpenseLists = async (userId: string): Promise<ExpenseList[]> => {
  if (!userId) {
    throw new Error('No user ID provided');
  }

  // Wait a bit to ensure Firebase is fully initialized
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Reference the specific user's expenses directly
    const expensesRef = ref(db, `expenses/${userId}`);
    const snapshot = await get(expensesRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const lists = Object.values(data) as ExpenseList[];
      // Sort by timestamp, newest first
      return lists.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    return [];
  } catch (error: any) {
    console.error('Error fetching expense lists:', error);
    // Check for specific Firebase error codes
    if (error.code === 'PERMISSION_DENIED' || 
        error.message?.includes('Permission denied')) {
      throw new Error('Authentication required. Please sign in.');
    }
    throw error;
  }
};
