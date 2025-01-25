// src/pages/CertificatesPage.js
import { useState, useEffect } from 'react';
import { 
  Award, 
  FileText, 
  Download, 
  Search, 
  Filter,
  Calendar,
  AlertTriangle 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

const CertificatesPage = () => {
  const [activeView, setActiveView] = useState('list');
  const [filterCriteria, setFilterCriteria] = useState({
    status: 'all',
    courseType: 'all',
    dateRange: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const certificates = useSelector((state) => state.certificates.list);
  const dispatch = useDispatch();

  const statusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
      revoked: 'bg-gray-100 text-gray-800'
    };
    return `px-2 py-1 rounded-full text-xs ${styles[status] || styles.default}`;
  };

  const courseTypes = {
    STCW: ['Basic Safety', 'Advanced Firefighting', 'Medical Care'],
    'Non-STCW': ['Port Security', 'Maritime English', 'Environmental Management']
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Course Certificates</h1>
          <p className="text-gray-600">Manage and issue course completion certificates</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            New Certificate
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Batch Process
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Certificates', value: '1,234', color: 'text-green-600' },
          { label: 'Pending Review', value: '56', color: 'text-yellow-600' },
          { label: 'Expiring Soon', value: '28', color: 'text-orange-600' },
          { label: 'Expired', value: '143', color: 'text-red-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
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
                placeholder="Search certificates..."
                className="pl-10 w-full rounded-md border border-gray-300 p-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="border rounded-md p-2"
            value={filterCriteria.courseType}
            onChange={(e) => setFilterCriteria({...filterCriteria, courseType: e.target.value})}
          >
            <option value="all">All Courses</option>
            <optgroup label="STCW Courses">
              {courseTypes.STCW.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </optgroup>
            <optgroup label="Non-STCW Courses">
              {courseTypes['Non-STCW'].map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </optgroup>
          </select>
          <select
            className="border rounded-md p-2"
            value={filterCriteria.status}
            onChange={(e) => setFilterCriteria({...filterCriteria, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Certificate ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Course</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Student</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Issue Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Expiry Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{cert.id}</td>
                  <td className="px-6 py-4">{cert.courseName}</td>
                  <td className="px-6 py-4">{cert.studentName}</td>
                  <td className="px-6 py-4">{cert.issueDate}</td>
                  <td className="px-6 py-4">{cert.expiryDate}</td>
                  <td className="px-6 py-4">
                    <span className={statusBadge(cert.status)}>{cert.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;