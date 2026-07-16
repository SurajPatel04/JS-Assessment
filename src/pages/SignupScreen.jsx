import React, { useRef, useState } from 'react';
import { auth } from '../firebase';
import { useToast } from '../context/ToastContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

function SignupScreen() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return "⚠️ An account with this email already exists. Please sign in instead.";
      case 'auth/invalid-email':
        return "Please enter a valid email address.";
      case 'auth/weak-password':
        return "Password must be at least 6 characters.";
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return "Invalid email or password.";
      case 'auth/network-request-failed':
        return "Network error. Please check your internet connection.";
      default:
        return "Unable to authenticate. Please try again.";
    }
  };

  const register = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!emailRef.current.value || !passwordRef.current.value || !nameRef.current.value || !confirmPasswordRef.current.value) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (passwordRef.current.value.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((authUser) => {
        updateProfile(authUser.user, {
          displayName: nameRef.current.value
        }).then(() => {
          showToast(`✓ Account created successfully!`);
        });
      })
      .catch((error) => {
        setErrorMsg(getErrorMessage(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const signIn = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!emailRef.current.value || !passwordRef.current.value) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    signInWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((authUser) => {
        showToast(`✓ Logged in successfully!`);
      })
      .catch((error) => {
        setErrorMsg(getErrorMessage(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="signupScreen">
      <form>
        <h1>{isLoginMode ? "Sign In" : "Sign Up"}</h1>
        {errorMsg && <p style={{color: '#e50914', marginBottom: '15px', fontSize: '0.9rem'}}>{errorMsg}</p>}
        
        {!isLoginMode && (
          <input ref={nameRef} placeholder="Full Name" type="text" required />
        )}
        <input ref={emailRef} placeholder="Email" type="email" required />
        <input ref={passwordRef} placeholder="Password" type="password" required />
        {!isLoginMode && (
          <input ref={confirmPasswordRef} placeholder="Confirm Password" type="password" required />
        )}
        
        <button type="submit" onClick={isLoginMode ? signIn : register} disabled={isLoading}>
          {isLoading ? (isLoginMode ? "Signing In..." : "Signing Up...") : (isLoginMode ? "Sign In" : "Sign Up")}
        </button>

        <h4 style={{textAlign: 'left', marginTop: '30px'}}>
          <span className="signupScreen_gray">
            {isLoginMode ? "New to Netflix? " : "Already have an account? "}
          </span>
          <span 
            className="signupScreen_link" 
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrorMsg("");
            }}
          >
            {isLoginMode ? "Sign Up now." : "Sign In now."}
          </span>
        </h4>
      </form>
    </div>
  );
}

export default SignupScreen;
