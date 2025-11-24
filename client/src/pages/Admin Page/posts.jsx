import { useState, useEffect } from "react";
import {getPosts, addPost, updatePost, deletePost, getFeedbacks, addFeedback, updateFeedback, deleteFeedback, getTestimonies, addTestimony, updateTestimony, deleteTestimony, getPrograms} from "../services/AdminApi";


const Posts = () => {
  // Form and data states
  const [posts, setPosts] = useState([]);
  const [pics, setPics] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [typper, setTypper] = useState(""); // Fixed: consistent naming
  const [category, setCategory] = useState("");
  const [programOptions, setProgramOptions] = useState([]);
  const [volume, setVolume] = useState("");
  
  // Edit state tracking current editing post id
  const [editingId, setEditingId] = useState(null);

  // UI states
  const [view, setView] = useState("form"); // form or list
  const [activeSection, setActiveSection] = useState("posts"); // posts, testimonies, or feedbacks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const [testimonies, setTestimonies] = useState([]);
const [feedbacks, setFeedbacks] = useState([]);
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
const [studentName, setStudentName] = useState("");
const [studentEmail, setStudentEmail] = useState("");
const [feedbackMessage, setFeedbackMessage] = useState("");
const [rating, setRating] = useState("");


  
  const handleMultipleImages = (index, file) => {
    const newPic = [...pics];
    newPic[index] = file;
    setPics(newPic);
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      handleMultipleImages(index, file);
    }
  };

  // Load post data from server
  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      const testify = await getTestimonies();
      const feedbackData = await getFeedbacks();
      
      // Handle posts data
      if (Array.isArray(data)) {
        setPosts(data);
      } else if (data?.data && Array.isArray(data.data)) {
        setPosts(data.data);
      } else {
        setPosts([]);
      }
      
      // Handle testimonies data
      if (Array.isArray(testify)) {
        setTestimonies(testify);
      } else if (testify?.data && Array.isArray(testify.data)) {
        setTestimonies(testify.data);
      } else {
        setTestimonies([]);
      }
      
      // Handle feedbacks data
      if (Array.isArray(feedbackData)) {
        setFeedbacks(feedbackData);
      } else if (feedbackData?.data && Array.isArray(feedbackData.data)) {
        setFeedbacks(feedbackData.data);
      } else {
        setFeedbacks([]);
      }
      
    } catch (err) {
      setError("Failed to load data from server");
      setPosts([]);
      setTestimonies([]);
      setFeedbacks([]);
      console.error("Load posts error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load posts when switching to list view
  useEffect(() => {
    if (view === "list") {
      loadPosts();
    }
  }, [view]);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const resp = await getPrograms();
        const items = Array.isArray(resp) ? resp : (resp?.data || []);
        setProgramOptions(items.map(p => p.title).filter(Boolean));
      } catch (e) {
        setProgramOptions([]);
      }
    };
    loadPrograms();
  }, []);

  // Add or update post depending on editing state
  
  const resetFormPost = () => {
    setPics([]);
    setTypper("");
    setTitle("");
    setDescription("");
    setCategory("");
    setVolume("");
    setEditingId(null);
  };

const resetFormTestimony = () => {
    setFullName("");
    setEmail("");
    setMessage("");
    setEditingId(null);
  };

const resetFormFeedback = () => {
    setStudentName("");
    setStudentEmail("");
    setFeedbackMessage("");
    setRating("");
    setEditingId(null);
  };

  const handlePostSubmit = (e) => {
      e.preventDefault();
    if (!description.trim() || !category.trim() || !typper.trim() || !title.trim()) {
      alert("Please fill all the required fields");
      return;
    }

    // Create FormData for file uploads
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('typper', typper.trim());
    formData.append('category', category.trim());
    
    // Add files to FormData
    pics.forEach((pic) => {
      if (pic && pic instanceof File) {
        formData.append('pics', pic);
      }
    });

    handleAllSubmit({postsData: formData, updateStructure: updatePost, addStructure: addPost, targetArray: setPosts});
    resetFormPost();
  };
  


 const handleTestimonySubmit = (e) => {

    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      alert("Please fill all the required fields");
      return;
    }

    const postsData = {
      fullName: fullName.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    handleAllSubmit({postsData, updateStructure: updateTestimony, addStructure: addTestimony, targetArray: setTestimonies});
    resetFormTestimony();
  };

const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim() || !feedbackMessage.trim() || !rating.trim()) {
      alert("Please fill all the required fields");
      return;
    }

    const postsData = {
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim(),
      feedbackMessage: feedbackMessage.trim(),
      rating: rating.trim(),
    };

    handleAllSubmit({postsData, updateStructure: updateFeedback, addStructure: addFeedback, targetArray: setFeedbacks});
    resetFormFeedback();
  };



  const handleAllSubmit = async ({postsData, updateStructure, addStructure, targetArray}) => {
    
    setLoading(true);
    try {
      if (editingId) {
        // Update existing
        const updatedResp = await updateStructure(editingId, postsData);
        const updatedItem = updatedResp?.data ?? updatedResp;
        targetArray((prev) => prev.map((item) => (item._id === editingId ? updatedItem : item)));
        alert("Updated successfully!");
      } else {
        // Add new
        const newResp = await addStructure(postsData);
        const newItem = newResp?.data ?? newResp;
        targetArray((prev) => [newItem, ...prev]);
        alert("Added successfully!");
      }
      setView("list");
    } catch (err) {
      alert("Failed to save post data. Please try again.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete functions for different sections
  const handleDeletePost = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this post?'
    );
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

  const handleDeleteTestimony = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this testimony?'
    );
    if (!confirmDelete) return;
    
    setLoading(true);
    try {
      await deleteTestimony(id);
      setTestimonies((prev) => prev.filter((testimony) => testimony._id !== id));
      alert("Testimony deleted successfully.");
    } catch (err) {
      alert("Failed to delete testimony. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this feedback?'
    );
    if (!confirmDelete) return;
    
    setLoading(true);
    try {
      await deleteFeedback(id);
      setFeedbacks((prev) => prev.filter((feedback) => feedback._id !== id));
      alert("Feedback deleted successfully.");
    } catch (err) {
      alert("Failed to delete feedback. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete individual image from post
  const handleDeleteImage = async (postId, imageIndex) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this image?'
    );
    if (!confirmDelete) return;
    
    setLoading(true);
    try {
      // Get the current post
      const currentPost = posts.find(post => post._id === postId);
      if (!currentPost) return;
      
      // Create new pics array without the deleted image
      const updatedPics = currentPost.pics.filter((_, index) => index !== imageIndex);
      
      // Create a simple object with only the pics field for update
      const updateData = {
        pics: updatedPics
      };
      
      // Update the post with only the pics field
      const updatedResp = await updatePost(postId, updateData);
      const updatedPost = updatedResp?.data ?? updatedResp;
      
      // Update the posts state
      setPosts((prev) => prev.map((post) => (post._id === postId ? updatedPost : post)));
      
      alert("Image deleted successfully.");
    } catch (err) {
      alert("Failed to delete image. Please try again.");
      console.error("Delete image error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing functions for different sections
  const startEditPost = (post) => {
    try {
      // For editing, we'll keep the existing pics as they are (already uploaded)
      // The user can add new pics which will replace the old ones
      setPics([]); // Start with empty array for new file uploads
      setVolume("0"); // Start with 0 for new uploads
      setTitle(post.title || "");
      setDescription(post.description || "");
      setTypper(post.typper || "");
      setCategory(post.category || "");
      setEditingId(post._id);
      setActiveSection("posts");
      setView("form");
    } catch (err) {
      console.error("Start edit error:", err);
      alert("Error loading post data for editing");
    }
  };

  const startEditTestimony = (testimony) => {
    try {
      setFullName(testimony.fullName || "");
      setEmail(testimony.email || "");
      setMessage(testimony.message || "");
      setEditingId(testimony._id);
      setActiveSection("testimonies");
      setView("form");
    } catch (err) {
      console.error("Start edit error:", err);
      alert("Error loading testimony data for editing");
    }
  };

  const startEditFeedback = (feedback) => {
    try {
      setStudentName(feedback.studentName || "");
      setStudentEmail(feedback.studentEmail || "");
      setFeedbackMessage(feedback.feedbackMessage || "");
      setRating(feedback.rating || "");
      setEditingId(feedback._id);
      setActiveSection("feedbacks");
      setView("form");
    } catch (err) {
      console.error("Start edit error:", err);
      alert("Error loading feedback data for editing");
    }
  };

  // Cancel editing and reset form
  const cancelEdit = () => {
    if (activeSection === "posts") {
      resetFormPost();
    } else if (activeSection === "testimonies") {
      resetFormTestimony();
    } else if (activeSection === "feedbacks") {
      resetFormFeedback();
    }
    setView("list");
  };

  // Handle volume change and pics array
  const handleVolumeChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setVolume(e.target.value);
    
    // Preserve existing pic values when possible
    const newPics = Array(count).fill("").map((_, index) => pics[index] || "");
    setPics(newPics);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 className="text-white text-3xl font-bold text-center">
            Posts Management
          </h1>
          <p className="text-blue-100 text-center mt-2">
           This contains testimonies,adverts and many more
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => { 
            if (activeSection === "posts") resetFormPost();
            else if (activeSection === "testimonies") resetFormTestimony();
            else if (activeSection === "feedbacks") resetFormFeedback();
            setView("form"); 
          }}
          className={`px-8 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center space-x-2 ${
            view === "form"
              ? "bg-blue-600 text-white transform scale-105"
              : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:shadow-xl"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{editingId ? `Edit ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1, -1)}` : `Add ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1, -1)}`}</span>
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-8 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center space-x-2 ${
            view === "list"
              ? "bg-blue-600 text-white transform scale-105"
              : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:shadow-xl"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>View Data</span>
        </button>
      </div>

      {/* Section Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveSection("posts")}
          className={`px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
            activeSection === "posts"
              ? "bg-green-600 text-white transform scale-105"
              : "bg-white text-green-600 border-2 border-green-600 hover:bg-green-50"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveSection("testimonies")}
          className={`px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
            activeSection === "testimonies"
              ? "bg-purple-600 text-white transform scale-105"
              : "bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50"
          }`}
        >
          Testimonies
        </button>
        <button
          onClick={() => setActiveSection("feedbacks")}
          className={`px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
            activeSection === "feedbacks"
              ? "bg-orange-600 text-white transform scale-105"
              : "bg-white text-orange-600 border-2 border-orange-600 hover:bg-orange-50"
          }`}
        >
          Student Feedbacks
        </button>
      </div>

      {view === "form" && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {activeSection === "posts" && (
            <form onSubmit={handlePostSubmit} className="space-y-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 font-semibold text-gray-700">
                    Number of Pictures
                  </label>
                  <input 
                   className="border border-gray-300 rounded-lg p-3 resize-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-300"
                    placeholder="Enter number of pics"
                    value={volume}
                    onChange={handleVolumeChange}
                    type="number"
                    min="0"
                    max="20"
                    disabled={loading}
                  />
                </div>
              </div>
            
              {pics.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-700">Selected Images ({pics.filter(pic => pic).length})</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const validPics = pics.filter(pic => pic);
                        if (validPics.length > 0) {
                          const imageUrls = validPics.map(pic => 
                            pic instanceof File ? URL.createObjectURL(pic) : pic
                          );
                          const imageWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                          imageWindow.document.write(`
                            <html>
                              <head>
                                <title>Preview Images</title>
                                <style>
                                  body { margin: 0; padding: 20px; background: #f5f5f5; font-family: Arial, sans-serif; }
                                  .image-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
                                  .image-item { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                                  .image-item img { width: 100%; height: 200px; object-fit: cover; }
                                  .header { text-align: center; margin-bottom: 20px; }
                                  .header h1 { color: #333; margin: 0; }
                                </style>
                              </head>
                              <body>
                                <div class="header">
                                  <h1>Preview Images</h1>
                                </div>
                                <div class="image-container">
                                  ${imageUrls.map(url => `
                                    <div class="image-item">
                                      <img src="${url}" alt="Preview Image" />
                                    </div>
                                  `).join('')}
                                </div>
                              </body>
                            </html>
                          `);
                          imageWindow.document.close();
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                    >
                      Preview All →
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pics.map((pic, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <label className="mb-3 block font-semibold text-gray-700">
                          Image {index + 1}
                        </label> 
                        <div className="space-y-3">
                          <input  
                            className="w-full border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-300"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(index, e)}
                            disabled={loading}
                          />
                          {pic && pic instanceof File && (
                            <div className="space-y-2">
                              <div className="relative">
                                <img 
                                  src={URL.createObjectURL(pic)} 
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-48 object-cover rounded-lg border border-gray-300 shadow-sm"
                                />
                                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                                  {index + 1}
                                </div>
                                
                                {/* Action buttons - always visible */}
                                <div className="absolute top-2 left-2 flex space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => window.open(URL.createObjectURL(pic), '_blank')}
                                    className="bg-white text-gray-800 p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                                    title="View Full Size"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newPics = [...pics];
                                      newPics[index] = null;
                                      setPics(newPics);
                                    }}
                                    className="bg-red-600 text-white p-1.5 rounded-full shadow-md hover:bg-red-700 transition-colors duration-200"
                                    title="Remove Image"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Name:</strong> {pic.name}</p>
                                <p><strong>Size:</strong> {(pic.size / 1024 / 1024).toFixed(2)} MB</p>
                                <p><strong>Type:</strong> {pic.type}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            
              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">Title of the Post *</label>
                <textarea
                  className="border border-gray-300 rounded-lg p-3 resize-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-300"
                  rows={2}
                  placeholder="Enter the title of your post"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">Description of the Post *</label>
                <textarea
                  className="border border-gray-300 rounded-lg p-3 resize-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-300"
                  rows={4}
                  placeholder="Provide detailed description of your post"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">Type of Post *</label>
                <select
                  className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-300"
                  value={typper}
                  onChange={(e) => setTypper(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Select type</option>
                  <option value="article">article</option>
                  <option value="advertisement">advertisement</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">Category of the Post *</label>
                <select
                  className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-300"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Select program</option>
                  {programOptions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                    className="flex-grow bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 focus:ring-4 focus:ring-blue-400 transform hover:scale-105 flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : (editingId ? "Update Post" : "Create Post")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {activeSection === "testimonies" && (
            <form onSubmit={handleTestimonySubmit} className="space-y-6 max-w-4xl mx-auto">
              {[
                {
                  label: "Full Name *",
                  placeholder: "Enter the full name",
                  value: fullName,
                  onChange: (e) => setFullName(e.target.value),
                  rows: 1,
                },
                {
                  label: "Email Address *",
                  placeholder: "Enter email address",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  rows: 1,
                },
                {
                  label: "Testimony Message *",
                  placeholder: "Share your testimony",
                  value: message,
                  onChange: (e) => setMessage(e.target.value),
                  rows: 4,
                }
              ].map(({ label, placeholder, value, onChange, rows }) => (
                <div key={label} className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700">{label}</label>
                  {rows === 1 ? (
                    <input
                      className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base transition-all duration-300"
                      placeholder={placeholder}
                      value={value}
                      onChange={onChange}
                      required
                      disabled={loading}
                    />
                  ) : (
                    <textarea
                      className="border border-gray-300 rounded-lg p-3 resize-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base transition-all duration-300"
                      rows={rows}
                      placeholder={placeholder}
                      value={value}
                      onChange={onChange}
                      required
                      disabled={loading}
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-grow bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 focus:ring-4 focus:ring-purple-400 transform hover:scale-105 flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : (editingId ? "Update Testimony" : "Create Testimony")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {activeSection === "feedbacks" && (
            <form onSubmit={handleFeedbackSubmit} className="space-y-6 max-w-4xl mx-auto">
              {[
                {
                  label: "Student Name *",
                  placeholder: "Enter student's full name",
                  value: studentName,
                  onChange: (e) => setStudentName(e.target.value),
                  rows: 1,
                },
                {
                  label: "Student Email *",
                  placeholder: "Enter student's email address",
                  value: studentEmail,
                  onChange: (e) => setStudentEmail(e.target.value),
                  rows: 1,
                },
                {
                  label: "Rating (1-5) *",
                  placeholder: "Enter rating from 1 to 5",
                  value: rating,
                  onChange: (e) => setRating(e.target.value),
                  rows: 1,
                },
                {
                  label: "Feedback Message *",
                  placeholder: "Share your feedback about the program",
                  value: feedbackMessage,
                  onChange: (e) => setFeedbackMessage(e.target.value),
                  rows: 4,
                }
              ].map(({ label, placeholder, value, onChange, rows }) => (
                <div key={label} className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700">{label}</label>
                  {rows === 1 ? (
                    <input
                      className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-300"
                      placeholder={placeholder}
                      value={value}
                      onChange={onChange}
                      required
                      disabled={loading}
                      type={label.includes("Email") ? "email" : label.includes("Rating") ? "number" : "text"}
                      min={label.includes("Rating") ? "1" : undefined}
                      max={label.includes("Rating") ? "5" : undefined}
                    />
                  ) : (
                    <textarea
                      className="border border-gray-300 rounded-lg p-3 resize-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-300"
                      rows={rows}
                      placeholder={placeholder}
                      value={value}
                      onChange={onChange}
                      required
                      disabled={loading}
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-grow bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 focus:ring-4 focus:ring-orange-400 transform hover:scale-105 flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : (editingId ? "Update Feedback" : "Create Feedback")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {view === "list" && (
        <div className="space-y-6">
          {loading && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-600 font-semibold">Loading data...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}
          
          {/* Posts Section */}
          {activeSection === "posts" && (
            <>
              {!loading && !error && posts.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-600 font-semibold text-lg">No posts found</p>
                  <p className="text-gray-500 mt-2">Create your first post to get started</p>
                </div>
              )}

              {!loading && !error && posts.length > 0 && (
                <>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Total Posts: {posts.length}
                    </h3>
                     <p className="text-gray-600">Keep CAC exciting</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-lg">
                            {post.title?.charAt(0) || 'M'}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
                          <p className="text-gray-600 text-sm">{post.category}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditPost(post)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                        <div className="bg-gray-50 rounded-lg p-3">
                          <span className="text-sm font-medium text-gray-600">Type of Post:</span>
                          <p className="text-gray-800 font-medium">{post.typper}</p>
                        </div>
                      </div>
                      
                      {post.description && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <span className="text-sm font-medium text-gray-600">Description:</span>
                          <p className="text-gray-800 mt-1">{post.description}</p>
                        </div>
                      )}
                      
                      {post.pics && post.pics.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600">Supportive Pictures ({post.pics.length})</span>
                            <button
                              onClick={() => {
                                // Create a modal or lightbox for viewing all images
                                const imageUrls = post.pics.map(pic => pic.link);
                                const imageWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                                imageWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>Post Images - ${post.title}</title>
                                      <style>
                                        body { margin: 0; padding: 20px; background: #f5f5f5; font-family: Arial, sans-serif; }
                                        .image-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
                                        .image-item { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                                        .image-item img { width: 100%; height: 200px; object-fit: cover; cursor: pointer; }
                                        .image-item:hover img { transform: scale(1.05); transition: transform 0.3s; }
                                        .header { text-align: center; margin-bottom: 20px; }
                                        .header h1 { color: #333; margin: 0; }
                                        .header p { color: #666; margin: 5px 0 0 0; }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="header">
                                        <h1>${post.title}</h1>
                                        <p>${post.pics.length} images</p>
                                      </div>
                                      <div class="image-container">
                                        ${imageUrls.map(url => `
                                          <div class="image-item">
                                            <img src="${url}" alt="Post Image" onclick="window.open('${url}', '_blank')" />
                                          </div>
                                        `).join('')}
                                      </div>
                                    </body>
                                  </html>
                                `);
                                imageWindow.document.close();
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                            >
                              View All Images →
                            </button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {post.pics.map((pic, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={pic.link}
                                  alt={`Post image ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                  }}
                                />
                                <div 
                                  className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs"
                                  style={{ display: 'none' }}
                                >
                                  Image not found
                                </div>
                                
                                {/* Action buttons - always visible */}
                                <div className="absolute top-2 right-2 flex space-x-1">
                                  <button
                                    onClick={() => window.open(pic.link, '_blank')}
                                    className="bg-white text-gray-800 p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                                    title="View Full Size"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = pic.link;
                                      link.download = `post-image-${index + 1}`;
                                      link.click();
                                    }}
                                    className="bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-200"
                                    title="Download Image"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteImage(post._id, index)}
                                    className="bg-red-600 text-white p-1.5 rounded-full shadow-md hover:bg-red-700 transition-colors duration-200"
                                    title="Delete Image"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                                
                                {/* Image number badge */}
                                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Testimonies Section */}
          {activeSection === "testimonies" && (
            <>
              {!loading && !error && testimonies.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-600 font-semibold text-lg">No testimonies found</p>
                  <p className="text-gray-500 mt-2">Create your first testimony to get started</p>
                </div>
              )}

              {!loading && !error && testimonies.length > 0 && (
                <>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Total Testimonies: {testimonies.length}
                    </h3>
                     <p className="text-gray-600">Share your CAC experience</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   
                {testimonies.map((testimony) => (
                  <div
                    key={testimony._id}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-bold text-lg">
                            {testimony.fullName?.charAt(0) || 'T'}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">{testimony.fullName}</h2>
                          <p className="text-gray-600 text-sm">{testimony.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditTestimony(testimony)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTestimony(testimony._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {testimony.message && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <span className="text-sm font-medium text-gray-600">Testimony:</span>
                          <p className="text-gray-800 mt-1">{testimony.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Feedbacks Section */}
          {activeSection === "feedbacks" && (
            <>
              {!loading && !error && feedbacks.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600 font-semibold text-lg">No feedbacks found</p>
                  <p className="text-gray-500 mt-2">Create your first feedback to get started</p>
                </div>
              )}

              {!loading && !error && feedbacks.length > 0 && (
                <>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Total Feedbacks: {feedbacks.length}
                    </h3>
                     <p className="text-gray-600">Student feedback matters</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback._id}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-lg">
                            {feedback.studentName?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">{feedback.studentName}</h2>
                          <p className="text-gray-600 text-sm">{feedback.studentEmail}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditFeedback(feedback)}
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all duration-300 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteFeedback(feedback._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <span className="text-sm font-medium text-gray-600">Rating:</span>
                          <p className="text-gray-800 font-medium">{feedback.rating}/5</p>
                        </div>
                      </div>
                      
                      {feedback.feedbackMessage && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <span className="text-sm font-medium text-gray-600">Feedback:</span>
                          <p className="text-gray-800 mt-1">{feedback.feedbackMessage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
