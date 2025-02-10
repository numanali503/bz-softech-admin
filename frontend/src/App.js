import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Mailbox from "./pages/Mailbox/Mailbox";
import Layout from "./pages/Layout";
import ZatcaUsersList from "./pages/Zatca/ZatcaUsersList";
import ZatcaPlatinumUsers from "./pages/Zatca/ZatcaPlatinumUsers";
import ZatcaGoldUsers from "./pages/Zatca/ZatcaGoldUsers";
import ZatcaPayments from "./pages/Zatca/ZatcaPayments";
import DocUsersList from "./pages/Quickdoc/DocUsersList";
import DocPremiumUsers from "./pages/Quickdoc/DocPremiumUsers";
import DocBasicUsers from "./pages/Quickdoc/DocBasicUsers";
import DocPayments from "./pages/Quickdoc/DocPayments";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import Login from "./components/Auth/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute Component={Layout} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="mailbox" element={<Mailbox />} />
          {/* ZATCA Routes */}
          <Route path="zatca/users-list" element={<ZatcaUsersList />} />
          <Route path="zatca/platinum-users" element={<ZatcaPlatinumUsers />} />
          <Route path="zatca/gold-users" element={<ZatcaGoldUsers />} />
          <Route path="zatca/payments" element={<ZatcaPayments />} />
          {/* QuickDoc Routes */}
          <Route path="quickdoc/users-list" element={<DocUsersList />} />
          <Route path="quickdoc/premium-users" element={<DocPremiumUsers />} />
          <Route path="quickdoc/basic-users" element={<DocBasicUsers />} />
          <Route path="quickdoc/payments" element={<DocPayments />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
