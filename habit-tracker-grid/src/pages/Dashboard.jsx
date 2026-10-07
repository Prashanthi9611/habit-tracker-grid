import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import Navbar from "../components/Navbar";
import HabitForm from "../components/HabitForm";
import HabitGrid from "../components/HabitGrid";
import ProgressCard from "../components/ProgressCard";
import Accountability from "../components/Accountability";

function Dashboard({ session }) {
  const user = session.user;

  const [profile, setProfile] =
    useState(null);

  const [habits, setHabits] =
    useState([]);

  const [completions, setCompletions] =
    useState([]);

  const [editingHabit, setEditingHabit] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const loadProfile = async () => {
    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(
        "Profile error:",
        error
      );
      return;
    }

    setProfile(data);
  };

  const loadHabits = async () => {
    const {
      data: habitData,
      error: habitError,
    } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: true,
      });

    if (habitError) {
      console.error(
        "Habit error:",
        habitError
      );

      setMessage(
        habitError.message
      );

      return;
    }

    setHabits(habitData || []);

    if (!habitData?.length) {
      setCompletions([]);
      return;
    }

    const habitIds =
      habitData.map(
        (habit) => habit.id
      );

    const {
      data: completionData,
      error: completionError,
    } = await supabase
      .from("habit_completions")
      .select("*")
      .in("habit_id", habitIds);

    if (completionError) {
      console.error(
        "Completion error:",
        completionError
      );

      setMessage(
        completionError.message
      );

      return;
    }

    setCompletions(
      completionData || []
    );
  };

  const loadDashboard = async () => {
    setLoading(true);

    await Promise.all([
      loadProfile(),
      loadHabits(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleSaveHabit = async (
    habitData
  ) => {
    setMessage("");

    if (editingHabit) {
      const {
        error,
      } = await supabase
        .from("habits")
        .update({
          name: habitData.name,
          description:
            habitData.description,
          color: habitData.color,
        })
        .eq("id", editingHabit.id)
        .eq("user_id", user.id);

      if (error) {
        setMessage(error.message);
        return false;
      }

      setMessage(
        "Habit updated successfully."
      );

      setEditingHabit(null);
    } else {
      const {
        error,
      } = await supabase
        .from("habits")
        .insert({
          user_id: user.id,
          name: habitData.name,
          description:
            habitData.description,
          color: habitData.color,
        });

      if (error) {
        setMessage(error.message);
        return false;
      }

      setMessage(
        "Habit created successfully."
      );
    }

    await loadHabits();

    return true;
  };

  const handleDeleteHabit = async (
    habitId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this habit?"
      );

    if (!confirmed) {
      return;
    }

    setMessage("");

    const {
      error,
    } = await supabase
      .from("habits")
      .delete()
      .eq("id", habitId)
      .eq("user_id", user.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Habit deleted successfully."
    );

    if (
      editingHabit?.id === habitId
    ) {
      setEditingHabit(null);
    }

    await loadHabits();
  };

  const handleToggleCompletion = async (
    habit,
    date,
    completed
  ) => {
    setMessage("");

    if (completed) {
      const {
        error,
      } = await supabase
        .from("habit_completions")
        .delete()
        .eq("habit_id", habit.id)
        .eq(
          "completion_date",
          date
        )
        .eq("user_id", user.id);

      if (error) {
        setMessage(error.message);
        return;
      }
    } else {
      const {
        error,
      } = await supabase
        .from("habit_completions")
        .upsert(
          {
            habit_id: habit.id,
            user_id: user.id,
            completion_date: date,
            completed: true,
          },
          {
            onConflict:
              "habit_id,completion_date",
          }
        );

      if (error) {
        setMessage(error.message);
        return;
      }
    }

    await loadHabits();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>

        <p>
          Loading your dashboard...
        </p>
      </div>
    );
  }

  const displayName =
    profile?.full_name ||
    profile?.username ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <div className="app-shell">
      <Navbar
        profile={profile}
        email={user.email}
      />

      <main className="dashboard">
        <section className="hero-section">
          <div>
            <span className="section-label">
              YOUR DASHBOARD
            </span>

            <h1>
              Good day,{" "}
              {
                displayName.split(
                  " "
                )[0]
              } 👋
            </h1>

            <p>
              Small actions every day create
              big changes over time.
            </p>
          </div>
        </section>

        <ProgressCard
          habits={habits}
          completions={completions}
        />

        <section className="tracker-section">
          <div className="section-heading">
            <div>
              <span className="section-label">
                DAILY TRACKER
              </span>

              <h2>
                My Habit Grid
              </h2>

              <p>
                Track your habits for the
                last seven days.
              </p>
            </div>

            <div className="habit-count">
              {habits.length}{" "}
              {habits.length === 1
                ? "Habit"
                : "Habits"}
            </div>
          </div>

          <HabitForm
            onSave={handleSaveHabit}
            editingHabit={editingHabit}
            onCancel={() =>
              setEditingHabit(null)
            }
          />

          {message && (
            <div className="info-message">
              {message}
            </div>
          )}

          <HabitGrid
            habits={habits}
            completions={completions}
            onToggle={
              handleToggleCompletion
            }
            onEdit={setEditingHabit}
            onDelete={
              handleDeleteHabit
            }
          />
        </section>

        <Accountability
          userId={user.id}
        />
      </main>

      <footer className="footer">
        <strong>
          Habit Tracker Grid
        </strong>

        <span>
          Built with React.js and Supabase
        </span>
      </footer>
    </div>
  );
}

export default Dashboard;