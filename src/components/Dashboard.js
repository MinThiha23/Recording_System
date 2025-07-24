import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const Dashboard = ({ currentUser, programs, setCurrentPage }) => {
  // Prepare data for charts
  const statusData = [
    { name: 'Approved', value: programs.filter(p => p.status === 'approved').length, color: '#10B981' },
    { name: 'Pending', value: programs.filter(p => p.status === 'pending' || p.status === 'under_review').length, color: '#F59E0B' },
    { name: 'Rejected', value: programs.filter(p => p.status === 'rejected').length, color: '#EF4444' },
    { name: 'Draft', value: programs.filter(p => p.status === 'draft').length, color: '#6B7280' }
  ];

  const budgetData = programs.map(program => ({
    name: program.name.length > 15 ? program.name.substring(0, 15) + '...' : program.name,
    budget: parseFloat(program.budget) || 0,
    status: program.status
  })).slice(0, 6); // Show top 6 programs

  const monthlyData = [
    { month: 'Jan', programs: 4, budget: 45000 },
    { month: 'Feb', programs: 6, budget: 52000 },
    { month: 'Mar', programs: 8, budget: 48000 },
    { month: 'Apr', programs: 5, budget: 61000 },
    { month: 'May', programs: 7, budget: 55000 },
    { month: 'Jun', programs: programs.length, budget: programs.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0) }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending Review';
      case 'under_review':
        return 'Under Review';
      default:
        return 'Draft';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-xl p-6 border-l-4 border-yellow-400">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Selamat Datang, {currentUser.name}!
            </h1>
            <p className="text-blue-200 mt-1">
              Urus program anda dan jejaki kemajuannya
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('apply-program')}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Mohon Program Baru</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-lg shadow-xl p-6 text-white border-t-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Jumlah Program</p>
              <p className="text-3xl font-bold">{programs.length}</p>
              <p className="text-blue-100 text-xs mt-1">+12% dari bulan lalu</p>
            </div>
            <div className="p-3 bg-yellow-400 bg-opacity-20 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-lg shadow-xl p-6 text-white border-t-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Diluluskan</p>
              <p className="text-3xl font-bold">{programs.filter(p => p.status === 'approved').length}</p>
              <p className="text-green-100 text-xs mt-1">+8% dari bulan lalu</p>
            </div>
            <div className="p-3 bg-yellow-400 bg-opacity-20 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-lg shadow-xl p-6 text-white border-t-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Menunggu</p>
              <p className="text-3xl font-bold">
                {programs.filter(p => p.status === 'pending' || p.status === 'under_review').length}
              </p>
              <p className="text-orange-100 text-xs mt-1">-3% dari bulan lalu</p>
            </div>
            <div className="p-3 bg-yellow-400 bg-opacity-20 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-lg shadow-xl p-6 text-white border-t-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Jumlah Belanjawan</p>
              <p className="text-3xl font-bold">
                RM {(programs.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-purple-100 text-xs mt-1">+15% dari bulan lalu</p>
            </div>
            <div className="p-3 bg-yellow-400 bg-opacity-20 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Status Pie Chart */}
        <div className="bg-white rounded-lg shadow-xl p-6 border-t-4 border-blue-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Taburan Status Program</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Bar Chart */}
        <div className="bg-white rounded-lg shadow-xl p-6 border-t-4 border-green-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Belanjawan Program</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => [`RM ${value.toLocaleString()}`, 'Budget']} />
              <Bar dataKey="budget" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow-xl p-6 border-t-4 border-purple-600">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Bulanan</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorPrograms" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'programs' ? value : `RM ${value.toLocaleString()}`,
                name === 'programs' ? 'Programs' : 'Budget'
              ]}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="programs"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorPrograms)"
              name="Programs"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="budget"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorBudget)"
              name="Budget"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Original Statistics Cards - REMOVED */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Programs</p>
              <p className="text-2xl font-semibold text-gray-900">{programs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {programs.filter(p => p.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {programs.filter(p => p.status === 'pending' || p.status === 'under_review').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">
                {programs.filter(p => p.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Table */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border-t-4 border-yellow-400">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Program Anda</h2>
        </div>
        
        {programs.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tiada Program</h3>
            <p className="mt-1 text-sm text-gray-500">Mulakan dengan memohon program baru.</p>
            <div className="mt-6">
              <button
                onClick={() => setCurrentPage('apply-program')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-blue-900 bg-yellow-400 hover:bg-yellow-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Mohon Program Baru
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Belanjawan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarikh Mohon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {programs.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{program.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">RM {program.budget?.toLocaleString() || '0'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(program.status)}`}>
                        {getStatusLabel(program.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(program.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Lihat
                      </button>
                      {program.status === 'draft' && (
                        <button className="text-green-600 hover:text-green-900">
                          Sunting
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;