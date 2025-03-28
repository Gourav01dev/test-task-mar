"use client";

import React, { useState } from "react";
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
import { Pencil, Trash, Plus } from "lucide-react";
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

interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: string;
  date: string;
}

const categories = ["Food", "Utilities", "Entertainment", "Salary", "Freelancing"];
 const transactionData =[
    { id: "T001", type: "Income", category: "Salary", amount: "$5000", date: "2024-03-01" },
    { id: "T002", type: "Expense", category: "Food", amount: "$200", date: "2024-03-02" },
    { id: "T003", type: "Expense", category: "Utilities", amount: "$150", date: "2024-03-03" },
    { id: "T004", type: "Income", category: "Freelancing", amount: "$1200", date: "2024-03-04" },
    { id: "T005", type: "Expense", category: "Entertainment", amount: "$100", date: "2024-03-05" },
  ]
const TransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "T001", type: "Income", category: "Salary", amount: "$5000", date: "2024-03-01" },
    { id: "T002", type: "Expense", category: "Food", amount: "$200", date: "2024-03-02" },
    { id: "T003", type: "Expense", category: "Utilities", amount: "$150", date: "2024-03-03" },
    { id: "T004", type: "Income", category: "Freelancing", amount: "$1200", date: "2024-03-04" },
    { id: "T005", type: "Expense", category: "Entertainment", amount: "$100", date: "2024-03-05" },
  ]);

  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: "",
    type: "Income",
    category: "",
    amount: "",
    date: "",
  });

  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Handle Add Transaction
  const handleAddTransaction = () => {
    if (newTransaction.id ) {
      setTransactions([...transactions, { ...newTransaction }]);
      setNewTransaction({ id: "", type: "Income", category: "", amount: "", date: "" });
      setOpenAddDialog(false); // Close the Add Dialog after adding
    }
  };

  // Handle Update Transaction
  const handleUpdateTransaction = () => {
    if (!editTransaction) return;
    setTransactions(transactions.map((txn) => (txn.id === editTransaction.id ? editTransaction : txn)));
    setEditTransaction(null);
    setOpenEditDialog(false); // Close the Edit Dialog after updating
  };

  // Handle Delete Transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

    // Handle Delete Transaction
    const handleFilter = (type: string) => {
        console.log("aaa", type);
        const newValue= {...newTransaction};
        newValue.type=type;
        setNewTransaction(newValue);
        
        setTransactions(transactionData.filter((transaction) => transaction.type== type));
      };

      const handleFilterData = (type: string) => {
        console.log("aaa", type);
        const newValue= {...newTransaction};
        newValue.category=type;
        setNewTransaction(newValue);
        
        setTransactions(transactionData.filter((transaction) => transaction.category== type));
      };
  return (
    <div className="w-full p-6 space-y-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold">Transaction Management</h2>
      <div className="flex justify-start items-center gap-4">

      <Select
          value={newTransaction.type}
          onValueChange={handleFilter}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Select Type">{newTransaction.type}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Income">Income</SelectItem>
            <SelectItem value="Expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={newTransaction.category}
          onValueChange={handleFilterData}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Select Category">{newTransaction.category}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      {/* Add Transaction Button (Triggers Dialog) */}
      <Button
        onClick={() => setOpenAddDialog(true)}
        className="bg-green-500 text-white flex items-center justify-center"
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
            <Input
              placeholder="Transaction ID"
              value={newTransaction.id}
              onChange={(e) => setNewTransaction({ ...newTransaction, id: e.target.value })}
            />
            <Select
              value={newTransaction.type}
              onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value as "Income" | "Expense" })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type">{newTransaction.type}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={newTransaction.category}
              onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category">{newTransaction.category}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            />
            <Button onClick={handleAddTransaction} className="bg-blue-500 text-white">
              Add Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transactions Table */}
      <Table className="w-full border border-gray-200">
        <TableCaption>Transaction History</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No transactions available
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-b">
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className="text-right">{transaction.amount}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  {/* Edit Button */}
                  <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditTransaction(transaction);
                          setOpenEditDialog(true);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <Input
                          placeholder="Amount"
                          value={editTransaction?.amount || ""}
                          onChange={(e) => setEditTransaction({ ...editTransaction!, amount: e.target.value })}
                        />
                        <Input
                          type="date"
                          value={editTransaction?.date || ""}
                          onChange={(e) => setEditTransaction({ ...editTransaction!, date: e.target.value })}
                        />
                        <Button onClick={handleUpdateTransaction} className="bg-blue-500 text-white">
                          Update
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteTransaction(transaction.id)}>
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionPage;
