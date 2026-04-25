import React, { useEffect, useState, useCallback } from "react";
import "./CommunityManagement.css";

const CommunityManagement = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(
        "https://hcl-system.onrender.com/api/management/community"
      );
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching community posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    if (!content.trim()) {
      setMessage("Announcement content cannot be empty.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        "https://hcl-system.onrender.com/api/management/community/announcement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            management_name: user?.full_name || "Management",
            content: content.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Announcement posted successfully.");
        setContent("");
        fetchPosts();
      } else {
        setMessage(data.message || "Failed to post announcement.");
      }
    } catch (error) {
      setMessage("Failed to post announcement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/management/community/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Post deleted successfully.");
        setPosts((prev) => prev.filter((post) => post.id !== id));
      } else {
        setMessage(data.message || "Failed to delete post.");
      }
    } catch (error) {
      setMessage("Failed to delete post.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="community-management-page">
      <div className="community-management-hero">
        <div>
          <h1 className="community-management-heading">Community Management</h1>
          <p className="community-management-subtext">
            Post official announcements, review community activity, and remove unwanted content.
          </p>
        </div>
      </div>

      <div className="community-management-card">
        <h2 className="community-management-card-title">Post Announcement</h2>

        <form className="community-management-form" onSubmit={handleAnnouncementSubmit}>
          <textarea
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write an official announcement..."
            required
          />

          <button
            type="submit"
            className="community-announcement-btn"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Post Announcement"}
          </button>
        </form>
      </div>

      <div className="community-management-card">
        <div className="community-management-card-header">
          <h2 className="community-management-card-title">All Posts</h2>
          <span className="community-management-count">{posts.length}</span>
        </div>

        {message && <p className="community-management-message">{message}</p>}

        {loading ? (
          <p className="community-management-empty">Loading data...</p>
        ) : posts.length > 0 ? (
          <div className="community-management-list">
            {posts.map((post) => (
              <div
                className={`community-management-item ${
                  post.posted_by_role === "management" ? "announcement" : ""
                }`}
                key={post.id}
              >
                <div className="community-management-content">
                  <p className="community-management-main">
                    {post.posted_by_name}
                    {post.posted_by_role === "management" && " • Announcement"}
                    {post.posted_by_role === "student" && post.student_id
                      ? ` (${post.student_id})`
                      : ""}
                  </p>
                  <p className="community-management-text">{post.content}</p>
                </div>

                <button
                  className="community-delete-btn"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="community-management-empty">No records found.</p>
        )}
      </div>
    </div>
  );
};

export default CommunityManagement;