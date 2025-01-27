import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log(userCredential.user);
      navigate("/login"); // Redirect to login
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
      navigate("/profile"); // Redirect to profile
    } catch (err) {
      console.error(err);
      setError("Failed to sign up with Google.");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="p-6 sm:p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Create Your Account
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2"
              />
            </div>
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
            <div>
              <label htmlFor="confirmPassword" className="block">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
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
              Create Account
            </button>
          </form>

          <div className="text-center">OR</div>

          <button
            onClick={handleGoogleSignUp}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google Logo"
              className="h-5 w-5 mr-2"
            />
            Sign up with Google
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
