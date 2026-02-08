import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { GlassCard, NeonButton } from "../components/FuturisticUI";

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
    <section className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-8">
          Create Your Account
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-gray-300 mb-2">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-center font-bold">{error}</p>}

          <NeonButton
            type="submit"
            className="w-full"
          >
            Create Account
          </NeonButton>
        </form>

        <div className="text-center text-gray-400 my-4">OR</div>

        <NeonButton
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-3 !border-red-500 hover:!bg-red-500/20 !shadow-[0_0_15px_rgba(255,0,0,0.4)]"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google Logo"
            className="h-6 w-6"
          />
          Sign up with Google
        </NeonButton>

        <p className="text-sm text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </GlassCard>
    </section>
  );
};

export default Signup;
