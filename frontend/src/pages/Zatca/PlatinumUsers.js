import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";

const PlatinumUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    searchTerm: "",
  });

  const statusOptions = [
    {
      value: "premium",
      label: "Premium",
      color: "bg-purple-50 text-purple-700",
    },
    {
      value: "basic",
      label: "Basic",
      color: "bg-yellow-50 text-yellow-700",
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://zatca.bzsconnect.com/api/fetch-user-stats"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        const usersArray = Array.isArray(data)
          ? data
          : data.data
          ? data.data
          : data.users
          ? data.users
          : [data];

        // Filter only Platinum ZATCA package users
        const platinumUsers = usersArray.filter(
          (user) =>
            user.package.toLowerCase() === "platinum zatca".toLowerCase()
        );
        setUsers(platinumUsers);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      return dateString;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesStatus =
      filters.status === "all" || user?.status === filters.status;
    const searchTerm = filters.searchTerm.toLowerCase();
    const fullName = user?.fullName?.toLowerCase() || "";
    const email = user?.email?.toLowerCase() || "";
    return (
      matchesStatus &&
      (filters.searchTerm === "" ||
        fullName.includes(searchTerm) ||
        email.includes(searchTerm))
    );
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-red-500 p-6 rounded-lg">
          <p className="text-white text-sm">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-2xl">
      <div className="bg-white border-b rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
              Platinum Users Dashboard
            </h1>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-blue-700 text-sm">
                Total Platinum Users: {filteredUsers.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Search Users
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by name or email..."
                  onChange={(e) =>
                    setFilters({ ...filters, searchTerm: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="all">All Status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No Platinum users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id || Math.random()}
                className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-800">
                      {user.fullName || "N/A"}
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.email || "N/A"}
                  </p>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Package</span>
                      <span className="text-xs font-medium text-gray-700">
                        {user.package || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Current Status
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          statusOptions.find((opt) => opt.value === user.status)
                            ?.color || "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {statusOptions.find((opt) => opt.value === user.status)
                          ?.label || "Unknown"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Purchased On
                      </span>
                      <span className="text-xs text-gray-700">
                        {formatDate(user.purchasedOn)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Expiry Date</span>
                      <span className="text-xs text-gray-700">
                        {formatDate(user.purchasedExpiry)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Last Updated
                      </span>
                      <span className="text-xs text-gray-700">
                        {formatDate(user.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatinumUsers;
