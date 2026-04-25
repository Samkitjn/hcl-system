import React, { useEffect, useState } from "react";
import "./Room.css";

const Room = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role") || "student";

  const [myRoom, setMyRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [preferredBlock, setPreferredBlock] = useState("");
  const [preferredCapacity, setPreferredCapacity] = useState("");
  const [message, setMessage] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const fetchMyRoom = async () => {
    try {
      const response = await fetch(
        `https://hcl-system.onrender.com/api/room/my-room/${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setMyRoom(data.room);
      }
    } catch (error) {
      console.error("Error fetching my room:", error);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch("https://hcl-system.onrender.com/api/room/available");
      const data = await response.json();

      if (data.success) {
        setAvailableRooms(data.rooms);
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handlePreferenceSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("https://hcl-system.onrender.com/api/room/preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: user.id,
          preferred_block: preferredBlock,
          preferred_capacity: Number(preferredCapacity),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Preference submitted successfully.");
        setPreferredBlock("");
        setPreferredCapacity("");
      } else {
        setMessage(data.message || "Failed to submit preference.");
      }
    } catch (error) {
      setMessage("Server error while submitting preference.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMyRoom();
      fetchAvailableRooms();
    }
  }, [user?.id]);

  return (
    <div className={`room-page ${role}`}>
      <div className="room-hero">
        <div>
          <h1 className="room-heading">Room Management</h1>
          <p className="room-subtext">
            View your current room details, check available rooms, and submit
            your room preference.
          </p>
        </div>
      </div>

      <div className="room-grid">
        <div className="room-card">
          <h2 className="room-card-title">Current Room</h2>

          {myRoom ? (
            <div className="room-info-list">
              <div className="room-info-item">
                <span>Room Number</span>
                <strong>{myRoom.room_number}</strong>
              </div>
              <div className="room-info-item">
                <span>Block</span>
                <strong>{myRoom.block}</strong>
              </div>
              <div className="room-info-item">
                <span>Capacity</span>
                <strong>{myRoom.capacity}</strong>
              </div>
            </div>
          ) : (
            <p className="room-empty">No room allocated yet.</p>
          )}
        </div>

        <div className="room-card">
          <h2 className="room-card-title">Submit Preference</h2>

          <form className="room-form" onSubmit={handlePreferenceSubmit}>
            <div className="room-form-group">
              <label>Preferred Block</label>
              <input
                type="text"
                value={preferredBlock}
                onChange={(e) => setPreferredBlock(e.target.value)}
                placeholder="Enter block"
                required
              />
            </div>

            <div className="room-form-group">
              <label>Preferred Capacity</label>
              <input
                type="number"
                value={preferredCapacity}
                onChange={(e) => setPreferredCapacity(e.target.value)}
                placeholder="Enter capacity"
                required
              />
            </div>

            <button type="submit" className="room-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Preference"}
            </button>

            {message && <p className="room-message">{message}</p>}
          </form>
        </div>
      </div>

      <div className="room-card room-table-card">
        <div className="room-table-header">
          <h2 className="room-card-title">Available Rooms</h2>
        </div>

        {loadingRooms ? (
          <p className="room-empty">Loading rooms...</p>
        ) : availableRooms.length > 0 ? (
          <div className="room-table-wrapper">
            <table className="room-table">
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Block</th>
                  <th>Capacity</th>
                  <th>Occupied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {availableRooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.room_number}</td>
                    <td>{room.block}</td>
                    <td>{room.capacity}</td>
                    <td>
                      {room.occupied}/{room.capacity}
                    </td>
                    <td>
                      <span className="room-status">Available</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="room-empty">No available rooms found.</p>
        )}
      </div>
    </div>
  );
};

export default Room;