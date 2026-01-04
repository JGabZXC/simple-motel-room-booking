import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../shared/components/Layout";
import RoomList from "../features/rooms/components/RoomList";
import RoomForm from "../features/rooms/components/RoomForm";
import BookingList from "../features/bookings/components/BookingList";
import BookingForm from "../features/bookings/components/BookingForm";
import BookingDetail from "../features/bookings/components/BookingDetail";
import CustomerList from "../features/customers/components/CustomerList";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/rooms" replace />} />

        {/* Rooms */}
        <Route path="rooms" element={<RoomList />} />
        <Route path="rooms/new" element={<RoomForm />} />
        <Route path="rooms/:code/edit" element={<RoomForm />} />

        {/* Bookings */}
        <Route path="bookings" element={<BookingList />} />
        <Route path="bookings/new" element={<BookingForm />} />
        <Route path="bookings/:id" element={<BookingDetail />} />

        {/* Customers */}
        <Route path="customers" element={<CustomerList />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
