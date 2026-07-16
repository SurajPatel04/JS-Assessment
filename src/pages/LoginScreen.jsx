import React, { useState } from 'react';
import SignupScreen from './SignupScreen';

function LoginScreen() {
  const [signIn, setSignIn] = useState(false);

  return (
    <div className="loginScreen">
      <div className="loginScreen_background">
        <h1
          className="nav_logo"
          onClick={() => setSignIn(false)}
          style={{ position: 'absolute', margin: 0, left: '20px', top: '20px', cursor: 'pointer' }}
        >
          NETFLIX
        </h1>
        {!signIn && (
          <button
            onClick={() => setSignIn(true)}
            className="loginScreen_button"
            style={{
              position: 'fixed',
              right: '20px',
              top: '20px',
              padding: '10px 20px',
              fontSize: '1rem',
              color: 'white',
              backgroundColor: '#e50914',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            Sign In
          </button>
        )}
        <div className="loginScreen_gradient" />
      </div>

      <div className="loginScreen_body" style={signIn ? { top: '30px' } : {}}>
        {signIn ? (
          <SignupScreen />
        ) : (
          <>
            <h1>Unlimited films, TV programmes and more.</h1>
            <h2>Watch anywhere. Cancel at any time.</h2>
            <h3>
              Ready to watch? Enter your email to create or restart your
              membership.
            </h3>

            <div className="loginScreen_input">
              <form onSubmit={(e) => { e.preventDefault(); setSignIn(true); }}>
                <input type="email" placeholder="Email Address" required />
                <button className="loginScreen_getStarted" type="submit">
                  GET STARTED
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
