import React from "react";
import { InspectionFormData } from "../useInspectionForm";
import { FormField } from "../FormField";

interface Props {
  data: InspectionFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export const FacilitiesSection: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Physical Facilities</h3>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Physical Facilities Overview"
          name="physicalFacilities"
          type="textarea"
          value={data.physicalFacilities}
          onChange={onChange}
          required
          placeholder="Describe the overall physical facilities"
        />
        <FormField
          label="Theory Rooms"
          name="theoryRooms"
          type="textarea"
          value={data.theoryRooms}
          onChange={onChange}
          required
          placeholder="Describe the theory rooms and their capacity"
        />
        <FormField
          label="Laboratories"
          name="laboratories"
          type="textarea"
          value={data.laboratories}
          onChange={onChange}
          required
          placeholder="Describe the laboratories and equipment"
        />
        <FormField
          label="Library"
          name="library"
          type="textarea"
          value={data.library}
          onChange={onChange}
          required
          placeholder="Describe the library facilities and resources"
        />
        <FormField
          label="Sanitation Facilities"
          name="sanitation"
          type="textarea"
          value={data.sanitation}
          onChange={onChange}
          required
          placeholder="Describe the sanitation facilities"
        />
        <FormField
          label="Water and Electricity"
          name="waterElectricity"
          type="textarea"
          value={data.waterElectricity}
          onChange={onChange}
          required
          placeholder="Describe water and electricity provisions"
        />
      </div>
    </div>
  );
};
