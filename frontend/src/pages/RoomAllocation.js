import React, { useEffect, useState, useCallback } from "react";
import "./RoomAllocation.css";

const RoomAllocation = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [message, setMessage] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  
  const fetchAllocationData = useCallback(async () => {
    try {
      const [studentsRes, roomsRes] = await Promise.all([
        fetch("http://localhost:5000/api/management/rooms/students"),
        fetch("http://localhost:5000/api/management/rooms/rooms"),
      ]);

      const studentsData = await studentsRes.json();
      const roomsData = await roomsRes.json();

      if (studentsData.success) {
        setStudents(studentsData.students);
      }

      if (roomsData.success) {
        setRooms(roomsData.rooms);
      }
    } catch (error) {
      console.error("Error fetching allocation data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAllocate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedStudent || !selectedRoom) {
      setMessage("Please select both student and room.");
      return;
    }

    setAllocating(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/management/rooms/allocate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: Number(selectedStudent),
            room_id: Number(selectedRoom),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Room allocated successfully.");
        setSelectedStudent("");
        setSelectedRoom("");
        fetchAllocationData();
      } else {
        setMessage(data.message || "Failed to allocate room.");
      }
    } catch (error) {
      setMessage("Failed to allocate room.");
    } finally {
      setAllocating(false);
    }
  };

  useEffect(() => {
    fetchAllocationData();
  }, [fetchAllocationData]);

  const unallocatedStudents = students.filter((student) => !student.room_id);
  const availableRooms = rooms.filter((room) => room.occupied < room.capacity);

  return (
    <div className="room-allocation-page">
      <div className="room-allocation-hero">
        <div>
          <h1 className="room-allocation-heading">Room Allocation</h1>
          <p className="room-allocation-subtext">
            Assign available rooms to approved students and manage hostel room occupancy.
          </p>
        </div>
      </div>

      <div className="room-allocation-grid">
        <div className="room-allocation-card">
          <h2 className="room-allocation-card-title">Allocate Room</h2>

          <form className="room-allocation-form" onSubmit={handleAllocate}>
            <div className="room-allocation-form-group">
              <label>Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
              >
                <option value="">Choose student</option>
                {unallocatedStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} ({student.student_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="room-allocation-form-group">
              <label>Select Room</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required
              >
                <option value="">Choose room</option>
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.room_number} - Block {room.block} ({room.occupied}/{room.capacity})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="allocate-btn"
              disabled={allocating}
            >
              {allocating ? "Allocating..." : "Allocate Room"}
            </button>

            {message && <p className="room-allocation-message">{message}</p>}
          </form>
        </div>

        <div className="room-allocation-card">
          <h2 className="room-allocation-card-title">Summary</h2>

          <div className="room-allocation-summary-list">
            <div className="room-allocation-summary-item">
              <span>Approved Students</span>
              <strong>{students.length}</strong>
            </div>
            <div className="room-allocation-summary-item">
              <span>Unallocated Students</span>
              <strong>{unallocatedStudents.length}</strong>
            </div>
            <div className="room-allocation-summary-item">
              <span>Total Rooms</span>
              <strong>{rooms.length}</strong>
            </div>
            <div className="room-allocation-summary-item">
              <span>Available Rooms</span>
              <strong>{availableRooms.length}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="room-allocation-card room-allocation-table-card">
        <div className="room-allocation-table-header">
          <h2 className="room-allocation-card-title">Approved Students</h2>
        </div>

        {loading ? (
          <p className="room-allocation-empty">Loading students...</p>
        ) : students.length > 0 ? (
          <div className="room-allocation-table-wrapper">
            <table className="room-allocation-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Allocation Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.full_name}</td>
                    <td>{student.student_id}</td>
                    <td>{student.course}</td>
                    <td>{student.year}</td>
                    <td>
                      <span
                        className={`allocation-status ${
                          student.room_id ? "allocated" : "pending"
                        }`}
                      >
                        {student.room_id ? "Allocated" : "Not Allocated"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="room-allocation-empty">No approved students found.</p>
        )}
      </div>

      <div className="room-allocation-card room-allocation-table-card">
        <div className="room-allocation-table-header">
          <h2 className="room-allocation-card-title">Room Availability</h2>
        </div>

        {loading ? (
          <p className="room-allocation-empty">Loading rooms...</p>
        ) : rooms.length > 0 ? (
          <div className="room-allocation-table-wrapper">
            <table className="room-allocation-table">
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
                        className={`allocation-status ${
                          room.occupied < room.capacity ? "allocated" : "full"
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
          <p className="room-allocation-empty">No rooms found.</p>
        )}
      </div>
    </div>
  );
};

export default RoomAllocation;