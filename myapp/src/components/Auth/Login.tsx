import React, { useState } from "react";
import { auth, googleProvider } from "../../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Auth/Login.css";

import bgImage from "../../assets/images/login-men-salon.jpg";
import GoogleIcon from "../../assets/svg/GoogleIcon.svg";
import AppleIcon from "../../assets/svg/Apple.svg";
import animatedLogin from "../../assets/videos/Login-Animation.gif";
import { doc, getDoc, getDocs, collection } from "firebase/firestore"; // Firestore'dan veri çekmek için ekledik
import { db } from "../../firebase"; // Firestore veritabanı referansı

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const fromSwitch = location.state?.fromSwitch; // Home bileşeninden gelen state

  // Kullanıcının rolünü kontrol eden fonksiyon
  const checkUserRole = async (email: string) => {
    const usersSnapshot = await getDocs(collection(db, "users")); // Tüm kullanıcı belgelerini al
    let userRole = null;

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.email === email) {
        // Email ile karşılaştır
        userRole = userData.role; // Rolü al
      }
    });

    return userRole; // Kullanıcının rolünü döndür
  };

  // Login with email and password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const role = await checkUserRole(email); // Kullanıcının rolünü kontrol et

      if (fromSwitch && role !== "business") {
        toast.error("You do not have a business account.", {
          position: "top-right",
        });
        return;
      }

      // Rol ve email'i cookie'ye kaydet
      document.cookie = `userRole=${role}; path=/`;
      document.cookie = `userEmail=${email}; path=/`; // Email'i de cookie'ye ekledik
      navigate(role === "business" ? "/mybusiness" : "/"); // Rolüne göre yönlendirme
      toast.success("Login successful!", {
        position: "top-right",
      });
    } catch (err) {
      toast.error(
        "Your email and password are incorrect or you don't have an account, please SIGN UP",
        {
          position: "top-right",
        }
      );
    }
  };

  // Password reset function
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first.", {
        position: "top-right",
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!", {
        position: "top-right",
      });
    } catch (err) {
      toast.error("Failed to send password reset email.", {
        position: "top-right",
      });
    }
  };

  // Login with google
  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const user = auth.currentUser;
      const role = await checkUserRole(user?.email || ""); // Google ile giriş yapan kullanıcının rolünü kontrol et
      document.cookie = `userRole=${role}; path=/`; // Rolü cookie'ye kaydet
      document.cookie = `userEmail=${user?.email}; path=/`; // Email'i de cookie'ye ekledik
      navigate(role === "business" ? "/mybusiness" : "/");
      toast.success("Logged in with Google!", {
        position: "top-right",
      });
    } catch (err) {
      toast.error("Google login failed.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="authenticate_sign_in">
      <div className="login_and_register_section">
        <h2>Welcome Back 👋</h2>
        <div>
          <h3>Sign in</h3>
          <img src={animatedLogin} alt="animate" />
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={handleForgotPassword}>Forgot Password?</span>
            </div>
            <button type="submit">Sign in</button>
          </form>
          <p>OR</p>
          <div>
            <div onClick={handleGoogleSignup} style={{ cursor: "pointer" }}>
              <img src={GoogleIcon} alt="Google Icon" />
              <span>Use Google</span>
            </div>
            <div style={{ cursor: "pointer" }}>
              <img src={AppleIcon} alt="Apple Icon" />
              <span>Use Apple</span>
            </div>
          </div>
          <p>
            You don't have an account? Please <Link to="/signin">Sign up</Link>
          </p>
        </div>
      </div>
      <div className="signup_bg">
        <img src={bgImage} alt="Hair salon background" />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
