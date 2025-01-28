import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore

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
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="p-6 sm:p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Welcome Back
          </h1>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google Logo"
              className="h-5 w-5 mr-2"
            />
            Sign in with Google
          </button>

          <p className="text-sm text-center">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
