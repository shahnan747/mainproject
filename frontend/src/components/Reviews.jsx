import { useState, useEffect } from "react";

const reviews = [
  {
    text: "FieldHub helped us manage orders faster and improve efficiency.",
    name: "Ramesh Kumar",
    role: "Sales Head",
  },
  {
    text: "The dashboard insights helped us increase our revenue.",
    name: "Priya Patel",
    role: "Director",
  },
  {
    text: "Easy to use and perfect for field agents working offline.",
    name: "Arjun Menon",
    role: "Operations Manager",
  },
];

export default function Reviews() {
  const [index, setIndex] = useState(0);

  return (
    <section className="bg-gradient-to-br from-[#0a0f1e] to-[#111d3e] px-6 py-20 text-center">
      
      {/* Heading */}
      <p className="text-[#f5c842] text-xs font-bold uppercase mb-3">
        Client Reviews
      </p>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-10">
        Trusted by distribution teams <br /> across India
      </h2>

      {/* Carousel */}
      <div className="max-w-xl mx-auto relative">

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left transition-all duration-500">
          
          <div className="text-yellow-400 mb-3">★★★★★</div>

          <p className="text-white/70 text-sm mb-6 italic">
            {reviews[index].text}
          </p>

          <div className="text-white text-sm font-semibold">
            {reviews[index].name}
          </div>

          <div className="text-white/40 text-xs">
            {reviews[index].role}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                i === index ? "bg-yellow-400" : "bg-white/30"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}