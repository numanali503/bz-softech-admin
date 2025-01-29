const Email = require("../models/Email");

// Get all emails with optional filtering
const getAllEmails = async (req, res) => {
  try {
    const { labels, isRead } = req.query;
    let query = {};

    if (labels) query.labels = labels;
    if (isRead !== undefined) query.isRead = isRead === "true";

    const emails = await Email.find(query).sort({ createdAt: -1 });
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single email by ID
const getEmailById = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.status(200).json(email);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new email
const createEmail = async (req, res) => {
  try {
    const newEmail = new Email(req.body);
    const savedEmail = await newEmail.save();
    res.status(201).json(savedEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update email - now includes label and read status updates
const updateEmail = async (req, res) => {
  try {
    const { labels, isRead, ...otherUpdates } = req.body;
    const updateData = {
      ...otherUpdates,
    };

    // Only include labels and isRead if they are provided
    if (labels !== undefined) updateData.labels = labels;
    if (isRead !== undefined) updateData.isRead = isRead;

    const updatedEmail = await Email.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedEmail) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.status(200).json(updatedEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete email
const deleteEmail = async (req, res) => {
  try {
    const deletedEmail = await Email.findByIdAndDelete(req.params.id);
    if (!deletedEmail) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.status(200).json({ message: "Email deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEmails,
  getEmailById,
  createEmail,
  updateEmail,
  deleteEmail,
};
