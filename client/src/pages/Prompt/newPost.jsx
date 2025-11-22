import { useState, useEffect } from "react";
import { getPosts, addPost, updatePost, deletePost } from "../services/AdminApi";
import AdminNavBar from "./adminNavbar";

const Posts = () => {
  // Form and data states
  const [posts, setPosts] = useState([]);
  const [pics, setPics] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [typper, setTypper] = useState("");
  const [category, setCategory] = useState("");
  const [volume, setVolume] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);

  // UI states
  const [view, setView] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form values
  const resetForm = () => {
    setPics([]);
    setTypper("");
    setTitle("");
    setDescription("");
    setCategory("");
    setVolume("");
    setEditingId(null);
  };

  // Handle selecting multiple images
  const handleMultipleImages = (index, file) => {
    const newPics = [...pics];
    newPics[index] = file;
    setPics(newPics);
  };

  // Load post data
  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      if (Array.isArray(data)) {
        setPosts(data);
      } else if (data?.data && Array.isArray(data.data)) {
        setPosts(data.data);
      } else {
        setPosts([]);
        setError("Unexpected data format from API");
      }
    } catch (err) {
      setError("Failed to load data from server");
      setPosts([]);
      console.error("Load posts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "list") {
      loadPosts();
    }
  }, [view]);

  // Add or update post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim() || !category.trim() || !typper.trim() || !title.trim()) {
      alert("Please fill all the required fields");
      return;
    }

    // Use FormData for text + files
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("typper", typper.trim());
    formData.append("category", category.trim());

    pics.forEach((file) => {
      if (file) formData.append("pics", file);
    });

    setLoading(true);
    try {
      if (editingId) {
        const updatedPost = await updatePost(editingId, formData);
        setPosts((prev) =>
          prev.map((post) => (post._id === editingId ? updatedPost : post))
        );
        alert("Post updated successfully!");
      } else {
        const newPost = await addPost(formData);
        setPosts((prev) => [newPost, ...prev]);
        alert("Post added successfully!");
      }
      resetForm();
      setView("list");
    } catch (err) {
      alert("Failed to save post data. Please try again.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((post) => post._id !== id));
      alert("Post deleted successfully.");
    } catch (err) {
      alert("Failed to delete post. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEdit = (post) => {
    try {
      // pics from DB are URLs (not files), skip reloading into file inputs
      setPics([]);
      setVolume((post.pics?.length || 0).toString());
      setTitle(post.title || "");
      setDescription(post.description || "");
      setTypper(post.typper || "");
      setCategory(post.category || "");
      setEditingId(post._id);
      setView("form");
    } catch (err) {
      console.error("Start edit error:", err);
      alert("Error loading post data for editing");
    }
  };

  const cancelEdit = () => {
    resetForm();
    setView("list");
  };

  // Handle number of pics
  const handleVolumeChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setVolume(e.target.value);

    const newPics = Array(count).fill(null).map((_, i) => pics[i] || null);
    setPics(newPics);
  };

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-10 bg-blue-50 rounded-3xl shadow-lg mt-20">
      <AdminNavBar />
      <h1 className="bg-blue-700 text-white text-2xl font-bold rounded-t-xl px-8 py-3 mb-4 text-center tracking-wide">
        Posts Manager
      </h1>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => {
            resetForm();
            setView("form");
          }}
          className={`px-6 py-2 font-semibold rounded-xl shadow-md transition ${
            view === "form"
              ? "bg-blue-800 text-white"
              : "bg-white text-blue-700 border border-blue-700 hover:bg-blue-100"
          }`}
          disabled={loading}
        >
          {editingId ? "Edit Post" : "Add Post"}
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-6 py-2 font-semibold rounded-xl shadow-md transition ${
            view === "list"
              ? "bg-blue-800 text-white"
              : "bg-white text-blue-700 border border-blue-700 hover:bg-blue-100"
          }`}
          disabled={loading}
        >
          View Posts
        </button>
      </div>

      {view === "form" && (
        <form onSubmit={handleSubmit} className="space-y-7 max-w-4xl mx-auto">
          <div>
            <label className="block mb-1 font-semibold text-blue-900">
              Number of Pictures
            </label>
            <input
              className="border-blue-300 border rounded-xl p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-base w-full"
              placeholder="Enter number of pics"
              value={volume}
              onChange={handleVolumeChange}
              type="number"
              min="0"
              max="20"
              disabled={loading}
            />
          </div>

          {pics.length > 0 && (
            <div className="space-y-4">
              {pics.map((_, index) => (
                <div key={index}>
                  <label className="block mb-1 font-semibold text-blue-900">
                    Image {index + 1}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMultipleImages(index, e.target.files[0])}
                    className="border-blue-300 border rounded-xl p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-base w-full"
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
          )}

          {[
            {
              label: "Title of the Post *",
              placeholder: "Enter the title of your post",
              value: title,
              onChange: (e) => setTitle(e.target.value),
              rows: 2,
            },
            {
              label: "Description of the Post *",
              placeholder: "Provide detailed description of your post",
              value: description,
              onChange: (e) => setDescription(e.target.value),
              rows: 4,
            },
            {
              label: "Type of Post *",
              placeholder: "e.g., article, daily post, program post, advertisement, etc.",
              value: typper,
              onChange: (e) => setTypper(e.target.value),
              rows: 2,
            },
            {
              label: "Category of the Post *",
              placeholder: "e.g., music, dance, computer, sports, etc.",
              value: category,
              onChange: (e) => setCategory(e.target.value),
              rows: 2,
            },
          ].map(({ label, placeholder, value, onChange, rows }) => (
            <div key={label} className="flex flex-col">
              <label className="block mb-1 font-semibold text-blue-900">
                {label}
              </label>
              <textarea
                className="border-blue-300 border rounded-xl p-3 resize-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-base w-full"
                rows={rows}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                disabled={loading}
              />
            </div>
          ))}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-grow bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-md transition focus:ring-4 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Processing..." : editingId ? "Update Post" : "Create Post"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-xl shadow-md transition disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {view === "list" && (
        <div className="max-w-5xl mx-auto space-y-6">
          {loading && (
            <div className="text-center py-8">
              <p className="text-blue-700 font-semibold">Loading posts...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
              {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-blue-700 font-semibold">No posts found.</p>
              <button
                onClick={() => {
                  resetForm();
                  setView("form");
                }}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Create Your First Post
              </button>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <>
              <div className="text-center mb-4">
                <p className="text-blue-700 font-semibold">
                  Total Posts: {posts.length}
                </p>
              </div>

              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-xl shadow-md p-6 border border-blue-300 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-blue-800 flex-1 mr-4">
                      {post.title}
                    </h2>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => startEdit(post)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p>
                      <strong className="bg-gray-200 p-2 rounded-sm">Description:</strong>
                      <span className="ml-2">{post.description}</span>
                    </p>

                    <p>
                      <strong className="bg-gray-200 p-2 rounded-sm">Type:</strong>
                      <span className="ml-2 bg-blue-100 px-2 py-1 rounded text-blue-800">
                        {post.typper}
                      </span>
                    </p>

                    <p>
                      <strong className="bg-gray-200 p-2 rounded-sm">Category:</strong>
                      <span className="ml-2 bg-green-100 px-2 py-1 rounded text-green-800">
                        {post.category}
                      </span>
                    </p>

                    {post.pics && post.pics.length > 0 && (
                      <div>
                        <strong className="bg-gray-200 p-2 rounded-sm">
                          Images ({post.pics.length}):
                        </strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {post.pics.map((pic, index) => {
                            const imageUrl =
                              typeof pic === "object" ? pic.link : pic;
                            return (
                              <a
                                key={pic._id || index}
                                href={imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                              >
                                Image {index + 1}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;