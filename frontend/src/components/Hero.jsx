import { Link } from "react-router-dom";

export default function Hero() {

    const STATS = [
        { num: "1.2K", suffix: "+", label: "Active Teams" },
        { num: "98", suffix: "%", label: "Uptime SLA" },
        { num: "4.2M", suffix: "", label: "Orders Processed" },
        { num: "34", suffix: "%", label: "Avg. Revenue Lift" },
    ];

    return (
        <section className="min-h-screen flex items-center justify-center text-center px-6 bg-gradient-to-br from-[#0a0f1e] via-[#0d1530] to-[#0a1a4a] relative">

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(245,200,66,0.08),transparent)]" />

            <div className="relative max-w-4xl mx-auto mt-16">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-[#f5c842] text-xs px-4 py-1.5 rounded-full mb-6">
                    <span className="w-2 h-2 bg-[#f5c842] rounded-full" />
                    Trusted by 1,200+ field teams
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[48px] font-extrabold text-white leading-tight tracking-tight">
                    Smarter <span className="text-[#f5c842]">Field</span><br />
                    Sales &<br />
                    Distribution Management
                </h1>

                {/* Subtext */}
                <p className="text-white/50 text-base sm:text-lg mt-6 max-w-xl mx-auto">
                    One platform to manage your sales agents, orders, deliveries,
                    payments, and profits — in real time, anywhere.
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <Link
                        to="/signup"
                        className="bg-[#f5c842] text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400"
                    >
                        Get Started
                    </Link>

                    <Link
                        to="/login"
                        className="border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/10"
                    >
                        Login to Dashboard
                    </Link>
                </div>

                {/* Stats row */}
                <div className="flex justify-center gap-12 mt-14 flex-wrap">
                    {STATS.map(({ num, suffix, label }) => (
                        <div key={label} className="text-center">
                            <div className="font-extrabold text-white text-[28px] leading-none">
                                {num}<span className="text-[#f5c842] text-sm ml-1">{suffix}</span>
                            </div>
                            <div className="text-white/40 text-xs mt-1 ">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Bounce Arrow */}
                <div className="mt-10 flex justify-center">
                    <a
                        href="#features"
                        className="animate-bounce text-[#f5c842] text-2xl"
                    >
                        ↓
                    </a>
                </div>
            </div>
        </section>
    );
}
