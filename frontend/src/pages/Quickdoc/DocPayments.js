import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";

const DocPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [packageFilter, setPackageFilter] = useState("all");
  const [showScreenshot, setShowScreenshot] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({});

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        "https://quickdoc-server.vercel.app/api/auth/get-users"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPayments(data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch payments data");
      setLoading(false);
    }
  };

  // Handle status change and update API
  const handleStatusChange = async (payment, newStatus) => {
    const payload = {
      package: payment.package,
      purchasedExpiry: payment.purchasedExpiry,
      purchasedOn: payment.purchasedOn,
      status: newStatus,
    };

    try {
      setUpdateStatus({ [payment._id]: "updating" });
      const response = await fetch(
        `https://zatca.bzsconnect.com/api/update-user-data?email=${payment.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      // Update successful
      setUpdateStatus({ [payment._id]: "success" });
      // Refresh payments data
      fetchPayments();

      // Clear status after 3 seconds
      setTimeout(() => {
        setUpdateStatus((prev) => {
          const newState = { ...prev };
          delete newState[payment._id];
          return newState;
        });
      }, 3000);
    } catch (error) {
      console.error("Update failed:", error);
      setUpdateStatus({ [payment._id]: "error" });
      // Clear error status after 3 seconds
      setTimeout(() => {
        setUpdateStatus((prev) => {
          const newState = { ...prev };
          delete newState[payment._id];
          return newState;
        });
      }, 3000);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPackage =
      packageFilter === "all" || payment.package === packageFilter;
    return matchesSearch && matchesPackage;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );

  return (
    <div className="w-full p-6 space-y-6 bg-gray-50">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">QuickDoc Payments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fa-regular fa-magnifying-glass absolute right-3 top-3 text-gray-400"></i>
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
          >
            <option value="all">All Packages</option>
            <option value="pro">Pro</option>
            <option value="not-pro">Not-Pro</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{payment.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.package.toLowerCase() === "pro"
                          ? "bg-green-100 text-green-800"
                          : payment.package.toLowerCase() === "not-pro"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800" // Default style if neither matches
                      }`}
                    >
                      {payment.package}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.createdAt)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      onClick={() => setShowScreenshot(payment.screenshot)}
                    >
                      <i className="fa-regular fa-receipt"></i>
                    </button>
                    <div className="inline-flex items-center gap-2">
                      <select
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        onChange={(e) =>
                          handleStatusChange(payment, e.target.value)
                        }
                        defaultValue=""
                        disabled={updateStatus[payment._id] === "updating"}
                      >
                        <option value="" disabled>
                          Change Status
                        </option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                      </select>
                      {updateStatus[payment._id] === "updating" && (
                        <span className="text-yellow-500">
                          <i className="fa-regular fa-spinner fa-spin"></i>
                        </span>
                      )}
                      {updateStatus[payment._id] === "success" && (
                        <span className="text-green-500">
                          <i className="fa-regular fa-check"></i>
                        </span>
                      )}
                      {updateStatus[payment._id] === "error" && (
                        <span className="text-red-500">
                          <i className="fa-regular fa-xmark"></i>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Modal */}
      {showScreenshot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Payment Receipt</h3>
              <button
                onClick={() => setShowScreenshot(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa-regular fa-times"></i>
              </button>
            </div>
            <img
              src={showScreenshot}
              alt="Payment Receipt"
              className="max-w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocPayments;
