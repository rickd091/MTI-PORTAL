import React from "react";
import { InspectionFormData } from "../useInspectionForm";
import { FormField } from "../FormField";

interface Props {
  data: InspectionFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export const StaffingSection: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Staffing & Personnel</h3>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Teaching Staff"
          name="teachingStaff"
          type="textarea"
          value={data.teachingStaff}
          onChange={onChange}
          required
          placeholder="Provide details about teaching staff qualifications and experience"
        />
        <FormField
          label="Technical Staff"
          name="technicalStaff"
          type="textarea"
          value={data.technicalStaff}
          onChange={onChange}
          required
          placeholder="Provide details about technical staff"
        />
        <FormField
          label="Administrative Staff"
          name="administrativeStaff"
          type="textarea"
          value={data.administrativeStaff}
          onChange={onChange}
          required
          placeholder="Provide details about administrative staff"
        />
        <FormField
          label="Guidance & Counseling Unit"
          name="guidanceCounselingUnit"
          type="textarea"
          value={data.guidanceCounselingUnit}
          onChange={onChange}
          required
          placeholder="Describe the guidance and counseling services"
        />
      </div>
    </div>
  );
};
