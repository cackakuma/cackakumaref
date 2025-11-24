import { useState, useEffect } from "react";
import {getMembers, addMember, updateMember, deleteMember} from "../services/AdminApi";

const Members = () => {
  // Form and data states
  const [members, setMembers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [logo, setLogo] = useState([]);
  const [typer, setTyper] = useState("");
  const [bio, setBio] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");

  // Edit state tracking current editing member id
  const [editingId, setEditingId] = useState(null);

  // UI states
  const [view, setView] = useState("form"); // form or list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form values
  const resetForm = () => {
    setFullName("");
    setLogo([]);
    setTyper("");
    setBio("");
    setPosition("");
    setEditingId(null);
    setEmail("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo([file]); // Store as array with single file
    }
  };
  
  
  useEffect(() => {
    loadMembers();
  }, []);
  

  // Load member data from server
  const loadMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMembers();
      if (Array.isArray(data)) setMembers(data);
      else if (data?.data && Array.isArray(data.data)) setMembers(data.data);
      else {
        setMembers([]);
        setError("Unexpected data format from API");
      }
    } catch (err) {
      setError("Failed to load data from server");
      setMembers([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load memberanisations when switching to list view
  
  //load members when switching to view
  useEffect(() => {
    if (view === "list") {
      loadMembers();
    }
  }, [view]);

  // Add or update memberanisation depending on editing state
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!fullName.trim() || !typer.trim() || !bio.trim() || !position.trim() ||  !email.trim()) {
      alert("Please fill all the blanks");
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName.trim());
    formData.append('typer', typer.trim());
    formData.append('bio', bio.trim());
    formData.append('position', position.trim());
    formData.append('email', email.trim());
   
    // Handle logo array - append each file 
    if (logo && logo.length > 0) {
      logo.forEach((file) => {
        if (file instanceof File) {
          formData.append('logo', file);
        }
      });
    }

    try {
      if (editingId) {
        // Update existing member
        const updatedmember = await updateMember(editingId, formData);
        setMembers((prev) =>
          prev.map((member) => (member._id === editingId ? updatedmember : member))
        );
        alert("member updated successfully!");
      } else {
        // Add new member
        const newMember = await addMember(formData);
        setMembers((prev) => [newMember, ...prev]);
        alert("member added successfully!");
      }
      resetForm();
      setView("list");
    } catch (err) {
      alert("Failed to save member data. Please try again.");
      console.error(err);
    
      
    }
  };
 
  // Delete memberanisation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete the details of the member?'
    );
    if (!confirmDelete) return;
    
    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((member) => member._id !== id));
      alert("member deleted successfully.");
    } catch (err) {
      alert("Failed to delete member. Please try again.");
      console.error(err);
    }
  };

  // Start editing form with selected memberanisation data
  const startEdit = (member) => {
    setFullName(member.fullName || "");
    setLogo(member.logo || []);
    setTyper(member.typer || "");
    setBio(member.bio || "");
    setPosition(member.position || "");
    setEmail(member.email || "");
    setEditingId(member._id);
    setView("form");
  };

  // Cancel editing and reset form
  const cancelEdit = () => {
    resetForm();
    setView("list");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 className="text-white text-3xl font-bold text-center">
            Members Management
          </h1>
          <p className="text-blue-100 text-center mt-2">
            Manage CAC members and their information
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => { resetForm(); setView("form"); }}
          className={`px-8 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center space-x-2 ${
            view === "form"
              ? "bg-blue-600 text-white transform scale-105"
              : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:shadow-xl"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{editingId ? "Edit Member" : "Add Member"}</span>
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
          <span>View Members</span>
        </button>
      </div>

      {view === "form" && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Official Name of the Member",
                  placeholder: "Enter the Official Name without any errors",
                  value: fullName,
                  onChange: (e) => setFullName(e.target.value),
                  rows: 2,
                },
                {
                  label: "Email Address",
                  placeholder: "Enter email address",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  rows: 2,
                },
                {
                  label: "Position in CAC",
                  placeholder: "Set the member's position",
                  value: position,
                  onChange: (e) => setPosition(e.target.value),
                  rows: 2,
                }
              ].map(({ label, placeholder, value, onChange, rows }) => (
                <div key={label} className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700">{label}</label>
                  <textarea
                    className="border border-gray-300 rounded-lg p-3 resize-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-300"
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                  />
                </div>
              ))}
            </div>

                <div className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">Type of Membership</label>
                  <select className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-300" 
                  value={typer} 
                  onChange={(e) => setTyper(e.target.value)}>
                    <option value="">Select Membership Type</option>
                    <option value="Executive">Executive</option>
                    <option value="Program Facilitator">Program Facilitator</option>
                  </select>
                
              </div>
              
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">Membership Bio</label>
                <textarea
                  className="border border-gray-300 rounded-lg p-3 resize-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-300"
                  rows={3}
                  placeholder="Bio of the member in depth"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Profile Picture</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-300"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            {logo && logo.length > 0 && logo[0] instanceof File && (
              <div className="mt-4">
                <img 
                  src={URL.createObjectURL(logo[0])} 
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg border border-gray-300 shadow-sm"
                />
              </div>
            )}
          </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-grow bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 focus:ring-4 focus:ring-blue-400 transform hover:scale-105"
              >
                {editingId ? "Update Member" : "Add Member"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {view === "list" && (
        <div className="space-y-6">
          {loading && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-600 font-semibold">Loading members...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}
          
          
          
          {!loading && !error && members.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600 font-semibold text-lg">No members found</p>
              <p className="text-gray-500 mt-2">Add your first member to get started</p>
            </div>
          )}


          {!loading &&
            !error &&
            members.length > 0 &&
            (<>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Total Members: {members.length}
                </h3>
                <p className="text-gray-600">Manage your CAC members</p>
              </div>
              
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {members.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {member.fullName?.charAt(0) || 'M'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{member.fullName}</h2>
                      <p className="text-gray-600 text-sm">{member.position}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(member)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
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
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <p className="text-gray-800 font-medium">{member.email}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">Membership Type:</span>
                      <p className="text-gray-800 font-medium">{member.typer}</p>
                    </div>
           
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">Position:</span>
                      <p className="text-gray-800 font-medium">{member.position}</p>
                    </div>
                  </div>
                  
                  {member.bio && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">Biography:</span>
                      <p className="text-gray-800 mt-1">{member.bio}</p>
                    </div>
                  )}
                  
                  {member.logo && member.logo.length > 0 && member.logo[0] && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">Profile Picture:</span>
                      <img 
                        src={member.logo[0].link}
                        alt={member.fullName}
                        className="w-48 h-48 object-cover rounded-lg border border-gray-300 shadow-sm mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
            </>
            )}
        </div>
      )}
    </div>
  );
};

export default Members;
