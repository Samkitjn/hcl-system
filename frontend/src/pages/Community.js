import React, { useEffect, useState, useCallback } from "react";
import "./Community.css";

const Community = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role") || "student";

  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/community/posts");
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setMessage("");

  if (!content.trim()) {
    setMessage("Post content cannot be empty.");
    setSubmitting(false);
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/community/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: user.id,
        content: content.trim(),
      }),
    });

    const data = await response.json();

    if (data.success) {
      setMessage("Post created successfully.");
      setContent("");
      fetchPosts();
    } else {
      setMessage(data.message || "Failed to create post.");
    }
  } catch (error) {
    setMessage("Server error while creating post.");
  } finally {
    setSubmitting(false);
  }
};

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className={`community-page ${role}`}>
      <div className="community-hero">
        <div>
          <h1 className="community-heading">Community</h1>
          <p className="community-subtext">
            Share updates, announcements, and connect with other students in the
            hostel.
          </p>
        </div>
      </div>

      <div className="community-card">
        <h2 className="community-card-title">Create Post</h2>

        <form className="community-form" onSubmit={handleSubmit}>
          <textarea
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            required
          />

          <button
            type="submit"
            className="community-btn"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Post"}
          </button>

          {message && <p className="community-message">{message}</p>}
        </form>
      </div>

      <div className="community-feed">
        <h2 className="community-card-title">Community Feed</h2>

        {loadingPosts ? (
          <p className="community-empty">Loading data...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="community-post">
              <div className="community-post-header">
                <div>
                  <p className="community-author">{post.full_name}</p>
                  <p className="community-student-id">
                    {post.student_id}
                  </p>
                </div>
                <span className="community-date">
                  {post.created_at?.split("T")[0]}
                </span>
              </div>

              <p className="community-content">{post.content}</p>
            </div>
          ))
        ) : (
          <p className="community-empty">No community posts found.</p>
        )}
      </div>
    </div>
  );
};

export default Community;