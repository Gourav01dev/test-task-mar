import { transactionService } from '../services/transaction.service';
import { categoryService } from '../services/category.service';
import { savingsService } from '../services/savings.service';
import { authService } from '../services/auth.service';
import { supabase } from '../db/supabase';

// Define resolver parameter types
interface ResolverContext {
  user?: any;
}

interface QueryArgs {
  id?: string;
  type?: 'income' | 'expense';
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  period?: 'month' | 'year';
  year?: number;
}

interface TransactionInput {
  amount: number;
  type: 'income' | 'expense';
  category_id: string;
  description?: string;
  transaction_date: string;
  savings_goal_id?: string;
}

interface SavingsGoalInput {
  name: string;
  target_amount: number;
  current_amount?: number;
  end_date: string;
}

export const resolvers = {
  Query: {
    // User queries
    currentUser: async () => {
      try {
        return await authService.getCurrentUser();
      } catch (error) {
        console.error('Error getting current user:', error);
        return null;
      }
    },

    // Transaction queries
    transactions: async (_: any, args: QueryArgs) => {
      try {
        return await transactionService.getFilteredTransactions(args);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
    },

    transaction: async (_: any, { id }: { id: string }) => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            categories (*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching transaction:', error);
        throw error;
      }
    },

    // Category queries
    categories: async (_: any, { type }: { type?: 'income' | 'expense' }) => {
      try {
        if (type) {
          return await categoryService.getCategoriesByType(type);
        }
        return await categoryService.getCategories();
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },

    category: async (_: any, { id }: { id: string }) => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
      }
    },

    // Savings Goal queries
    savingsGoals: async () => {
      try {
        const goals = await savingsService.getSavingsGoals();
        
        // Calculate progress percentage for each goal
        return goals.map(goal => ({
          ...goal,
          progress_percentage: Math.min(100, (parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100)
        }));
      } catch (error) {
        console.error('Error fetching savings goals:', error);
        throw error;
      }
    },

    savingsGoal: async (_: any, { id }: { id: string }) => {
      try {
        const { data, error } = await supabase
          .from('savings_goals')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        return {
          ...data,
          progress_percentage: Math.min(100, (parseFloat(data.current_amount) / parseFloat(data.target_amount)) * 100)
        };
      } catch (error) {
        console.error('Error fetching savings goal:', error);
        throw error;
      }
    },

    // Dashboard queries
    dashboardSummary: async () => {
      try {
        return await transactionService.getDashboardSummary();
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        throw error;
      }
    },

    categoryBreakdown: async (_: any, { type, period = 'month' }: { type: 'income' | 'expense', period?: 'month' | 'year' }) => {
      try {
        const breakdown = await transactionService.getCategoryBreakdown(type, period);
        
        // Calculate total amount for percentage calculation
        const total = breakdown.reduce((sum, category) => sum + category.total, 0);
        
        // Add percentage to each category
        return breakdown.map(category => ({
          ...category,
          percentage: total > 0 ? (category.total / total) * 100 : 0
        }));
      } catch (error) {
        console.error('Error fetching category breakdown:', error);
        throw error;
      }
    },

    monthlyTrends: async (_: any, { year }: { year?: number }) => {
      try {
        const currentYear = year || new Date().getFullYear();
        const months = [];
        
        // Generate data for each month
        for (let month = 0; month < 12; month++) {
          const startDate = new Date(currentYear, month, 1).toISOString().split('T')[0];
          const endDate = new Date(currentYear, month + 1, 0).toISOString().split('T')[0];
          
          // Get income for this month
          const { data: incomeData, error: incomeError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'income')
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate);
          
          if (incomeError) throw incomeError;
          
          // Get expenses for this month
          const { data: expenseData, error: expenseError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'expense')
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate);
          
          if (expenseError) throw expenseError;
          
          // Calculate totals
          const totalIncome = incomeData.reduce((sum, transaction) => 
            sum + parseFloat(transaction.amount), 0);
          const totalExpense = expenseData.reduce((sum, transaction) => 
            sum + parseFloat(transaction.amount), 0);
          
          months.push({
            month: new Date(currentYear, month, 1).toLocaleString('default', { month: 'short' }),
            income: totalIncome,
            expense: totalExpense,
            balance: totalIncome - totalExpense
          });
        }
        
        return months;
      } catch (error) {
        console.error('Error fetching monthly trends:', error);
        throw error;
      }
    },

    dashboardData: async () => {
      try {
        // Get summary
        const summary = await transactionService.getDashboardSummary();
        
        // Get expense category breakdown
        const expenseBreakdown = await transactionService.getCategoryBreakdown('expense');
        const totalExpense = expenseBreakdown.reduce((sum, category) => sum + category.total, 0);
        const categoryBreakdown = expenseBreakdown.map(category => ({
          ...category,
          percentage: totalExpense > 0 ? (category.total / totalExpense) * 100 : 0
        }));
        
        // Get recent transactions
        const { data: recentTransactions, error: transactionsError } = await supabase
          .from('transactions')
          .select(`
            *,
            categories (*)
          `)
          .order('transaction_date', { ascending: false })
          .limit(5);
        
        if (transactionsError) throw transactionsError;
        
        // Get savings goals
        const goals = await savingsService.getSavingsGoals();
        const savingsGoals = goals.map(goal => ({
          ...goal,
          progress_percentage: Math.min(100, (parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100)
        }));
        
        // Get monthly trends for the last 6 months
        const monthlyTrends = [];
        const currentDate = new Date();
        
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(currentDate.getMonth() - i);
          
          const startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
          const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
          
          // Get income for this month
          const { data: incomeData, error: incomeError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'income')
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate);
          
          if (incomeError) throw incomeError;
          
          // Get expenses for this month
          const { data: expenseData, error: expenseError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'expense')
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate);
          
          if (expenseError) throw expenseError;
          
          // Calculate totals
          const totalIncome = incomeData.reduce((sum, transaction) => 
            sum + parseFloat(transaction.amount), 0);
          const totalExpense = expenseData.reduce((sum, transaction) => 
            sum + parseFloat(transaction.amount), 0);
          
          monthlyTrends.push({
            month: date.toLocaleString('default', { month: 'short' }),
            income: totalIncome,
            expense: totalExpense,
            balance: totalIncome - totalExpense
          });
        }
        
        return {
          summary,
          categoryBreakdown,
          recentTransactions,
          savingsGoals,
          monthlyTrends
        };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
      }
    }
  },

  Mutation: {
    // Transaction mutations
    createTransaction: async (_: any, { transaction }: { transaction: TransactionInput }) => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const newTransaction = {
          ...transaction,
          user_id: user.id
        };

        const result = await transactionService.addTransaction(newTransaction);
        
        // If it's an expense transaction related to a savings goal, update the goal
        if (transaction.type === 'expense' && transaction.savings_goal_id) {
          await savingsService.updateGoalProgress(
            transaction.savings_goal_id, 
            parseFloat(transaction.amount.toString())
          );
        }
        
        return result;
      } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
    },
    
    updateTransaction: async (_: any, { id, transaction }: { id: string, transaction: Partial<TransactionInput> }) => {
      try {
        return await transactionService.updateTransaction(id, transaction);
      } catch (error) {
        console.error('Error updating transaction:', error);
        throw error;
      }
    },
    
    deleteTransaction: async (_: any, { id }: { id: string }) => {
      try {
        return await transactionService.deleteTransaction(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
      }
    },
    
    // Category mutations
    createCategory: async (_: any, { name, type, color }: { name: string, type: 'income' | 'expense', color: string }) => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) throw new Error('Not authenticated');
        
        return await categoryService.addCategory({
          name,
          type,
          color,
          user_id: user.id
        });
      } catch (error) {
        console.error('Error creating category:', error);
        throw error;
      }
    },
    
    updateCategory: async (_: any, { id, name, type, color }: { id: string, name?: string, type?: 'income' | 'expense', color?: string }) => {
      try {
        const updates: Record<string, any> = {};
        if (name !== undefined) updates.name = name;
        if (type !== undefined) updates.type = type;
        if (color !== undefined) updates.color = color;
        
        return await categoryService.updateCategory(id, updates);
      } catch (error) {
        console.error('Error updating category:', error);
        throw error;
      }
    },
    
    deleteCategory: async (_: any, { id }: { id: string }) => {
      try {
        return await categoryService.deleteCategory(id);
      } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
    },
    
    // Savings Goal mutations
    createSavingsGoal: async (_: any, { goal }: { goal: SavingsGoalInput }) => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) throw new Error('Not authenticated');
        
        return await savingsService.addSavingsGoal({
          ...goal,
          user_id: user.id,
          current_amount: goal.current_amount || 0,
          start_date: new Date().toISOString().split('T')[0]
        });
      } catch (error) {
        console.error('Error creating savings goal:', error);
        throw error;
      }
    },
    
    updateSavingsGoal: async (_: any, { id, goal }: { id: string, goal: Partial<SavingsGoalInput> }) => {
      try {
        return await savingsService.updateSavingsGoal(id, goal);
      } catch (error) {
        console.error('Error updating savings goal:', error);
        throw error;
      }
    },
    
    deleteSavingsGoal: async (_: any, { id }: { id: string }) => {
      try {
        return await savingsService.deleteSavingsGoal(id);
      } catch (error) {
        console.error('Error deleting savings goal:', error);
        throw error;
      }
    },
    
    updateGoalProgress: async (_: any, { id, amount }: { id: string, amount: number }) => {
      try {
        return await savingsService.updateGoalProgress(id, amount);
      } catch (error) {
        console.error('Error updating goal progress:', error);
        throw error;
      }
    }
  }
};