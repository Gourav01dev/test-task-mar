import { supabase } from '../db/supabase';
import { Transaction } from '../types';

export const transactionService = {
  // Get all transactions for the current user
  async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        category:categories (*)
      `)
      .order('transaction_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get transactions with filters
  async getFilteredTransactions({
    startDate,
    endDate,
    type,
    categoryId,
  }: {
    startDate?: string;
    endDate?: string;
    type?: 'income' | 'expense';
    categoryId?: string;
  }) {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        category:categories (*)
      `)
      .order('transaction_date', { ascending: false });

    if (startDate) {
      query = query.gte('transaction_date', startDate);
    }

    if (endDate) {
      query = query.lte('transaction_date', endDate);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

// Add a new transaction
async addTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>) {
  try {
    // Hard code a valid user ID for now
    // This is a TEMPORARY fix - you should replace this with proper authentication
    const userId = '5b600c2d-c8a4-4004-b8dd-bb7bf040c4ab'; // Use a valid user ID from your database
    
    // Add the user_id to the transaction object
    const transactionWithUser = {
      ...transaction,
      user_id: userId
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionWithUser)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
},
  // Update a transaction
  async updateTransaction(id: string, transaction: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a transaction
  async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Get summary data for dashboard
  async getDashboardSummary() {
    // Get current month's data
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    // Get income transactions
    const { data: incomeData, error: incomeError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'income')
      .gte('transaction_date', startOfMonth)
      .lte('transaction_date', endOfMonth);
    
    if (incomeError) throw incomeError;

    // Get expense transactions
    const { data: expenseData, error: expenseError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'expense')
      .gte('transaction_date', startOfMonth)
      .lte('transaction_date', endOfMonth);
    
    if (expenseError) throw expenseError;

    // Calculate totals
    const totalIncome = incomeData.length > 0 
      ? incomeData.reduce((sum, transaction) => sum + parseFloat(transaction.amount.toString()), 0)
      : 0;
    const totalExpense = expenseData.length > 0
      ? expenseData.reduce((sum, transaction) => sum + parseFloat(transaction.amount.toString()), 0)
      : 0;
    const balance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
      startDate: startOfMonth,
      endDate: endOfMonth
    };
  },

  // Get expense breakdown by category for visualizations
  async getCategoryBreakdown(type: 'income' | 'expense', period: 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate;
    
    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    } else {
      startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
    }
    
    const endDate = now.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        amount,
        category:categories (id, name, color)
      `)
      .eq('type', type)
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate);
    
    if (error) throw error;
    
    // Transform data for visualization
    const categoryMap = new Map();
    
    if (data && data.length > 0) {
      data.forEach((transaction) => {
        // transaction.category is an object that contains the first category
        const categoryObj = transaction.category;
        
        // Check if it's an array and get the first item if so
        const category = Array.isArray(categoryObj) ? categoryObj[0] : categoryObj;
        
        if (!category) return; // Skip if no category
        
        const amount = parseFloat(transaction.amount.toString());
        
        if (categoryMap.has(category.id)) {
          categoryMap.set(category.id, {
            ...category,
            total: categoryMap.get(category.id).total + amount
          });
        } else {
          categoryMap.set(category.id, {
            ...category,
            total: amount
          });
        }
      });
    }
    
    return Array.from(categoryMap.values());
  }
};