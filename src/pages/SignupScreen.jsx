import React, { useRef, useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

function SignupScreen() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const register = (e) => {
    e.preventDefault();

    if (!emailRef.current.value || !passwordRef.current.value || (!isLoginMode && !nameRef.current.value)) {
      alert("Please fill in all fields.");
      return;
    }

    createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((authUser) => {
        updateProfile(authUser.user, {
          displayName: nameRef.current.value
        }).then(() => {
          console.log("Registered with name:", authUser.user.displayName);
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const signIn = (e) => {
    e.preventDefault();

    if (!emailRef.current.value || !passwordRef.current.value) {
      alert("Please enter both email and password.");
      return;
    }

    signInWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((authUser) => {
        console.log("Signed in:", authUser);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="signupScreen">
      <form>
        <h1>{isLoginMode ? "Sign In" : "Sign Up"}</h1>
        
        {!isLoginMode && (
          <input ref={nameRef} placeholder="Full Name" type="text" required />
        )}
        <input ref={emailRef} placeholder="Email" type="email" required />
        <input ref={passwordRef} placeholder="Password" type="password" required />
        
        <button type="submit" onClick={isLoginMode ? signIn : register}>
          {isLoginMode ? "Sign In" : "Sign Up"}
        </button>

        <h4 style={{textAlign: 'left', marginTop: '30px'}}>
          <span className="signupScreen_gray">
            {isLoginMode ? "New to Netflix? " : "Already have an account? "}
          </span>
          <span 
            className="signupScreen_link" 
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? "Sign Up now." : "Sign In now."}
          </span>
        </h4>
      </form>
    </div>
  );
}

export default SignupScreen;
