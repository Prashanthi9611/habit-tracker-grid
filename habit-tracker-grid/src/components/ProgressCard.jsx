function ProgressCard({
  habits,
  completions,
}) {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const completedToday =
    habits.filter((habit) =>
      completions.some(
        (completion) =>
          completion.habit_id ===
            habit.id &&
          completion.completion_date ===
            today &&
          completion.completed
      )
    ).length;

  const totalHabits =
    habits.length;

  const todayPercentage =
    totalHabits === 0
      ? 0
      : Math.round(
          (completedToday /
            totalHabits) *
            100
        );

  const lastSevenDays = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setHours(12, 0, 0, 0);

    date.setDate(
      date.getDate() - i
    );

    lastSevenDays.push(
      date
        .toISOString()
        .split("T")[0]
    );
  }

  let weeklyCompleted = 0;

  lastSevenDays.forEach(
    (date) => {
      habits.forEach((habit) => {
        const completed =
          completions.some(
            (completion) =>
              completion.habit_id ===
                habit.id &&
              completion.completion_date ===
                date &&
              completion.completed
          );

        if (completed) {
          weeklyCompleted++;
        }
      });
    }
  );

  const weeklyPossible =
    habits.length * 7;

  const weeklyPercentage =
    weeklyPossible === 0
      ? 0
      : Math.round(
          (weeklyCompleted /
            weeklyPossible) *
            100
        );

  return (
    <section className="progress-section">
      <div className="progress-header">
        <div>
          <span className="section-label">
            YOUR PROGRESS
          </span>

          <h2>Keep going!</h2>

          <p>
            Consistency is built one day
            at a time.
          </p>
        </div>

        <div className="progress-score">
          {todayPercentage}%
        </div>
      </div>

      <div className="progress-content">
        <div className="progress-stat">
          <span>
            Today's completion
          </span>

          <strong>
            {completedToday}/
            {totalHabits}
          </strong>
        </div>

        <div className="progress-stat">
          <span>
            7-day completion
          </span>

          <strong>
            {weeklyPercentage}%
          </strong>
        </div>

        <div className="progress-bar-wrapper">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${weeklyPercentage}%`,
              }}
            ></div>
          </div>

          <span>
            {weeklyCompleted} completed
            check-ins this week
          </span>
        </div>
      </div>
    </section>
  );
}

export default ProgressCard;