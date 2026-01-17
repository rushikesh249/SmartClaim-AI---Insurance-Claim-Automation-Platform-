import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { FileText, Download, Eye, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { documentApi } from '@/api/document';
import type { DocumentResponse } from '@/types/document';
import { Skeleton } from '@/components/ui/skeleton';

export function Documents() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      // TODO: Implement global documents endpoint in backend
      // For now, we'll fetch documents from all user's claims
      // This is a temporary workaround until backend provides /api/v1/documents endpoint
      
      // First, get all claims for the user
      const claimsResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/claims/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      
      if (!claimsResponse.ok) {
        throw new Error('Failed to fetch claims');
      }
      
      const claims = await claimsResponse.json();
      
      // Fetch documents for each claim
      const allDocuments: DocumentResponse[] = [];
      
      for (const claim of claims) {
        try {
          const docsResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/claims/${claim.id}/documents`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
              }
            }
          );
          
          if (docsResponse.ok) {
            const docs = await docsResponse.json();
            allDocuments.push(...docs);
          }
        } catch (err) {
          console.warn(`Failed to fetch documents for claim ${claim.id}:`, err);
        }
      }
      
      setDocuments(allDocuments);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
      toast.error('Failed to load documents');
      setLoading(false);
    }
  };

  const getStatusIcon = (doc: DocumentResponse) => {
    if (doc.is_duplicate) {
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
    if (doc.quality_score >= 90) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    if (doc.quality_score >= 70) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadgeVariant = (doc: DocumentResponse) => {
    if (doc.is_duplicate) {
      return 'warning';
    }
    if (doc.quality_score >= 90) {
      return 'success';
    }
    if (doc.quality_score >= 70) {
      return 'secondary';
    }
    return 'destructive';
  };

  const getStatusText = (doc: DocumentResponse) => {
    if (doc.is_duplicate) {
      return 'Duplicate';
    }
    if (doc.quality_score >= 90) {
      return 'Verified';
    }
    if (doc.quality_score >= 70) {
      return 'Pending Review';
    }
    return 'Low Quality';
  };

  const handleDownload = async (doc: DocumentResponse) => {
    try {
      // Use the axios client to make a request with proper authentication
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/files/${encodeURIComponent(doc.file_path)}?download=true`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Access denied or file not found');
      }
      
      // Create blob from response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.file_name || doc.file_path.split('/').pop() || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Access denied or file missing');
    }
  };

  const handleView = (doc: DocumentResponse) => {
    // Open file in new tab for preview
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/files/${encodeURIComponent(doc.file_path)}`;
    window.open(url, '_blank');
    
    toast.success('Opening file in new tab');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Documents" 
          description="Manage all uploaded documents" 
        />
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle><Skeleton className="h-5 w-3/4" /></CardTitle>
                <CardDescription><Skeleton className="h-4 w-full" /></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Documents" 
          description="Manage all uploaded documents" 
        />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Failed to Load Documents</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDocuments}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Documents" 
        description="Manage all uploaded documents" 
      />

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Documents Yet"
          description="Upload documents to get started with your claims processing"
          action={{
            label: "Go to Claims",
            onClick: () => navigate('/app/claims')
          }}
        />
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{document.file_name || document.document_type}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(document)}
                    <Badge variant={getStatusBadgeVariant(document)}>
                      {getStatusText(document)}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Claim #{document.claim_id} • {document.document_type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Uploaded: {new Date(document.created_at).toLocaleDateString()} •{' '}
                    {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : 'Size unknown' }
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(document)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}