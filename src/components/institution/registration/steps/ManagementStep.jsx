// src/components/institution/registration/steps/ManagementStep.js
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Plus, Trash2 } from 'lucide-react';

const FilePreview = ({ document, onRemove }) => (
  <div className="border rounded-lg p-4 mb-4 bg-gray-50">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div>
          <h4 className="font-medium">{document.name}</h4>
          <p className="text-sm text-gray-500">
            {(document.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
      >
        Remove
      </button>
    </div>
  </div>
);

const ManagementMemberForm = ({ member, onChange, onRemove }) => (
  <div className="border rounded-lg p-4 mb-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={member.name || ''}
          onChange={(e) => onChange({ ...member, name: e.target.value })}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Enter full name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <input
          type="text"
          value={member.role || ''}
          onChange={(e) => onChange({ ...member, role: e.target.value })}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Enter role"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={member.email || ''}
          onChange={(e) => onChange({ ...member, email: e.target.value })}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Enter email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          value={member.phone || ''}
          onChange={(e) => onChange({ ...member, phone: e.target.value })}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Enter phone number"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
        <textarea
          value={member.bio || ''}
          onChange={(e) => onChange({ ...member, bio: e.target.value })}
          className="w-full border rounded-md px-3 py-2"
          rows={3}
          placeholder="Enter brief biography"
        />
      </div>
    </div>
    <div className="mt-4 flex justify-end">
      <button
        onClick={onRemove}
        className="flex items-center text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Remove Member
      </button>
    </div>
  </div>
);

const ManagementStep = ({ formData = { management: {} }, setFormData }) => {
  const [members, setMembers] = useState(formData?.management?.members || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      management: {
        ...(prev?.management || {}),
        [name]: value
      }
    }));
  };

  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    if (files?.length) {
      const file = files[0];
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      };
      
      setFormData(prev => ({
        ...prev,
        management: {
          ...(prev?.management || {}),
          [name]: fileData
        }
      }));
    }
  };

  const handleFileRemove = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      management: {
        ...(prev?.management || {}),
        [fieldName]: null
      }
    }));
  };

  const handleAddMember = () => {
    const newMember = {
      id: Date.now(),
      name: '',
      role: '',
      email: '',
      phone: '',
      bio: ''
    };
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    setFormData(prev => ({
      ...prev,
      management: {
        ...(prev?.management || {}),
        members: updatedMembers
      }
    }));
  };

  const handleMemberChange = (index, updatedMember) => {
    const updatedMembers = [...members];
    updatedMembers[index] = updatedMember;
    setMembers(updatedMembers);
    setFormData(prev => ({
      ...prev,
      management: {
        ...(prev?.management || {}),
        members: updatedMembers
      }
    }));
  };

  const handleMemberRemove = (index) => {
    const updatedMembers = members.filter((_, idx) => idx !== index);
    setMembers(updatedMembers);
    setFormData(prev => ({
      ...prev,
      management: {
        ...(prev?.management || {}),
        members: updatedMembers
      }
    }));
  };

  const management = formData?.management || {};

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Management Type
          </label>
          <select
            name="managementType"
            value={management.managementType || ''}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Management Type</option>
            <option value="BOG">Board of Governors (BOG)</option>
            <option value="BOD">Board of Directors (BOD)</option>
            <option value="TRUST">Trust</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Strategic Plan</h4>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                name="strategicPlan"
                onChange={handleFileUpload}
                className="hidden"
                id="strategicPlan"
                accept=".pdf,.doc,.docx"
              />
              <label 
                htmlFor="strategicPlan"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Upload Strategic Plan
                </span>
                <span className="text-xs text-gray-500">
                  (PDF, DOC, DOCX up to 10MB)
                </span>
              </label>
            </div>
            {management.strategicPlan && (
              <FilePreview
                document={management.strategicPlan}
                onRemove={() => handleFileRemove('strategicPlan')}
              />
            )}
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Operational Plan</h4>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                name="operationalPlan"
                onChange={handleFileUpload}
                className="hidden"
                id="operationalPlan"
                accept=".pdf,.doc,.docx"
              />
              <label 
                htmlFor="operationalPlan"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Upload Operational Plan
                </span>
                <span className="text-xs text-gray-500">
                  (PDF, DOC, DOCX up to 10MB)
                </span>
              </label>
            </div>
            {management.operationalPlan && (
              <FilePreview
                document={management.operationalPlan}
                onRemove={() => handleFileRemove('operationalPlan')}
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Key Management Members</h4>
            <button
              onClick={handleAddMember}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Member
            </button>
          </div>

          {members.map((member, index) => (
            <ManagementMemberForm
              key={member.id}
              member={member}
              onChange={(updatedMember) => handleMemberChange(index, updatedMember)}
              onRemove={() => handleMemberRemove(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagementStep;