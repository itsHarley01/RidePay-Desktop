import { useState, useEffect } from "react";

type RequirementModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    inputType: "image" | "image/pdf";
    organization?: string;
    operatorUnit?: string;
  }) => void;
  initialData?: {
    name: string;
    inputType: "image" | "image/pdf";
    organization?: string;
    operatorUnit?: string;
  };
  userRole: "super-admin" | "admin-transport-cooperative" | "admin-operator";
  category: "coop" | "operator" | "driver"; 
};

export default function RequirementModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  userRole, 
  category
}: RequirementModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"image" | "image/pdf">("image");
  const [organization, setOrganization] = useState("");
  const [operator, setOperator] = useState("");

  // Handle both edit mode and add mode
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setType(initialData.inputType as "image" | "image/pdf");
        setOrganization(initialData.organization || "");
        setOperator(initialData.operatorUnit || "");
      } else {
        setName("");
        setType("image/pdf");
        setOrganization("");
        setOperator("");
      }

      // Role & category based defaults
      if (userRole === "super-admin") {
        if (category === "coop") {
          setOrganization("");
          setOperator("");
        } else if (category === "operator") {
          setOrganization("");
          setOperator("");
        }
      }

      if (userRole === "admin-transport-cooperative") {
        if (category === "operator") {
          const org = localStorage.getItem("organization") || "";
          setOrganization(org);
          setOperator("");
        } else if (category === "driver") {
          setOrganization("");
          setOperator("");
        }
      }

      if (userRole === "admin-operator" && category === "driver") {
        const org = localStorage.getItem("organization") || "";
        const op = localStorage.getItem("operatorUnit") || "";
        setOrganization(org);
        setOperator(op);
      }
    } else {
      setName("");
      setType("image/pdf");
      setOrganization("");
      setOperator("");
    }
  }, [isOpen, initialData, userRole, category]);
  
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    const payload: {
      name: string;
      inputType: "image" | "image/pdf";
      organization?: string;
      operatorUnit?: string;
    } = {
      name,
      inputType: type,
    };

    if (userRole === "super-admin") {
      payload.organization = organization;
      payload.operatorUnit = operator;
    } else if (userRole === "admin-transport-cooperative") {
      payload.organization = organization;
      payload.operatorUnit = operator;
    } else if (userRole === "admin-operator") {
      payload.organization = organization;
      payload.operatorUnit = operator;
    }

    onSave(payload);
    onClose();
  };

  // UI Field visibility logic
  const showOrganizationField =
    (userRole === "super-admin" && category === "operator") ||
    (userRole === "super-admin" && category !== "coop" && category !== "operator") ||
    (userRole === "admin-transport-cooperative" && category === "driver") //||
    // (userRole === "admin-operator" && category === "driver");

  const showOperatorField =
    (userRole === "super-admin" && category !== "coop" && category !== "operator") ||
    (userRole === "admin-transport-cooperative" && category !== "coop" && category !== "operator") // ||
    // (userRole === "admin-operator" && category === "driver");

  // Special hiding cases
  if (userRole === "super-admin" && category === "coop") {
    // No organization/operator fields
  }
  if (userRole === "admin-transport-cooperative" && category === "operator") {
    // No organization/operator fields
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Requirement" : "Add Requirement"}
        </h2>

        {/* Requirement Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Requirement Name</label>
          <input
            type="text"
            placeholder="Enter requirement name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full px-3 py-2"
          />
        </div>

        {/* Allowed File Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Allowed File Types</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "image" | "image/pdf")}
            className="border rounded w-full px-3 py-2"
          >
            <option value="image/pdf">Image or PDF</option>
            <option value="image">Image Only</option>
          </select>
        </div>

        {/* Organization Field */}
        {!(userRole === "super-admin" && category === "coop") &&
         !(userRole === "admin-transport-cooperative" && category === "operator") &&
         showOrganizationField && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Transport Cooperative</label>
            <input
              type="text"
              value={organization}
              onChange={e => setOrganization(e.target.value)}
              className="border rounded w-full px-3 py-2"
              disabled={userRole === "admin-transport-cooperative" && category === "operator"}
            />
          </div>
        )}

        {/* Operator Field */}
        {!(userRole === "super-admin" && category === "coop") &&
         !(userRole === "super-admin" && category === "operator") &&
         !(userRole === "admin-transport-cooperative" && category === "operator") &&
         showOperatorField && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Operator</label>
            <input
              type="text"
              value={operator}
              onChange={e => setOperator(e.target.value)}
              className="border rounded w-full px-3 py-2"
              disabled={userRole === "admin-operator" && category === "driver"}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-yellow-400 text-[#0A2A54] font-semibold hover:bg-yellow-500"
          >
            {initialData ? "Save Changes" : "Add Requirement"}
          </button>
        </div>
      </div>
    </div>
  );
}
