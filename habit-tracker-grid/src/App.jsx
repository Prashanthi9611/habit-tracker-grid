import { useEffect, useState } from "react";

import { supabase } from "./lib/supabase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
        }

        if (mounted) {
          setSession(session);
          setLoading(false);
        }
      } catch (error) {
        console.error("Supabase error:", error);

        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setSession(session);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* Loading screen */
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>

        <h2>Habit Tracker</h2>

        <p>Loading...</p>
      </div>
    );
  }

  /* Logged-in user */
  if (session) {
    return (
      <Dashboard
        session={session}
      />
    );
  }

  /* Signup page */
  if (page === "signup") {
    return (
      <Signup
        onLogin={() => {
          setPage("login");
        }}
      />
    );
  }

  /* Login page */
  return (
    <Login
      onSignup={() => {
        setPage("signup");
      }}
    />
  );
}

export default App;