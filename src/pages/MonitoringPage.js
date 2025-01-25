// src/pages/MonitoringPage.js
import { useEffect, useState } from 'react';
import { 
  Calendar,
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAudits,
  scheduleAudit,
  updateAuditStatus,
  setFilters 
} from '../store/slices/monitoringSlice';

const MonitoringPage = () => {
  const dispatch = useDispatch();
  const { 
    audits,
    scheduledAudits,
    completedAudits,
    upcomingAudits,
    status,
    error,
    filters 
  } = useSelector((state) => state.monitoring);
  const [showScheduleAudit, setShowScheduleAudit] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAudits());
    }
  }, [status, dispatch]);

  const auditTypes = {
    INITIAL: 'Initial Assessment',
    ANNUAL: 'Annual Audit',
    FOLLOWUP: 'Follow-up Audit',
    RENEWAL: 'Renewal Audit'
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'text-blue-600 bg-blue-100',
      completed: 'text-green-600 bg-green-100',
      overdue: 'text-red-600 bg-red-100',
      inProgress: 'text-yellow-600 bg-yellow-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Monitoring & Audits</h1>
          <p className="text-gray-600">Track and manage institutional audits</p>
        </div>
        <button
          onClick={() => setShowScheduleAudit(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Audit
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Scheduled Audits',
            value: scheduledAudits.length,
            icon: Calendar,
            color: 'text-blue-600'
          },
          {
            label: 'Completed',
            value: completedAudits.length,
            icon: CheckCircle,
            color: 'text-green-600'
          },
          {
            label: 'Upcoming (2 weeks)',
            value: upcomingAudits.length,
            icon: Clock,
            color: 'text-yellow-600'
          },
          {
            label: 'Requires Action',
            value: audits.filter(a => a.findings?.length > 0).length,
            icon: AlertTriangle,
            color: 'text-red-600'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search audits..."
                className="pl-10 w-full rounded-md border border-gray-300 p-2"
                onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
              />
            </div>
          </div>
          <select
            className="border rounded-md p-2"
            value={filters.type}
            onChange={(e) => dispatch(setFilters({ type: e.target.value }))}
          >
            <option value="all">All Types</option>
            {Object.entries(auditTypes).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          <select
            className="border rounded-md p-2"
            value={filters.status}
            onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Audits Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Institution
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Audit Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Scheduled Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Findings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {audits.map((audit) => (
              <tr key={audit.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{audit.institutionName}</div>
                    <div className="text-sm text-gray-500">{audit.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4">{auditTypes[audit.type]}</td>
                <td className="px-6 py-4">{audit.scheduledDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(audit.status)}`}>
                    {audit.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm">
                    {audit.findings?.length || 0} {audit.findings?.length === 1 ? 'finding' : 'findings'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => setSelectedAudit(audit)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View Details
                  </button>
                  {audit.status === 'scheduled' && (
                    <button
                      onClick={() => handleUpdateStatus(audit.id, 'completed')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Mark Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showScheduleAudit && (
        <ScheduleAuditModal
          onClose={() => setShowScheduleAudit(false)}
          onSubmit={handleScheduleAudit}
          auditTypes={auditTypes}
        />
      )}

      {selectedAudit && (
        <AuditDetailsModal
          audit={selectedAudit}
          onClose={() => setSelectedAudit(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default MonitoringPage;