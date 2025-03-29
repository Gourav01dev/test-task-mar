'use client';

import React, { useEffect, useState } from "react";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import ColumnGraph from "@/components/Columngraph";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BookingGraph from "@/components/PieGraph";
import { dashboardService } from "@/backend/services/dashboard.service";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState([
    {
      id: 1,
      title: "Total Income",
      amount: "$0",
      description: "Total earnings this month",
      icon: <TrendingUp className="text-green-500 w-8 h-8" />,
    },
    {
      id: 2,
      title: "Total Expenses",
      amount: "$0",
      description: "Total spent this month",
      icon: <TrendingDown className="text-red-500 w-8 h-8" />,
    },
    {
      id: 3,
      title: "Current Balance",
      amount: "$0",
      description: "Remaining balance",
      icon: <DollarSign className="text-blue-500 w-8 h-8" />,
    },
  ]);
  
  const [monthlyData, setMonthlyData] = useState({
    incomeData: Array(12).fill(0),
    expenseData: Array(12).fill(0)
  });
  
  const [profitRatio, setProfitRatio] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get summary data
        const summary = await dashboardService.getDashboardSummary();
        
        // Calculate total profit
        const profit = summary.balance;
        setTotalProfit(profit);
        
        // Update dashboard cards
        setDashboardData([
          {
            id: 1,
            title: "Total Income",
            amount: `$${summary.totalIncome.toLocaleString()}`,
            description: "Total earnings this month",
            icon: <TrendingUp className="text-green-500 w-8 h-8" />,
          },
          {
            id: 2,
            title: "Total Expenses",
            amount: `$${summary.totalExpense.toLocaleString()}`,
            description: "Total spent this month",
            icon: <TrendingDown className="text-red-500 w-8 h-8" />,
          },
          {
            id: 3,
            title: "Current Balance",
            amount: `$${summary.balance.toLocaleString()}`,
            description: "Remaining balance",
            icon: <DollarSign className="text-blue-500 w-8 h-8" />,
          },
        ]);
        
        // Get monthly data for charts
        const monthly = await dashboardService.getMonthlyData();
        setMonthlyData(monthly);
        
        // Calculate profit percentage (what percentage of income becomes profit)
        const profitPercentage = summary.totalIncome > 0 
          ? Math.round((summary.balance / summary.totalIncome) * 100) 
          : 0;
          
        setProfitRatio(profitPercentage);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="w-full max-w-[100dvw] mx-auto flex flex-col gap-5">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardData.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 rounded-lg border p-6 shadow-md bg-white w-full"
              >
                {item.icon}
                <div className="flex-1">
                  <p className="text-base font-medium">{item.title}</p>
                  <p className="text-xl font-bold">{item.amount}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Card className="!shadow-md">
            <CardHeader>
              <CardTitle>Income</CardTitle>
            </CardHeader>
            <CardContent>
              <ColumnGraph id="income" name="Income" rate={monthlyData.incomeData} />
            </CardContent>
          </Card>
          
          <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
            <Card className="md:col-span-2 !shadow-md">
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ColumnGraph id="expense" name="Expenses" rate={monthlyData.expenseData} />
              </CardContent>
            </Card>
            
            <Card className="!shadow-md max-h-[300px]">
              <CardHeader>
                <CardTitle>Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingGraph 
                  id="booking" 
                  rate={profitRatio} 
                  totalProfit={totalProfit}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;