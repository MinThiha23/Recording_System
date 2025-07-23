import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Eye, Edit, Trash2, Plus, ArrowLeft, FileText, CheckCircle, XCircle, Clock, Users, BarChart3, Download, MessageSquare, Upload, History, Info } from 'lucide-react';

// Generic Modal Component
const Modal = ({ show, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!show) return null;

  // Force red for delete/Reject, green for others
  let confirmBtnClass = 'px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl';
  if (confirmText.toLowerCase().includes('delete') || confirmText.toLowerCase().includes('reject')) {
    confirmBtnClass += ' bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700';
  } else {
    confirmBtnClass += ' bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={confirmBtnClass}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Document History Modal Component
const DocumentHistoryModal = ({ show, onClose, documentHistory, onDownload, t }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-blue-600 p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">{t('documentHistory')}</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {documentHistory.length > 0 ? (
            <ul className="space-y-4">
              {documentHistory.map(record => (
                <li key={record.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{record.file_name}</p>
                    <p className="text-sm text-gray-600">
                      Uploaded by {record.user_name} on {new Date(record.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onDownload(record.id)}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">{t('noHistoryFound')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Documents Modal Component
const DocumentsModal = ({ show, onClose, program, t, handleShowHistory, currentUser }) => {
  if (!show) return null;

  const allDocuments = [
    { key: 'centralServiceLetter', label: t('documents.centralServiceLetter'), path: program.central_service_letter_path, uploadedAt: program.central_service_letter_uploaded_at },
    { key: 'pknsApprovalLetter', label: t('documents.pknsApprovalLetter'), path: program.pkns_approval_letter_path, uploadedAt: program.pkns_approval_letter_uploaded_at },
    { key: 'programLetter', label: t('documents.programLetter'), path: program.program_letter_path, uploadedAt: program.program_letter_uploaded_at },
    { key: 'excoLetter', label: t('documents.excoLetter'), path: program.exco_letter_path, uploadedAt: program.exco_letter_uploaded_at },
    { key: 'bankAccountManager', label: t('documents.bankAccountManager'), path: program.bank_account_manager_path, uploadedAt: program.bank_account_manager_uploaded_at },
    { key: 'cordRegistrationForm', label: t('documents.cordRegistrationForm'), path: program.cord_registration_form_path, uploadedAt: program.cord_registration_form_uploaded_at }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-blue-500 p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">{t('Documents')}</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allDocuments.map((doc, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-700 mb-2">{doc.label}</h5>
                  <div className="flex items-start justify-between">
                    <div>
                      {doc.path ? (
                        <a
                          href={`http://localhost:5000/api/programs/${program.id}/document/${doc.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {t('View Document')}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No document</span>
                      )}
                      {doc.uploadedAt && (
                        <div className="text-xs text-gray-500 mt-2">
                          {t('Uploaded at')}: {new Date(doc.uploadedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleShowHistory(program.id, doc.key)}
                      className="ml-2 inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-xs"
                    >
                      <History className="h-3 w-3 mr-1" />
                      History
                    </button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

// Signed Documents Modal Component
const SignedDocumentsModal = ({ show, onClose, signedDocuments, program, t }) => {
  if (!show || !program) return null;

  const allSignedDocuments = [
    { key: 'signedCentralServiceLetter', label: t('documents.signedCentralServiceLetter'), path: signedDocuments?.signed_central_service_letter_path, uploadedAt: signedDocuments?.signed_central_service_letter_uploaded_at },
    { key: 'signedPknsApprovalLetter', label: t('documents.signedPknsApprovalLetter'), path: signedDocuments?.signed_pkns_approval_letter_path, uploadedAt: signedDocuments?.signed_pkns_approval_letter_uploaded_at },
    { key: 'signedProgramLetter', label: t('documents.signedProgramLetter'), path: signedDocuments?.signed_program_letter_path, uploadedAt: signedDocuments?.signed_program_letter_uploaded_at },
    { key: 'signedExcoLetter', label: t('documents.signedExcoLetter'), path: signedDocuments?.signed_exco_letter_path, uploadedAt: signedDocuments?.signed_exco_letter_uploaded_at },
    { key: 'signedBankAccountManager', label: t('documents.signedBankAccountManager'), path: signedDocuments?.signed_bank_account_manager_path, uploadedAt: signedDocuments?.signed_bank_account_manager_uploaded_at },
    { key: 'signedCordRegistrationForm', label: t('documents.signedCordRegistrationForm'), path: signedDocuments?.signed_cord_registration_form_path, uploadedAt: signedDocuments?.signed_cord_registration_form_uploaded_at }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-blue-500 p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">Signed Documents - {program?.name || 'Program'}</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {signedDocuments ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSignedDocuments.map((doc, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-700 mb-2">{doc.label}</h5>
                  <div>
                    {doc.path ? (
                      <a
                        href={`http://localhost:5000/api/programs/${program.id}/signed-document/${doc.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                      >
                        {t('View Signed Document')}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No signed document</span>
                    )}
                    {doc.uploadedAt && (
                      <div className="text-xs text-gray-500 mt-2">
                        {t('Uploaded at')}: {new Date(doc.uploadedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No signed documents found for this program</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Upload Signed Documents Modal Component
const UploadSignedDocumentsModal = ({ show, onClose, program, t, onUpload, signedDocumentFiles, onFileChange, isUploading }) => {
  if (!show) return null;

  const signedDocumentFields = [
    { key: 'signedCentralServiceLetter', label: t('documents.signedCentralServiceLetter') },
    { key: 'signedPknsApprovalLetter', label: t('documents.signedPknsApprovalLetter') },
    { key: 'signedProgramLetter', label: t('documents.signedProgramLetter') },
    { key: 'signedExcoLetter', label: t('documents.signedExcoLetter') },
    { key: 'signedBankAccountManager', label: t('documents.signedBankAccountManager') },
    { key: 'signedCordRegistrationForm', label: t('documents.signedCordRegistrationForm') }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-purple-600 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">Upload Signed Documents - {program?.name}</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={onUpload} encType="multipart/form-data" className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Signed Documents
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {signedDocumentFields.map((doc) => (
                  <div key={doc.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{doc.label}</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => onFileChange(e, doc.key)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Signed Documents'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Program Modal Component
const EditProgramModal = ({ show, onClose, program, onSave, currentUser, t, setError, setSuccess, fetchPrograms, setShowEditModal }) => {
  const [editedProgram, setEditedProgram] = useState(program);
  const [editFiles, setEditFiles] = useState({});

  useEffect(() => {
    setEditedProgram(program);
    setEditFiles({});
  }, [program]);

  if (!show || !editedProgram) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProgram((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'recipient_name' || name === 'recipientName' ? { recipient_name: value, recipientName: value } : {}),
      ...(name === 'exco_letter_reference_no' || name === 'excoLetterReferenceNo' ? { exco_letter_reference_no: value, excoLetterReferenceNo: value } : {}),
    }));
  };

  const handleFileChange = (e, fieldName) => {
    setEditFiles(prev => ({ ...prev, [fieldName]: e.target.files[0] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      
      const canEditAllFields =
        currentUser.role === 'admin' ||
        (currentUser.role === 'user' && editedProgram.created_by === currentUser.id) ||
        (currentUser.role === 'staff_pa' && editedProgram.status === 'query');

      if (canEditAllFields) {
        formData.append('name', editedProgram.name);
        formData.append('recipientName', editedProgram.recipient_name || editedProgram.recipientName || '');
        formData.append('excoLetterReferenceNo', editedProgram.exco_letter_reference_no || editedProgram.excoLetterReferenceNo || '');

        if (editFiles.centralServiceLetter) formData.append('centralServiceLetter', editFiles.centralServiceLetter);
        if (editFiles.pknsApprovalLetter) formData.append('pknsApprovalLetter', editFiles.pknsApprovalLetter);
        if (editFiles.programLetter) formData.append('programLetter', editFiles.programLetter);
        if (editFiles.excoLetter) formData.append('excoLetter', editFiles.excoLetter);
        if (editFiles.bankAccountManager) formData.append('bankAccountManager', editFiles.bankAccountManager);
        if (editFiles.cordRegistrationForm) formData.append('cordRegistrationForm', editFiles.cordRegistrationForm);
        if (editFiles.updatedDocument) formData.append('updatedDocument', editFiles.updatedDocument);
      } else {
        alert(t('permissionDeniedEditProgram'));
        onClose();
        return;
      }
      
      if (Array.from(formData.keys()).length === 0) {
        setError(t('noChangesDetectedOrPermissionDenied'));
        return;
      }

      const response = await fetch(`http://localhost:5000/api/programs/${editedProgram.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onClose();
        setSuccess(t('Program Updated Successfully'));
        fetchPrograms();
      } else {
        setError(data.error || t('failedToUpdateProgram'));
      }
    } catch (error) {
      setError(t('failedToConnectToServer'));
    }
  };

  const isFieldDisabled = (fieldName) => {
    if (currentUser.role === 'admin') return false;
    if (currentUser.role === 'user' && editedProgram.created_by === currentUser.id) return false;
    if (currentUser.role === 'staff_pa' && editedProgram.status === 'query') return false;
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">{t('editProgram')}</h3>
          <button
            onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
          >
              <XCircle className="h-6 w-6" />
          </button>
        </div>
        </div>
        
        <form onSubmit={handleSave} encType="multipart/form-data" className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="space-y-6">
          {currentUser.role !== 'staff_exco' && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('name')}</label>
                <input
                  type="text"
                  name="name"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={editedProgram.name || ''}
                  onChange={handleChange}
                  required
                  disabled={isFieldDisabled('name')}
                />
              </div>
              <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('budget')}</label>
                <input
                  type="number"
                  name="budget"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={editedProgram.budget || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  disabled={isFieldDisabled('budget')}
                />
              </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('recipientName')}</label>
                <input
                  type="text"
                  name="recipient_name"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={editedProgram.recipient_name || editedProgram.recipientName || ''}
                  onChange={handleChange}
                  required
                  disabled={isFieldDisabled('recipient_name')}
                />
              </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {t('documents')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'centralServiceLetter', label: t('documents.centralServiceLetter'), path: editedProgram.central_service_letter_path, uploadedAt: editedProgram.central_service_letter_uploaded_at },
                      { key: 'pknsApprovalLetter', label: t('documents.pknsApprovalLetter'), path: editedProgram.pkns_approval_letter_path, uploadedAt: editedProgram.pkns_approval_letter_uploaded_at },
                      { key: 'programLetter', label: t('documents.programLetter'), path: editedProgram.program_letter_path, uploadedAt: editedProgram.program_letter_uploaded_at },
                      { key: 'excoLetter', label: t('documents.excoLetter'), path: editedProgram.exco_letter_path, uploadedAt: editedProgram.exco_letter_uploaded_at },
                      { key: 'bankAccountManager', label: t('documents.bankAccountManager'), path: editedProgram.bank_account_manager_path, uploadedAt: editedProgram.bank_account_manager_uploaded_at },
                      { key: 'cordRegistrationForm', label: t('documents.cordRegistrationForm'), path: editedProgram.cord_registration_form_path, uploadedAt: editedProgram.cord_registration_form_uploaded_at }
                    ].map((doc) => (
                      <div key={doc.key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">{doc.label}</label>
                    <input
                      type="file"
                          onChange={(e) => handleFileChange(e, doc.key)}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                          disabled={isFieldDisabled(doc.key)}
                        />
                        {doc.uploadedAt && (
                          <div className="text-xs">
                            <a
                              href={`http://localhost:5000/api/programs/${editedProgram.id}/document/${doc.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {t('Current Document')}
                        </a>
                            <div className="text-gray-500 mt-1">
                              {t('Uploaded at')}: {new Date(doc.uploadedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                    ))}
                </div>
              </div>
            </>
          )}

          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('EXCO Reference Number')}</label>
            <input
              type="text"
              name="exco_letter_reference_no"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={editedProgram.exco_letter_reference_no || editedProgram.excoLetterReferenceNo || ''}
              onChange={handleChange}
            />
          </div>

          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {t('saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Combined Query Modal Component
const QueryModal = ({ show, onClose, program, t, onAddQuery, queries, newQueryText, setNewQueryText, isAddingQuery, activeTab, setActiveTab, onTabChange }) => {
  if (!show || !program) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'view' && onTabChange) {
      onTabChange();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-blue-600 p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">Query Management - {program.name}</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => handleTabChange('add')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'add'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Add Query
            </button>
            <button
              onClick={() => handleTabChange('view')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'view'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Eye className="h-4 w-4 inline mr-2" />
              View Queries
            </button>
          </nav>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {activeTab === 'add' ? (
            <div className="space-y-6">
              <form onSubmit={onAddQuery}>
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t('Enter your query')}
                  </label>
                  <textarea
                    value={newQueryText}
                    onChange={(e) => setNewQueryText(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    rows="4"
                    placeholder={t('Enter your query')}
                    required
                  />
                  <button
                    type="submit"
                    disabled={!newQueryText.trim() || isAddingQuery}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingQuery ? t('Adding...') : t('Add Query')}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {queries.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('No queries yet.')}</p>
                </div>
              ) : (
                queries.map(query => (
                  <div key={query.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="space-y-2">
                      <div><b>{t('Query')}:</b> {query.query_text}</div>
                      <div><b>{t('By')}:</b> {query.created_by_name} ({query.created_by_role})</div>
                      <div><b>{t('Status')}:</b> {query.status}</div>
                      {query.answer_text && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                          <b>{t('Answer')}:</b> {query.answer_text}
                          <br />
                          <b>{t('By')}:</b> {query.answered_by_name} ({query.answered_by_role})
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// DragScrollWrapper for horizontal drag-to-scroll
function DragScrollWrapper({ children }) {
  const scrollRef = useRef();
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.classList.add('cursor-grabbing');
  };

  const onMouseLeave = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove('cursor-grabbing');
  };

  const onMouseUp = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove('cursor-grabbing');
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto cursor-grab"
      style={{ userSelect: 'none' }}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  );
}

// Helper for user-friendly status
function getStatusLabel(status) {
  switch (status) {
    case 'Completed':
    case 'completed':
      return 'Document Checked';
    case 'approved':
      return 'Payment Approved';
    case 'approved_by_mmk_office':
      return 'Approved by MMK Office';
    case 'under_review':
      return 'Under Review';
    case 'under_review_mmk':
      return 'Under Review by MMK Office';
    case 'under_review_finance':
      return 'Under Review by Finance Unit';
    case 'query':
      return 'Query';
    case 'query_answered':
      return 'Query Answered';
    case 'rejected':
      return 'Rejected';
    case 'draft':
      return 'Draft';
    default:
      return status || 'No Status';
  }
}

function ProgramManagement({ programs, setPrograms, currentUser, users, setUsers }) {
  const { t } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [documentHistory, setDocumentHistory] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [newRemark, setNewRemark] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newProgram, setNewProgram] = useState({
    name: '',
    budget: '',
    recipientName: '',
    centralServiceLetter: null,
    pknsApprovalLetter: null,
    programLetter: null,
    excoLetter: null,
    bankAccountManager: null,
    cordRegistrationForm: null,
    excoLetterReferenceNo: '',
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [isAddingRemark, setIsAddingRemark] = useState(false);
  const [remarkCountdown, setRemarkCountdown] = useState(0);
  const [showSignedDocumentsModal, setShowSignedDocumentsModal] = useState(false);
  const [signedDocuments, setSignedDocuments] = useState(null);
  const [showUploadSignedDocumentsModal, setShowUploadSignedDocumentsModal] = useState(false);
  const [signedDocumentFiles, setSignedDocumentFiles] = useState({
    signedCentralServiceLetter: null,
    signedPknsApprovalLetter: null,
    signedProgramLetter: null,
    signedExcoLetter: null,
    signedBankAccountManager: null,
    signedCordRegistrationForm: null
  });
  const [isUploadingSignedDocuments, setIsUploadingSignedDocuments] = useState(false);
  const [queries, setQueries] = useState([]);
  const [showQueriesModal, setShowQueriesModal] = useState(false);
  const [showAddQueryModal, setShowAddQueryModal] = useState(false);
  const [showAnswerQueryModal, setShowAnswerQueryModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [newQueryText, setNewQueryText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [isAddingQuery, setIsAddingQuery] = useState(false);
  const [isAnsweringQuery, setIsAnsweringQuery] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [queryModalActiveTab, setQueryModalActiveTab] = useState('add');
  // Add state for status filter
  const [statusFilter, setStatusFilter] = useState('all');
  // Add state for MMK submission modal
  const [showMMKSubmitModal, setShowMMKSubmitModal] = useState(false);
  const [programToMMKSubmit, setProgramToMMKSubmit] = useState(null);
  // Add state for finance submission modal
  const [showFinanceSubmitModal, setShowFinanceSubmitModal] = useState(false);
  const [programToFinanceSubmit, setProgramToFinanceSubmit] = useState(null);
  // Add state for final approval modal
  const [showFinalApproveModal, setShowFinalApproveModal] = useState(false);
  const [finalApproveVoucher, setFinalApproveVoucher] = useState('');
  const [finalApproveEFT, setFinalApproveEFT] = useState('');
  const [isFinalApproving, setIsFinalApproving] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [programPayments, setProgramPayments] = useState({});
  const [showApprovedPrograms, setShowApprovedPrograms] = useState(false);
  const [showRejectedPrograms, setShowRejectedPrograms] = useState(false);

  const handleShowHistory = async (programId, documentType) => {
    try {
      const response = await fetch(`http://localhost:5000/api/programs/${programId}/documents/${documentType}/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if(response.ok) {
        const historyData = await response.json();
        setDocumentHistory(historyData);
        setShowHistoryModal(true);
      } else {
        setError('Failed to fetch document history.');
      }
    } catch (error) {
      setError('Failed to connect to server.');
    }
  };

  const handleDownloadHistory = (historyId) => {
    window.open(`http://localhost:5000/api/document-history/${historyId}`);
  };

  const handleShowSignedDocuments = async (programId) => {
    try {
      // Find the program object to set as selectedProgram
      const program = programs.find(p => p.id === programId);
      if (!program) {
        setError('Program not found.');
        return;
      }
      
      setSelectedProgram(program);
      
      const response = await fetch(`http://localhost:5000/api/programs/${programId}/signed-documents`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSignedDocuments(data);
        setShowSignedDocumentsModal(true);
      } else {
        setError('Failed to fetch signed documents.');
      }
    } catch (error) {
      setError('Failed to connect to server.');
    }
  };

  const handleUploadSignedDocuments = async (e) => {
    e.preventDefault();
    setIsUploadingSignedDocuments(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      
      // Add files to formData
      Object.keys(signedDocumentFiles).forEach(key => {
        if (signedDocumentFiles[key]) {
          formData.append(key, signedDocumentFiles[key]);
        }
      });

      const response = await fetch(`http://localhost:5000/api/programs/${selectedProgram.id}/signed-documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setShowUploadSignedDocumentsModal(false);
        setSignedDocumentFiles({
          signedCentralServiceLetter: null,
          signedPknsApprovalLetter: null,
          signedProgramLetter: null,
          signedExcoLetter: null,
          signedBankAccountManager: null,
          signedCordRegistrationForm: null
        });
        setSuccess(t('Signed documents uploaded successfully'));
        // Refresh signed documents
        await handleShowSignedDocuments(selectedProgram.id);
      } else {
        setError(data.error || t('failedToUploadSignedDocuments'));
      }
    } catch (error) {
      setError(t('failedToConnectToServer'));
    } finally {
      setIsUploadingSignedDocuments(false);
    }
  };

  const handleSignedDocumentFileChange = (e, fieldName) => {
    setSignedDocumentFiles(prev => ({ ...prev, [fieldName]: e.target.files[0] }));
  };

  const fetchQueries = async (programId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/programs/${programId}/queries`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setQueries(data);
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
    }
  };

  const handleShowQueries = async (programId) => {
    await fetchQueries(programId);
    setShowQueriesModal(true);
  };

  const handleAddQuery = async (e) => {
    e.preventDefault();
    if (!newQueryText.trim() || !selectedProgram || isAddingQuery) return;

    setIsAddingQuery(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/api/programs/${selectedProgram.id}/queries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query_text: newQueryText.trim()
        }),
      });

      if (response.ok) {
        const addedQuery = await response.json();
        setQueries(prevQueries => [addedQuery, ...prevQueries]);
        setNewQueryText('');
        setSuccess(t('queryAddedSuccessfully'));
        // Switch to view tab to show the new query
        setQueryModalActiveTab('view');
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('failedToAddQuery'));
      }
    } catch (error) {
      setError(t('failedToConnectToServer'));
    } finally {
      setIsAddingQuery(false);
    }
  };

  const handleAnswerQuery = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || !selectedQuery || isAnsweringQuery) return;

    setIsAnsweringQuery(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/api/queries/${selectedQuery.id}/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          answer_text: answerText.trim()
        }),
      });

      if (response.ok) {
        const updatedQuery = await response.json();
        setQueries(prevQueries => 
          prevQueries.map(q => q.id === selectedQuery.id ? updatedQuery : q)
        );
        setAnswerText('');
        setShowAnswerQueryModal(false);
        setSelectedQuery(null);
        setSuccess(t('queryAnsweredSuccessfully'));
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('failedToAnswerQuery'));
      }
    } catch (error) {
      setError(t('failedToConnectToServer'));
    } finally {
      setIsAnsweringQuery(false);
    }
  };

  const handleResolveQuery = async (queryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/queries/${queryId}/resolve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setQueries(prevQueries => 
          prevQueries.map(q => q.id === queryId ? { ...q, status: 'resolved', resolved_at: new Date() } : q)
        );
        setSuccess(t('queryResolvedSuccessfully'));
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('failedToResolveQuery'));
      }
    } catch (error) {
      setError(t('failedToConnectToServer'));
    }
  };

  const handleRejectProgram = async () => {
    if (!selectedProgram || isRejecting) return;

    setIsRejecting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/api/programs/${selectedProgram.id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setShowRejectModal(false);
        setSelectedProgram(null);
        setSuccess(t('Program rejected successfully'));
        fetchPrograms();
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('failedToRejectProgram'));
      }
    } catch (error) {
      setError(t('failedToConnectToServer'));
    } finally {
      setIsRejecting(false);
    }
  };

  const handleApproveProgram = async () => {
    if (!selectedProgram || isApproving) return;

    setIsApproving(true);
    setError('');
    setSuccess('');

    try {
      let endpoint = '';
      if (currentUser.role === 'staff_mmk') {
        endpoint = `http://localhost:5000/api/programs/${selectedProgram.id}/approve-mmk`;
      } else if (currentUser.role === 'staff_finance') {
        endpoint = `http://localhost:5000/api/programs/${selectedProgram.id}/approve`;
      } else {
        setError('You do not have permission to approve this program.');
        setIsApproving(false);
        return;
      }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setShowApproveModal(false);
        setSelectedProgram(null);
        setSuccess(t('Program approved successfully'));
        fetchPrograms();
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('failedToApproveProgram'));
      }
    } catch (error) {
      setError(t('failedToConnectToServer'));
    } finally {
      setIsApproving(false);
    }
  };

  // Add a new handler for staff_mmk approval
  const handleApproveProgramMMK = async () => {
    if (!selectedProgram || isApproving) return;
    setIsApproving(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`http://localhost:5000/api/programs/${selectedProgram.id}/approve-mmk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setShowApproveModal(false);
        setSelectedProgram(null);
        setSuccess('Program approved by MMK office successfully');
        fetchPrograms();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to approve program by MMK office');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setIsApproving(false);
    }
  };

  // Handler for final approval
  const handleFinalApprove = async () => {
    if (!selectedProgram) return;
    setIsFinalApproving(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`http://localhost:5000/api/programs/${selectedProgram.id}/final-approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          voucher_number: finalApproveVoucher,
          eft_number: finalApproveEFT
        })
      });
      if (response.ok) {
        setShowFinalApproveModal(false);
        setFinalApproveVoucher('');
        setFinalApproveEFT('');
        setSuccess('Program approved and payment recorded successfully.');
        fetchPrograms();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to approve program.');
      }
    } catch (error) {
      setError('Failed to connect to server.');
    } finally {
      setIsFinalApproving(false);
    }
  };

  const fetchPrograms = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('http://localhost:5000/api/programs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
        setLastRefreshed(new Date());
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [setPrograms]);

  useEffect(() => {
    fetchPrograms();
    // Fetch all payments for overview table
    const fetchAllPayments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/payments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const payments = await response.json();
          // Map by program_id for quick lookup
          const paymentMap = {};
          payments.forEach(p => {
            paymentMap[p.program_id] = p;
          });
          setProgramPayments(paymentMap);
        }
      } catch (e) {
        setProgramPayments({});
      }
    };
    fetchAllPayments();
  }, [fetchPrograms]);

  const handleManualRefresh = () => {
    fetchPrograms();
  };

  const fetchRemarks = async (programId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/programs/${programId}/remarks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRemarks(data);
      }
    } catch (error) {
      console.error('Error fetching remarks:', error);
    }
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      
      formData.append('name', newProgram.name);
      formData.append('budget', newProgram.budget);
      formData.append('recipientName', newProgram.recipientName);
      formData.append('excoLetterReferenceNo', newProgram.excoLetterReferenceNo || '-');
      formData.append('created_by', currentUser.id);

      if (newProgram.centralServiceLetter) formData.append('centralServiceLetter', newProgram.centralServiceLetter);
      if (newProgram.pknsApprovalLetter) formData.append('pknsApprovalLetter', newProgram.pknsApprovalLetter);
      if (newProgram.programLetter) formData.append('programLetter', newProgram.programLetter);
      if (newProgram.excoLetter) formData.append('excoLetter', newProgram.excoLetter);
      if (newProgram.bankAccountManager) formData.append('bankAccountManager', newProgram.bankAccountManager);
      if (newProgram.cordRegistrationForm) formData.append('cordRegistrationForm', newProgram.cordRegistrationForm);

      const response = await fetch('http://localhost:5000/api/programs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setPrograms([...programs, { ...data, status: 'draft' }]);
        setShowAddModal(false);
        setNewProgram({
          name: '',
          budget: '',
          recipientName: '',
          centralServiceLetter: null,
          pknsApprovalLetter: null,
          programLetter: null,
          excoLetter: null,
          bankAccountManager: null,
          cordRegistrationForm: null,
          excoLetterReferenceNo: ''
        });
        setSuccess(t('Program Added Successfully'));
      } else {
        setError(data.error || t('failedToAddProgram'));
      }
    } catch (error) {
      setError(t('failedToConnectToServer'));
    }
  };

  const handleSaveEditedProgram = (updatedProgram) => {
    setPrograms(programs.map((program) =>
      program.id === updatedProgram.id ? { ...program, ...updatedProgram } : program
    ));
    setSuccess(t('program Updated Successfully'));
    setShowEditModal(false);
    setSelectedProgram(null);
  };

  const handleDeleteProgram = async () => {
    if (currentUser.role !== 'admin' && selectedProgram.created_by !== currentUser.id) {
      alert(t('onlyDeleteOwnPrograms'));
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/programs/${selectedProgram.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setPrograms(programs.filter(p => p.id !== selectedProgram.id));
        setShowDeleteModal(false);
        setSelectedProgram(null);
        setSuccess(t('programDeletedSuccessfully'));
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('failedToDeleteProgram'));
      }
    } catch (error) {
      setError(t('failedToConnectToServer'));
    }
  };

  const handleSubmitForApproval = async (program) => {
    // Optimistic UI update
    const originalPrograms = programs;
    setPrograms(programs.map(p =>
      p.id === program.id ? { ...p, status: 'under_review' } : p
    ));

    try {
      const response = await fetch('http://localhost:5000/api/approvals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          programId: program.id,
          programName: program.name,
          status: 'pending', // This is for the approval request, which is fine
        }),
      });

      if (response.ok) {
        setSuccess(t('Program is submitted.'));
        // Refresh the programs to get latest status from server
        fetchPrograms().catch(err => {
          console.error('Failed to refresh programs after submission:', err);
        });
      } else {
        // Revert on failure
        setPrograms(originalPrograms);
        const errorData = await response.json();
        setError(errorData.error || t('failedToSubmitForApproval'));
      }
    } catch (error) {
      // Revert on failure
      setPrograms(originalPrograms);
      console.error('Caught error in handleSubmitForApproval:', error);
      setError(t('failedToConnectToServer'));
    }
  };

  const handleAddRemark = async (e) => {
    e.preventDefault();
    if (!newRemark.trim() || !selectedProgram || !currentUser || isAddingRemark) return;

    setError('');
    setSuccess('');
    setIsAddingRemark(true);
    setRemarkCountdown(1);

    try {
      const response = await fetch(`http://localhost:5000/api/programs/${selectedProgram.id}/remarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          remark: newRemark.trim(),
          userId: currentUser.id
        }),
      });

      if (response.ok) {
        const addedRemark = await response.json();
        setRemarks(prevRemarks => [addedRemark, ...prevRemarks]);
        setNewRemark('');
        setSuccess(t('remarkAddedSuccessfully'));
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('failedToAddRemark'));
      }
    } catch (error) {
      setError(t('failedToConnectToServer'));
    } finally {
      // Start countdown timer
      const countdownInterval = setInterval(() => {
        setRemarkCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsAddingRemark(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleViewProgram = async (program) => {
    setSelectedProgram(program);
    setShowViewModal(true);
    setActiveTab('details');
    await fetchRemarks(program.id);
    // Fetch payment info if program is approved
    if (program.status === 'approved') {
      try {
        const response = await fetch(`http://localhost:5000/api/payments?program_id=${program.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const payments = await response.json();
          // Find payment for this program
          const payment = payments.find(p => p.program_id === program.id);
          setPaymentInfo(payment || null);
        } else {
          setPaymentInfo(null);
        }
      } catch (e) {
        setPaymentInfo(null);
      }
    } else {
      setPaymentInfo(null);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'Completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending_approval':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'query':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'query_answered':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'under_review_mmk':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'under_review_finance':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'approved_by_mmk_office':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const isSummaryFlowActive = currentUser.role === 'admin' || currentUser.role === 'staff_finance' || currentUser.role === 'staff_pa' || currentUser.role === 'staff_mmk';
  const shouldShowUserList = isSummaryFlowActive && !selectedUserId;

  let programsToDisplay = programs;
  if (isSummaryFlowActive) {
    if (selectedUserId) {
      programsToDisplay = programs.filter(p => p.created_by === selectedUserId);
    } else {
      programsToDisplay = [];
    }
  }

  // Add this line to define filteredPrograms
  const filteredPrograms = statusFilter === 'all' ? programsToDisplay : programsToDisplay.filter(p => p.status === statusFilter);

  // For staff_finance, split into three tables
  let financeMainPrograms = filteredPrograms;
  let financeApprovedPrograms = [];
  let financeRejectedPrograms = [];
  let approvedByMMKOfficeCount = 0;
  if (currentUser.role === 'staff_finance') {
    financeApprovedPrograms = filteredPrograms.filter(p => p.status === 'approved' || p.status === 'approved_by_mmk_office');
    financeRejectedPrograms = filteredPrograms.filter(p => p.status === 'rejected');
    financeMainPrograms = filteredPrograms.filter(p => p.status !== 'approved' && p.status !== 'approved_by_mmk_office' && p.status !== 'rejected');
    approvedByMMKOfficeCount = filteredPrograms.filter(p => p.status === 'approved_by_mmk_office').length;
  }

  if (shouldShowUserList) {
    const userProgramStats = users
      .filter(u => u.role === 'user')
      .map(user => {
        let userPrograms = programs.filter(p => p.created_by === user.id);
        let total = userPrograms.length;
        
        if (currentUser.role === 'staff_pa') {
          let queryCount = userPrograms.filter(p => p?.status === 'query' || p?.status === 'query_answered').length;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            total,
            queryCount,
          };
        } else {
          let approved = userPrograms.filter(p => p?.status === 'approved').length;
          let rejected = userPrograms.filter(p => p?.status === 'rejected').length;
          let pending = userPrograms.filter(p => p?.status !== 'approved' && p?.status !== 'rejected').length;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            total,
            approved,
            rejected,
            pending,
          };
        }
      });

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('User Program Summary')}</h1>
            <p className="text-lg text-gray-600">{t('userProgramSummarySubtitle')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-600 p-6">
              <div className="flex items-center text-white">
                <Users className="h-8 w-8 mr-3" />
                <h2 className="text-2xl font-bold">{t('User Statistics')}</h2>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">{t('USER')}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">{t('EMAIL')}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">{t('TOTAL_PROGRAMS')}</th>
                    {currentUser.role === 'staff_pa' ? (
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">{t('QUERY')}</th>
                    ) : (
                      <>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">{t('APPROVED')}</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">{t('PENDING')}</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">{t('REJECTED')}</th>
                      </>
                    )}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">{t('ACTIONS')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userProgramStats.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          {user.total}
                        </span>
                      </td>
                      {currentUser.role === 'staff_pa' ? (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {user.queryCount}
                          </span>
                        </td>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {user.approved}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="h-4 w-4 mr-1" />
                              {user.pending}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              <XCircle className="h-4 w-4 mr-1" />
                              {user.rejected}
                            </span>
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                          onClick={() => setSelectedUserId(user.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t('View Portfolio')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mb-8">
          {isSummaryFlowActive && selectedUserId && (
            <button
              onClick={() => setSelectedUserId(null)}
              className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors duration-200 group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">{t('Back to User Program Summary')}</span>
            </button>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {isSummaryFlowActive && selectedUserId
                  ? `${t('programManagement')} - ${users.find(u => u.id === selectedUserId)?.name || ''}`
                  : t('programManagement')}
              </h1>
              <p className="text-lg text-gray-600">{t('manageAndTrackPrograms')}</p>
            </div>
            
            {currentUser.role === 'user' && (
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-300"
                >
                  <svg 
                    className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Program
                </button>
              </div>
            )}
            
            {(currentUser.role === 'admin' || currentUser.role === 'staff_exco') && (
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-300"
                >
                  <svg 
                    className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <FileText className="h-8 w-8 mr-3" />
                <h2 className="text-2xl font-bold">Programs Overview</h2>
              </div>
              <div className="flex items-center space-x-3">
                <label htmlFor="statusFilter" className="text-sm font-medium text-white mr-2">Filter by Status:</label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="rounded-lg px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="draft">Draft</option>
                  <option value="under_review_mmk">Under Review by MMK Office</option>
                  <option value="under_review_finance">Under Review by Finance Unit</option>
                  <option value="query">Query</option>
                  <option value="query_answered">Query Answered</option>
                  <option value="Completed">Document Checked</option>
                  <option value="approved_by_mmk_office">Approved by MMK Office</option>
                  <option value="approved">Payment Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          {/* FINANCE STAFF: SPLIT TABLES */}
          {currentUser.role === 'staff_finance' ? (
            <>
              {/* Main Table: not approved/approved_by_mmk_office */}
              <div className="overflow-x-auto">
                <DragScrollWrapper>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('ACTIONS')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('PROGRAM')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('BUDGET')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('RECIPIENT')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('EXCO Reference Number')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[110px]">{t('STATUS')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('DOCUMENTS')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('SIGNED_DOCUMENTS')}</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('OPERATIONS')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {financeMainPrograms.filter(program => program !== null).map((program) => (
                        <tr key={program.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleViewProgram(program)}
                              className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <div className="text-sm font-medium text-gray-900 truncate">{program.name}</div>
                              {program.created_at && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(program.created_at).toLocaleDateString('en-MY')}, {new Date(program.created_at).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">RM {program.budget?.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{program.recipient_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{program.exco_letter_reference_no || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap min-w-[110px]">
                            <div className={`text-sm font-semibold ${
                              program?.status === 'rejected' ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {getStatusLabel(program?.status)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedProgram(program);
                                setShowDocumentsModal(true);
                              }}
                              className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              {t('Open Documents')}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleShowSignedDocuments(program.id)}
                              className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              {t('Open Signed Documents')}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {(currentUser.role === 'admin' || (currentUser.role === 'user' && program?.created_by === currentUser.id && program?.status !== 'approved' && program?.status !== 'Completed' && program?.status !== 'rejected')) && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedProgram(program);
                                      setShowEditModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                    disabled={currentUser.role === 'user' && (program?.status === 'approved' || program?.status === 'Completed' || program?.status === 'rejected')}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedProgram(program);
                                      setShowDeleteModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                    disabled={currentUser.role === 'user' && (program?.status === 'approved' || program?.status === 'Completed' || program?.status === 'rejected')}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </button>
                                </>
                              )}
                              {program?.status === 'draft' && (currentUser.role === 'admin' || (currentUser.role === 'user' && program?.created_by === currentUser.id)) && (
                                <button
                                  onClick={() => {
                                    setProgramToFinanceSubmit(program);
                                    setShowFinanceSubmitModal(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Submit
                                </button>
                              )}
                              {program?.status === 'under_review' && currentUser.role !== 'staff_finance' && currentUser.role !== 'staff_pa' && (
                                <button
                                  disabled
                                  className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Submitted
                                </button>
                              )}
                              {currentUser.role === 'staff_pa' && program?.status === 'query' && (
                                <button
                                  onClick={() => {
                                    setSelectedProgram(program);
                                    setShowEditModal(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </button>
                              )}
                              {currentUser.role === 'staff_finance' && (
                                (program?.status === 'under_review_finance' || program?.status === 'under_review_mmk' || program?.status === 'query' || program?.status === 'query_answered') ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        setSelectedProgram(program);
                                        setShowUploadSignedDocumentsModal(true);
                                      }}
                                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                                    >
                                      <Upload className="h-4 w-4 mr-1" />
                                      Upload Signed Docs
                                    </button>
                                    {(program?.status === 'under_review_finance' || program?.status === 'under_review_mmk') && (
                                      <>
                                        <div className="flex flex-col space-y-2">
                                          <button
                                            onClick={() => {
                                              setSelectedProgram(program);
                                              setShowApproveModal(true);
                                            }}
                                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                          >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Complete
                                          </button>
                                          <button
                                            onClick={() => {
                                              setSelectedProgram(program);
                                              setShowRejectModal(true);
                                            }}
                                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                          >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                          </button>
                                        </div>
                                        <button
                                          onClick={async () => {
                                            setSelectedProgram(program);
                                            await fetchQueries(program.id);
                                            setQueryModalActiveTab('add');
                                            setShowQueryModal(true);
                                            setNewQueryText('');
                                          }}
                                          className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                                        >
                                          <MessageSquare className="h-4 w-4 mr-1" />
                                          Query
                                        </button>
                                      </>
                                    )}
                                    {program?.status === 'query' && (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-600">
                                        <MessageSquare className="h-4 w-4 mr-1" />
                                        Query Pending
                                      </span>
                                    )}
                                    {program?.status === 'query_answered' && (
                                      <>
                                        <button
                                          onClick={async () => {
                                            setSelectedProgram(program);
                                            await fetchQueries(program.id);
                                            setQueryModalActiveTab('add');
                                            setShowQueryModal(true);
                                            setNewQueryText('');
                                          }}
                                          className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                                        >
                                          <MessageSquare className="h-4 w-4 mr-1" />
                                          Query
                                        </button>
                                        <div className="flex flex-col space-y-2">
                                          <button
                                            onClick={() => {
                                              setSelectedProgram(program);
                                              setShowApproveModal(true);
                                            }}
                                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                          >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Complete
                                          </button>
                                          <button
                                            onClick={() => {
                                              setSelectedProgram(program);
                                              setShowRejectModal(true);
                                            }}
                                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                          >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  null
                                )
                              )}
                              {currentUser.role === 'staff_pa' && (
                                <button
                                  onClick={() => {
                                    setSelectedProgram(program);
                                    handleShowQueries(program.id);
                                  }}
                                  className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                                >
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  {t('View Queries')}
                                </button>
                              )}
                              {program?.status === 'Completed' && (
                                null
                              )}
                              {program?.status === 'Completed' && currentUser.role === 'user' && program?.created_by === currentUser.id && (
                                <button
                                  onClick={() => {
                                    setProgramToMMKSubmit(program);
                                    setShowMMKSubmitModal(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Submit
                                </button>
                              )}
                              {currentUser.role === 'staff_mmk' && program?.status === 'under_review_mmk' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedProgram(program);
                                      setShowApproveModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedProgram(program);
                                      setShowRejectModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {currentUser.role === 'user' && program.status === 'approved' && programPayments[program.id] ? (
                              <div>
                                <div><b>Voucher:</b> {programPayments[program.id].voucher_number}</div>
                                <div><b>EFT:</b> {programPayments[program.id].eft_number}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </DragScrollWrapper>
              </div>
              {/* Approved Table: only approved/approved_by_mmk_office */}
              <div className="bg-blue-100 p-4 mt-8 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-blue-800">
                    {t('Approved Programs')}
                    {currentUser.role === 'staff_finance' && (
                      <span className="ml-4 text-base font-medium text-blue-900">
                        | Programs Pending to be Approved: {approvedByMMKOfficeCount}
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => setShowApprovedPrograms(!showApprovedPrograms)}
                    className="flex items-center text-blue-700 hover:text-blue-900 transition-colors duration-200"
                  >
                    {showApprovedPrograms ? (
                      <>
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Hide
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Show
                      </>
                    )}
                  </button>
                </div>
                {showApprovedPrograms && (
                  <div className="overflow-x-auto">
                    <DragScrollWrapper>
                      <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('ACTIONS')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('PROGRAM')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('BUDGET')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('RECIPIENT')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('EXCO Reference Number')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[110px]">{t('STATUS')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('DOCUMENTS')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('SIGNED_DOCUMENTS')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('Voucher/EFT ')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {financeApprovedPrograms.filter(program => program !== null).map((program) => (
                          <tr key={program.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleViewProgram(program)}
                                className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs">
                                <div className="text-sm font-medium text-gray-900 truncate">{program.name}</div>
                                {program.created_at && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {new Date(program.created_at).toLocaleDateString('en-MY')}, {new Date(program.created_at).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">RM {program.budget?.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{program.recipient_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{program.exco_letter_reference_no || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap min-w-[110px]">
                              <div className={`text-sm font-semibold ${
                                program?.status === 'rejected' ? 'text-red-600' : 'text-gray-900'
                              }`}>
                                {getStatusLabel(program?.status)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setSelectedProgram(program);
                                  setShowDocumentsModal(true);
                                }}
                                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                {t('Open Documents')}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleShowSignedDocuments(program.id)}
                                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                {t('Open Signed Documents')}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {program.status === 'approved' && programPayments[program.id] ? (
                                <div>
                                  <div><b>Voucher:</b> {programPayments[program.id].voucher_number}</div>
                                  <div><b>EFT:</b> {programPayments[program.id].eft_number}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                {(currentUser.role === 'admin' || (currentUser.role === 'user' && program?.created_by === currentUser.id)) && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setSelectedProgram(program);
                                        setShowEditModal(true);
                                      }}
                                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                    >
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedProgram(program);
                                        setShowDeleteModal(true);
                                      }}
                                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Delete
                                    </button>
                                  </>
                                )}
                                {program?.status === 'draft' && (currentUser.role === 'admin' || (currentUser.role === 'user' && program?.created_by === currentUser.id)) && (
                                  <button
                                    onClick={() => {
                                      setProgramToFinanceSubmit(program);
                                      setShowFinanceSubmitModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Submit
                                  </button>
                                )}
                                {program?.status === 'under_review' && currentUser.role !== 'staff_finance' && currentUser.role !== 'staff_pa' && (
                                  <button
                                    disabled
                                    className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Submitted
                                  </button>
                                )}
                                {currentUser.role === 'staff_pa' && program?.status === 'query' && (
                                  <button
                                    onClick={() => {
                                      setSelectedProgram(program);
                                      setShowEditModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </button>
                                )}
                                {currentUser.role === 'staff_finance' && (
                                  (program?.status === 'under_review_finance' || program?.status === 'under_review_mmk' || program?.status === 'query' || program?.status === 'query_answered') ? (
                                    <>
                                      <button
                                        onClick={() => {
                                          setSelectedProgram(program);
                                          setShowUploadSignedDocumentsModal(true);
                                        }}
                                        className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                                      >
                                        <Upload className="h-4 w-4 mr-1" />
                                        Upload Signed Docs
                                      </button>
                                      {(program?.status === 'under_review_finance' || program?.status === 'under_review_mmk') && (
                                        <>
                                          <div className="flex flex-col space-y-2">
                                            <button
                                              onClick={() => {
                                                setSelectedProgram(program);
                                                setShowApproveModal(true);
                                              }}
                                              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                            >
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Complete
                                            </button>
                                            <button
                                              onClick={() => {
                                                setSelectedProgram(program);
                                                setShowRejectModal(true);
                                              }}
                                              className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                            >
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Reject
                                            </button>
                                          </div>
                                          <button
                                            onClick={async () => {
                                              setSelectedProgram(program);
                                              await fetchQueries(program.id);
                                              setQueryModalActiveTab('add');
                                              setShowQueryModal(true);
                                              setNewQueryText('');
                                            }}
                                            className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                                          >
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            Query
                                          </button>
                                        </>
                                      )}
                                      {program?.status === 'query' && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-600">
                                          <MessageSquare className="h-4 w-4 mr-1" />
                                          Query Pending
                                        </span>
                                      )}
                                      {program?.status === 'query_answered' && (
                                        <>
                                          <button
                                            onClick={async () => {
                                              setSelectedProgram(program);
                                              await fetchQueries(program.id);
                                              setQueryModalActiveTab('add');
                                              setShowQueryModal(true);
                                              setNewQueryText('');
                                            }}
                                            className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                                          >
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            Query
                                          </button>
                                          <div className="flex flex-col space-y-2">
                                            <button
                                              onClick={() => {
                                                setSelectedProgram(program);
                                                setShowApproveModal(true);
                                              }}
                                              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                            >
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Complete
                                            </button>
                                            <button
                                              onClick={() => {
                                                setSelectedProgram(program);
                                                setShowRejectModal(true);
                                              }}
                                              className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                            >
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Reject
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    null
                                  )
                                )}
                                {currentUser.role === 'staff_pa' && (
                                  <button
                                    onClick={() => {
                                      setSelectedProgram(program);
                                      handleShowQueries(program.id);
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    {t('View Queries')}
                                  </button>
                                )}
                                {program?.status === 'Completed' && (
                                  null
                                )}
                                {program?.status === 'Completed' && currentUser.role === 'user' && program?.created_by === currentUser.id && (
                                  <button
                                    onClick={() => {
                                      setProgramToMMKSubmit(program);
                                      setShowMMKSubmitModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Submit
                                  </button>
                                )}
                                {currentUser.role === 'staff_mmk' && program?.status === 'under_review_mmk' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setSelectedProgram(program);
                                        setShowApproveModal(true);
                                      }}
                                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedProgram(program);
                                        setShowRejectModal(true);
                                      }}
                                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </button>
                                  </>
                                )}
                                {currentUser.role === 'staff_finance' && program.status === 'approved_by_mmk_office' && (
                                  <button
                                    onClick={() => {
                                      setSelectedProgram(program);
                                      setShowFinalApproveModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </DragScrollWrapper>
                </div>
                )}
              </div>
              
              {/* Rejected Table: only rejected programs */}
              <div className="bg-red-100 p-4 mt-8 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-red-800">{t('Rejected Programs')}</h3>
                  <button
                    onClick={() => setShowRejectedPrograms(!showRejectedPrograms)}
                    className="flex items-center text-red-700 hover:text-red-900 transition-colors duration-200"
                  >
                    {showRejectedPrograms ? (
                      <>
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Hide
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Show
                      </>
                    )}
                  </button>
                </div>
                {showRejectedPrograms && (
                  <div className="overflow-x-auto">
                    <DragScrollWrapper>
                      <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('ACTIONS')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('PROGRAM')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('BUDGET')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('RECIPIENT')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('EXCO Reference Number')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[110px]">{t('STATUS')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('DOCUMENTS')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('SIGNED_DOCUMENTS')}</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('OPERATIONS')}</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {financeRejectedPrograms.filter(program => program !== null).map((program) => (
                          <tr key={program.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleViewProgram(program)}
                                className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs">
                                <div className="text-sm font-medium text-gray-900 truncate">{program.name}</div>
                                {program.created_at && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {new Date(program.created_at).toLocaleDateString('en-MY')}, {new Date(program.created_at).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">RM {program.budget?.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{program.recipient_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{program.exco_letter_reference_no || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap min-w-[110px]">
                              <div className="text-sm font-semibold text-red-600">
                                {getStatusLabel(program?.status)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setSelectedProgram(program);
                                  setShowDocumentsModal(true);
                                }}
                                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                {t('Open Documents')}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleShowSignedDocuments(program.id)}
                                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                {t('Open Signed Documents')}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                {(currentUser.role === 'admin' || (currentUser.role === 'user' && program?.created_by === currentUser.id)) && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setSelectedProgram(program);
                                        setShowEditModal(true);
                                      }}
                                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                    >
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedProgram(program);
                                        setShowDeleteModal(true);
                                      }}
                                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </DragScrollWrapper>
                </div>
                )}
              </div>
            </>
          ) : (
            // Default: show the original table for all other roles
            <div className="overflow-x-auto">
              <DragScrollWrapper>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('ACTIONS')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('PROGRAM')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('BUDGET')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('RECIPIENT')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('EXCO Reference Number')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[110px]">{t('STATUS')}</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('DOCUMENTS')}</th>
                                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('SIGNED_DOCUMENTS')}</th>
                        {(currentUser.role === 'admin' || currentUser.role === 'user') && (
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Voucher/EFT</th>
                        )}
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('OPERATIONS')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPrograms.filter(program => program !== null).map((program) => (
                      <tr key={program.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewProgram(program)}
                            className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm font-medium text-gray-900 truncate">{program.name}</div>
                            {program.created_at && (
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(program.created_at).toLocaleDateString('en-MY')}, {new Date(program.created_at).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true })}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">RM {program.budget?.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{program.recipient_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{program.exco_letter_reference_no || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap min-w-[110px]">
                          <div className={`text-sm font-semibold ${
                            program?.status === 'rejected' ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {getStatusLabel(program?.status)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedProgram(program);
                              setShowDocumentsModal(true);
                            }}
                            className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {t('Open Documents')}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleShowSignedDocuments(program.id)}
                            className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {t('Open Signed Documents')}
                          </button>
                        </td>
                        {(currentUser.role === 'admin' || currentUser.role === 'user') && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            {program.status === 'approved' && programPayments[program.id] ? (
                              <div>
                                <div><b>Voucher:</b> {programPayments[program.id].voucher_number}</div>
                                <div><b>EFT:</b> {programPayments[program.id].eft_number}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {(currentUser.role === 'admin' || (currentUser.role === 'user' && program?.created_by === currentUser.id && program?.status !== 'approved' && program?.status !== 'Completed' && program?.status !== 'rejected')) && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedProgram(program);
                                    setShowEditModal(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                  disabled={currentUser.role === 'user' && (program?.status === 'approved' || program?.status === 'Completed' || program?.status === 'rejected')}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedProgram(program);
                                    setShowDeleteModal(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                  disabled={currentUser.role === 'user' && (program?.status === 'rejected' || program?.status === 'approved' || program?.status === 'Completed')}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </button>
                              </>
                            )}
                            {program?.status === 'draft' && (currentUser.role === 'admin' || (currentUser.role === 'user' && program?.created_by === currentUser.id)) && (
                              <button
                                onClick={() => {
                                  setProgramToFinanceSubmit(program);
                                  setShowFinanceSubmitModal(true);
                                }}
                                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Submit
                              </button>
                            )}
                            {program?.status === 'under_review' && currentUser.role !== 'staff_finance' && currentUser.role !== 'staff_pa' && (
                              <button
                                disabled
                                className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Submitted
                              </button>
                            )}
                            {currentUser.role === 'staff_pa' && program?.status === 'query' && (
                              <button
                                onClick={() => {
                                  setSelectedProgram(program);
                                  setShowEditModal(true);
                                }}
                                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                            )}
                            {currentUser.role === 'staff_finance' && (
                              (program?.status === 'under_review_finance' || program?.status === 'under_review_mmk' || program?.status === 'query' || program?.status === 'query_answered') ? (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedProgram(program);
                                      setShowUploadSignedDocumentsModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload Signed Docs
                                  </button>
                                  {(program?.status === 'under_review_finance' || program?.status === 'under_review_mmk') && (
                                    <>
                                      <div className="flex flex-col space-y-2">
                                        <button
                                          onClick={() => {
                                            setSelectedProgram(program);
                                            setShowApproveModal(true);
                                          }}
                                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Complete
                                        </button>
                                        <button
                                          onClick={() => {
                                            setSelectedProgram(program);
                                            setShowRejectModal(true);
                                          }}
                                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Reject
                                        </button>
                                      </div>
                                      <button
                                        onClick={async () => {
                                          setSelectedProgram(program);
                                          await fetchQueries(program.id);
                                          setQueryModalActiveTab('add');
                                          setShowQueryModal(true);
                                          setNewQueryText('');
                                        }}
                                        className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                                      >
                                        <MessageSquare className="h-4 w-4 mr-1" />
                                        Query
                                      </button>
                                    </>
                                  )}
                                  {program?.status === 'query' && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-600">
                                      <MessageSquare className="h-4 w-4 mr-1" />
                                      Query Pending
                                    </span>
                                  )}
                                  {program?.status === 'query_answered' && (
                                    <>
                                      <button
                                        onClick={async () => {
                                          setSelectedProgram(program);
                                          await fetchQueries(program.id);
                                          setQueryModalActiveTab('add');
                                          setShowQueryModal(true);
                                          setNewQueryText('');
                                        }}
                                        className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                                      >
                                        <MessageSquare className="h-4 w-4 mr-1" />
                                        Query
                                      </button>
                                      <div className="flex flex-col space-y-2">
                                        <button
                                          onClick={() => {
                                            setSelectedProgram(program);
                                            setShowApproveModal(true);
                                          }}
                                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Complete
                                        </button>
                                        <button
                                          onClick={() => {
                                            setSelectedProgram(program);
                                            setShowRejectModal(true);
                                          }}
                                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Reject
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </>
                              ) : (
                                null
                              )
                            )}
                            {currentUser.role === 'staff_pa' && (
                              <button
                                onClick={() => {
                                  setSelectedProgram(program);
                                  handleShowQueries(program.id);
                                }}
                                className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {t('View Queries')}
                              </button>
                            )}
                            {program?.status === 'Completed' && (
                              null
                            )}
                            {program?.status === 'Completed' && currentUser.role === 'user' && program?.created_by === currentUser.id && (
                              <button
                                onClick={() => {
                                  setProgramToMMKSubmit(program);
                                  setShowMMKSubmitModal(true);
                                }}
                                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Submit
                              </button>
                            )}
                            {currentUser.role === 'staff_mmk' && program?.status === 'under_review_mmk' && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedProgram(program);
                                    setShowApproveModal(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedProgram(program);
                                    setShowRejectModal(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DragScrollWrapper>
            </div>
          )}
        </div>
      </div>

      {/* View Program Modal */}
      {showViewModal && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-blue-600 p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">{t('Program Details')}</h3>
              <button
                onClick={() => setShowViewModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
              >
                  <XCircle className="h-6 w-6" />
              </button>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText className="h-4 w-4 inline mr-2" />
                  {t('Details')}
                </button>
                <button
                  onClick={() => setActiveTab('remarks')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'remarks'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  {t('Remarks')}
                </button>
              </nav>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {activeTab === 'details' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2">{t('NAME')}</h4>
                      <p className="text-gray-900">{selectedProgram.name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2">{t('BUDGET')}</h4>
                      <p className="text-gray-900">RM {selectedProgram.budget?.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2">{t('RECIPIENT NAME')}</h4>
                      <p className="text-gray-900">{selectedProgram.recipient_name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2">{t('EXCO Reference Number')}</h4>
                      <p className="text-gray-900">{selectedProgram.exco_letter_reference_no || '-'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2">{t('STATUS')}</h4>
                      <span className={getStatusBadge(selectedProgram?.status)}>
                        {selectedProgram?.status === 'draft' && 'Draft'}
                        {selectedProgram?.status === 'under_review' && 'Under Review'}
                        {selectedProgram?.status === 'query' && 'Query'}
                        {selectedProgram?.status === 'query_answered' && 'Query Answered'}
                        {selectedProgram?.status === 'Completed' && 'Completed'}
                        {selectedProgram?.status === 'approved' && 'Approved'}
                        {selectedProgram?.status === 'rejected' && 'Rejected'}
                        {selectedProgram?.status === 'under_review_mmk' && 'Under Review by MMK Office'}
                        {selectedProgram?.status === 'under_review_finance' && 'Under Review by Finance Unit'}
                        {selectedProgram?.status === 'approved_by_mmk_office' && 'Approved by MMK Office'}
                        {!selectedProgram?.status && 'No Status'}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2">{t('CREATED AT')}</h4>
                      <p className="text-gray-900">
                        {selectedProgram.created_at ? (
                          <>
                            <div className="font-medium">
                              {new Date(selectedProgram.created_at).toLocaleDateString('en-MY')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(selectedProgram.created_at).toLocaleTimeString('en-MY', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </>
                        ) : (
                          <span className="text-red-500 text-sm">No date available</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      {t('Documents')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { key: 'centralServiceLetter', label: t('documents.centralServiceLetter'), path: selectedProgram.central_service_letter_path, uploadedAt: selectedProgram.central_service_letter_uploaded_at },
                        { key: 'pknsApprovalLetter', label: t('documents.pknsApprovalLetter'), path: selectedProgram.pkns_approval_letter_path, uploadedAt: selectedProgram.pkns_approval_letter_uploaded_at },
                        { key: 'programLetter', label: t('documents.programLetter'), path: selectedProgram.program_letter_path, uploadedAt: selectedProgram.program_letter_uploaded_at },
                        { key: 'excoLetter', label: t('documents.excoLetter'), path: selectedProgram.exco_letter_path, uploadedAt: selectedProgram.exco_letter_uploaded_at },
                        { key: 'bankAccountManager', label: t('documents.bankAccountManager'), path: selectedProgram.bank_account_manager_path, uploadedAt: selectedProgram.bank_account_manager_uploaded_at },
                        { key: 'cordRegistrationForm', label: t('documents.cordRegistrationForm'), path: selectedProgram.cord_registration_form_path, uploadedAt: selectedProgram.cord_registration_form_uploaded_at }
                      ].map((doc, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                          <h5 className="font-medium text-gray-700 mb-2">{doc.label}</h5>
                          <div className="flex items-start justify-between">
                            <div>
                              {doc.path && (
                                <a
                                  href={`http://localhost:5000/api/programs/${selectedProgram.id}/document/${doc.key}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {t('View Document')}
                                </a>
                              )}
                              {doc.uploadedAt && (
                                <div className="text-xs text-gray-500 mt-2">
                                  {t('Uploaded at')}: {new Date(doc.uploadedAt).toLocaleString()}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleShowHistory(selectedProgram.id, doc.key)}
                              className="ml-2 inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-xs"
                            >
                              <History className="h-3 w-3 mr-1" />
                              History
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Show voucher/EFT for regular user, admin, and staff_finance if approved */}
                  {(currentUser.role === 'user' || currentUser.role === 'admin' || currentUser.role === 'staff_finance') && selectedProgram.status === 'approved' && paymentInfo && (
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-green-700 mb-2">Payment Information</h4>
                      <div className="text-gray-900"><b>Voucher Number:</b> {paymentInfo.voucher_number}</div>
                      <div className="text-gray-900"><b>EFT Number:</b> {paymentInfo.eft_number}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <form onSubmit={handleAddRemark} className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4">{t('Add Remark')}</h4>
                    <textarea
                      value={newRemark}
                      onChange={(e) => setNewRemark(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                      rows="3"
                      placeholder={t('Write Your Remark Here')}
                      required
                    />
                    <button
                      type="submit"
                      className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!newRemark.trim() || isAddingRemark}
                    >
                      {isAddingRemark ? `Adding Remark... (${remarkCountdown}s)` : 'Add Remark'}
                    </button>
                  </form>

                  <div className="space-y-4">
                    {remarks.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">{t('No Remarks')}</p>
                      </div>
                    ) : (
                      remarks.map((remark) => (
                        <div key={remark.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                          <div className="flex items-start space-x-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {remark.user_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800 mb-2">{remark.remark}</p>
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="font-medium">{remark.user_name}</span>
                                <span className="mx-2">•</span>
                                <span className="italic">{t(remark.user_role)}</span>
                                <span className="mx-2">•</span>
                                <span>{new Date(remark.created_at).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
           <div className="bg-blue-600 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">{t('addNewProgram')}</h3>
              </div>
            </div>
            
            <form onSubmit={handleAddProgram} encType="multipart/form-data" className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('name')}</label>
                <input
                  type="text"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  required
                />
              </div>
              <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('budget')}</label>
                <input
                  type="number"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={newProgram.budget}
                  onChange={(e) => setNewProgram({ ...newProgram, budget: e.target.value })}
                  required
                  min="0"
                />
              </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('recipientName')}</label>
                <input
                  type="text"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={newProgram.recipientName}
                  onChange={(e) => setNewProgram({ ...newProgram, recipientName: e.target.value })}
                  required
                />
              </div>

                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('EXCO Reference Number')}</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={newProgram.excoLetterReferenceNo}
                  onChange={(e) => setNewProgram({ ...newProgram, excoLetterReferenceNo: e.target.value })}
                  placeholder="Enter EXCO Reference Number"
                />
              </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    {t('documents')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'centralServiceLetter', label: t('documents.centralServiceLetter') },
                      { key: 'pknsApprovalLetter', label: t('documents.pknsApprovalLetter') },
                      { key: 'programLetter', label: t('documents.programLetter') },
                      { key: 'excoLetter', label: t('documents.excoLetter') },
                      { key: 'bankAccountManager', label: t('documents.bankAccountManager') },
                      { key: 'cordRegistrationForm', label: t('documents.cordRegistrationForm') }
                    ].map((doc) => (
                      <div key={doc.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{doc.label}</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                          onChange={e => setNewProgram({ ...newProgram, [doc.key]: e.target.files[0] })}
                    />
                  </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  {t('addProgram')}
                </button>
              </div>
            </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Program Modal */}
      {showEditModal && selectedProgram && (
        <EditProgramModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          program={selectedProgram}
          onSave={handleSaveEditedProgram}
          currentUser={currentUser}
          t={t}
          setError={setError}
          setSuccess={setSuccess}
          fetchPrograms={fetchPrograms}
          setShowEditModal={setShowEditModal}
        />
      )}

      {/* Documents Modal */}
      {showDocumentsModal && selectedProgram && (
        <DocumentsModal
            show={showDocumentsModal}
            onClose={() => setShowDocumentsModal(false)}
            program={selectedProgram}
            t={t}
            handleShowHistory={handleShowHistory}
            currentUser={currentUser}
        />
      )}

      {/* Document History Modal */}
      <DocumentHistoryModal
        show={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        documentHistory={documentHistory}
        onDownload={handleDownloadHistory}
        t={t}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        title={t('confirmDelete')}
        message={t('deleteConfirmation', { name: selectedProgram?.name })}
        onConfirm={handleDeleteProgram}
        onCancel={() => setShowDeleteModal(false)}
        confirmText={t('delete')}
        cancelText={t('cancel')}
      />

      {/* Signed Documents Modal */}
      {showSignedDocumentsModal && selectedProgram && (
        <SignedDocumentsModal
          show={showSignedDocumentsModal}
          onClose={() => {
            setShowSignedDocumentsModal(false);
            setSelectedProgram(null);
            setSignedDocuments(null);
          }}
          signedDocuments={signedDocuments}
          program={selectedProgram}
          t={t}
        />
      )}

      {/* Upload Signed Documents Modal */}
      {showUploadSignedDocumentsModal && selectedProgram && (
        <UploadSignedDocumentsModal
          show={showUploadSignedDocumentsModal}
          onClose={() => setShowUploadSignedDocumentsModal(false)}
          program={selectedProgram}
          t={t}
          onUpload={handleUploadSignedDocuments}
          signedDocumentFiles={signedDocumentFiles}
          onFileChange={handleSignedDocumentFileChange}
          isUploading={isUploadingSignedDocuments}
        />
      )}

      {/* Add Query Modal */}
      {showAddQueryModal && (
        <Modal
          show={showAddQueryModal}
          title={t('Add Query')}
          message={
            <form onSubmit={handleAddQuery}>
              <textarea
                value={newQueryText}
                onChange={e => setNewQueryText(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder={t('Enter your query')}
                required
              />
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" disabled={isAddingQuery}>
                {isAddingQuery ? t('Adding...') : t('Add Query')}
              </button>
            </form>
          }
          onCancel={() => setShowAddQueryModal(false)}
          cancelText={t('Close')}
          onConfirm={null}
        />
      )}

      {/* Queries Modal */}
      {showQueriesModal && (
        <Modal
          show={showQueriesModal}
          title={t('Queries')}
          message={
            <div>
              {queries.length === 0 ? (
                <div>{t('No queries yet.')}</div>
              ) : (
                queries.map(query => (
                  <div key={query.id} className="mb-4 p-2 border rounded">
                    <div><b>{t('Query')}:</b> {query.query_text}</div>
                    <div><b>{t('By')}:</b> {query.created_by_name} ({query.created_by_role})</div>
                    <div><b>{t('Status')}:</b> {query.status}</div>
                    {query.answer_text && (
                      <div className="mt-2">
                        <b>{t('Answer')}:</b> {query.answer_text}
                        <br />
                        <b>{t('By')}:</b> {query.answered_by_name} ({query.answered_by_role})
                      </div>
                    )}
                    {currentUser.role === 'staff_pa' && query.status === 'pending' && (
                      <button
                        className="btn btn-success mt-2 px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => {
                          setSelectedQuery(query);
                          setShowAnswerQueryModal(true);
                        }}
                      >
                        {t('Answer')}
                      </button>
                    )}
                    {currentUser.role === 'staff_finance' && query.status === 'answered' && (
                      <button
                        className="btn btn-warning mt-2 px-3 py-1 bg-yellow-500 text-white rounded"
                        onClick={() => handleResolveQuery(query.id)}
                      >
                        {t('Mark as Resolved')}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          }
          onCancel={() => setShowQueriesModal(false)}
          cancelText={t('Close')}
          onConfirm={null}
        />
      )}

      {/* Answer Query Modal */}
      {showAnswerQueryModal && selectedQuery && (
        <Modal
          show={showAnswerQueryModal}
          title={t('Answer Query')}
          message={
            <form onSubmit={handleAnswerQuery}>
              <textarea
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder={t('Enter your answer')}
                required
              />
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" disabled={isAnsweringQuery}>
                {isAnsweringQuery ? t('Answering...') : t('Submit Answer')}
              </button>
            </form>
          }
          onCancel={() => setShowAnswerQueryModal(false)}
          cancelText={t('Close')}
          onConfirm={null}
        />
      )}

      {/* Reject Program Confirmation Modal */}
      <Modal
        show={showRejectModal}
        title={t('Confirm Rejection')}
        message={`Are you sure you want to reject the program "${selectedProgram?.name}"? This action cannot be undone.`}
        onConfirm={handleRejectProgram}
        onCancel={() => {
          setShowRejectModal(false);
          setSelectedProgram(null);
        }}
        confirmText={isRejecting ? 'Rejecting...' : 'Reject Program'}
        cancelText={t('Cancel')}
      />

      {/* Approve Program Confirmation Modal */}
      <Modal
        show={showApproveModal}
        title={currentUser.role === 'staff_mmk' ? 'Confirm Approval by MMK Office' : t('Confirm Completion')}
        message={currentUser.role === 'staff_mmk'
          ? `Are you sure you want to approve the program "${selectedProgram?.name}" as MMK office? This action cannot be undone.`
          : `Are you sure you want to mark the program "${selectedProgram?.name}" as completed in checking documents? This action cannot be undone.`}
        onConfirm={currentUser.role === 'staff_mmk' ? handleApproveProgramMMK : handleApproveProgram}
        onCancel={() => {
          setShowApproveModal(false);
          setSelectedProgram(null);
        }}
        confirmText={isApproving ? (currentUser.role === 'staff_mmk' ? 'Approving...' : 'Completing...') : (currentUser.role === 'staff_mmk' ? 'Approve Program' : 'Complete Program')}
        cancelText={t('Cancel')}
      />

      {/* Combined Query Modal */}
      {showQueryModal && selectedProgram && (
        <QueryModal
          show={showQueryModal}
          onClose={() => {
            setShowQueryModal(false);
            setSelectedProgram(null);
            setNewQueryText('');
            setQueries([]);
          }}
          program={selectedProgram}
          t={t}
          onAddQuery={handleAddQuery}
          queries={queries}
          newQueryText={newQueryText}
          setNewQueryText={setNewQueryText}
          isAddingQuery={isAddingQuery}
          activeTab={queryModalActiveTab}
          setActiveTab={setQueryModalActiveTab}
          onTabChange={() => fetchQueries(selectedProgram.id)}
        />
      )}

      {/* MMK Submission Modal */}
      <Modal
        show={showMMKSubmitModal}
        title="Submit to MMK Office"
        message="Are you sure you want to submit documents to MMK office?"
        onConfirm={async () => {
          if (programToMMKSubmit) {
            // Update the status locally
            setPrograms(prev => prev.map(p => p.id === programToMMKSubmit.id ? { ...p, status: 'under_review_mmk' } : p));
            setShowMMKSubmitModal(false);
            setProgramToMMKSubmit(null);
            // Optionally, send to backend if needed
            await fetch(`http://localhost:5000/api/programs/${programToMMKSubmit.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ status: 'under_review_mmk' })
            });
          }
        }}
        onCancel={() => {
          setShowMMKSubmitModal(false);
          setProgramToMMKSubmit(null);
        }}
        confirmText="Submit"
        cancelText="Cancel"
      />

      {/* Finance Submission Modal */}
      <Modal
        show={showFinanceSubmitModal}
        title="Submit to Finance"
        message="Are you sure you want to submit documents to finance?"
        onConfirm={async () => {
          if (programToFinanceSubmit) {
            await handleSubmitForApproval(programToFinanceSubmit);
            setShowFinanceSubmitModal(false);
            setProgramToFinanceSubmit(null);
          }
        }}
        onCancel={() => {
          setShowFinanceSubmitModal(false);
          setProgramToFinanceSubmit(null);
        }}
        confirmText="Submit"
        cancelText="Cancel"
      />

      {/* Final Approve Modal */}
      {showFinalApproveModal && selectedProgram && (
        <Modal
          show={showFinalApproveModal}
          title="Final Approval"
          message={
            <form onSubmit={e => { e.preventDefault(); handleFinalApprove(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Number</label>
                <input
                  type="text"
                  value={finalApproveVoucher}
                  onChange={e => setFinalApproveVoucher(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">EFT Number</label>
                <input
                  type="text"
                  value={finalApproveEFT}
                  onChange={e => setFinalApproveEFT(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={isFinalApproving}>
                {isFinalApproving ? 'Approving...' : 'Approve'}
              </button>
            </form>
          }
          onCancel={() => setShowFinalApproveModal(false)}
          cancelText="Cancel"
          onConfirm={null}
        />
      )}
    </div>
  );
}

export default ProgramManagement; 