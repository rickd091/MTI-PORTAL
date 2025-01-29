import React from "react";
import { InspectionFormData } from "../useInspectionForm";
import { FormField } from "../FormField";

interface Props {
  data: InspectionFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export const SafetySection: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Safety & Training</h3>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Safety Measures"
          name="safetyMeasures"
          type="textarea"
          value={data.safetyMeasures}
          onChange={onChange}
          required
          placeholder="Describe safety measures and emergency procedures"
        />
        <FormField
          label="Industrial Attachment"
          name="industrialAttachment"
          type="textarea"
          value={data.industrialAttachment}
          onChange={onChange}
          required
          placeholder="Describe industrial attachment programs"
        />
        <FormField
          label="Approved Courses"
          name="coursesApproved"
          type="textarea"
          value={data.coursesApproved}
          onChange={onChange}
          required
          placeholder="List all approved courses"
        />
        <FormField
          label="Licensed Courses"
          name="licensedCourses"
          type="textarea"
          value={data.licensedCourses}
          onChange={onChange}
          required
          placeholder="List all licensed courses"
        />
        <FormField
          label="Trainer Preparation"
          name="trainerPreparation"
          type="textarea"
          value={data.trainerPreparation}
          onChange={onChange}
          required
          placeholder="Describe trainer preparation and development programs"
        />
        <FormField
          label="Examination Results"
          name="examinationResults"
          type="textarea"
          value={data.examinationResults}
          onChange={onChange}
          required
          placeholder="Provide summary of examination results"
        />
      </div>
    </div>
  );
};
