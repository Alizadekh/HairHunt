import React, { useState } from "react";
import { auth, googleProvider } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore import
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Auth/Signin.css";

import bgImage from "../../assets/images/login-men-salon.jpg";
import GoogleIcon from "../../assets/svg/GoogleIcon.svg";
import AppleIcon from "../../assets/svg/Apple.svg";
import animatedLogin from "../../assets/videos/Login-Animation.gif";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // State for email
  const [password, setPassword] = useState<string>(""); // State for password
  const [role, setRole] = useState<string>("client"); // State for user role
  const navigate = useNavigate();

  // Firestore reference
  const db = getFirestore();

  // Function to handle signup with email and password
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role, // Include user role
      });
      navigate("/login");

      toast.success("Signup successful!", {
        position: "top-right",
      });
    } catch (err) {
      toast.error("Failed to sign up. Please check your credentials.", {
        position: "top-right",
      });
    }
  };

  // Function to handle signup with Google
  const handleGoogleSignup = async () => {
    try {
      // Sign in with Google
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role, // Include user role
      });

      toast.success("Signed up with Google!", {
        position: "top-right",
      });
    } catch (err) {
      toast.error("Google signup failed.", {
        position: "top-right",
      });
    }
  };

  return (
    <div>
      <div className="authenticate_sign_in">
        <div className="login_and_register_section">
          <h2>Welcome! Please Sign Up 👋</h2>
          <div>
            <h3>Sign Up</h3>
            <img src={animatedLogin} alt="" />
            <form onSubmit={handleSignup}>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email" // Use email type for validation
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required // Ensure the field is filled
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required // Ensure the field is filled
                />
              </div>
              <div>
                <label htmlFor="role">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Please select your role
                  </option>
                  <option value="client">Client</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <button type="submit">Sign up</button>
            </form>
            <p>OR</p>
            <div>
              <div onClick={handleGoogleSignup}>
                <img src={GoogleIcon} alt="Google Icon" />{" "}
                <span>Use Google</span>
              </div>
              <div>
                <img src={AppleIcon} alt="Apple Icon" /> <span>Use Apple</span>
              </div>
            </div>
            <p>
              You already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
        <div className="signup_bg">
          <img src={bgImage} alt="Hair salon background" />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
