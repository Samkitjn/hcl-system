import React, { useEffect, useState, useCallback } from "react";
import "./Students.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchPendingStudents = useCallback(async () => {
    try {
      const response = await fetch(
        '${process.env.REACT_APP_API_URL}/api/management/students/pending'
      );
      const data = await response.json();

      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Error fetching pending students:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApprove = async (id) => {
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/management/students/approve/${id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Student approved successfully.");
        setStudents((prev) => prev.filter((student) => student.id !== id));
      } else {
        setMessage(data.message || "Failed to approve student.");
      }
    } catch (error) {
      setMessage("Server error while approving student.");
    }
  };

  useEffect(() => {
    fetchPendingStudents();
  }, [fetchPendingStudents]);

  return (
    <div className="students-page">
      <div className="students-hero">
        <div>
          <h1 className="students-heading">Student Approvals</h1>
          <p className="students-subtext">
            Review pending student registrations and approve eligible accounts.
          </p>
        </div>
      </div>

      <div className="students-card">
        <div className="students-card-header">
          <h2 className="students-card-title">Pending Students</h2>
          <span className="students-count">{students.length}</span>
        </div>

        {message && <p className="students-message">{message}</p>}

        {loading ? (
          <p className="students-empty">Loading pending students...</p>
        ) : students.length > 0 ? (
          <div className="students-table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Student ID</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.full_name}</td>
                    <td>{student.email}</td>
                    <td>{student.student_id}</td>
                    <td>{student.course}</td>
                    <td>{student.year}</td>
                    <td>
                      <span
                        className={`student-badge ${
                          student.is_preloaded ? "preloaded" : "normal"
                        }`}
                      >
                        {student.is_preloaded ? "Preloaded" : "Registered"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(student.id)}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="students-empty">No pending students found.</p>
        )}
      </div>
    </div>
  );
};

export default Students;