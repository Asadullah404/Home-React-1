import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log(userCredential.user);
      navigate("/profile"); // Redirect after login
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
      navigate("/profile"); // Redirect after Google sign-in
    } catch (err) {
      console.error(err);
      setError("Failed to sign in with Google.");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="p-6 sm:p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Welcome Back
          </h1>
          <form className="space-y-6" onSubmit={handleEmailLogin}>
            <div>
              <label htmlFor="email" className="block">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </form>

          <div className="text-center">OR</div>

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
