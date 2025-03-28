import React from "react";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import ColumnGraph from "@/components/Columngraph";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import BookingGraph from "@/components/PieGraph";

const dashboardData = [
  {
    id: 1,
    title: "Total Income",
    amount: "$5,000",
    description: "Total earnings this month",
    icon: <TrendingUp className="text-green-500 w-8 h-8" />,
  },
  {
    id: 2,
    title: "Total Expenses",
    amount: "$2,500",
    description: "Total spent this month",
    icon: <TrendingDown className="text-red-500 w-8 h-8" />,
  },
  {
    id: 3,
    title: "Current Balance",
    amount: "$2,500",
    description: "Remaining balance",
    icon: <DollarSign className="text-blue-500 w-8 h-8" />,
  },
];

const HomePage = () => {
  const expenseData= [500,200,400,500,450,152,145,145,256,356,145,125]
  return (
    <div className="w-full max-w-[100dvw] mx-auto flex flex-col gap-5">
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
      <Card className=" !shadow-md">
  <CardHeader>
    <CardTitle>Income</CardTitle>
  </CardHeader>
  <CardContent>
  <ColumnGraph id="income" name="Income" rate={expenseData} />
  </CardContent>
</Card>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
      <Card className="md:col-span-2 !shadow-md">
  <CardHeader>
    <CardTitle>Expenses</CardTitle>
  </CardHeader>
  <CardContent>
  <ColumnGraph id="expense" name="Expenses" rate={expenseData} />
  </CardContent>
</Card>

<Card className=" !shadow-md max-h-[300px]">
  <CardHeader>
    <CardTitle>Expense/income rartio</CardTitle>
  </CardHeader>
  <CardContent>
  <BookingGraph id="booking" rate={50} />
  </CardContent>
</Card>
      </div>
    </div>
  );
};

export default HomePage;
