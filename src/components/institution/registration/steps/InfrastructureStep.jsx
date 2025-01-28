// src/components/institution/registration/steps/InfrastructureStep.js
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Camera } from 'lucide-react';

const RatingSelect = ({ value, onChange, label }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full border rounded-md px-3 py-2"
    >
      <option value="">Select Rating</option>
      {[1, 2, 3, 4, 5].map(num => (
        <option key={num} value={num}>
          {num} - {num === 1 ? 'Poor' : num === 2 ? 'Fair' : num === 3 ? 'Good' : num === 4 ? 'Very Good' : 'Excellent'}
        </option>
      ))}
    </select>
  </div>
);

const FacilityForm = ({ facility, onChange, onRemove, type }) => (
  <div className="border rounded-lg p-4 mb-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Area (sq. meters)
        </label>
        <input
          type="number"
          value={facility.area || ''}
          onChange={(e) => onChange({ ...facility, area: e.target.value })}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Enter area"
        />
      </div>
      <div>
        <RatingSelect
          value={facility.condition}
          onChange={(value) => onChange({ ...facility, condition: value })}
          label="Condition Rating"
        />
      </div>
      {(type === 'workshop' || type === 'lab') && (
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equipment List
          </label>
          <textarea
            value={facility.equipment || ''}
            onChange={(e) => onChange({ ...facility, equipment: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            rows={3}
            placeholder="List major equipment items"
          />
        </div>
      )}
    </div>
    <div className="mt-4 flex justify-end">
      <button
        onClick={onRemove}
        className="flex items-center text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Remove
      </button>
    </div>
  </div>
);

const InfrastructureStep = ({ formData = { infrastructure: {} }, setFormData }) => {
  const [classrooms, setClassrooms] = useState(formData?.infrastructure?.classrooms || []);
  const [workshops, setWorkshops] = useState(formData?.infrastructure?.workshops || []);
  const [labs, setLabs] = useState(formData?.infrastructure?.labs || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      infrastructure: {
        ...(prev?.infrastructure || {}),
        [name]: value
      }
    }));
  };

  const handleAddFacility = (type) => {
    const newFacility = {
      id: Date.now(),
      area: '',
      condition: '',
      equipment: type !== 'classroom' ? '' : undefined
    };

    if (type === 'classroom') {
      const updatedClassrooms = [...classrooms, newFacility];
      setClassrooms(updatedClassrooms);
      updateFormData('classrooms', updatedClassrooms);
    } else if (type === 'workshop') {
      const updatedWorkshops = [...workshops, newFacility];
      setWorkshops(updatedWorkshops);
      updateFormData('workshops', updatedWorkshops);
    } else if (type === 'lab') {
      const updatedLabs = [...labs, newFacility];
      setLabs(updatedLabs);
      updateFormData('labs', updatedLabs);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      infrastructure: {
        ...(prev?.infrastructure || {}),
        [field]: value
      }
    }));
  };

  const handleFacilityChange = (type, index, updatedFacility) => {
    if (type === 'classroom') {
      const updatedClassrooms = [...classrooms];
      updatedClassrooms[index] = updatedFacility;
      setClassrooms(updatedClassrooms);
      updateFormData('classrooms', updatedClassrooms);
    } else if (type === 'workshop') {
      const updatedWorkshops = [...workshops];
      updatedWorkshops[index] = updatedFacility;
      setWorkshops(updatedWorkshops);
      updateFormData('workshops', updatedWorkshops);
    } else if (type === 'lab') {
      const updatedLabs = [...labs];
      updatedLabs[index] = updatedFacility;
      setLabs(updatedLabs);
      updateFormData('labs', updatedLabs);
    }
  };

  const handleFacilityRemove = (type, index) => {
    if (type === 'classroom') {
      const updatedClassrooms = classrooms.filter((_, idx) => idx !== index);
      setClassrooms(updatedClassrooms);
      updateFormData('classrooms', updatedClassrooms);
    } else if (type === 'workshop') {
      const updatedWorkshops = workshops.filter((_, idx) => idx !== index);
      setWorkshops(updatedWorkshops);
      updateFormData('workshops', updatedWorkshops);
    } else if (type === 'lab') {
      const updatedLabs = labs.filter((_, idx) => idx !== index);
      setLabs(updatedLabs);
      updateFormData('labs', updatedLabs);
    }
  };

  const infrastructure = formData?.infrastructure || {};

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* Classrooms Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Classrooms</h4>
            <button
              onClick={() => handleAddFacility('classroom')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Classroom
            </button>
          </div>
          {classrooms.map((classroom, index) => (
            <FacilityForm
              key={classroom.id}
              facility={classroom}
              onChange={(updated) => handleFacilityChange('classroom', index, updated)}
              onRemove={() => handleFacilityRemove('classroom', index)}
              type="classroom"
            />
          ))}
        </div>

        {/* Workshops Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Workshops & Equipment</h4>
            <button
              onClick={() => handleAddFacility('workshop')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Workshop
            </button>
          </div>
          {workshops.map((workshop, index) => (
            <FacilityForm
              key={workshop.id}
              facility={workshop}
              onChange={(updated) => handleFacilityChange('workshop', index, updated)}
              onRemove={() => handleFacilityRemove('workshop', index)}
              type="workshop"
            />
          ))}
        </div>

        {/* Labs Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Labs & Equipment</h4>
            <button
              onClick={() => handleAddFacility('lab')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Lab
            </button>
          </div>
          {labs.map((lab, index) => (
            <FacilityForm
              key={lab.id}
              facility={lab}
              onChange={(updated) => handleFacilityChange('lab', index, updated)}
              onRemove={() => handleFacilityRemove('lab', index)}
              type="lab"
            />
          ))}
        </div>

        {/* General Facilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Male Toilets
            </label>
            <input
              type="number"
              name="maleToilets"
              value={infrastructure.maleToilets || ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Female Toilets
            </label>
            <input
              type="number"
              name="femaleToilets"
              value={infrastructure.femaleToilets || ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Water Source
            </label>
            <select
              name="waterSource"
              value={infrastructure.waterSource || ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select Water Source</option>
              <option value="COUNTY">County Water Provider</option>
              <option value="BOREHOLE">Borehole</option>
              <option value="RIVER">River</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solid Waste Disposal
            </label>
            <select
              name="wasteDisposal"
              value={infrastructure.wasteDisposal || ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select Disposal Method</option>
              <option value="SEPTIC">Septic Tank</option>
              <option value="SEWERAGE">Sewerage System</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Safety Features */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Safety & Emergency Preparedness</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RatingSelect
              value={infrastructure.fireReadiness}
              onChange={(value) => updateFormData('fireReadiness', value)}
              label="Fire Safety Readiness"
            />
            <RatingSelect
              value={infrastructure.safetyFeatures}
              onChange={(value) => updateFormData('safetyFeatures', value)}
              label="General Safety Features"
            />
          </div>
        </div>

        {/* Insurance Information */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="hasInsurance"
              checked={infrastructure.hasInsurance || false}
              onChange={(e) => updateFormData('hasInsurance', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Infrastructure is insured</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfrastructureStep;