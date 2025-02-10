import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../components/Loader";

const DocUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://quickdoc-server.vercel.app/api/auth/get-users",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            mode: "cors", // Enable CORS
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");
        const responseData = await response.json();
        const usersArray = responseData.data || [];
        setUsers(usersArray);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getMonthlyData = (filterFn) => {
    const monthlyCounts = new Map();
    const filteredUsers = filterFn ? users.filter(filterFn) : users;
    let runningTotal = 0;

    const sortedUsers = [...filteredUsers].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    sortedUsers.forEach((user) => {
      try {
        const date = new Date(user.createdAt);
        const monthYear = date.toISOString().substring(0, 7);
        const displayMonth = `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getFullYear()}`;

        runningTotal += 1;

        monthlyCounts.set(monthYear, {
          sortKey: monthYear,
          month: displayMonth,
          users: runningTotal,
        });
      } catch (err) {
        console.warn(`Error processing date for user:`, user, err);
      }
    });

    return Array.from(monthlyCounts.values()).sort((a, b) =>
      a.sortKey.localeCompare(b.sortKey)
    );
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );

  const premiumUsers = users.filter((u) => u.package === "pro");
  const freemiumUsers = users.filter((u) => u.package === "not-pro");

  return (
    <div className="min-h-screen bg-white p-4 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            QuickDoc Users Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor your platform's performance and user activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Users Card */}
          <div className="bg-slate-50 rounded-lg border border-slate-100 p-4">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
                <i className="fas fa-users text-blue-500 text-xl" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {users.length}
                </h3>
              </div>
            </div>
          </div>

          {/* Platinum Users Card */}
          <div className="bg-slate-50 rounded-lg border border-slate-100 p-4">
            <div className="flex items-center">
              <div className="bg-purple-50 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
                <i className="fas fa-crown text-purple-500 text-xl" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">
                  Premium Users
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {premiumUsers.length}
                </h3>
              </div>
            </div>
          </div>

          {/* Gold Users Card */}
          <div className="bg-slate-50 rounded-lg border border-slate-100 p-4">
            <div className="flex items-center">
              <div className="bg-yellow-50 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
                <i className="fas fa-medal text-yellow-500 text-xl" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Basic Users</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {freemiumUsers.length}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg border border-slate-100 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Total Users Growth
              </h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getMonthlyData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                    axisLine={false}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3B82F6" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg border border-slate-100 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Premium Users Growth
              </h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getMonthlyData((user) => user.package === "pro")}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                    axisLine={false}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#8B5CF6" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg border border-slate-100 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Pro Package Users Growth
              </h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getMonthlyData((user) => user.package === "not-pro")}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                    axisLine={false}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#F59E0B" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocUsersList;
