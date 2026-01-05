import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBooking } from "../hooks/useBookings";
import { useInfiniteRooms } from "../../rooms/hooks/useRooms";
import type { Room } from "../../rooms/types";
import type { CreateRoomBookingDTO } from "../types";
import type { CreateCustomerDetailDTO } from "../../customers/types";
import { toast } from "react-toastify";
import { calculateTotalHours } from "../../../shared/utils/calculateTotalHours";

const BookingForm = () => {
  const navigate = useNavigate();
  const {
    rooms,
    loading: roomsLoading,
    fetchRooms,
    next: hasMoreRooms,
  } = useInfiniteRooms();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRoomDisplay, setSelectedRoomDisplay] = useState("");
  const {
    createBooking,
    loading: creating,
    error: createError,
  } = useCreateBooking();

  const [formData, setFormData] = useState<CreateRoomBookingDTO>({
    room_code: "",
    start_time: "",
    end_time: "",
    customer_details: [],
  });

  const [roomCodeSearch, setRoomCodeSearch] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  useEffect(() => {
    const controller = new AbortController();
    const params: any = { status: "open" };
    if (formData.start_time) params.start_time = formData.start_time;
    if (formData.end_time) params.end_time = formData.end_time;
    if (roomCodeSearch) params.code = roomCodeSearch;
    if (minPrice) params.min_price = Number(minPrice);
    if (maxPrice) params.max_price = Number(maxPrice);

    const timer = setTimeout(() => {
      fetchRooms(params, true);
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    formData.start_time,
    formData.end_time,
    roomCodeSearch,
    minPrice,
    maxPrice,
  ]);

  const [customer, setCustomer] = useState<CreateCustomerDetailDTO>({
    name: "",
    age: 18,
    email: "",
    phone_number: "",
    gender: "male",
  });

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      !roomsLoading &&
      hasMoreRooms
    ) {
      const params: any = { status: "open" };
      if (formData.start_time) params.start_time = formData.start_time;
      if (formData.end_time) params.end_time = formData.end_time;
      if (roomCodeSearch) params.code = roomCodeSearch;
      if (minPrice) params.min_price = Number(minPrice);
      if (maxPrice) params.max_price = Number(maxPrice);

      fetchRooms(params, false);
    }
  };

  const handleRoomSelect = (room: Room) => {
    setFormData((prev) => ({ ...prev, room_code: room.id }));
    setSelectedRoomDisplay(`${room.code} — $${room.price_per_hour}/hr`);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.room_code) {
      toast.error("Please select a room");
      return;
    }
    if (formData.customer_details.length === 0) {
      toast.error("At least one customer is required");
      return;
    }
    try {
      await createBooking(formData);
      toast.success("Booking created successfully");
      navigate("/bookings");
    } catch (error: any) {
      toast.error(createError || error.message || "Failed to create booking");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gray-900 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">New Booking</h2>
          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Room & Time Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Booking Details
            </h3>

            {/* Room Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Search Room Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 101"
                  value={roomCodeSearch}
                  onChange={(e) => setRoomCodeSearch(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Min Price ($/hr)
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(e.target.value ? Number(e.target.value) : "")
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Max Price ($/hr)
                </label>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(e.target.value ? Number(e.target.value) : "")
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-sm text-gray-500 text-right">
                Total Hours:{" "}
                {calculateTotalHours(formData.start_time, formData.end_time)}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Room
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="block w-full pl-3 pr-10 py-2.5 text-left text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm bg-gray-50"
                    >
                      {formData.room_code
                        ? selectedRoomDisplay || "Room Selected"
                        : "-- Choose a Room --"}
                    </button>
                    {isDropdownOpen && (
                      <div
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        onScroll={handleScroll}
                      >
                        {rooms.length === 0 && !roomsLoading ? (
                          <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-700">
                            No rooms found
                          </div>
                        ) : (
                          rooms.map((room) => (
                            <div
                              key={room.id}
                              onClick={() => handleRoomSelect(room)}
                              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white ${
                                formData.room_code === room.id
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              <span className="block truncate">
                                {room.code} — ${room.price_per_hour}/hr
                              </span>
                            </div>
                          ))
                        )}
                        {roomsLoading && (
                          <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500 text-center">
                            Loading...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Customer Details Section */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Customer Information
              </h3>
              <span className="text-sm text-gray-500">
                {formData.customer_details.length} Added
              </span>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3 space-y-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customer.name}
                    onChange={handleCustomerChange}
                    placeholder="John Doe"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={customer.age}
                    onChange={handleCustomerChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    placeholder="john@example.com"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={customer.gender}
                    onChange={handleCustomerChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={addCustomer}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>

            {formData.customer_details.length > 0 ? (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Age
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Gender
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Remove</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {formData.customer_details.map((c, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {c.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {c.age}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {c.email || "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                          {c.gender}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            onClick={() => removeCustomer(index)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">
                  No customers added yet. Please add at least one customer.
                </p>
              </div>
            )}
          </section>

          <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="px-6 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
