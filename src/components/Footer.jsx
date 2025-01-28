import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-600 p-4 text-white text-center relative">
      <div className="container mx-auto">
        <p>&copy; 2025 Meter Reading Multi User Database</p>
        <p>
          Check out my{" "}
          <a
            href="https://github.com/Asadullah404"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline"
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
        className="fixed bottom-5 right-5"
      >
        <img
          src="/whatsapp.gif"
          alt="WhatsApp"
          className="w-12 h-12 rounded-full shadow-lg"
        />
      </a>
    </footer>
  );
};

export default Footer;
