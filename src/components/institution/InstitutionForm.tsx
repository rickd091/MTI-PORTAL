import React, { useState } from "react";
import { Institution } from "../../types/Institution";

interface InstitutionFormProps {
  initialData?: Institution;
  onSubmit: (data: Institution) => void;
}

const InstitutionForm: React.FC<InstitutionFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Institution>(
    initialData || {
      institutionId: "",
      institutionName: "",
      ownershipType: "Public",
      institutionType: "",
      dateOfRegistration: "",
      physicalAddress: "",
      contactInfo: { phoneNumbers: [], emails: [] },
      premises: { status: "Owned" },
      management: { members: [] },
      infrastructure: {
        classrooms: [],
        workshops: [],
        labs: [],
        toilets: { countFemale: 0, countMale: 0, qualityRating: 1 },
        waterSource: "",
        solidWasteDisposal: "",
        fireReadiness: 1,
        safetyFeaturesRating: 1,
      },
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Institution Name
        </label>
        <input
          type="text"
          name="institutionName"
          value={formData.institutionName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ownership Type
        </label>
        <select
          name="ownershipType"
          value={formData.ownershipType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Save
      </button>
    </form>
  );
};

export default InstitutionForm;
