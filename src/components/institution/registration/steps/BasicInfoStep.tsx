import React from "react";
import { useFormContext } from "react-hook-form";
import { type BasicInfoInputs } from "@/lib/validation/institutionSchema";

export function BasicInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<{ basicInfo: BasicInfoInputs }>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution Name
          </label>
          <input
            {...register("basicInfo.name")}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.basicInfo?.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.basicInfo.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution Type
          </label>
          <select
            {...register("basicInfo.type")}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            <option value="POLYTECHNIC">National Polytechnic</option>
            <option value="VTC">Vocational Training Center</option>
            <option value="UNIVERSITY">University</option>
            <option value="SPECIALIZED">Specialized College</option>
          </select>
          {errors.basicInfo?.type && (
            <p className="mt-1 text-sm text-red-600">
              {errors.basicInfo.type.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number
          </label>
          <input
            {...register("basicInfo.registration_number")}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.basicInfo?.registration_number && (
            <p className="mt-1 text-sm text-red-600">
              {errors.basicInfo.registration_number.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person
          </label>
          <input
            {...register("basicInfo.contact_person")}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.basicInfo?.contact_person && (
            <p className="mt-1 text-sm text-red-600">
              {errors.basicInfo.contact_person.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("basicInfo.email")}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.basicInfo?.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.basicInfo.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            {...register("basicInfo.phone")}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.basicInfo?.phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.basicInfo.phone.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            {...register("basicInfo.address")}
            rows={3}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.basicInfo?.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.basicInfo.address.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website (Optional)
          </label>
          <input
            type="url"
            {...register("basicInfo.website")}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.basicInfo?.website && (
            <p className="mt-1 text-sm text-red-600">
              {errors.basicInfo.website.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
