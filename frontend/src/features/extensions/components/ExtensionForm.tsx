import { useState } from "react";
import { useCreateExtension } from "../hooks/useExtensions";
import { toast } from "react-toastify";

interface ExtensionFormProps {
  bookingId: number;
  onExtensionAdded: () => void;
}

const ExtensionForm = ({ bookingId, onExtensionAdded }: ExtensionFormProps) => {
  const [duration, setDuration] = useState(1);
  const { createExtension, loading } = useCreateExtension();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExtension(bookingId, { duration });
      toast.success("Extension added successfully");
      onExtensionAdded();
    } catch (error: any) {
      toast.error(error.response.data?.status || "Failed to add extension");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Duration (hours)
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
