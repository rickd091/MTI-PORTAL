import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { type FacilityInputs } from "@/lib/validation/institutionSchema";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function FacilitiesStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<{ facilities: FacilityInputs[] }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "facilities",
  });

  const addFacility = () => {
    append({
      facility_type: "",
      name: "",
      capacity: undefined,
      area_size: undefined,
      status: "operational",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Facilities</h3>
        <Button
          type="button"
          onClick={addFacility}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Facility</span>
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="text-md font-medium">Facility {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facility Type
              </label>
              <select
                {...register(`facilities.${index}.facility_type`)}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select Type</option>
                <option value="CLASSROOM">Classroom</option>
                <option value="LABORATORY">Laboratory</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="LIBRARY">Library</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.facilities?.[index]?.facility_type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.facilities[index]?.facility_type?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facility Name
              </label>
              <input
                {...register(`facilities.${index}.name`)}
                className="w-full border rounded-md p-2"
              />
              {errors.facilities?.[index]?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.facilities[index]?.name?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                {...register(`facilities.${index}.capacity`, {
                  valueAsNumber: true,
                })}
                className="w-full border rounded-md p-2"
              />
              {errors.facilities?.[index]?.capacity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.facilities[index]?.capacity?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area Size (sq. meters)
              </label>
              <input
                type="number"
                {...register(`facilities.${index}.area_size`, {
                  valueAsNumber: true,
                })}
                className="w-full border rounded-md p-2"
              />
              {errors.facilities?.[index]?.area_size && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.facilities[index]?.area_size?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register(`facilities.${index}.status`)}
                className="w-full border rounded-md p-2"
              >
                <option value="operational">Operational</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.facilities?.[index]?.status && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.facilities[index]?.status?.message}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No facilities added. Click the button above to add a facility.
        </p>
      )}
    </div>
  );
}
