import React from "react";
import { InspectionFormData } from "../useInspectionForm";
import { FormField } from "../FormField";

interface Props {
  data: InspectionFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export const DocumentationSection: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Documentation & Compliance</h3>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Health Inspection Report"
          name="healthInspection"
          type="textarea"
          value={data.healthInspection}
          onChange={onChange}
          required
          placeholder="Enter details of the health inspection report"
        />
        <FormField
          label="Lease Agreement"
          name="leaseAgreement"
          type="textarea"
          value={data.leaseAgreement}
          onChange={onChange}
          required
          placeholder="Enter details of the lease agreement"
        />
        <FormField
          label="Financial Records"
          name="financialRecords"
          type="textarea"
          value={data.financialRecords}
          onChange={onChange}
          required
          placeholder="Enter details of financial records and compliance"
        />
        <FormField
          label="Legal Documents"
          name="legalDocuments"
          type="textarea"
          value={data.legalDocuments}
          onChange={onChange}
          required
          placeholder="Enter details of legal documentation"
        />
        <FormField
          label="Internal Quality Assurance"
          name="internalQualityAssurance"
          type="textarea"
          value={data.internalQualityAssurance}
          onChange={onChange}
          required
          placeholder="Describe the internal quality assurance system"
        />
        <FormField
          label="Strategic Plan"
          name="strategicPlan"
          type="textarea"
          value={data.strategicPlan}
          onChange={onChange}
          required
          placeholder="Describe the institution's strategic plan"
        />
      </div>
    </div>
  );
};
