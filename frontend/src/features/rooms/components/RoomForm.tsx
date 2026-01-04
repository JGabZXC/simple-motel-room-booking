import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { roomService } from "../services/roomService";
import type { CreateRoomDTO } from "../types";
import { toast } from "react-toastify";

const RoomForm: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const isEditMode = !!code;

  const [formData, setFormData] = useState<Omit<CreateRoomDTO, "id">>({
    code: "",
    capacity: 1,
    is_air_conditioned: false,
    status: "open",
    price_per_hour: 0,
    bed_details: {},
  });

  const [bedType, setBedType] = useState("single");
  const [bedCount, setBedCount] = useState(1);

  useEffect(() => {
    if (isEditMode) {
      loadRoom();
    }
  }, [code]);

  const loadRoom = async () => {
    try {
      const room = await roomService.get(code!);
      setFormData({
        code: room.code,
        capacity: room.capacity,
        is_air_conditioned: room.is_air_conditioned,
        status: room.status,
        price_per_hour: parseFloat(room.price_per_hour),
        bed_details: room.bed_details,
      });
    } catch (error) {
      toast.error("Failed to load room details");
      navigate("/rooms");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddBed = () => {
    setFormData((prev) => ({
      ...prev,
      bed_details: {
        ...prev.bed_details,
        [bedType]: bedCount,
      },
    }));
  };

  const handleRemoveBed = (type: string) => {
    const newBedDetails = { ...formData.bed_details };
    delete newBedDetails[type];
    setFormData((prev) => ({
      ...prev,
      bed_details: newBedDetails,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await roomService.update(code!, formData);
        toast.success("Room updated successfully");
      } else {
        await roomService.create(formData);
        toast.success("Room created successfully");
      }
      navigate("/rooms");
    } catch (error: any) {
      toast.error(error.message || "Failed to save room");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gray-900 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {isEditMode ? "Edit Room" : "Create New Room"}
          </h2>
          <button
            type="button"
            onClick={() => navigate("/rooms")}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Room Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  disabled={isEditMode}
                  placeholder="e.g. 101"
                  className={`block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    isEditMode ? "bg-gray-100 cursor-not-allowed" : "bg-gray-50"
                  }`}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Price Per Hour ($)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="price_per_hour"
                    value={formData.price_per_hour}
                    onChange={handleChange}
                    className="block w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                    required
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Capacity (People)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                  required
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <input
                  id="is_air_conditioned"
                  name="is_air_conditioned"
                  type="checkbox"
                  checked={formData.is_air_conditioned}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_air_conditioned"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Air Conditioned
                </label>
              </div>
            </div>
          </section>

          {/* Bed Details */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Bed Configuration
              </h3>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-1/2 space-y-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bed Type
                  </label>
                  <select
                    value={bedType}
                    onChange={(e) => setBedType(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="queen">Queen</option>
                    <option value="king">King</option>
                  </select>
                </div>
                <div className="w-full sm:w-1/4 space-y-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </label>
                  <input
                    type="number"
                    value={bedCount}
                    onChange={(e) => setBedCount(parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    min="1"
                  />
                </div>
                <div className="w-full sm:w-1/4">
                  <button
                    type="button"
                    onClick={handleAddBed}
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
                    Add Bed
                  </button>
                </div>
              </div>
            </div>

            {Object.keys(formData.bed_details).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.bed_details).map(([type, count]) => (
                  <div
                    key={type}
                    className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center group hover:border-indigo-300 transition-all"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {type} Bed
                      </p>
                      <p className="text-xs text-gray-500">Quantity: {count}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBed(type)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">
                  No bed configuration added yet.
                </p>
              </div>
            )}
          </section>

          <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/rooms")}
              className="px-6 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all"
            >
              {isEditMode ? "Update Room" : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
