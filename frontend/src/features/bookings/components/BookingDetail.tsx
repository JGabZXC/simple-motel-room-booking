import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useBooking, useUpdateBooking } from "../hooks/useBookings";
import { useExtensionsForBooking } from "../../extensions/hooks/useExtensions";
import type { RoomBooking } from "../types";
import ExtensionList from "../../extensions/components/ExtensionList";
import ExtensionForm from "../../extensions/components/ExtensionForm";
import { toast } from "react-toastify";
import { Modal } from "../../../shared/components/Modal";

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bookingId = parseInt(id || "0");

  const {
    booking,
    loading: bookingLoading,
    fetchBooking,
  } = useBooking(bookingId);
  const { extensions, fetchExtensions } = useExtensionsForBooking(bookingId);
  const { updateBooking } = useUpdateBooking(bookingId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<
    RoomBooking["status"] | null
  >(null);

  const handleStatusChange = (newStatus: RoomBooking["status"]) => {
    setTargetStatus(newStatus);
    setIsModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!booking || !targetStatus) return;
    try {
      await updateBooking({ status: targetStatus });
      toast.success(`Booking status updated to ${targetStatus}`);
      fetchBooking(bookingId);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.status || "Failed to update status");
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTargetStatus(null);
  };

  const handleExtensionAdded = () => {
    fetchExtensions(bookingId);
    fetchBooking(bookingId);
  };

  if (bookingLoading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
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
          {booking && (
            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-semibold">Room:</span> {booking.room_code}
              </p>
              <p>
                <span className="font-semibold">Start Time:</span>{" "}
                {new Date(booking.start_time).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">End Time:</span>{" "}
                {new Date(booking.end_time).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </Modal>
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Booking #{booking.id}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View and manage booking details
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/bookings"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            ← Back to Bookings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Booking Info & Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info Card */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Booking Information
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                  booking.status === "booked"
                    ? "bg-blue-100 text-blue-800"
                    : booking.status === "checked_in"
                    ? "bg-green-100 text-green-800"
                    : booking.status === "checked_out"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {booking.status.replace("_", " ")}
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Room Code</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {booking.room_code}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Price</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  ${booking.total_price}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Start Time</p>
                <p className="mt-1 text-base text-gray-900">
                  {new Date(booking.start_time).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">End Time</p>
                <p className="mt-1 text-base text-gray-900">
                  {new Date(booking.end_time).toLocaleString()}
                </p>
              </div>
              {extensions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Original End Time
                  </p>
                  <p className="mt-1 text-base text-gray-900">
                    {new Date(booking.original_end_time).toLocaleString()}
                  </p>
                </div>
              )}
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">Booked At</p>
                <p className="mt-1 text-sm text-gray-700">
                  {new Date(booking.booked_at).toLocaleString()}
                </p>
              </div>
              {booking.checked_in_at && (
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    Checked In At
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {new Date(booking.checked_in_at).toLocaleString()}
                  </p>
                </div>
              )}
              {booking.checked_out_at && (
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    Checked Out At
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {new Date(booking.checked_out_at).toLocaleString()}
                  </p>
                </div>
              )}
              {booking.cancelled_at && (
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    Cancelled At
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {new Date(booking.cancelled_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-3">
              {booking.status === "booked" && (
                <button
                  onClick={() => handleStatusChange("checked_in")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Check In
                </button>
              )}
              {booking.status === "checked_in" && (
                <button
                  onClick={() => handleStatusChange("checked_out")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Check Out
                </button>
              )}
              {(booking.status === "booked" ||
                booking.status === "checked_in") && (
                <button
                  onClick={() => handleStatusChange("cancelled")}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>

          {/* Time Extensions Section */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Time Extensions
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Add Extension
                </h3>
                <ExtensionForm
                  bookingId={booking.id}
                  onExtensionAdded={handleExtensionAdded}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Extension History
                </h3>
                <ExtensionList extensions={extensions} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customers */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 sticky top-6">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {booking.customer_details.length}
              </span>
            </div>
            <ul className="divide-y divide-gray-100">
              {booking.customer_details.map((customer) => (
                <li
                  key={customer.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-500 font-semibold text-lg">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {customer.email || "No email"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs uppercase">
                        Age
                      </span>
                      <span className="font-medium text-gray-900">
                        {customer.age}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase">
                        Gender
                      </span>
                      <span className="font-medium text-gray-900 capitalize">
                        {customer.gender}
                      </span>
                    </div>
                    {customer.phone_number && (
                      <div className="col-span-2">
                        <span className="text-gray-500 block text-xs uppercase">
                          Phone
                        </span>
                        <span className="font-medium text-gray-900">
                          {customer.phone_number}
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
