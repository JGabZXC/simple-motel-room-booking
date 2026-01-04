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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Room" : "Create Room"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Room Code
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            disabled={isEditMode}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            min="1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Price Per Hour
          </label>
          <input
            type="number"
            name="price_per_hour"
            value={formData.price_per_hour}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_air_conditioned"
              checked={formData.is_air_conditioned}
              onChange={handleChange}
              className="mr-2 leading-tight"
            />
            <span className="text-sm">Air Conditioned</span>
          </label>
        </div>

        <div className="mb-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Bed Details</h3>
          <div className="flex gap-2 mb-2">
            <select
              value={bedType}
              onChange={(e) => setBedType(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="queen">Queen</option>
              <option value="king">King</option>
            </select>
            <input
              type="number"
              value={bedCount}
              onChange={(e) => setBedCount(parseInt(e.target.value))}
              className="border rounded px-2 py-1 w-20"
              min="1"
            />
            <button
              type="button"
              onClick={handleAddBed}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Add
            </button>
          </div>
          <ul className="list-disc pl-5">
            {Object.entries(formData.bed_details).map(([type, count]) => (
              <li key={type} className="flex justify-between items-center w-48">
                <span>
                  {type}: {count}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveBed(type)}
                  className="text-red-500 text-xs"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isEditMode ? "Update Room" : "Create Room"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/rooms")}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
