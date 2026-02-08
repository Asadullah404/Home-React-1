// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { MdKeyboardArrowDown } from "react-icons/md";
// import { auth } from "../firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase";
// import { motion, AnimatePresence } from "framer-motion";

// const Navbar = ({ isAdmin }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isToolsOpen, setIsToolsOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
//       setUser(currentUser);
//       if (currentUser) {
//         const userRef = doc(db, "users", currentUser.uid);
//         const userDoc = await getDoc(userRef);
//         if (userDoc.exists()) {
//           setRole(userDoc.data().role);
//         }
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ type: "spring", stiffness: 120 }}
//       className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
//     >
//       <div className="container mx-auto flex justify-between items-center p-4">
//         {/* Logo and App Name */}
//         <Link to="/" className="flex items-center gap-2 group">
//           <motion.img
//             whileHover={{ scale: 1.1, rotate: 5 }}
//             src="/vite.PNG"
//             alt="Logo"
//             className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
//           />
//           <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 hidden sm:block">
//             NEXUS
//           </span>
//         </Link>

//         {/* Hamburger Menu Button */}
//         <button
//           className="lg:hidden flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-sm border border-white/20"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16m-7 6h7" />}
//           </svg>
//         </button>

//         {/* Navigation Links */}
//         <div
//           className={`${isMenuOpen ? "flex" : "hidden"
//             } lg:flex flex-col lg:flex-row lg:items-center lg:space-x-6 absolute lg:static top-16 left-0 w-full lg:w-auto bg-black/90 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-4 lg:p-0 border-b lg:border-none border-white/10 transition-all duration-300 ease-in-out`}
//         >
//           <NavLink to="/home">Home</NavLink>

//           {/* Tools Dropdown */}
//           <div className="relative group">
//             <button
//               className="flex items-center gap-1 px-4 py-2 text-gray-300 hover:text-cyan-400 transition"
//               onClick={() => setIsToolsOpen(!isToolsOpen)}
//               onMouseEnter={() => setIsToolsOpen(true)}
//             >
//               Tools <MdKeyboardArrowDown className="transition-transform group-hover:rotate-180" />
//             </button>
//             <AnimatePresence>
//               {isToolsOpen && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   className="absolute left-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.2)]"
//                   onMouseLeave={() => setIsToolsOpen(false)}
//                 >
//                   <Link to="/datainc" className="block px-4 py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-white transition">Data Increment</Link>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {isAdmin && (
//             <NavLink to="/admin-dashboard" className="text-purple-400 hover:text-purple-300">Admin</NavLink>
//           )}

//           {user && (
//             <NavLink to="/user-dashboard" className="text-green-400 hover:text-green-300">Dashboard</NavLink>
//           )}

//           {!user ? (
//             <Link to="/login">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-6 py-2 rounded-full font-bold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_15px_rgba(0,255,255,0.5)] transition"
//               >
//                 Login
//               </motion.button>
//             </Link>
//           ) : (
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => {
//                 auth.signOut();
//                 setUser(null);
//                 setRole(null);
//               }}
//               className="px-6 py-2 rounded-full font-bold text-white border border-red-500/50 hover:bg-red-500/20 shadow-[0_0_10px_rgba(255,0,0,0.3)] transition"
//             >
//               Logout
//             </motion.button>
//           )}
//         </div>
//       </div>
//     </motion.nav>
//   );
// };

// const NavLink = ({ to, children, className = "" }) => (
//   <Link
//     to={to}
//     className={`block px-4 py-2 text-gray-300 hover:text-cyan-400 transition relative group ${className}`}
//   >
//     {children}
//     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full" />
//   </Link>
// );

// export default Navbar;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo and App Name */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img
            whileHover={{ scale: 1.1, rotate: 5 }}
            src="/vite.PNG"
            alt="Logo"
            className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
          />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 hidden sm:block">
            NEXUS
          </span>
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-sm border border-white/20"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16m-7 6h7" />}
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`${isMenuOpen ? "flex" : "hidden"
            } lg:flex flex-col lg:flex-row lg:items-center lg:space-x-6 absolute lg:static top-16 left-0 w-full lg:w-auto bg-black/90 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-4 lg:p-0 border-b lg:border-none border-white/10 transition-all duration-300 ease-in-out`}
        >
          <NavLink to="/home">Home</NavLink>

          <NavLink to="/datainc">Data Increment</NavLink>

          {isAdmin && (
            <NavLink to="/admin-dashboard" className="text-purple-400 hover:text-purple-300">Admin</NavLink>
          )}

          {user && (
            <NavLink to="/user-dashboard" className="text-green-400 hover:text-green-300">Dashboard</NavLink>
          )}

          {!user ? (
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-full font-bold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_15px_rgba(0,255,255,0.5)] transition"
              >
                Login
              </motion.button>
            </Link>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                auth.signOut();
                setUser(null);
                setRole(null);
              }}
              className="px-6 py-2 rounded-full font-bold text-white border border-red-500/50 hover:bg-red-500/20 shadow-[0_0_10px_rgba(255,0,0,0.3)] transition"
            >
              Logout
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, children, className = "" }) => (
  <Link
    to={to}
    className={`block px-4 py-2 text-gray-300 hover:text-cyan-400 transition relative group ${className}`}
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full" />
  </Link>
);

export default Navbar;



