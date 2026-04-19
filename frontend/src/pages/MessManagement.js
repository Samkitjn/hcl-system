import React, { useEffect, useState, useCallback } from "react";
import "./MessManagement.css";

const MessManagement = () => {
  const [menu, setMenu] = useState([]);
  const [charges, setCharges] = useState([]);
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("unpaid");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        "${process.env.REACT_APP_API_URL}/api/management/mess"
      );
      const data = await response.json();

      if (data.success) {
        setMenu(data.menu);
        setCharges(data.charges);
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Error fetching mess data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "${process.env.REACT_APP_API_URL}/api/management/mess/charge",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: studentId,
            amount,
            month,
            status,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Mess charge added successfully.");
        setStudentId("");
        setAmount("");
        setMonth("");
        setStatus("unpaid");
        fetchData();
      } else {
        setMessage(data.message || "Failed to add charge.");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="mess-management-page">
      <div className="mess-management-hero">
        <h1>Mess Management</h1>
        <p>Manage mess menu and student charges.</p>
      </div>

      {/* Add Charge */}
      <div className="mess-card">
        <h2>Add Mess Charge</h2>

        <form className="mess-form" onSubmit={handleSubmit}>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name} ({s.student_id})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Month (e.g., May)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <button type="submit">Add Charge</button>
        </form>

        {message && <p className="mess-message">{message}</p>}
      </div>

      {/* Charges */}
      <div className="mess-card">
        <h2>Mess Charges</h2>

        {loading ? (
          <p>Loading data...</p>
        ) : charges.length > 0 ? (
          <table className="mess-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {charges.map((c) => (
                <tr key={c.id}>
                  <td>{c.full_name}</td>
                  <td>{c.student_id}</td>
                  <td>{c.month}</td>
                  <td>₹{c.amount}</td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No records found.</p>
        )}
      </div>

      {/* Menu */}
      <div className="mess-card">
        <h2>Mess Menu</h2>

        {menu.length > 0 ? (
          <table className="mess-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Meal</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((m) => (
                <tr key={m.id}>
                  <td>{m.day}</td>
                  <td>{m.meal_type}</td>
                  <td>{m.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No records found.</p>
        )}
      </div>
    </div>
  );
};

export default MessManagement;