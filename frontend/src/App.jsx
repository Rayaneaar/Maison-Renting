import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Catalog from "./pages/Catalog";
import PropertyDetails from "./pages/PropertyDetails";
import Dashboard from "./pages/Dashboard";
import Chats from "./pages/Chats";
import ListingForm from "./pages/ListingForm";
import SavedProperties from "./pages/SavedProperties";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

import MiniChat from "./components/MiniChat";

export default function App() {
  const location = useLocation();
  
  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <MiniChat />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/properties" element={<Catalog />} />
        <Route path="/properties/:slug" element={<PropertyDetails />} />
        <Route path="/profile/:id" element={<Profile />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/new"
          element={
            <ProtectedRoute role="seller">
              <ListingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/edit/:slug"
          element={
            <ProtectedRoute role="seller">
              <ListingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute role="client">
              <SavedProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute role="client">
              <Chats />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      </AnimatePresence>
    </>
  );
}
