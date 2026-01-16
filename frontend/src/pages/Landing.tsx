import { Link } from "react-router-dom";
import { Shield, Scan, AlertTriangle, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gray-900">SmartClaim AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Transform Insurance Claims with <span className="text-primary">AI-Powered</span> Intelligence
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl">
                SmartClaim AI automates document processing, fraud detection, and timeline analysis to streamline your claims workflow and reduce processing time by 80%.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="px-8 py-3 text-base">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="px-8 py-3 text-base">
                    View Demo
                  </Button>
                </Link>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">80%</div>
                  <div className="text-sm text-gray-600 mt-1">Time Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-sm text-gray-600 mt-1">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-gray-600 mt-1">Automated Processing</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                      <Scan className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">OCR Processing</h3>
                    <p className="text-sm text-gray-600 mt-1">Document scanning</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-8">
                <div className="h-48 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-3">
                      <AlertTriangle className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Fraud Detection</h3>
                    <p className="text-sm text-gray-600 mt-1">Risk analysis</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="h-48 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Timeline Analysis</h3>
                    <p className="text-sm text-gray-600 mt-1">Event tracking</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-8">
                <div className="h-48 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg mb-3">
                      <TrendingUp className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">PDF Summary</h3>
                    <p className="text-sm text-gray-600 mt-1">Report generation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features for Insurance Excellence</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform delivers comprehensive solutions for modern insurance operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-6">
                <Scan className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">OCR Document Processing</h3>
              <p className="text-gray-600">
                Automatically extract and process information from insurance documents, policies, and claims with 99% accuracy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-6">
                <AlertTriangle className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fraud Scoring</h3>
              <p className="text-gray-600">
                Advanced algorithms detect suspicious patterns and anomalies to flag potential fraudulent claims early.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-6">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Timeline Analysis</h3>
              <p className="text-gray-600">
                Visualize and analyze the chronological sequence of events to understand claim progression and identify delays.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg mb-6">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">PDF Summary Generation</h3>
              <p className="text-gray-600">
                Automatically create comprehensive summaries of complex documents for quick review and decision-making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How SmartClaim AI Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your claims process in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Documents</h3>
              <p className="text-gray-600">
                Securely upload claims documents, policies, and supporting evidence through our intuitive interface.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Processing</h3>
              <p className="text-gray-600">
                Our AI analyzes documents, extracts key information, and performs fraud risk assessment.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Insights</h3>
              <p className="text-gray-600">
                Review AI-generated insights, summaries, and recommendations in our comprehensive dashboard.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Process Claims</h3>
              <p className="text-gray-600">
                Make informed decisions and process claims faster with automated workflows and approvals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to know about SmartClaim AI
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How accurate is the fraud detection?</h3>
              <p className="text-gray-600">
                Our AI models have been trained on millions of claims and achieve 95% accuracy in identifying potential fraud indicators. 
                The system continuously learns and improves based on new data patterns.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What document types do you support?</h3>
              <p className="text-gray-600">
                We support all common insurance document types including policies, claims forms, medical records, 
                police reports, and correspondence. Our OCR technology works with both digital and scanned documents.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How secure is my data?</h3>
              <p className="text-gray-600">
                Security is our top priority. All data is encrypted in transit and at rest. We comply with 
                industry standards including SOC 2 Type II, GDPR, and HIPAA requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I integrate with my existing systems?</h3>
              <p className="text-gray-600">
                Yes, we offer comprehensive API integrations and can connect with most major insurance management 
                platforms. Our team provides dedicated support for seamless implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">SmartClaim AI</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing insurance claims processing with artificial intelligence.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Solutions</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Status</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SmartClaim AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}