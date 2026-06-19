export default function Features() {

    const FEATURES = [
        {
            icon: "📦",
            title: "Order Management",
            desc: "Create, track and fulfil orders from the field.",
        },
        {
            icon: "⚡",
            title: "Smart Auto-Fill",
            desc: "Auto-fill customer data and reduce manual work.",
        },
        {
            icon: "💰",
            title: "Payment Analytics",
            desc: "Track collections and pending payments easily.",
        },
        {
            icon: "📈",
            title: "Profit Tracking",
            desc: "Monitor margins per product and route.",
        },
        {
            icon: "🔄",
            title: "Real-Time Updates",
            desc: "Live sync across all devices instantly.",
        },
        {
            icon: "📍",
            title: "Offline Support",
            desc: "Works even without internet connection.",
        },
    ];

    return (
        <section id = "features" className="bg-gradient-to-br from-[#0a0f1e] to-[#111d3e] px-6 py-20 text-center">

            {/* Heading */}
            <p className="text-[#f5c842] text-xs font-bold tracking-[1.5px] uppercase mb-3">
                Platform Features
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                Everything your field team needs
            </h2>

            <p className="text-white/50 max-w-md mx-auto font-light text-base">
                From order capture to profit analytics — built for speed and simplicity in the field.
            </p>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">

                {FEATURES.map(({ icon, title, desc }) => (

                    <div
                        key={title}
                        className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-7 text-left 
                       hover:-translate-y-1 hover:border-yellow-400/40 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] 
                       transition-all"
                    >

                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-5">
                            {icon}
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-white mb-2 tracking-tight">
                            {title}
                        </h3>

                        {/* Description */}
                        <p className="text-white/50 text-sm leading-relaxed font-light">
                            {desc}
                        </p>
                    </div>

                ))}
            </div>
        </section>

    );
}
