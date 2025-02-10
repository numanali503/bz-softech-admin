import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FixedSizeList as List } from "react-window";

const Dashboard = () => {
  const salesData = useMemo(
    () => [
      { month: "Jan", sales: 4000, profit: 2400 },
      { month: "Feb", sales: 3000, profit: 1398 },
      { month: "Mar", sales: 9800, profit: 2000 },
      { month: "Apr", sales: 3908, profit: 2780 },
      { month: "May", sales: 4800, profit: 1890 },
      { month: "Jun", sales: 3800, profit: 2390 },
    ],
    []
  );

  const pieData = useMemo(
    () => [
      { name: "Desktop", value: 400, color: "#0088FE" },
      { name: "Mobile", value: 300, color: "#00C49F" },
      { name: "Tablet", value: 200, color: "#FFBB28" },
    ],
    []
  );

  const orders = useMemo(
    () => [
      {
        id: "#12345",
        customer: "John Smith",
        product: "iPhone 13 Pro",
        amount: "$999",
        status: "Completed",
      },
      {
        id: "#12346",
        customer: "Sarah Johnson",
        product: "MacBook Air",
        amount: "$1299",
        status: "Pending",
      },
      {
        id: "#12347",
        customer: "Michael Brown",
        product: "AirPods Pro",
        amount: "$249",
        status: "Processing",
      },
      {
        id: "#12348",
        customer: "Emily Davis",
        product: "iPad Mini",
        amount: "$499",
        status: "Completed",
      },
    ],
    []
  );

  const Row = ({ index, style }) => {
    const order = orders[index];
    return (
      <tr style={style}>
        <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
        <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
        <td className="px-6 py-4 text-sm text-gray-900">{order.product}</td>
        <td className="px-6 py-4 text-sm text-gray-900">{order.amount}</td>
        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              order.status === "Completed"
                ? "bg-green-100 text-green-800"
                : order.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {order.status}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 flex justify-between items-center mb-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <i className="fa-regular fa-bell text-xl"></i>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <i className="fa-regular fa-user text-white"></i>
            </div>
            <span className="text-gray-700">Admin</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-2">$54,234</h3>
              <p className="text-sm mt-2 text-green-500">
                <i className="fa-solid fa-trend-up mr-1"></i>
                12.5%
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-dollar-sign text-white text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold mt-2">2,543</h3>
              <p className="text-sm mt-2 text-red-500">
                <i className="fa-solid fa-trend-down mr-1"></i>
                3.6%
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-users text-white text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">New Orders</p>
              <h3 className="text-2xl font-bold mt-2">1,123</h3>
              <p className="text-sm mt-2 text-green-500">
                <i className="fa-solid fa-trend-up mr-1"></i>
                8.2%
              </p>
            </div>
            <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-shopping-cart text-white text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Conversion Rate</p>
              <h3 className="text-2xl font-bold mt-2">2.4%</h3>
              <p className="text-sm mt-2 text-green-500">
                <i className="fa-solid fa-trend-up mr-1"></i>
                4.8%
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-chart-line text-white text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Sales Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Traffic Sources
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <List
            height={200}
            itemCount={orders.length}
            itemSize={50}
            className="w-full"
          >
            {Row}
          </List>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
