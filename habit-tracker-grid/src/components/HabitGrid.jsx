import HabitCard from "./HabitCard";

function getLastSevenDays() {
  const dates = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setHours(12, 0, 0, 0);

    date.setDate(
      date.getDate() - i
    );

    dates.push(
      date.toISOString().split("T")[0]
    );
  }

  return dates;
}

function formatDate(dateString) {
  const date = new Date(
    `${dateString}T12:00:00`
  );

  return {
    weekday: date.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
      }
    ),

    day: date.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
      }
    ),

    month: date.toLocaleDateString(
      "en-US",
      {
        month: "short",
      }
    ),
  };
}

function HabitGrid({
  habits,
  completions,
  onToggle,
  onEdit,
  onDelete,
}) {
  const dates =
    getLastSevenDays();

  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          ✓
        </div>

        <h3>
          No habits yet
        </h3>

        <p>
          Create your first habit above
          and start tracking your progress.
        </p>
      </div>
    );
  }

  return (
    <section className="grid-card">
      <div className="habit-grid-scroll">
        <div className="habit-grid">
          <div className="grid-header habit-title-header">
            Habit
          </div>

          {dates.map((date) => {
            const formatted =
              formatDate(date);

            return (
              <div
                className="grid-header date-header"
                key={date}
              >
                <span>
                  {formatted.weekday}
                </span>

                <strong>
                  {formatted.day}
                </strong>

                <small>
                  {formatted.month}
                </small>
              </div>
            );
          })}

          <div className="grid-header actions-header">
            Actions
          </div>

          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              dates={dates}
              completions={completions}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HabitGrid;