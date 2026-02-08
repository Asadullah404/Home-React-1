import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { GlassCard, NeonButton } from "../components/FuturisticUI";
import { motion } from "framer-motion";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Save user data to Firestore with role
  const saveUserDataToFirestore = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid); // users collection where document ID is the user's UID

      // Check if the user already exists to avoid overwriting the role
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // If the user doesn't exist, assign a new role (e.g., "user")
        await setDoc(userRef, {
          email: user.email,
          uid: user.uid,
          role: "user", // Assign default role for new users
        });
        console.log("New user data saved to Firestore with role");
      } else {
        console.log("User already exists, role will not change");
      }

      // After saving user data, fetch the role
      navigateToDashboard(user); // Navigate based on role

    } catch (error) {
      console.error("Error saving user data to Firestore", error);
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log(user);
      await saveUserDataToFirestore(user); // Save user data to Firestore
    } catch (err) {
      console.error(err);
      setError("Failed to sign in with Google.");
    }
  };

  // Navigate to the correct dashboard based on role
  const navigateToDashboard = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userRole = userDoc.data().role;
      if (userRole === "admin") {
        navigate("/admin-dashboard"); // Redirect to admin dashboard if role is admin
      } else {
        navigate("/user-dashboard"); // Redirect to user dashboard if role is user
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md">
        <div className="p-6 sm:p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-8">
            Welcome Back
          </h1>

          {error && <p className="text-red-500 text-center font-bold">{error}</p>}

          <NeonButton
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 !border-red-500 hover:!bg-red-500/20 !shadow-[0_0_15px_rgba(255,0,0,0.4)]"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google Logo"
              className="h-6 w-6"
            />
            Sign in with Google
          </NeonButton>

          <p className="text-sm text-center text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </GlassCard>
    </section>
  );
};

export default Login;
