import React from "react";
import { Route, Routes } from "react-router-dom";
import Mailbox from "./pages/Mailbox/Mailbox";
import Layout from "./pages/Layout";
import PlatinumUsers from "./pages/Zatca/PlatinumUsers";
import GoldUsers from "./pages/Zatca/GoldUsers";
import UsersList from "./pages/Zatca/UsersList";
import Payments from "./pages/Zatca/Payments";

function App() {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Mailbox />} />
          <Route path="mailbox" element={<Mailbox />} />
          <Route path="zatca/users-list" element={<UsersList />} />
          <Route path="zatca/platinum-users" element={<PlatinumUsers />} />
          <Route path="zatca/gold-users" element={<GoldUsers />} />
          <Route path="zatca/payments" element={<Payments />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
