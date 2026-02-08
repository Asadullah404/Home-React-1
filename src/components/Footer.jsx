import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-black/80 backdrop-blur-md border-t border-cyan-500/30 p-4 text-center relative z-10 mt-auto">
      <div className="container mx-auto">
        <p className="text-gray-300">
          &copy; 2025 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-bold">Meter Reading Multi User Database</span>
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Check out my{" "}
          <a
            href="https://github.com/Asadullah404"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-300 transition-all"
          >
            GitHub
          </a>
        </p>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/message/M3ECBZ74CQBMJ1?src=qr"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 transition-transform hover:scale-110 duration-300"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full blur opacity-40 animate-pulse"></div>
          <img
            src="/whatsapp.gif"
            alt="WhatsApp"
            className="w-12 h-12 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.5)] relative z-10"
          />
        </div>
      </a>
    </footer>
  );
};

export default Footer;
