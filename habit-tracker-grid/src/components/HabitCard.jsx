function HabitCard({
  habit,
  dates,
  completions,
  onToggle,
  onEdit,
  onDelete,
}) {
  const isCompleted = (date) => {
    return completions.some(
      (completion) =>
        completion.habit_id === habit.id &&
        completion.completion_date === date &&
        completion.completed
    );
  };

  return (
    <div className="habit-row">
      <div className="habit-name-cell">
        <span
          className="habit-color"
          style={{
            backgroundColor: habit.color,
          }}
        ></span>

        <div>
          <strong>{habit.name}</strong>

          {habit.description && (
            <small>
              {habit.description}
            </small>
          )}
        </div>
      </div>

      {dates.map((date) => {
        const completed =
          isCompleted(date);

        return (
          <div
            className="habit-day-cell"
            key={date}
          >
            <button
              type="button"
              className={`completion-checkbox ${
                completed
                  ? "completed"
                  : ""
              }`}
              onClick={() =>
                onToggle(
                  habit,
                  date,
                  completed
                )
              }
              aria-label={
                completed
                  ? `Mark ${habit.name} incomplete`
                  : `Mark ${habit.name} complete`
              }
            >
              {completed && "✓"}
            </button>
          </div>
        );
      })}

      <div className="habit-actions-cell">
        <button
          type="button"
          className="icon-button edit"
          onClick={() =>
            onEdit(habit)
          }
        >
          Edit
        </button>

        <button
          type="button"
          className="icon-button delete"
          onClick={() =>
            onDelete(habit.id)
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default HabitCard;