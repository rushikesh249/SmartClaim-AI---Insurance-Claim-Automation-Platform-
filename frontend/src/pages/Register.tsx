import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/stores/authStore"
import { Eye, EyeOff, Loader2, Shield } from "lucide-react"

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone must be 10-15 digits").max(15, "Phone must be 10-15 digits"),
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function Register() {
    const navigate = useNavigate()
    const { register: registerAction, isLoading, error } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
        reValidateMode: "onChange"
    })

    const onSubmit = async (data: RegisterFormValues) => {
        // Sanitize phone number before sending
        const sanitizedPhone = data.phone.replace(/\D/g, '');
        
        try {
            await registerAction({
                name: data.name,
                phone: sanitizedPhone,
                email: data.email || '',
                password: data.password
            })
            toast.success("Account created successfully!")
            // Redirect to dashboard after successful registration
            navigate("/app")
        } catch (error: any) {
            // Error is handled by the store and toast is shown there
            console.error('Registration error:', error)
        }
    }

    // Handle phone input to automatically sanitize as user types
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only digits to be entered
        const digitsOnly = value.replace(/\D/g, '');
        // Limit to 15 digits maximum
        if (digitsOnly.length <= 15) {
            setValue('phone', digitsOnly, { shouldValidate: true });
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Column - Auth Form */}
            <div className="w-full md:w-[480px] xl:w-[520px] flex items-center justify-center px-6 py-10 bg-white flex-shrink-0">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex flex-col text-center items-center mb-6">
                        <div className="p-2 bg-primary rounded-lg mb-4">
                            <Shield className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your information to create an account
                        </p>
                    </div>
                    
                    {/* Only render error if it's a string */}
                    {error && typeof error === 'string' && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    {...register("name")}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter 10-15 digit phone number"
                                    {...register("phone")}
                                    onChange={handlePhoneChange}
                                />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="sr-only">Toggle password visibility</span>
                                    </Button>
                                </div>
                                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                            </div>
                            <Button disabled={isLoading}>
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Account
                            </Button>
                        </div>
                    </form>
                    <div className="items-center flex justify-center">
                        <p className="text-sm text-muted-foreground">Already have an account? <Link to="/login" className="underline underline-offset-4 hover:text-primary">Sign in</Link></p>
                    </div>
                </div>
            </div>
            
            {/* Right Column - Brand Panel */}
            <div className="hidden md:flex flex-1 bg-slate-950 relative overflow-hidden min-w-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-700/15 to-slate-900/90" />
                
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 max-w-2xl mx-auto text-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                Insurance Claims
                                <span className="block text-blue-400">Reimagined</span>
                            </h2>
                            <p className="text-lg text-slate-300 max-w-lg mx-auto leading-relaxed">
                                Experience the future of insurance claim processing with AI-powered automation that reduces processing time by 85%.
                            </p>
                        </div>
                        
                        {/* Testimonial Card */}
                        <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                            <blockquote className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                        SD
                                    </div>
                                    <div className="ml-4 text-left">
                                        <p className="font-semibold text-white">Sofia Davis</p>
                                        <p className="text-sm text-slate-300">VP of Claims, TechSure</p>
                                    </div>
                                </div>
                                <p className="text-slate-200 italic text-base leading-relaxed">
                                    "This platform has completely revolutionized how we process insurance claims. The AI accuracy is unmatched and has saved us countless hours."
                                </p>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}