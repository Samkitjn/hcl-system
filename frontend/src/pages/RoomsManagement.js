import React, { useEffect, useState, useCallback } from "react";
import "./RoomsManagement.css";

const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/management/rooms-list`
      );
      const data = await response.json();

      if (data.success) {
        setRooms(data.rooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="rooms-management-page">
      <div className="rooms-management-hero">
        <div>
          <h1 className="rooms-management-heading">Rooms Management</h1>
          <p className="rooms-management-subtext">
            View all hostel rooms, their capacity, occupancy, and availability status.
          </p>
        </div>
      </div>

      <div className="rooms-management-card">
        <div className="rooms-management-card-header">
          <h2 className="rooms-management-card-title">All Rooms</h2>
          <span className="rooms-management-count">{rooms.length}</span>
        </div>

        {loading ? (
          <p className="rooms-management-empty">Loading data...</p>
        ) : rooms.length > 0 ? (
          <div className="rooms-management-table-wrapper">
            <table className="rooms-management-table">
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
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.room_number}</td>
                    <td>{room.block}</td>
                    <td>{room.capacity}</td>
                    <td>
                      {room.occupied}/{room.capacity}
                    </td>
                    <td>
                      <span
                        className={`room-status-badge ${
                          room.occupied < room.capacity ? "available" : "full"
                        }`}
                      >
                        {room.occupied < room.capacity ? "Available" : "Full"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rooms-management-empty">No records found.</p>
        )}
      </div>
    </div>
  );
};

export default RoomsManagement;