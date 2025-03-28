import { supabase } from '../db/supabase';
import { Transaction } from '../types';

export const transactionService = {
  // Get all transactions for the current user
  async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories (*)
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
        categories (*)
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
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
    const totalIncome = incomeData.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
    const totalExpense = expenseData.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
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
        categories (id, name, color)
      `)
      .eq('type', type)
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate);
    
    if (error) throw error;
    
    // Transform data for visualization
    const categoryMap = new Map();
    
    data.forEach((transaction) => {
      const category = transaction.categories;
      const amount = parseFloat(transaction.amount);
      
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
    
    return Array.from(categoryMap.values());
  }
};