import { useState } from "react";

import { supabase } from "../lib/supabase";

function Login({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

      if (error) {
        setError(error.message);
        return;
      }

      /*
        App.jsx listens for the Supabase
        authentication change.

        After successful login:
        Login → Dashboard
      */
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to Supabase. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-mark">
            ✓
          </div>

          <div>
            <h1>Habit Tracker</h1>

            <p>
              Shared accountability
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="auth-heading">

          <span className="section-label">
            WELCOME BACK
          </span>

          <h2>
            Sign in to your account
          </h2>

          <p>
            Continue building better habits every day.
          </p>

        </div>

        {/* Login Form */}
        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          {/* Email */}
          <div className="form-field">

            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              disabled={loading}
              required
            />

          </div>

          {/* Password */}
          <div className="form-field">

            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
              disabled={loading}
              required
            />

          </div>

          {/* Error */}
          {error && (
            <div
              className="error-message"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Sign In */}
          <button
            type="submit"
            className="primary-button full-width"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* Create Account */}
        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={onSignup}
            disabled={loading}
          >
            Create account
          </button>

        </div>

      </section>
    </main>
  );
}

export default Login;