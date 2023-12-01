import React, { useState, useEffect } from "react";
import styles from "./Auth.module.css";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  sendPasswordResetEmail,
  db,
} from "../firebase";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import ULyfeLogo from "../images/ULyfe_final_logo.PNG";


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      if (newUser && newUser.emailVerified) {
        // Check if additional info is already filled
        const userInfo = await getUserInfoFromFirestore(newUser.uid);
        if (userInfo && Object.keys(userInfo).length > 0) {
          navigate("/screens/forum");
        } else {
          navigate("/screens/additional-info");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const getUserInfoFromFirestore = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      console.log(`Fetching data for path: users/${uid}`);

      const userDoc = await getDoc(userRef);
      console.log(userDoc.data());

      if (userDoc.exists()) {
        console.log("Manually fetched data:", userDoc.data());
        const userData = userDoc.data();
        console.log("User data fetched:", userData);
        return userData;
      } else {
        console.error("Manual fetch failed.");
      }

      console.log("No additional info found for user:", uid);
      return null;
    } catch (error) {
      console.error("Error fetching user data: ", error);
      return null;
    }
  };

  const handleAuthAttempt = async (e) => {
    e.preventDefault();

    // Reset status and error messages
    setSuccess(false);
    setError(null);

    // New check to ensure fields aren't blank
    if (!email || !password || (!isLogin && !confirmPassword)) {
      setValidationError(true);
      setError("Please fill in all the required fields.");
      return;
    }
    if (!email.endsWith(".edu")) {
      setValidationError(true);
      setError("Please use a student email");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setValidationError(true);
      setError("Passwords entered do not match!");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess(true);
        setStatusMessage("Login successful!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await sendEmailVerification(userCredential.user);
        setSuccess(true);
        setStatusMessage("Verification email sent. Please check your inbox.");
      }
    } catch (error) {
      console.error("Authentication error:", error.message);

      if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use. Please use a different email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      }else {
        setError("Invalid credentials or user does not exist");
      }
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleForgotPassword = async () => {
    try {
      if (!forgotPasswordEmail) {
        setError("Please provide a valid email address.");
        return;
      }

      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      setSuccess(true);
      setStatusMessage("Password reset email sent. Please check your inbox.");
      setShowForgotPassword(false); // Hide the forgot password form after sending the email
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setError("Invalid email address. Please provide a valid one.");
      } else {
        console.error('Forgot password error:', error);
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles["auth-container"]}>
      <img src={ULyfeLogo} alt="ULyfe Logo" className={styles["auth-logo"]}  />
        {!showForgotPassword ? (
          <>
            {/* <h1 className={styles["login-signup-title"]}>{isLogin ? "Login" : "Signup"}</h1> */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{statusMessage}</p>}
            <form onSubmit={handleAuthAttempt}>
              <div>
                <label className="auth-label">Student email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${styles.inputBox} ${validationError && !email ? styles.error : ""
                    }`}
                />
              </div>
              <div>
                <label className="auth-label">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.inputBox} ${validationError && !password ? styles.error : ""
                    }`}
                />
              </div>

              {isLogin && (
                <label className="auth-label forgot" onClick={handleForgotPasswordClick}>Forgot Password?</label>
              )}

              {!isLogin && (
                <div>
                  <label className="auth-label">Confirm Password:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${styles.inputBox} ${validationError && !confirmPassword ? styles.error : ""
                      }`}
                  />
                </div>
              )}
              <button className={styles.login} onClick={handleAuthAttempt}>
                {isLogin ? "Login" : "Signup"}
              </button>
              <button className={styles.login} onClick={() => setIsLogin(!isLogin)}>
                Switch to {isLogin ? "Signup" : "Login"}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* <h1 className={styles["login-signup-title"]}>Forgot Password</h1> */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{statusMessage}</p>}
            <form>
              <div>
                <label className="auth-label">Student email:</label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className={`${styles.inputBox} ${validationError && !forgotPasswordEmail ? styles.error : ""}`}
                />
              </div>
              <button className={styles.login} onClick={handleForgotPassword}>
                Get Password Reset Email
              </button>
              <button className={styles.login} onClick={() => setShowForgotPassword(false)}>
                Back to Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
