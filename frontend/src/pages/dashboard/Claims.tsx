import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FileText, Plus, Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { claimApi } from "@/api/claim";
import { policyApi } from "@/api/policy";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import type { ClaimResponse } from "@/types/claim";
import type { PolicyResponse } from "@/types/policy";

const claimCreateSchema = z.object({
    policy_id: z.string().min(1, "Policy selection is required"),
    claim_type: z.enum(["health", "motor"]),
    incident_date: z.string().min(1, "Incident date is required"),
    incident_location: z.string().optional(),
    incident_description: z.string().optional(),
    claimed_amount: z.union([z.string(), z.number()]).transform(v => String(v)),
});

interface ClaimFormData {
    policy_id: string;
    claim_type: 'health' | 'motor';
    incident_date: string;
    incident_location?: string;
    incident_description?: string;
    claimed_amount: string | number;
}

interface TransformedClaimData {
    policy_id: string;
    claim_type: 'health' | 'motor';
    incident_date: string;
    incident_location?: string;
    incident_description?: string;
    claimed_amount: number;
}

export function Claims() {
    const [claims, setClaims] = useState<ClaimResponse[]>([]);
    const [policies, setPolicies] = useState<PolicyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ClaimFormData>({
        resolver: zodResolver(claimCreateSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [claimsData, policiesData] = await Promise.all([
                    claimApi.listClaims(),
                    policyApi.listPolicies()
                ]);
                setClaims(claimsData);
                setPolicies(policiesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load claims and policies');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (formData: ClaimFormData) => {
        setSubmitting(true);
        try {
            const transformedData: TransformedClaimData = {
                policy_id: formData.policy_id,
                claim_type: formData.claim_type,
                incident_date: formData.incident_date,
                incident_location: formData.incident_location,
                incident_description: formData.incident_description,
                claimed_amount: Number(formData.claimed_amount),
            };
            
            const response = await claimApi.createClaim(transformedData);
            setClaims(prev => [response, ...prev]);
            reset();
            toast.success("Claim created successfully");
        } catch (error) {
            console.error('Error creating claim:', error);
            const errorMessage = getApiErrorMessage(error);
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRowClick = (claimId: string) => {
        navigate(`/app/claims/${claimId}`);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Claims" description="View and process insurance claims." />
            
            {/* Create Claim Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Create New Claim</CardTitle>
                    <CardDescription>Submit a new insurance claim for processing</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="policy_id">Policy *</Label>
                                <select
                                    id="policy_id"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("policy_id")}
                                >
                                    <option value="">Select a policy</option>
                                    {policies.map(policy => (
                                        <option key={policy.id} value={policy.id}>
                                            {policy.policy_number} - {policy.insurer_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.policy_id && (
                                    <p className="text-sm text-red-500">{errors.policy_id.message}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="claim_type">Claim Type *</Label>
                                <select
                                    id="claim_type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("claim_type")}
                                >
                                    <option value="">Select claim type</option>
                                    <option value="health">Health</option>
                                    <option value="motor">Motor</option>
                                </select>
                                {errors.claim_type && (
                                    <p className="text-sm text-red-500">{errors.claim_type.message}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="incident_date">Incident Date *</Label>
                                <Input
                                    id="incident_date"
                                    type="date"
                                    {...register("incident_date")}
                                />
                                {errors.incident_date && (
                                    <p className="text-sm text-red-500">{errors.incident_date.message}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="incident_location">Incident Location</Label>
                                <Input
                                    id="incident_location"
                                    placeholder="Enter incident location"
                                    {...register("incident_location")}
                                />
                            </div>
                            
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="incident_description">Incident Description</Label>
                                <textarea
                                    id="incident_description"
                                    rows={3}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Describe the incident in detail"
                                    {...register("incident_description")}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="claimed_amount">Claimed Amount *</Label>
                                <Input
                                    id="claimed_amount"
                                    type="text"
                                    inputMode="decimal"
                                    pattern="[0-9]+([\.][0-9]+)?"
                                    placeholder="Enter claimed amount"
                                    {...register("claimed_amount")}
                                />
                                {errors.claimed_amount && (
                                    <p className="text-sm text-red-500">{errors.claimed_amount.message}</p>
                                )}
                            </div>
                        </div>
                        
                        <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                            {submitting ? (
                                <>
                                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Claim
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            
            {/* Claims List */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Claims</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            ))}
                        </div>
                    ) : claims.length > 0 ? (
                        <div className="space-y-4">
                            {claims.map(claim => (
                                <div 
                                    key={claim.id} 
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                                    onClick={() => handleRowClick(claim.id)}
                                >
                                    <div>
                                        <p className="font-medium">{claim.claim_number}</p>
                                        <p className="text-sm text-muted-foreground">{claim.claim_type} claim</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="font-medium">${claim.claimed_amount.toLocaleString()}</p>
                                            <p className="text-sm text-muted-foreground">Claimed</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatDate(claim.incident_date)}</p>
                                            <p className="text-sm text-muted-foreground">Incident Date</p>
                                        </div>
                                        <Badge className={`capitalize ${getStatusBadgeVariant(claim.status)}`}>
                                            {claim.status}
                                        </Badge>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No claims found"
                            description="There are no claims to display at the moment."
                            icon={FileText}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
