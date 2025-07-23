import React from 'react';

// Helper for user-friendly status
function getStatusLabel(status) {
  switch (status) {
    case 'Completed':
    case 'completed':
      return 'Document Checked';
    case 'approved':
      return 'Payment Approved';
    case 'pending_approval':
      return 'Pending Approval';
    case 'rejected':
      return 'Rejected';
    case 'draft':
      return 'Draft';
    default:
      return status || 'No Status';
  }
}

const StatusTracking = ({ users, setUsers, programs, setPrograms, payments, fetchUsers, fetchPrograms, currentUser }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Status Tracking Overview</h2>

      {/* User Account Statuses Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Account Statuses</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Program Statuses Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Program Statuses</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                {/* Only show for admin */}
                {currentUser && currentUser.role === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {programs.map((program) => {
                // Find creator name
                const creator = users.find(u => u.id === program.created_by);
                return (
                  <tr key={program.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{program.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.name}</td>
                    {/* Only show for admin */}
                    {currentUser && currentUser.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{creator ? creator.name : '-'}</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RM {program.budget}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        program.status === 'approved' ? 'bg-green-100 text-green-800' :
                        program.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                        program.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusLabel(program.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatusTracking; 