import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/data";
import ReplyModal from "./ReplyModal";

const Mailbox = () => {
  const { authURL } = useAuth();
  const [allEmails, setAllEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New states for reply modal
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyData, setReplyData] = useState({
    replyTo: "",
    appGenre: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "BZSoftech@awaisCEO",
  };

  useEffect(() => {
    fetchAllEmails();
  }, []);

  const fetchAllEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${authURL}/emails`, {
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch emails");
      const data = await response.json();
      setAllEmails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEmails = () => {
    let filtered = [...allEmails];

    // Filter by folder
    if (currentFolder === "inbox") {
      filtered = filtered.filter(
        (email) => !email.labels || email.labels === "inbox"
      );
    } else {
      filtered = filtered.filter((email) => email.labels === currentFolder);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (email) =>
          email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // New function to handle reply submission
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await fetch(`${authURL}/replies`, {
        method: "POST",
        headers,
        body: JSON.stringify(replyData),
      });

      if (!response.ok) throw new Error("Failed to send reply");

      // Close modal and reset form
      setIsReplyModalOpen(false);
      setReplyData({
        replyTo: "",
        appGenre: "",
        subject: "",
        message: "",
      });

      // Fetch updated emails
      await fetchAllEmails();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  // Modified handleReply function
  const handleReply = (email) => {
    setReplyData({
      replyTo: email.from,
      appGenre: email.appGenre || "",
      subject: `Re: ${email.subject}`,
      message: "",
    });
    setIsReplyModalOpen(true);
  };

  const getUnreadCount = (folder) => {
    return allEmails.filter(
      (email) => (!email.labels || email.labels === folder) && !email.isRead
    ).length;
  };

  const handleStarEmail = async (emailId) => {
    try {
      const email = allEmails.find((e) => e._id === emailId);
      const newLabels = email.labels === "starred" ? "inbox" : "starred";

      const response = await fetch(`${authURL}/emails/${emailId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ labels: newLabels }),
      });

      if (!response.ok) throw new Error("Failed to star email");

      setAllEmails(
        allEmails.map((email) =>
          email._id === emailId ? { ...email, labels: newLabels } : email
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAsRead = async (emailId, isRead = true) => {
    try {
      const response = await fetch(`${authURL}/emails/${emailId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ isRead }),
      });

      if (!response.ok) throw new Error("Failed to mark email as read");

      setAllEmails(
        allEmails.map((email) =>
          email._id === emailId ? { ...email, isRead } : email
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMoveToTrash = async (emailId) => {
    try {
      const response = await fetch(`${authURL}/emails/${emailId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ labels: "trash" }),
      });

      if (!response.ok) throw new Error("Failed to move email to trash");

      setAllEmails(
        allEmails.map((email) =>
          email._id === emailId ? { ...email, labels: "trash" } : email
        )
      );
      setSelectedEmail(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePermanently = async (emailId) => {
    try {
      const response = await fetch(`${authURL}/emails/${emailId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) throw new Error("Failed to delete email");

      setAllEmails(allEmails.filter((email) => email._id !== emailId));
      setSelectedEmail(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  const filteredEmails = getFilteredEmails();

  return (
    <div className="bg-gray-50 min-h-screen rounded-2xl">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Mailbox</h1>

          {/* Search field */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>

          {/* Folder navigation */}
          <div className="flex space-x-4 mb-6">
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                currentFolder === "inbox"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentFolder("inbox")}
            >
              <i className="fas fa-inbox"></i>
              <span>Inbox</span>
              {getUnreadCount("inbox") > 0 && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                  {getUnreadCount("inbox")}
                </span>
              )}
            </button>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                currentFolder === "starred"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentFolder("starred")}
            >
              <i className="fas fa-star"></i>
              <span>Starred</span>
            </button>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                currentFolder === "trash"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentFolder("trash")}
            >
              <i className="fas fa-trash"></i>
              <span>Trash</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex">
            {/* Email list */}
            <div className="w-1/3 border-r border-gray-200">
              {filteredEmails.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No emails found
                </div>
              ) : (
                filteredEmails.map((email) => (
                  <div
                    key={email._id}
                    className={`border-b border-gray-100 p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedEmail?._id === email._id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      setSelectedEmail(email);
                      if (!email.isRead) handleMarkAsRead(email._id);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarEmail(email._id);
                          }}
                          className={`focus:outline-none ${
                            email.labels === "starred"
                              ? "text-yellow-400"
                              : "text-gray-400 hover:text-yellow-400"
                          }`}
                        >
                          <i className="fas fa-star"></i>
                        </button>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {email.fullName}
                            </span>
                            {!email.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {email.from}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {email.subject}
                          </div>
                          <div className="text-xs text-gray-500">
                            App Genre: {email.appGenre || "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(email.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Email detail view */}
            <div className="w-2/3 p-6">
              {selectedEmail ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      {selectedEmail.subject}
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleMarkAsRead(
                            selectedEmail._id,
                            !selectedEmail.isRead
                          )
                        }
                        className="p-2 text-gray-500 hover:text-gray-700"
                        title={
                          selectedEmail.isRead
                            ? "Mark as unread"
                            : "Mark as read"
                        }
                      >
                        <i
                          className={`fas fa-envelope${
                            selectedEmail.isRead ? "" : "-open"
                          }`}
                        ></i>
                      </button>
                      {currentFolder === "trash" ? (
                        <button
                          onClick={() =>
                            handleDeletePermanently(selectedEmail._id)
                          }
                          className="p-2 text-red-500 hover:text-red-700"
                          title="Delete Permanently"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMoveToTrash(selectedEmail._id)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                          title="Move to Trash"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            From: {selectedEmail.fullName}
                          </span>
                          <span className="text-gray-500">
                            ({selectedEmail.from})
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                selectedEmail.from,
                                selectedEmail._id
                              )
                            }
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <i
                              className={`fas ${
                                copiedId === selectedEmail._id
                                  ? "fa-check"
                                  : "fa-copy"
                              }`}
                            ></i>
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(selectedEmail.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        App Genre: {selectedEmail.appGenre || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="prose max-w-none mb-6">
                    {selectedEmail.message}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => handleReply(selectedEmail)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <i className="fas fa-reply mr-2"></i>
                      Reply
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500">
                  Select an email to view
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isReplyModalOpen && (
        <ReplyModal
          isOpen={isReplyModalOpen}
          onClose={() => setIsReplyModalOpen(false)}
          replyData={replyData}
          setReplyData={setReplyData}
          onSubmit={handleReplySubmit}
          sending={sending}
        />
      )}
    </div>
  );
};

export default Mailbox;
