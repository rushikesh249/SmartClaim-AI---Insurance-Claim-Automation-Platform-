import { useState, useEffect } from "react";
import { StatCard } from "@/components/shared/StatCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Users, Shield, FileText, AlertCircle } from "lucide-react"
import { policyApi } from "@/api/policy";
import { claimApi } from "@/api/claim";
import type { PolicyResponse } from "@/types/policy";
import type { ClaimResponse } from "@/types/claim";

export function Overview() {
    const [policies, setPolicies] = useState<PolicyResponse[]>([]);
    const [claims, setClaims] = useState<ClaimResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [policiesData, claimsData] = await Promise.all([
                    policyApi.listPolicies(),
                    claimApi.listClaims()
                ]);
                setPolicies(policiesData);
                setClaims(claimsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalClaims = claims.length;
    const activePolicies = policies.filter(policy => policy.status === 'active' || policy.status === 'Active').length;
    const pendingReviews = claims.filter(claim => claim.status.toLowerCase().includes('pending')).length;
    
    // Calculate percentage changes (mock calculation)
    const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
    };

    const handleNewClaimClick = () => {
        navigate('/app/claims');
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Overview" description="Welcome back to SmartClaim AI.">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Claim
                    </Button>
                </PageHeader>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-semibold leading-none tracking-tight mb-4">Recent Claims</h3>
                        <div className="space-y-2">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>
                    <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-semibold leading-none tracking-tight mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Overview" description="Welcome back to SmartClaim AI.">
                <Button onClick={handleNewClaimClick}>
                    <Plus className="mr-2 h-4 w-4" /> New Claim
                </Button>
            </PageHeader>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Claims"
                    value={totalClaims.toString()}
                    icon={FileText}
                    trend={{ value: calculatePercentageChange(totalClaims, totalClaims - 10), label: "vs last month", positive: true }}
                />
                <StatCard
                    title="Active Policies"
                    value={activePolicies.toString()}
                    icon={Shield}
                    trend={{ value: calculatePercentageChange(activePolicies, activePolicies - 5), label: "new policies", positive: true }}
                />
                <StatCard
                    title="Pending Reviews"
                    value={pendingReviews.toString()}
                    icon={AlertCircle}
                    description="Requires attention"
                />
                <StatCard
                    title="Customers"
                    value="3,890"
                    icon={Users}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow p-6">
                    <h3 className="font-semibold leading-none tracking-tight mb-4">Recent Claims</h3>
                    {claims.length > 0 ? (
                        <div className="space-y-4">
                            {claims.slice(0, 3).map((claim) => (
                                <div key={claim.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                                    <div>
                                        <p className="font-medium">{claim.claim_number}</p>
                                        <p className="text-sm text-muted-foreground">{claim.claim_type} claim</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">${claim.claimed_amount.toFixed(2)}</p>
                                        <p className="text-sm text-muted-foreground capitalize">{claim.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            No recent claims
                        </div>
                    )}
                </div>
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow p-6">
                    <h3 className="font-semibold leading-none tracking-tight mb-4">Recent Activity</h3>
                    {policies.length > 0 ? (
                        <div className="space-y-4">
                            {policies.slice(0, 3).map((policy) => (
                                <div key={policy.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Policy {policy.policy_number}</p>
                                        <p className="text-xs text-muted-foreground">{policy.insurer_name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">No recent activity</p>
                                    <p className="text-xs text-muted-foreground">Add a policy to get started</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
