import React, { useState } from 'react';
import { mockCreateProgram } from '../utils/mockAuth';

const ApplyProgram = ({ currentUser, onProgramAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    recipientName: '',
    documents: {}
  });
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const documentTypes = [
    { key: 'centralServiceLetter', label: 'Central Service Acknowledgement Letter' },
    { key: 'pknsApprovalLetter', label: 'PKNS Approval Letter' },
    { key: 'programLetter', label: 'Program Letter' },
    { key: 'excoLetter', label: 'EXCO Letter' },
    { key: 'bankAccountManager', label: 'Bank Account Manager' },
    { key: 'cordRegistrationForm', label: 'KOD Registration Form' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (documentType, file) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [documentType]: file
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const programData = {
        name: formData.name,
        description: formData.description,
        budget: formData.budget,
        recipientName: formData.recipientName,
        remarks: remarks
      };

      await mockCreateProgram(token, programData);
      alert('Program application submitted successfully!');
      onProgramAdded();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        budget: '',
        recipientName: '',
        documents: {}
      });
      setRemarks('');
    } catch (error) {
      console.error('Error submitting program:', error);
      alert(error.message || 'An error occurred while submitting the program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Apply for New Program</h1>
          <p className="text-gray-600 mt-2">Fill in the details below to submit your program application</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Program Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter program name"
                />
              </div>

              <div>
                <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  name="recipientName"
                  id="recipientName"
                  required
                  value={formData.recipientName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter recipient name"
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (RM) *
                </label>
                <input
                  type="number"
                  name="budget"
                  id="budget"
                  required
                  step="0.01"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Program Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your program..."
                />
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documentTypes.map((docType) => (
                <div key={docType.key} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {docType.label}
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm">
                      Choose File
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(docType.key, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {formData.documents[docType.key] && (
                      <span className="text-sm text-green-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {formData.documents[docType.key].name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Remarks</h2>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional remarks or notes about your program application..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyProgram;