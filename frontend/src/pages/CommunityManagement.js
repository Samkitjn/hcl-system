import React, { useEffect, useState, useCallback } from "react";
import "./CommunityManagement.css";

const CommunityManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/management/community"
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
            Review student posts and remove inappropriate or unwanted content.
          </p>
        </div>
      </div>

      <div className="community-management-card">
        <div className="community-management-card-header">
          <h2 className="community-management-card-title">All Posts</h2>
          <span className="community-management-count">{posts.length}</span>
        </div>

        {message && (
          <p className="community-management-message">{message}</p>
        )}

        {loading ? (
          <p className="community-management-empty">Loading data...</p>
        ) : posts.length > 0 ? (
          <div className="community-management-list">
            {posts.map((post) => (
              <div className="community-management-item" key={post.id}>
                <div className="community-management-content">
                  <p className="community-management-main">
                    {post.full_name} ({post.student_id})
                  </p>
                  <p className="community-management-text">
                    {post.content}
                  </p>
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