// src/components/program/ProgramManagement.js
import { Plus, FileText, Edit, Trash2, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { programService } from '../../services/api';

const ProgramManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all'
  });

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await programService.list(filters);
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Maritime Training Programs</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Program
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search programs..."
              className="pl-10 w-full border rounded-md p-2"
              onChange={(e) => setFilters(prev => ({
                ...prev,
                search: e.target.value
              }))}
            />
          </div>
          <select
            onChange={(e) => setFilters(prev => ({
              ...prev,
              type: e.target.value
            }))}
            className="border rounded-md p-2"
          >
            <option value="all">All Types</option>
            <option value="deck">Deck</option>
            <option value="engine">Engine</option>
            <option value="safety">Safety</option>
          </select>
          <select
            onChange={(e) => setFilters(prev => ({
              ...prev,
              status: e.target.value
            }))}
            className="border rounded-md p-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Program Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {programs.map((program) => (
              <tr key={program.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                    {program.name}
                  </div>
                </td>
                <td className="px-6 py-4">{program.type}</td>
                <td className="px-6 py-4">{program.duration}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    program.status === 'active' ? 'bg-green-100 text-green-800' :
                    program.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {program.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(program.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Program Modal */}
      {showAddModal && (
        <ProgramFormModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleProgramSubmit}
        />
      )}
    </div>
  );
};

// Program Form Modal Component
const ProgramFormModal = ({ program, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(program || {
    name: '',
    type: '',
    duration: '',
    level: '',
    capacity: '',
    curriculum: null,
    syllabus: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      await onSubmit(formDataToSend);
      onClose();
    } catch (error) {
      console.error('Error submitting program:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-medium mb-4">
          {program ? 'Edit Program' : 'Add New Program'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Program Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Program Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              >
                <option value="">Select Type</option>
                <option value="deck">Deck</option>
                <option value="engine">Engine</option>
                <option value="safety">Safety</option>
              </select>
            </div>

            {/* Add more form fields */}
          </div>

          {/* File uploads */}
          <div className="space-y-4">
            <FileUpload
              label="Curriculum Document"
              accept=".pdf,.doc,.docx"
              onChange={(file) => setFormData(prev => ({
                ...prev,
                curriculum: file
              }))}
            />

            <FileUpload
              label="Syllabus"
              accept=".pdf,.doc,.docx"
              onChange={(file) => setFormData(prev => ({
                ...prev,
                syllabus: file
              }))}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {program ? 'Update Program' : 'Add Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramManagement;