import { useState, useEffect } from "react";
import RequirementModal from "../../components/Admins/RequirementModal";
import {
  createRequirement as apiCreateRequirement,
  getRequirements as apiGetRequirements,
  updateRequirement as apiUpdateRequirement,
  deleteRequirement as apiDeleteRequirement,
  Requirement
} from "../../api/requirementsApi";

function RequirementSection({ title, category }: { title: string; category: string }) {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const currentUserRole = localStorage.getItem("role") || "";

  // ✅ Fetch requirements on mount
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await apiGetRequirements(category);
      console.log("Fetched requirements:", data); // Debug
      setRequirements(data);
    } catch (err) {
      console.error("Failed to fetch requirements:", err);
    }
  };
  fetchData();
}, [category]);

const handleSave = async (data: { name: string; inputType: "image" | "image/pdf"; organization?: string; operatorUnit?: string; }) => {
  try {
    const payload = {
      name: data.name,
      inputType: data.inputType,
      category,
      organization: data.organization || "",
      operatorUnit: data.operatorUnit || "", 
    };
    console.log("Saving requirement:", payload);

    if (editingId) {
      await apiUpdateRequirement(editingId, payload);
      setRequirements(prev =>
        prev.map(req =>
          req.id === editingId ? { ...req, ...payload } : req
        )
      );
      setEditingId(null);
    } else {
      const newReq = await apiCreateRequirement(payload);
      setRequirements(prev => [...prev, newReq]);
    }
  } catch (err) { 
    console.error("Failed to save requirement:", err);
  }
};

  const handleEdit = (req: Requirement) => {
    setEditingId(req.id || null);
    setModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await apiDeleteRequirement(id);
      setRequirements(prev => prev.filter(req => req.id !== id));
    } catch (err) {
      console.error("Failed to delete requirement:", err);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#0A2A54]">{title}</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setModalOpen(true);
          }}
          className="bg-yellow-400 hover:bg-yellow-500 text-[#0A2A54] px-4 py-2 rounded font-semibold shadow-sm"
        >
          + Add Requirement
        </button>
      </div>

      {requirements.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requirements.map(req => (
            <div
              key={req.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-gray-50"
            >
              <p className="font-medium text-xl text-[#0A2A54]">{req.name}</p>
              <p className="text-sm text-gray-500 mb-3">
                Allowed: {req.inputType === "image" ? "Image Only" : "Image or PDF"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(req)}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(req.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-800 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No requirements yet.</p>
      )}

      {/* Modal */}
      <RequirementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        category={category}
        userRole={currentUserRole as "super-admin" | "admin-transport-cooperative" | "admin-operator"}
        initialData={
          editingId ? requirements.find(r => r.id === editingId) : undefined
        }
      />
    </div>
  );
}

export default function AdminRequirements() {
  const currentUserRole = localStorage.getItem("role") || "";
  return (
    <div className="p-6 space-y-6">
      {currentUserRole === "super-admin" && (
        <RequirementSection title="Transport Cooperative Requirements" category="coop" />
      )}
      {(currentUserRole === "super-admin" || currentUserRole === "admin-transport-cooperative") && (
        <RequirementSection title="Operator Requirements" category="operator" />
      )}
      {(currentUserRole === "super-admin" || currentUserRole === "admin-transport-cooperative") && (
        <RequirementSection title="Driver Requirements" category="driver" />
      )}
      {currentUserRole === "admin-operator" && (
        <RequirementSection title="Driver Requirements" category="driver" />
      )}
    </div>
  );
}
