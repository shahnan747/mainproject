import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0f1e] px-6 pt-14 pb-6 text-center md:text-left">
      
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        
        {/* Brand */}
        <div>
          <h3 className="text-white font-bold text-lg mb-3">
            Field<span className="text-[#f5c842]">Hub</span>
          </h3>
          <p className="text-white/50 text-sm max-w-xs">
            The complete field sales and distribution management platform for modern businesses.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-white/70 text-xs uppercase mb-3">Product</h4>
          <p className="text-white/50 text-sm mb-2">Features</p>
          <p className="text-white/50 text-sm mb-2">Pricing</p>
          <p className="text-white/50 text-sm">Integrations</p>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white/70 text-xs uppercase mb-3">Company</h4>
          <p className="text-white/50 text-sm mb-2">About</p>
          <p className="text-white/50 text-sm mb-2">Careers</p>
          <p className="text-white/50 text-sm">Contact</p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white/70 text-xs uppercase mb-3">Contact</h4>
          <p className="text-white/50 text-sm mb-2">hello@fieldhub.in</p>
          <p className="text-white/50 text-sm mb-2">+91 98765 43210</p>
          <p className="text-white/50 text-sm">Tvm, Kerala</p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-3">
        
        <p className="text-white/40 text-xs">
          © 2026 FieldHub. All rights reserved.
        </p>

        <div className="flex gap-4 text-xs text-white/40">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Cookies</span>
        </div>

      </div>

    </footer>
  );
}
