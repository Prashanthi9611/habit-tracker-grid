import { supabase } from "../lib/supabase";

function Navbar({ profile, email }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const displayName =
    profile?.full_name ||
    profile?.username ||
    email?.split("@")[0] ||
    "User";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="logo-mark small-logo">
            ✓
          </div>

          <div>
            <strong>
              Habit Tracker
            </strong>

            <span>
              Shared Accountability
            </span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="navbar-user">
            <div className="avatar">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="user-text">
              <strong>
                {displayName}
              </strong>

              <span>{email}</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;