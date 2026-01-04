import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../services/bookingService";
import { roomService } from "../../rooms/services/roomService";
import type { CreateRoomBookingDTO } from "../types";
import type { CreateCustomerDetailDTO } from "../../customers/types";
import type { Room } from "../../rooms/types";
import { toast } from "react-toastify";

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);

  const [formData, setFormData] = useState<CreateRoomBookingDTO>({
    room_code: "",
    start_time: "",
    end_time: "",
    customer_details: [],
  });

  const [customer, setCustomer] = useState<CreateCustomerDetailDTO>({
    name: "",
    age: 18,
    email: "",
    phone_number: "",
    gender: "male",
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomService.getAll();
      // Filter only open rooms or handle availability check later
      setRooms(data.filter((r) => r.status === "open"));
    } catch (error) {
      toast.error("Failed to load rooms");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const addCustomer = () => {
    if (!customer.name || customer.age < 0) {
      toast.error("Please provide valid customer name and age");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      customer_details: [...prev.customer_details, customer],
    }));
    setCustomer({
      name: "",
      age: 18,
      email: "",
      phone_number: "",
      gender: "male",
    });
  };

  const removeCustomer = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customer_details: prev.customer_details.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customer_details.length === 0) {
      toast.error("At least one customer is required");
      return;
    }
    try {
      await bookingService.create(formData);
      toast.success("Booking created successfully");
      navigate("/bookings");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    }
  };

  console.log(formData);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">New Booking</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Room
            </label>
            <select
              name="room_code"
              value={formData.room_code}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="">Select Room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.code} - ${room.price_per_hour}/hr
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Time
            </label>
            <input
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
        </div>

        <div className="mb-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleCustomerChange}
                className="border rounded w-full py-1 px-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={customer.age}
                onChange={handleCustomerChange}
                className="border rounded w-full py-1 px-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleCustomerChange}
                className="border rounded w-full py-1 px-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Gender</label>
              <select
                name="gender"
                value={customer.gender}
                onChange={handleCustomerChange}
                className="border rounded w-full py-1 px-2 text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <button
                type="button"
                onClick={addCustomer}
                className="bg-green-500 text-white px-4 py-1 rounded text-sm w-full"
              >
                Add
              </button>
            </div>
          </div>

          {formData.customer_details.length > 0 && (
            <table className="min-w-full bg-gray-50 text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Age</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Gender</th>
                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.customer_details.map((c, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{c.name}</td>
                    <td className="py-2 px-4">{c.age}</td>
                    <td className="py-2 px-4">{c.email}</td>
                    <td className="py-2 px-4 capitalize">{c.gender}</td>
                    <td className="py-2 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => removeCustomer(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Create Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
