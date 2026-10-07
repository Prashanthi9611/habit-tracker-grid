import { useState } from "react";

import { supabase } from "../lib/supabase";

function Signup({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim();

    /* Validation */
    if (!cleanEmail || !password || !confirmPassword) {
      setError(
        "Please fill in all the fields."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error: signupError,
      } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
      });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      /*
        If email confirmation is enabled
        in Supabase, the user must confirm
        their email before logging in.
      */

      if (data?.user && !data?.session) {
        setSuccess(
          "Account created successfully! Please check your email to confirm your account, then sign in."
        );
      } else {
        setSuccess(
          "Account created successfully! You can now sign in."
        );
      }

      /* Clear form */
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      setError(
        "Unable to create your account. Please try again."
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
            GET STARTED
          </span>

          <h2>
            Create your account
          </h2>

          <p>
            Start building better habits today.
          </p>

        </div>

        {/* Signup Form */}
        <form
          className="auth-form"
          onSubmit={handleSignup}
        >

          {/* Email */}
          <div className="form-field">

            <label htmlFor="signup-email">
              Email
            </label>

            <input
              id="signup-email"
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

            <label htmlFor="signup-password">
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              value={password}
              placeholder="Create a password"
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="new-password"
              disabled={loading}
              required
            />

          </div>

          {/* Confirm Password */}
          <div className="form-field">

            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              placeholder="Confirm your password"
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              autoComplete="new-password"
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

          {/* Success */}
          {success && (
            <div
              className="success-message"
              role="status"
            >
              {success}
            </div>
          )}

          {/* Create Account */}
          <button
            type="submit"
            className="primary-button full-width"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>

        {/* Back to Login */}
        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={onLogin}
            disabled={loading}
          >
            Sign In
          </button>

        </div>

      </section>
    </main>
  );
}

export default Signup;