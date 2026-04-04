import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { BarChart2, Hash, MessageCircle, ArrowRight } from "lucide-react"

const Hero = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
            {/* Navbar */}
            <nav className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
                <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">Postlytics</span>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => navigate("/login")}>Log in</Button>
                    <Button onClick={() => navigate("/signup")}>Get Started</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-8">
                    <BarChart2 size={14} />
                    Analytics-powered social posting
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
                    Track, Analyze &<br />
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                        Grow Your Reach
                    </span>
                </h1>

                <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
                    Create posts, discover trending hashtags, and get real-time analytics
                    to understand what resonates with your audience.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                    <Button size="lg" className="text-base px-8 py-3 h-12" onClick={() => navigate("/signup")}>
                        Start for Free
                        <ArrowRight size={18} className="ml-1" />
                    </Button>
                    <Button variant="outline" size="lg" className="text-base px-8 py-3 h-12" onClick={() => navigate("/login")}>
                        Sign In
                    </Button>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/70 backdrop-blur rounded-2xl border border-gray-200/60 p-6 hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                        <BarChart2 size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Real-time Analytics</h3>
                    <p className="text-sm text-gray-500">Track post performance with interactive charts and daily insights.</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-2xl border border-gray-200/60 p-6 hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                        <Hash size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hashtag Trends</h3>
                    <p className="text-sm text-gray-500">Discover which hashtags drive the most engagement.</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-2xl border border-gray-200/60 p-6 hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                        <MessageCircle size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Live Comments</h3>
                    <p className="text-sm text-gray-500">Real-time comment streaming powered by WebSockets.</p>
                </div>
            </div>
        </div>
    )
}

export default Hero