import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../services/bookingService";
import type { RoomBooking } from "../types";
import { toast } from "react-toastify";

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Link
          to="/bookings/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Booking
        </Link>
      </div>
      <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Room</th>
              <th className="py-3 px-6 text-left">Start Time</th>
              <th className="py-3 px-6 text-left">End Time</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-right">Total Price</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {booking.id}
                </td>
                <td className="py-3 px-6 text-left">{booking.room_code}</td>
                <td className="py-3 px-6 text-left">
                  {new Date(booking.start_time).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-left">
                  {new Date(booking.end_time).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`py-1 px-3 rounded-full text-xs ${
                      booking.status === "booked"
                        ? "bg-blue-200 text-blue-600"
                        : booking.status === "checked_in"
                        ? "bg-green-200 text-green-600"
                        : booking.status === "checked_out"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-red-200 text-red-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-right">${booking.total_price}</td>
                <td className="py-3 px-6 text-center">
                  <Link
                    to={`/bookings/${booking.id}`}
                    className="text-blue-500 hover:text-blue-700 text-xs font-bold"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;
