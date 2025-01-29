import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createInstitution } from "@/store/slices/institutionSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

const steps = [
  "Basic Information",
  "Document Upload",
  "Facility Details",
  "Review & Submit",
];

export default function RegistrationWizard() {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    documents: [],
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      await dispatch(createInstitution(formData)).unwrap();
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Institution Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {/* Add more basic information fields */}
          </div>
        );
      case 1:
        return <div className="space-y-4">{/* Document upload section */}</div>;
      case 2:
        return (
          <div className="space-y-4">{/* Facility details section */}</div>
        );
      case 3:
        return <div className="space-y-4">{/* Review section */}</div>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === currentStep
                      ? "bg-blue-600 text-white"
                      : index < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-sm">{step}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div
              className="absolute top-0 left-0 h-1 bg-blue-600"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
            <div className="h-1 bg-gray-200 w-full" />
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleSubmit}>Submit</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
