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
import { toast } from "sonner";
import { Shield, Plus, Eye, Calendar, DollarSign } from "lucide-react";
import { policyApi } from "@/api/policy";
import type { PolicyResponse } from "@/types/policy";

const policyLinkSchema = z.object({
    policy_number: z.string().min(1, "Policy number is required"),
    policy_type: z.enum(["health", "motor"]),
    insurer_name: z.string().min(1, "Insurer name is required"),
    sum_insured: z.string().min(1, "Sum insured is required"),
    premium_amount: z.string().optional(),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
});

// Define the transformed type
interface PolicyLinkFormData extends z.infer<typeof policyLinkSchema> {
    sum_insured: string;
    premium_amount?: string;
}

interface TransformedPolicyLinkData {
    policy_number: string;
    policy_type: 'health' | 'motor';
    insurer_name: string;
    sum_insured: number;
    premium_amount?: number;
    start_date: string;
    end_date: string;
    coverage_details?: Record<string, any>;
}

export function Policies() {
    const [policies, setPolicies] = useState<PolicyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<PolicyResponse | null>(null);
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm<PolicyLinkFormData>({
        resolver: zodResolver(policyLinkSchema),
    });

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const data = await policyApi.listPolicies();
                setPolicies(data);
            } catch (error) {
                console.error('Error fetching policies:', error);
                toast.error('Failed to load policies');
            } finally {
                setLoading(false);
            }
        };

        fetchPolicies();
    }, []);

    const onSubmit = async (formData: PolicyLinkFormData) => {
        try {
            const transformedData: TransformedPolicyLinkData = {
                ...formData,
                sum_insured: Number(formData.sum_insured),
                premium_amount: formData.premium_amount ? Number(formData.premium_amount) : undefined,
            };
            
            const response = await policyApi.linkPolicy(transformedData);
            setPolicies(prev => [response, ...prev]);
            reset();
            toast.success("Policy linked successfully");
        } catch (error) {
            console.error('Error linking policy:', error);
            toast.error("Failed to link policy");
        }
    };

    const handleViewDetails = (policy: PolicyResponse) => {
        setSelectedPolicy(policy);
        setDetailsModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Policies" description="Manage insurance policies and coverages." />
            
            {/* Link Policy Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Link New Policy</CardTitle>
                    <CardDescription>Add a new insurance policy to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="policy_number">Policy Number *</Label>
                                <Input
                                    id="policy_number"
                                    placeholder="Enter policy number"
                                    {...register("policy_number")}
                                />
                                {errors.policy_number && (
                                    <p className="text-sm text-red-500">{errors.policy_number.message}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="policy_type">Policy Type *</Label>
                                <select
                                    id="policy_type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("policy_type")}
                                >
                                    <option value="">Select policy type</option>
                                    <option value="health">Health</option>
                                    <option value="motor">Motor</option>
                                </select>
                                {errors.policy_type && (
                                    <p className="text-sm text-red-500">{errors.policy_type.message}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="insurer_name">Insurer Name *</Label>
                                <Input
                                    id="insurer_name"
                                    placeholder="Enter insurer name"
                                    {...register("insurer_name")}
                                />
                                {errors.insurer_name && (
                                    <p className="text-sm text-red-500">{errors.insurer_name.message}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="sum_insured">Sum Insured *</Label>
                                <Input
                                    id="sum_insured"
                                    type="number"
                                    placeholder="Enter sum insured"
                                    {...register("sum_insured", { valueAsNumber: true })}
                                />
                                {errors.sum_insured && (
                                    <p className="text-sm text-red-500">{errors.sum_insured.message}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="premium_amount">Premium Amount</Label>
                                <Input
                                    id="premium_amount"
                                    type="number"
                                    placeholder="Enter premium amount"
                                    {...register("premium_amount", { valueAsNumber: true })}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date *</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    {...register("start_date")}
                                />
                                {errors.start_date && (
                                    <p className="text-sm text-red-500">{errors.start_date.message}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="end_date">End Date *</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    {...register("end_date")}
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-red-500">{errors.end_date.message}</p>
                                )}
                            </div>
                        </div>
                        
                        <Button type="submit" className="w-full md:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Link Policy
                        </Button>
                    </form>
                </CardContent>
            </Card>
            
            {/* Policies List */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Policies</CardTitle>
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
                    ) : policies.length > 0 ? (
                        <div className="space-y-4">
                            {policies.map(policy => (
                                <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                                    <div>
                                        <p className="font-medium">{policy.policy_number}</p>
                                        <p className="text-sm text-muted-foreground">{policy.insurer_name}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="font-medium">${policy.sum_insured.toLocaleString()}</p>
                                            <p className="text-sm text-muted-foreground">Sum Insured</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatDate(policy.start_date)} - {formatDate(policy.end_date)}</p>
                                            <p className="text-sm text-muted-foreground">Coverage Period</p>
                                        </div>
                                        <Badge className={`capitalize ${getStatusBadgeVariant(policy.status)}`}>
                                            {policy.status}
                                        </Badge>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleViewDetails(policy)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No policies found"
                            description="You haven't added any policies yet. Link one to get started."
                            icon={Shield}
                        />
                    )}
                </CardContent>
            </Card>
            
            {/* Policy Details Modal - Simplified Implementation */}
            {detailsModalOpen && selectedPolicy && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold">Policy Details</h3>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setDetailsModalOpen(false)}
                                    className="h-8 w-8 p-0"
                                >
                                    ×
                                </Button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Policy Number</p>
                                        <p className="font-medium">{selectedPolicy.policy_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Policy Type</p>
                                        <p className="font-medium capitalize">{selectedPolicy.policy_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Insurer Name</p>
                                        <p className="font-medium">{selectedPolicy.insurer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <Badge className={`capitalize ${getStatusBadgeVariant(selectedPolicy.status)}`}>
                                            {selectedPolicy.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Sum Insured</p>
                                        <p className="font-medium">${selectedPolicy.sum_insured.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Premium Amount</p>
                                        <p className="font-medium">${selectedPolicy.premium_amount?.toLocaleString() || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Start Date</p>
                                        <p className="font-medium">{formatDate(selectedPolicy.start_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">End Date</p>
                                        <p className="font-medium">{formatDate(selectedPolicy.end_date)}</p>
                                    </div>
                                </div>
                                
                                {selectedPolicy.coverage_details && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Coverage Details</p>
                                        <pre className="text-sm bg-gray-100 p-3 rounded mt-1 overflow-x-auto">
                                            {JSON.stringify(selectedPolicy.coverage_details, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
