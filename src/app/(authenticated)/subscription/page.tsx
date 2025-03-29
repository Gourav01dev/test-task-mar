"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash, Plus, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transactionService } from "@/backend/services/transaction.service";
import { categoryService } from "@/backend/services/category.service";
import { Category, Transaction } from "@/backend/types";

const TransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: "income",
    category_id: "",
    amount: "",
    transaction_date: new Date().toISOString().split('T')[0],
    description: ""
  });

  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Fetch transactions and categories on component mount
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Filter transactions
  const filterTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: any = {};
      
      if (filterType !== "all") {
        filters.type = filterType;
      }
      
      if (filterCategory !== "all") {
        filters.categoryId = filterCategory;
      }
      
      const data = await transactionService.getFilteredTransactions(filters);
      setTransactions(data);
    } catch (err) {
      console.error("Error filtering transactions:", err);
      setError("Failed to filter transactions");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  useEffect(() => {
    if (!loading) {
      filterTransactions();
    }
  }, [filterType, filterCategory]);

  // Handle Add Transaction
  const handleAddTransaction = async () => {
    try {
      if (!newTransaction.amount || !newTransaction.category_id || !newTransaction.transaction_date) {
        setError("Please fill all required fields");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      // Create the transaction object to send to the API
      const transaction = {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount.toString()),
      } as Omit<Transaction, 'id' | 'created_at'>;
      
      await transactionService.addTransaction(transaction);
      
      // Clear form and refresh transactions
      setNewTransaction({
        type: "income",
        category_id: "",
        amount: "",
        transaction_date: new Date().toISOString().split('T')[0],
        description: ""
      });
      
      setOpenAddDialog(false);
      fetchTransactions();
    } catch (err) {
      console.error("Error adding transaction:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Update Transaction
  const handleUpdateTransaction = async () => {
    try {
      if (!editTransaction || !editTransaction.id) return;
      
      setLoading(true);
      setError(null);
      
      // Update transaction
      const updates = {
        amount: parseFloat(editTransaction.amount.toString()),
        transaction_date: editTransaction.transaction_date,
        description: editTransaction.description
      };
      
      await transactionService.updateTransaction(editTransaction.id, updates);
      
      setEditTransaction(null);
      setOpenEditDialog(false);
      fetchTransactions();
    } catch (err) {
      console.error("Error updating transaction:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Transaction
  const handleDeleteTransaction = async (id: string) => {
    try {
      if (!confirm("Are you sure you want to delete this transaction?")) {
        return;
      }
      
      setLoading(true);
      setError(null);
      
      await transactionService.deleteTransaction(id);
      fetchTransactions();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  // Format amount for display
  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount);
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="w-full p-6 space-y-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold">Transaction Management</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-start items-center gap-4 flex-wrap">
        {/* Type Filter */}
        <Select
          value={filterType}
          onValueChange={(value) => setFilterType(value)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Filter by Type">
              {filterType === "all" ? "All Types" : filterType === "income" ? "Income" : "Expense"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Category Filter */}
        <Select
          value={filterCategory}
          onValueChange={(value) => setFilterCategory(value)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Filter by Category">
              {filterCategory === "all" ? "All Categories" : getCategoryName(filterCategory)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Refresh Button */}
        <Button 
          variant="outline" 
          onClick={fetchTransactions} 
          disabled={loading}
          className="ml-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span className="ml-2">Refresh</span>
        </Button>
        
        {/* Add Transaction Button */}
        <Button
          onClick={() => setOpenAddDialog(true)}
          className="bg-green-500 text-white flex items-center justify-center"
          disabled={loading}
        >
          <Plus size={20} /> Add Transaction
        </Button>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Transaction Type */}
            <Select
              value={newTransaction.type}
              onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value as "income" | "expense" })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type">
                  {newTransaction.type === "income" ? "Income" : "Expense"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Category Selection */}
            <Select
              value={newTransaction.category_id}
              onValueChange={(value) => setNewTransaction({ ...newTransaction, category_id: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category">
                  {newTransaction.category_id ? getCategoryName(newTransaction.category_id) : "Select Category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter(cat => cat.type === newTransaction.type)
                  .map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            
            {/* Amount */}
            <Input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            />
            
            {/* Date */}
            <Input
              type="date"
              value={newTransaction.transaction_date}
              onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
            />
            
            {/* Description */}
            <Input
              placeholder="Description (optional)"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            />
            
            {/* Add Button */}
            <Button 
              onClick={handleAddTransaction} 
              className="bg-blue-500 text-white"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Transaction"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transactions Table */}
      <Table className="w-full border border-gray-200">
        <TableCaption>Transaction History</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && !transactions.length ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                Loading transactions...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No transactions available
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-b">
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
  {transaction.category && typeof transaction.category === 'object' 
    ? transaction.category.name 
    : getCategoryName(transaction.category_id)}
</TableCell>
                <TableCell className={`text-right font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatAmount(transaction.amount)}
                </TableCell>
                <TableCell>{new Date(transaction.transaction_date).toLocaleDateString()}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {transaction.description || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditTransaction(transaction);
                        setOpenEditDialog(true);
                      }}
                      disabled={loading}
                    >
                      <Pencil size={16} />
                    </Button>
                    
                    {/* Delete Button */}
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      disabled={loading}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Edit Transaction Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Amount */}
            <Input
              type="number"
              placeholder="Amount"
              value={editTransaction?.amount || ""}
              onChange={(e) => setEditTransaction({ ...editTransaction!, amount: parseFloat(e.target.value) })}
            />
            
            {/* Date */}
            <Input
              type="date"
              value={editTransaction?.transaction_date || ""}
              onChange={(e) => setEditTransaction({ ...editTransaction!, transaction_date: e.target.value })}
            />
            
            {/* Description */}
            <Input
              placeholder="Description (optional)"
              value={editTransaction?.description || ""}
              onChange={(e) => setEditTransaction({ ...editTransaction!, description: e.target.value })}
            />
            
            {/* Update Button */}
            <Button 
              onClick={handleUpdateTransaction} 
              className="bg-blue-500 text-white"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Transaction"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionPage;