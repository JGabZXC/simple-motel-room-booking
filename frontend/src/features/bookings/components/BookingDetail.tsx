import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { bookingService } from "../services/bookingService";
import { extensionService } from "../../extensions/services/extensionService";
import type { RoomBooking } from "../types";
import type { TimeExtension } from "../../extensions/types";
import ExtensionList from "../../extensions/components/ExtensionList";
import ExtensionForm from "../../extensions/components/ExtensionForm";
import { toast } from "react-toastify";

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<RoomBooking | null>(null);
  const [extensions, setExtensions] = useState<TimeExtension[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      const bookingData = await bookingService.get(parseInt(id));
      setBooking(bookingData);

      const extensionData = await extensionService.getAllForBooking(
        parseInt(id)
      );
      setExtensions(extensionData);
    } catch (error) {
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: RoomBooking["status"]) => {
    if (!booking) return;
    try {
      await bookingService.update(booking.id, { status: newStatus });
      toast.success(`Booking status updated to ${newStatus}`);
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booking Details #{booking.id}</h1>
        <Link to="/bookings" className="text-blue-500 hover:underline">
          Back to List
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Info */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-bold">Room:</span> {booking.room_code}
            </p>
            <p>
              <span className="font-bold">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  booking.status === "booked"
                    ? "bg-blue-200 text-blue-800"
                    : booking.status === "checked_in"
                    ? "bg-green-200 text-green-800"
                    : booking.status === "checked_out"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {booking.status}
              </span>
            </p>
            <p>
              <span className="font-bold">Start Time:</span>{" "}
              {new Date(booking.start_time).toLocaleString()}
            </p>
            <p>
              <span className="font-bold">End Time:</span>{" "}
              {new Date(booking.end_time).toLocaleString()}
            </p>
            <p>
              <span className="font-bold">Total Price:</span> $
              {booking.total_price}
            </p>
            <p>
              <span className="font-bold">Booked At:</span>{" "}
              {new Date(booking.booked_at).toLocaleString()}
            </p>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Actions</h3>
            <div className="flex gap-2">
              {booking.status === "booked" && (
                <button
                  onClick={() => handleStatusChange("checked_in")}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Check In
                </button>
              )}
              {booking.status === "checked_in" && (
                <button
                  onClick={() => handleStatusChange("checked_out")}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Check Out
                </button>
              )}
              {(booking.status === "booked" ||
                booking.status === "checked_in") && (
                <button
                  onClick={() => handleStatusChange("cancelled")}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          <ul className="divide-y divide-gray-200">
            {booking.customer_details.map((customer) => (
              <li key={customer.id} className="py-3">
                <p className="font-medium">
                  {customer.name} ({customer.age})
                </p>
                <p className="text-sm text-gray-500">{customer.email}</p>
                <p className="text-sm text-gray-500">{customer.phone_number}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {customer.gender}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Time Extensions */}
      <div className="mt-6 bg-white shadow rounded p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Time Extensions</h2>
        </div>

        <div className="mb-6">
          <ExtensionForm bookingId={booking.id} onExtensionAdded={loadData} />
        </div>

        <ExtensionList extensions={extensions} />
      </div>
    </div>
  );
};

export default BookingDetail;
