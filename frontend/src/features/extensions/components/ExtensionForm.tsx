import React, { useState } from "react";
import { extensionService } from "../services/extensionService";
import { toast } from "react-toastify";

interface ExtensionFormProps {
  bookingId: number;
  onExtensionAdded: () => void;
}

const ExtensionForm: React.FC<ExtensionFormProps> = ({
  bookingId,
  onExtensionAdded,
}) => {
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await extensionService.create(bookingId, { duration });
      toast.success("Extension added successfully");
      onExtensionAdded();
    } catch (error: any) {
      toast.error(error.message || "Failed to add extension");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Duration (minutes)
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          min="1"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-0.5"
      >
        {loading ? "Adding..." : "Add Extension"}
      </button>
    </form>
  );
};

export default ExtensionForm;
