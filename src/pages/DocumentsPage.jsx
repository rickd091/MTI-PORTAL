// src/pages/DocumentsPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FileText, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye
} from 'lucide-react';
import { 
  fetchDocuments, 
  verifyDocument,
  updateDocumentStatus 
} from '../store/slices/documentsSlice';
import DocumentVerification from '../components/documents/DocumentVerification';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const DocumentsPage = () => {
  const dispatch = useDispatch();
  const { 
    documents, 
    status, 
    error,
    verificationChecklist 
  } = useSelector((state) => state.documents);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [checklistItems, setChecklistItems] = useState({});

  useEffect(() => {
    dispatch(fetchDocuments({}));
  }, [dispatch]);

  const handleVerification = async (documentId, status) => {
    try {
      await dispatch(verifyDocument({ 
        documentId, 
        verificationData: {
          status,
          notes: verificationNotes,
          checklistItems
        }
      })).unwrap();
      setShowVerificationModal(false);
      setSelectedDocument(null);
      setVerificationNotes('');
      setChecklistItems({});
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const handleVerifyDocument = (document) => {
    setSelectedDocument(document);
    setShowVerificationModal(true);
  };

  const handleChecklistItem = (itemId, checked) => {
    setChecklistItems(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const filteredDocuments = documents.all?.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const VerificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h3 className="text-xl font-bold mb-4">Document Verification</h3>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">{selectedDocument?.title}</h4>
          <p className="text-sm text-gray-600">{selectedDocument?.description}</p>
        </div>

        <div className="space-y-4">
          {verificationChecklist[selectedDocument?.type]?.map(item => (
            <div key={item.id} className="flex items-start gap-2">
              <input
                type="checkbox"
                id={item.id}
                className="mt-1"
                checked={checklistItems[item.id] || false}
                onChange={(e) => handleChecklistItem(item.id, e.target.checked)}
              />
              <label htmlFor={item.id} className="text-sm">
                {item.label}
                {item.required && <span className="text-red-500">*</span>}
              </label>
            </div>
          ))}
          
          <textarea
            className="w-full border rounded-md p-2 mt-4"
            placeholder="Add verification notes..."
            rows={4}
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setShowVerificationModal(false);
              setVerificationNotes('');
              setChecklistItems({});
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleVerification(selectedDocument.id, 'rejected')}
          >
            Reject
          </Button>
          <Button
            onClick={() => handleVerification(selectedDocument.id, 'verified')}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDocumentSection = (title, docs, status) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === 'pending' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
          {status === 'verified' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {status === 'rejected' && <XCircle className="w-5 h-5 text-red-500" />}
          {title}
          <span className="ml-2 text-sm text-gray-500">({docs?.length || 0})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {docs?.map(doc => (
            <div 
              key={doc.id} 
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{doc.title}</h4>
                  <p className="text-sm text-gray-500">{doc.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                      doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(doc.url, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(doc.downloadUrl, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  {doc.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleVerifyDocument(doc)}
                    >
                      Verify
                    </Button>
                  )}
                </div>
              </div>

              {doc.verificationNotes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">{doc.verificationNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-gray-600">Verify and manage submitted documents</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="pl-10 w-full rounded-md border border-gray-300 p-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="border rounded-md p-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Document Sections */}
      {renderDocumentSection('Pending Verification', documents.pending, 'pending')}
      {renderDocumentSection('Verified Documents', documents.verified, 'verified')}
      {renderDocumentSection('Rejected Documents', documents.rejected, 'rejected')}

      {/* Verification Modal */}
      {showVerificationModal && selectedDocument && <VerificationModal />}
    </div>
  );
};

export default DocumentsPage;