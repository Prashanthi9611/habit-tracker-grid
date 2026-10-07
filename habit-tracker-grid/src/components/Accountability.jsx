import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

function generateInviteCode() {
  return Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
}

function Accountability({ userId }) {
  const [groups, setGroups] =
    useState([]);

  const [selectedGroup, setSelectedGroup] =
    useState(null);

  const [members, setMembers] =
    useState([]);

  const [groupName, setGroupName] =
    useState("");

  const [inviteCode, setInviteCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const loadGroups = async () => {
    const { data, error } =
      await supabase
        .from("accountability_groups")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(error);
      return;
    }

    setGroups(data || []);

    if (
      data?.length &&
      !selectedGroup
    ) {
      setSelectedGroup(data[0]);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadMembers(
        selectedGroup.id
      );
    }
  }, [selectedGroup]);

  const loadMembers = async (
    groupId
  ) => {
    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("group_members")
      .select(
        `
          user_id,
          profiles (
            id,
            username,
            full_name
          )
        `
      )
      .eq("group_id", groupId);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setMembers(data || []);

    setLoading(false);
  };

  const createGroup = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } =
      await supabase
        .from("accountability_groups")
        .insert({
          name: groupName.trim(),
          invite_code:
            generateInviteCode(),
          owner_id: userId,
        })
        .select()
        .single();

    if (error) {
      setMessage(error.message);
    } else {
      setGroupName("");

      setMessage(
        `Group "${data.name}" created successfully.`
      );

      await loadGroups();

      setSelectedGroup(data);
    }

    setLoading(false);
  };

  const joinGroup = async (e) => {
    e.preventDefault();

    if (!inviteCode.trim()) {
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } =
      await supabase.rpc(
        "join_group_by_code",
        {
          p_invite_code:
            inviteCode.trim(),
        }
      );

    if (error) {
      setMessage(error.message);
    } else if (!data?.success) {
      setMessage(
        data?.message ||
          "Unable to join group."
      );
    } else {
      setInviteCode("");

      setMessage(
        `You joined "${data.group_name}" successfully.`
      );

      await loadGroups();
    }

    setLoading(false);
  };

  return (
    <section className="accountability-section">
      <div className="section-heading">
        <div>
          <span className="section-label">
            SHARED ACCOUNTABILITY
          </span>

          <h2>
            Stay accountable together
          </h2>

          <p>
            Create a group or join your
            friends using an invite code.
          </p>
        </div>
      </div>

      <div className="accountability-forms">
        <form
          className="group-form"
          onSubmit={createGroup}
        >
          <div className="group-icon">
            +
          </div>

          <div>
            <h3>
              Create a group
            </h3>

            <p>
              Start an accountability
              group.
            </p>
          </div>

          <input
            type="text"
            placeholder="Example: Study Squad"
            value={groupName}
            onChange={(e) =>
              setGroupName(
                e.target.value
              )
            }
            maxLength="50"
          />

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            Create Group
          </button>
        </form>

        <form
          className="group-form"
          onSubmit={joinGroup}
        >
          <div className="group-icon">
            →
          </div>

          <div>
            <h3>
              Join a group
            </h3>

            <p>
              Enter the invite code
              shared with you.
            </p>
          </div>

          <input
            type="text"
            placeholder="Enter invite code"
            value={inviteCode}
            onChange={(e) =>
              setInviteCode(
                e.target.value.toUpperCase()
              )
            }
            maxLength="20"
          />

          <button
            type="submit"
            className="secondary-button"
            disabled={loading}
          >
            Join Group
          </button>
        </form>
      </div>

      {message && (
        <div className="info-message">
          {message}
        </div>
      )}

      {groups.length > 0 && (
        <div className="group-area">
          <div className="group-selector">
            <label>
              Your Groups
            </label>

            <select
              value={
                selectedGroup?.id || ""
              }
              onChange={(e) => {
                const group =
                  groups.find(
                    (item) =>
                      item.id ===
                      e.target.value
                  );

                setSelectedGroup(group);
              }}
            >
              {groups.map((group) => (
                <option
                  key={group.id}
                  value={group.id}
                >
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          {selectedGroup && (
            <div className="group-dashboard">
              <div className="group-dashboard-header">
                <div>
                  <span className="section-label">
                    GROUP
                  </span>

                  <h3>
                    {selectedGroup.name}
                  </h3>
                </div>

                <div>
                  <span className="invite-label">
                    INVITE CODE
                  </span>

                  <strong className="invite-code">
                    {
                      selectedGroup.invite_code
                    }
                  </strong>
                </div>
              </div>

              {loading ? (
                <div className="small-loading">
                  Loading members...
                </div>
              ) : (
                <div className="member-grid">
                  {members.map(
                    (member) => {
                      const profile =
                        member.profiles;

                      const name =
                        profile?.full_name ||
                        profile?.username ||
                        "User";

                      return (
                        <div
                          className="member-card"
                          key={
                            member.user_id
                          }
                        >
                          <div className="member-avatar">
                            {name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {name}
                            </strong>

                            <span>
                              @
                              {
                                profile?.username
                              }
                            </span>

                            {member.user_id ===
                              userId && (
                              <small>
                                You
                              </small>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Accountability;