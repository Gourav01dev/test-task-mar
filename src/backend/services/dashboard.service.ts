// services/dashboard.service.ts
import { supabase } from '@/backend/db/supabase';

export const dashboardService = {
  // Get dashboard summary data
  async getDashboardSummary() {
    try {
      // Get current month's data
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

      // Get income transactions for the current month
      const { data: incomeData, error: incomeError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'income')
        .gte('transaction_date', startOfMonth)
        .lte('transaction_date', endOfMonth);
      
      if (incomeError) throw incomeError;

      // Get expense transactions for the current month
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
        balance
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  // Get monthly data for the current year
  async getMonthlyData() {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const months = [];
      
      // Create arrays to store monthly data
      let incomeData = Array(12).fill(0);
      let expenseData = Array(12).fill(0);
      
      // Get all transactions for the current year
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, transaction_date')
        .gte('transaction_date', `${currentYear}-01-01`)
        .lte('transaction_date', `${currentYear}-12-31`);
      
      if (error) throw error;
      
      // Group transactions by month and type
      transactions.forEach(transaction => {
        const date = new Date(transaction.transaction_date);
        const month = date.getMonth(); // 0-11
        const amount = parseFloat(transaction.amount);
        
        if (transaction.type === 'income') {
          incomeData[month] += amount;
        } else {
          expenseData[month] += amount;
        }
      });
      
      return {
        incomeData,
        expenseData
      };
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      throw error;
    }
  },
  
  // Get expense breakdown by category
  async getExpenseBreakdown() {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
      
      // Get expense transactions with categories
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          amount,
          categories (id, name, color)
        `)
        .eq('type', 'expense')
        .gte('transaction_date', startOfMonth)
        .lte('transaction_date', endOfMonth);
      
      if (error) throw error;
      
      // Group expenses by category
      const categoryMap = new Map();
      let totalExpense = 0;
      
      data.forEach(transaction => {
        const category :any= transaction.categories;
        const amount = parseFloat(transaction.amount);
        totalExpense += amount;
        
        const categoryId = Array.isArray(category) ? category[0].id : category.id;
        const categoryName = Array.isArray(category) ? category[0].name : category.name;
        const categoryColor = Array.isArray(category) ? category[0].color : category.color;
        
        if (categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            ...categoryMap.get(categoryId),
            amount: categoryMap.get(categoryId).amount + amount
          });
        } else {
          categoryMap.set(categoryId, {
            id: categoryId,
            name: categoryName,
            color: categoryColor,
            amount
          });
        }
      });
      
      // Calculate percentages
      const categoryBreakdown = Array.from(categoryMap.values()).map(category => ({
        ...category,
        percentage: Math.round((category.amount / totalExpense) * 100)
      }));
      
      return {
        categories: categoryBreakdown,
        totalExpense
      };
    } catch (error) {
      console.error('Error fetching expense breakdown:', error);
      throw error;
    }
  }
};