import { Outlet } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function AuthLayout() {
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="flex flex-col text-center items-center mb-6">
                        <div className="p-2 bg-primary rounded-lg mb-4">
                            <Shield className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">SmartClaim AI</h1>
                    </div>
                    <Outlet />
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-zinc-900 border-l border-zinc-800" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-zinc-900/0" />

                <div className="absolute bottom-10 left-10 right-10 text-white p-8 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-white/10">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;This platform has completely revolutionized how we process insurance claims.
                            The AI accuracy is unmatched and has saved us countless hours.&rdquo;
                        </p>
                        <footer className="text-sm text-zinc-400">
                            Sofia Davis <span className="mx-2">·</span> VP of Claims, TechSure
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
