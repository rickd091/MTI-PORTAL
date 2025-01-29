import React from "react";
import { InspectionFormData } from "../useInspectionForm";
import { FormField } from "../FormField";

interface Props {
  data: InspectionFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export const InstitutionDetailsSection: React.FC<Props> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Institution Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Institution Name"
          name="institutionName"
          value={data.institutionName}
          onChange={onChange}
          required
        />
        <FormField
          label="Postal Address"
          name="address"
          value={data.address}
          onChange={onChange}
          required
        />
        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={onChange}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={data.email}
          onChange={onChange}
          required
        />
        <FormField
          label="Website"
          name="website"
          type="url"
          value={data.website}
          onChange={onChange}
        />
        <FormField
          label="Location"
          name="location"
          value={data.location}
          onChange={onChange}
          required
        />
        <FormField
          label="Category"
          name="category"
          value={data.category}
          onChange={onChange}
          required
        />
        <FormField
          label="Ownership"
          name="ownership"
          value={data.ownership}
          onChange={onChange}
          required
        />
        <FormField
          label="Manager Name"
          name="managerName"
          value={data.managerName}
          onChange={onChange}
          required
        />
        <FormField
          label="Principal Name"
          name="principalName"
          value={data.principalName}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};
