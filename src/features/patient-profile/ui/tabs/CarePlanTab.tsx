import React, { useState } from "react";

interface CarePlanTabProps {
  isDoctor: boolean;
  carePlans: Array<{ title: string; description: string }>;
  onAddCarePlan: (plan: { title: string; description: string }) => void;
}

export const CarePlanTab: React.FC<CarePlanTabProps> = ({
  isDoctor,
  carePlans = [],
  onAddCarePlan,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddCarePlan({ title, description });
    setTitle("");
    setDescription("");
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Patient Care Plan</h3>
        {isDoctor && (
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            {isFormOpen ? "Cancel" : "+ Add Care Plan"}
          </button>
        )}
      </div>

      {isDoctor && isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4"
        >
          <h4 className="font-semibold text-gray-700 text-sm">
            Create New Care Plan Item
          </h4>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Post-surgery recovery routine"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description / Instructions
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter detailed instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Save Care Plan
          </button>
        </form>
      )}

      {carePlans.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {carePlans.map((plan, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
            >
              <h4 className="font-semibold text-gray-800">{plan.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-sm font-medium">
            No active care plans assigned yet.
          </p>
        </div>
      )}
    </div>
  );
};
