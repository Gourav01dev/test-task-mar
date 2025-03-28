import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type Category {
    id: ID!
    name: String!
    type: String!
    color: String!
  }

  type Transaction {
    id: ID!
    amount: Float!
    type: String!
    category: Category!
    description: String
    transaction_date: String!
    created_at: String!
  }

  type SavingsGoal {
    id: ID!
    name: String!
    target_amount: Float!
    current_amount: Float!
    start_date: String!
    end_date: String!
    progress_percentage: Float!
  }

  type TransactionSummary {
    totalIncome: Float!
    totalExpense: Float!
    balance: Float!
    startDate: String!
    endDate: String!
  }

  type CategoryBreakdown {
    id: ID!
    name: String!
    color: String!
    total: Float!
    percentage: Float!
  }

  type MonthlyTrend {
    month: String!
    income: Float!
    expense: Float!
    balance: Float!
  }

  type DashboardData {
    summary: TransactionSummary!
    categoryBreakdown: [CategoryBreakdown!]!
    recentTransactions: [Transaction!]!
    savingsGoals: [SavingsGoal!]!
    monthlyTrends: [MonthlyTrend!]!
  }

  input TransactionInput {
    amount: Float!
    type: String!
    category_id: ID!
    description: String
    transaction_date: String!
  }

  input SavingsGoalInput {
    name: String!
    target_amount: Float!
    current_amount: Float
    end_date: String!
  }

  input DateRangeInput {
    startDate: String!
    endDate: String!
  }

  type Query {
    # User
    currentUser: User

    # Transactions
    transactions(
      startDate: String
      endDate: String
      type: String
      categoryId: ID
    ): [Transaction!]!
    
    transaction(id: ID!): Transaction
    
    # Categories
    categories(type: String): [Category!]!
    category(id: ID!): Category
    
    # Savings Goals
    savingsGoals: [SavingsGoal!]!
    savingsGoal(id: ID!): SavingsGoal
    
    # Dashboard
    dashboardSummary: TransactionSummary!
    categoryBreakdown(type: String!, period: String): [CategoryBreakdown!]!
    monthlyTrends(year: Int): [MonthlyTrend!]!
    dashboardData: DashboardData!
  }

  type Mutation {
    # Transactions
    createTransaction(transaction: TransactionInput!): Transaction!
    updateTransaction(id: ID!, transaction: TransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
    
    # Categories
    createCategory(name: String!, type: String!, color: String!): Category!
    updateCategory(id: ID!, name: String, type: String, color: String): Category!
    deleteCategory(id: ID!): Boolean!
    
    # Savings Goals
    createSavingsGoal(goal: SavingsGoalInput!): SavingsGoal!
    updateSavingsGoal(id: ID!, goal: SavingsGoalInput!): SavingsGoal!
    deleteSavingsGoal(id: ID!): Boolean!
    updateGoalProgress(id: ID!, amount: Float!): SavingsGoal!
  }
`;