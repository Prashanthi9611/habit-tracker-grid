import { useEffect, useState } from "react";

const defaultForm = {
  name: "",
  description: "",
  color: "#6366f1",
};

function HabitForm({
  onSave,
  editingHabit,
  onCancel,
}) {
  const [form, setForm] =
    useState(defaultForm);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (editingHabit) {
      setForm({
        name: editingHabit.name || "",
        description:
          editingHabit.description || "",
        color:
          editingHabit.color ||
          "#6366f1",
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingHabit]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    setSaving(true);

    const success = await onSave({
      name: form.name.trim(),
      description:
        form.description.trim(),
      color: form.color,
    });

    setSaving(false);

    if (success && !editingHabit) {
      setForm(defaultForm);
    }
  };

  return (
    <section className="habit-form-card">
      <div className="form-section-heading">
        <div>
          <span className="section-label">
            {editingHabit
              ? "UPDATE HABIT"
              : "NEW HABIT"}
          </span>

          <h3>
            {editingHabit
              ? "Edit your habit"
              : "Create a habit"}
          </h3>
        </div>
      </div>

      <form
        className="habit-form"
        onSubmit={handleSubmit}
      >
        <div className="form-field">
          <label>Habit Name *</label>

          <input
            type="text"
            name="name"
            placeholder="Example: Exercise"
            value={form.name}
            onChange={handleChange}
            maxLength="50"
            required
          />
        </div>

        <div className="form-field">
          <label>Description</label>

          <input
            type="text"
            name="description"
            placeholder="Example: Exercise for 30 minutes"
            value={form.description}
            onChange={handleChange}
            maxLength="120"
          />
        </div>

        <div className="form-field color-field">
          <label>Color</label>

          <input
            type="color"
            name="color"
            value={form.color}
            onChange={handleChange}
          />
        </div>

        <div className="habit-form-actions">
          {editingHabit && (
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingHabit
              ? "Update Habit"
              : "Add Habit"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default HabitForm;