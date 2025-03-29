export type User = {
    id: string;
    email: string;
    created_at: string;
  };
  
  export type Transaction = {
    id: string;
    user_id: string;
    amount: number | string;
    category?:string;
    type: 'income' | 'expense';
    category_id: string;
    description?: string;
    transaction_date: string;
    created_at: string;
  };
  
  export type Category = {
    id: string;
    user_id: string;
    name: string;
    type: 'income' | 'expense';
    color: string;
    created_at: string;
  };
  
  export type SavingsGoal = {
    id: string;
    user_id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    start_date: string;
    end_date: string;
    created_at: string;
  };
  
  export type TransactionWithCategory = Transaction & {
    category: Category;
  };
  
  export type DashboardSummary = {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    startDate: string;
    endDate: string;
  };
  
  export type CategoryBreakdown = {
    id: string;
    name: string;
    color: string;
    total: number;
    percentage: number;
  };