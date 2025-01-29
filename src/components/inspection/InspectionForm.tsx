import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InspectionFormData, useInspectionForm } from "./useInspectionForm";
import { InstitutionDetailsSection } from "./sections/InstitutionDetailsSection";
import { DocumentationSection } from "./sections/DocumentationSection";
import { FacilitiesSection } from "./sections/FacilitiesSection";
import { StaffingSection } from "./sections/StaffingSection";
import { SafetySection } from "./sections/SafetySection";

export const InspectionForm: React.FC = () => {
  const { formData, handleSubmit, handleChange, isSubmitting, error } =
    useInspectionForm();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Maritime Training Institute - Online Inspection Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <InstitutionDetailsSection
              data={formData}
              onChange={handleChange}
            />

            <DocumentationSection data={formData} onChange={handleChange} />

            <FacilitiesSection data={formData} onChange={handleChange} />

            <StaffingSection data={formData} onChange={handleChange} />

            <SafetySection data={formData} onChange={handleChange} />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Inspection Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspectionForm;
