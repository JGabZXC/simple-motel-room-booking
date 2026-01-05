import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBookings } from "../hooks/useBookings";
import { toast } from "react-toastify";
import type { RoomBooking } from "../types";
import { Modal } from "../../../shared/components/Modal";

const BookingList: React.FC = () => {
  const { bookings, loading, error, fetchBookings, updateBookingStatus } =
    useBookings({ skipInitialFetch: true });
  const [filters, setFilters] = useState({
    status: "",
    start_time: "",
    end_time: "",
    guest_name: "",
  });

  console.log(loading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  const [targetStatus, setTargetStatus] = useState<
    RoomBooking["status"] | null
  >(null);
  const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(
    null
  );

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchBookings(filters, controller.signal);
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (id: number, newStatus: RoomBooking["status"]) => {
    const booking = bookings.find((b) => b.id === id);
    if (booking) {
      setSelectedBooking(booking);
      setSelectedBookingId(id);
      setTargetStatus(newStatus);
      setIsModalOpen(true);
    }
  };

  const confirmStatusChange = async () => {
    if (selectedBookingId && targetStatus) {
      try {
        await updateBookingStatus(selectedBookingId, targetStatus);
        toast.success(`Booking status updated to ${targetStatus}`);
      } catch (error) {
        toast.error("Failed to update booking status");
      }
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
    setTargetStatus(null);
    setSelectedBooking(null);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Confirm Status Change"
        footer={
          <>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmStatusChange}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirm
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to change the status to{" "}
            <strong>{targetStatus?.replace("_", " ")}</strong>?
          </p>
          {selectedBooking && (
            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-semibold">Room:</span>{" "}
                {selectedBooking.room_code}
              </p>
              <p>
                <span className="font-semibold">Start Time:</span>{" "}
                {new Date(selectedBooking.start_time).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">End Time:</span>{" "}
                {new Date(selectedBooking.end_time).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </Modal>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="text"
            name="guest_name"
            placeholder="Search Guest Name"
            value={filters.guest_name}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          />
          <input
            type="datetime-local"
            name="start_time"
            value={filters.start_time}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          />
          <input
            type="datetime-local"
            name="end_time"
            value={filters.end_time}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          />
          <Link
            to="/bookings/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            New Booking
          </Link>
        </div>
      </div>
      <div className="bg-white shadow-md rounded my-6 overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-blue-500 font-bold">Loading...</div>
          </div>
        )}
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
                <td className="py-3 px-6 text-center flex justify-center gap-2">
                  <Link
                    to={`/bookings/${booking.id}`}
                    className="text-blue-500 hover:text-blue-700 text-xs font-bold"
                  >
                    View
                  </Link>
                  {booking.status === "booked" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "checked_in")
                        }
                        className="text-green-500 hover:text-green-700 text-xs font-bold"
                      >
                        Check In
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "cancelled")
                        }
                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === "checked_in" && (
                    <button
                      onClick={() =>
                        handleStatusChange(booking.id, "checked_out")
                      }
                      className="text-gray-500 hover:text-gray-700 text-xs font-bold"
                    >
                      Check Out
                    </button>
                  )}
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
