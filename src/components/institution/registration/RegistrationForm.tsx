import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { FacilitiesStep } from "./steps/FacilitiesStep";
import { StaffStep } from "./steps/StaffStep";
import { DocumentsStep } from "./steps/DocumentsStep";
import {
  registrationSchema,
  type RegistrationInputs,
} from "@/lib/validation/institutionSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { id: "basicInfo", title: "Basic Information" },
  { id: "facilities", title: "Facilities" },
  { id: "staff", title: "Staff" },
  { id: "documents", title: "Documents" },
];

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<RegistrationInputs>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      basicInfo: {
        name: "",
        type: "",
        registration_number: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        website: "",
      },
      facilities: [],
      staff: [],
      documents: [],
      terms_accepted: false,
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: RegistrationInputs) => {
    try {
      setSubmitError(null);
      // Handle form submission
      console.log("Form data:", data);
      // Add your submission logic here
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An error occurred during submission",
      );
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep />;
      case 1:
        return <FacilitiesStep />;
      case 2:
        return <StaffStep />;
      case 3:
        return <DocumentsStep />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Institution Registration
            </h2>

            {/* Progress Indicator */}
            <div className="relative">
              <div className="flex justify-between mb-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${index === currentStep ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm mt-1">{step.title}</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-4 left-0 h-0.5 bg-gray-200 w-full -z-10">
                <div
                  className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {renderStep()}

            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              ) : (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
