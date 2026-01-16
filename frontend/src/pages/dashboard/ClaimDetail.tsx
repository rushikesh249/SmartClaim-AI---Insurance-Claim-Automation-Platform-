import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, FileText, Calendar, DollarSign, Shield, AlertTriangle, CheckCircle, XCircle, Upload, Download, Send } from "lucide-react";
import { claimApi } from "@/api/claim";
import { policyApi } from "@/api/policy";
import { documentApi } from "@/api/document";
import { timelineApi } from "@/api/timeline";
import { workflowApi } from "@/api/workflow";
import type { ClaimResponse } from "@/types/claim";
import type { PolicyResponse } from "@/types/policy";
import type { DocumentResponse } from "@/types/document";
import type { TimelineEventResponse } from "@/types/timeline";

export function ClaimDetail() {
  const { claimId } = useParams<{ claimId: string }>();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<ClaimResponse | null>(null);
  const [policy, setPolicy] = useState<PolicyResponse | null>(null);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [timeline, setTimeline] = useState<TimelineEventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!claimId) return;
      
      try {
        const claimData = await claimApi.getClaim(claimId);
        setClaim(claimData);
        
        // Also fetch the associated policy
        const policyData = await policyApi.getPolicy(claimData.policy_id);
        setPolicy(policyData);
      } catch (error) {
        console.error('Error fetching claim details:', error);
        toast.error('Failed to load claim details');
        navigate('/app/claims');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [claimId, navigate]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (!claimId) return;
      
      try {
        // Fetch documents
        const documentsData = await documentApi.listDocuments(claimId);
        setDocuments(documentsData);
        
        // Fetch timeline
        const timelineData = await timelineApi.getTimeline(claimId);
        setTimeline(timelineData);
      } catch (error) {
        console.error('Error fetching additional data:', error);
        toast.error('Failed to load documents and timeline');
      } finally {
        setDocumentsLoading(false);
        setTimelineLoading(false);
      }
    };

    fetchAdditionalData();
  }, [claimId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    if (!claimId) return;
    
    try {
      setUploading(true);
      const newDocument = await documentApi.uploadDocument(claimId, file, documentType);
      setDocuments(prev => [...prev, newDocument]);
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Prompt for document type
      const documentType = prompt('Enter document type (e.g., Medical Report, Police Report, etc.):', 'Medical Report');
      if (documentType) {
        handleFileUpload(file, documentType);
      }
    }
    // Reset the input so the same file can be selected again
    if (e.target.value) {
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Prompt for document type
      const documentType = prompt('Enter document type (e.g., Medical Report, Police Report, etc.):', 'Medical Report');
      if (documentType) {
        handleFileUpload(file, documentType);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDownloadPdf = async () => {
    if (!claimId) return;
    
    try {
      const pdfBlob = await workflowApi.getSummaryPdf(claimId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `claim-${claimId}-summary.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const handleSubmitClaim = async () => {
    if (!claimId) return;
    
    try {
      await workflowApi.submitClaim(claimId);
      toast.success('Claim submitted successfully');
      // Refresh claim data
      const claimData = await claimApi.getClaim(claimId);
      setClaim(claimData);
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error('Failed to submit claim');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getDocumentIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word') || mimeType.includes('msword')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    return '📁';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Claim Details" 
          description="View detailed information about the claim"
        >
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </PageHeader>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Claim Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Policy Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Claim Not Found" 
          description="The requested claim could not be found"
        >
          <Button onClick={() => navigate('/app/claims')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Claims
          </Button>
        </PageHeader>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Claim #${claim.claim_number}`} 
        description="Detailed information about the claim"
      >
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </PageHeader>
      
      {/* TOP: Claim Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Claim Summary</CardTitle>
              <CardDescription>
                Overview of claim information and status
              </CardDescription>
            </div>
            <Badge className={`capitalize ${getStatusBadgeVariant(claim.status)}`}>
              {claim.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Claim Number</p>
              <p className="font-medium">{claim.claim_number}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Claim Type</p>
              <p className="font-medium capitalize">{claim.claim_type}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Claimed Amount</p>
              <p className="font-medium">${claim.claimed_amount.toLocaleString()}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Policy</p>
              <p className="font-medium">{policy?.policy_number || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Decision Banner */}
      {claim.decision_type && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">
                  {claim.decision_type === 'auto_approved' ? 'Auto-Approved' : 
                   claim.decision_type === 'auto_rejected' ? 'Auto-Rejected' : 
                   'Manual Review Required'}
                </p>
                <p className="text-sm text-blue-700">
                  {claim.decision_type === 'auto_approved' ? 'Claim automatically approved based on risk assessment' :
                   claim.decision_type === 'auto_rejected' ? 'Claim automatically rejected due to high risk' :
                   'Claim requires manual review by an agent'}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {claim.decision_type.replace('_', ' ').toUpperCase()}
            </Badge>
          </CardContent>
        </Card>
      )}
      
      {/* MIDDLE SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Documents Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Upload UI */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors mb-4"
                onClick={triggerFileInput}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 font-medium">Upload Documents</p>
                <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>
              
              {/* Documents List */}
              {documentsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">{getDocumentIcon(doc.mime_type || "")}</span>
                        <div>
                          <p className="font-medium truncate max-w-xs">{doc.file_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(doc.file_size || 0)}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {doc.is_duplicate ? "duplicate" : "uploaded"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No documents uploaded yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* RIGHT: Timeline and Scores */}
        <div className="space-y-6">
          {/* Timeline Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : timeline.length > 0 ? (
                <div className="space-y-4">
                  {timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        {index < timeline.length - 1 && (
                          <div className="h-full w-0.5 bg-gray-200 mt-2 ml-1"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium">{event.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No timeline events yet
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Readiness/Fraud Scores and Signals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {claim.readiness_score !== undefined && (
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">{claim.readiness_score}%</p>
                    <p className="text-sm text-blue-600">Readiness Score</p>
                  </div>
                )}
                
                {claim.fraud_score !== undefined && (
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-700">{claim.fraud_score}%</p>
                    <p className="text-sm text-red-600">Fraud Score</p>
                  </div>
                )}
              </div>
              
              {/* Signals List */}
              <div>
                <p className="font-medium mb-2">Risk Signals</p>
                <ul className="space-y-2">
                  {claim.fraud_score !== undefined && claim.fraud_score > 70 && (
                    <li className="flex items-center text-red-600">
                      <XCircle className="mr-2 h-4 w-4" />
                      High fraud probability detected
                    </li>
                  )}
                  {claim.readiness_score !== undefined && claim.readiness_score < 50 && (
                    <li className="flex items-center text-yellow-600">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Low readiness score - requires additional documentation
                    </li>
                  )}
                  {!claim.decision_type && (
                    <li className="flex items-center text-blue-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Claim processing in progress
                    </li>
                  )}
                  {claim.decision_type === 'auto_approved' && (
                    <li className="flex items-center text-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Auto-approved based on risk assessment
                    </li>
                  )}
                  {claim.decision_type === 'auto_rejected' && (
                    <li className="flex items-center text-red-600">
                      <XCircle className="mr-2 h-4 w-4" />
                      Auto-rejected due to high risk indicators
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* BOTTOM: Workflow Buttons */}
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row gap-4 justify-end">
          <Button 
            variant="outline" 
            onClick={handleDownloadPdf}
            disabled={claim.status.toLowerCase() === 'pending' || claim.status.toLowerCase() === 'draft'}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF Summary
          </Button>
          <Button 
            onClick={handleSubmitClaim}
            disabled={claim.status.toLowerCase() !== 'draft'}
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Claim
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}