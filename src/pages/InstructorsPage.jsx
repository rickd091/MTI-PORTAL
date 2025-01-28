// src/pages/InstructorsPage.js
import { useState, useEffect } from 'react';
import { 
  Users, Award, Search, Plus, FileText, 
  CheckCircle, AlertCircle, Calendar 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchInstructors, 
  addInstructor, 
  updateInstructorCertification,
  setFilters 
} from '../store/slices/instructorsSlice';

const InstructorsPage = () => {
  const dispatch = useDispatch();
  const { list: instructors, status, error, filters } = useSelector(
    (state) => state.instructors
  );
  const [showNewInstructor, setShowNewInstructor] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchInstructors());
    }
  }, [status, dispatch]);

  const specializations = [
    'Navigation',
    'Engineering',
    'Safety & Security',
    'Environmental Protection',
    'Maritime Law'
  ];

  const handleAddInstructor = async (instructorData) => {
    try {
      await dispatch(addInstructor(instructorData)).unwrap();
      setShowNewInstructor(false);
    } catch (err) {
      console.error('Failed to add instructor:', err);
    }
  };

  const handleUpdateCertification = async (instructorId, certificationData) => {
    try {
      await dispatch(
        updateInstructorCertification({ instructorId, certificationData })
      ).unwrap();
    } catch (err) {
      console.error('Failed to update certification:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Maritime Instructors</h1>
          <p className="text-gray-600">Manage and track instructor certifications</p>
        </div>
        <button
          onClick={() => setShowNewInstructor(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Instructor
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Instructors',
            value: instructors.length,
            icon: Users,
            color: 'text-blue-600'
          },
          {
            label: 'Active Certifications',
            value: instructors.filter(i => i.certifications?.some(c => c.status === 'active')).length,
            icon: Award,
            color: 'text-green-600'
          },
          {
            label: 'Expiring Soon',
            value: instructors.filter(i => i.certifications?.some(c => c.status === 'expiring')).length,
            icon: AlertCircle,
            color: 'text-yellow-600'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search instructors..."
                className="pl-10 w-full rounded-md border border-gray-300 p-2"
                value={filters.search}
                onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
              />
            </div>
          </div>
          <select
            className="border rounded-md p-2"
            value={filters.specialization}
            onChange={(e) => dispatch(setFilters({ specialization: e.target.value }))}
          >
            <option value="all">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          <select
            className="border rounded-md p-2"
            value={filters.status}
            onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specializations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Certifications
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {instructors.map((instructor) => (
              <tr key={instructor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {instructor.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {instructor.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {instructor.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {instructor.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Award className="w-4 h-4 mr-2 text-blue-500" />
                        {cert.name}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs 
                          ${cert.status === 'active' ? 'bg-green-100 text-green-800' :
                            cert.status === 'expiring' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                          {cert.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full 
                    ${instructor.status === 'active' ? 'bg-green-100 text-green-800' :
                      instructor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {instructor.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <button
                    onClick={() => setSelectedInstructor(instructor)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleUpdateCertification(instructor.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Update Certification
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Components */}
      {showNewInstructor && (
        <NewInstructorModal
          onClose={() => setShowNewInstructor(false)}
          onSubmit={handleAddInstructor}
          specializations={specializations}
        />
      )}

      {selectedInstructor && (
        <InstructorDetailsModal
          instructor={selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
          onUpdateCertification={handleUpdateCertification}
        />
      )}
    </div>
  );
};

export default InstructorsPage;