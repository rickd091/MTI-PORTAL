import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { type StaffInputs } from "@/lib/validation/institutionSchema";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function StaffStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<{ staff: StaffInputs[] }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "staff",
  });

  const addStaffMember = () => {
    append({
      first_name: "",
      last_name: "",
      role: "",
      qualification: "",
      email: "",
      phone: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Staff Members</h3>
        <Button
          type="button"
          onClick={addStaffMember}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="text-md font-medium">Staff Member {index + 1}</h4>
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
                First Name
              </label>
              <input
                {...register(`staff.${index}.first_name`)}
                className="w-full border rounded-md p-2"
              />
              {errors.staff?.[index]?.first_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.staff[index]?.first_name?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                {...register(`staff.${index}.last_name`)}
                className="w-full border rounded-md p-2"
              />
              {errors.staff?.[index]?.last_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.staff[index]?.last_name?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                {...register(`staff.${index}.role`)}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select Role</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMINISTRATOR">Administrator</option>
                <option value="SUPPORT_STAFF">Support Staff</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.staff?.[index]?.role && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.staff[index]?.role?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification
              </label>
              <input
                {...register(`staff.${index}.qualification`)}
                className="w-full border rounded-md p-2"
              />
              {errors.staff?.[index]?.qualification && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.staff[index]?.qualification?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register(`staff.${index}.email`)}
                className="w-full border rounded-md p-2"
              />
              {errors.staff?.[index]?.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.staff[index]?.email?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                {...register(`staff.${index}.phone`)}
                className="w-full border rounded-md p-2"
              />
              {errors.staff?.[index]?.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.staff[index]?.phone?.message}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No staff members added. Click the button above to add a staff member.
        </p>
      )}
    </div>
  );
}
