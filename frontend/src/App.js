import React from "react";
import { Route, Routes } from "react-router-dom";
import Mailbox from "./pages/Mailbox/Mailbox";
import Layout from "./pages/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Mailbox />} />
          <Route path="mailbox" element={<Mailbox />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
