import { useState, useEffect } from "react";
import { getMembers, addMember, updateMember, deleteMember } from "../services/AdminApi";
import LoadingScreen from "../../components/loadingScreen";

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
    setEmail("");
    setEditingId(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setLogo([file]);
  };

  // Load members from server
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

  useEffect(() => {
    if (view === "list") loadMembers();
  }, [view]);

  // Add or update member
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !typer.trim() || !bio.trim() || !position.trim() || !email.trim()) {
      alert("Please fill all the blanks");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("typer", typer.trim());
    formData.append("bio", bio.trim());
    formData.append("position", position.trim());
    formData.append("email", email.trim());
    logo.forEach((file) => file instanceof File && formData.append("logo", file));

    setLoading(true);
    try {
      if (editingId) {
        const updatedMember = await updateMember(editingId, formData);
        setMembers((prev) => prev.map((m) => (m._id === editingId ? updatedMember : m)));
        alert("Member updated successfully!");
      } else {
        const newMember = await addMember(formData);
        setMembers((prev) => [newMember, ...prev]);
        alert("Member added successfully!");
      }
      resetForm();
      setView("list");
    } catch (err) {
      alert("Failed to save member data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete member
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this member?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((m) => m._id !== id));
      alert("Member deleted successfully.");
    } catch (err) {
      alert("Failed to delete member. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing
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

  const cancelEdit = () => {
    resetForm();
    setView("list");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 relative">
      {loading && <LoadingScreen />}
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 className="text-white text-3xl font-bold text-center">Members Management</h1>
          <p className="text-blue-100 text-center mt-2">Manage CAC members and their information</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => { resetForm(); setView("form"); }}
          className={`px-8 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center space-x-2 ${view === "form" ? "bg-blue-600 text-white scale-105" : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"}`}
        >
          <span>{editingId ? "Edit Member" : "Add Member"}</span>
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-8 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center space-x-2 ${view === "list" ? "bg-blue-600 text-white scale-105" : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"}`}
        >
          <span>View Members</span>
        </button>
      </div>

      {/* FORM VIEW */}
      {view === "form" && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "Enter full name", rows: 2 },
                { label: "Email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Enter email", rows: 2 },
                { label: "Position", value: position, onChange: (e) => setPosition(e.target.value), placeholder: "Enter position", rows: 2 },
              ].map(({ label, value, onChange, placeholder, rows }) => (
                <div key={label} className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700">{label}</label>
                  <textarea className="border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500" rows={rows} placeholder={placeholder} value={value} onChange={onChange} />
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Membership Type</label>
              <select value={typer} onChange={(e) => setTyper(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500">
                <option value="">Select Membership Type</option>
                <option value="Executive">Executive</option>
                <option value="Program Facilitator">Program Facilitator</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Biography</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio of the member" rows={3} className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} className="border border-gray-300 rounded-lg p-3" />
              {logo && logo.length > 0 && logo[0] instanceof File && <img src={URL.createObjectURL(logo[0])} alt="Preview" className="w-48 h-48 mt-4 rounded-lg border" />}
            </div>

            <div className="flex gap-4 pt-6">
              <button type="submit" className="flex-grow bg-blue-600 text-white py-4 rounded-xl">{editingId ? "Update Member" : "Add Member"}</button>
              {editingId && <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white py-4 px-8 rounded-xl">Cancel</button>}
            </div>
          </form>
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="space-y-6">
          {!loading && error && <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">{error}</div>}
          {!loading && !error && members.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-600">No members found. Add your first member.</div>
          )}
          {!loading && !error && members.length > 0 && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h3 className="text-2xl font-bold">{`Total Members: ${members.length}`}</h3>
                <p className="text-gray-600">Manage your CAC members</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {members.map((member) => (
                  <div key={member._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                          {member.fullName?.charAt(0) || "M"}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{member.fullName}</h2>
                          <p className="text-gray-600">{member.position}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => startEdit(member)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Edit</button>
                        <button onClick={() => handleDelete(member._id)} className="bg-red-600 text-white px-4 py-2 rounded-lg">Delete</button>
                      </div>
                    </div>

                    <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-600">Email:</span>
                        <p className="text-gray-800">{member.email}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-600">Membership Type:</span>
                        <p className="text-gray-800">{member.typer}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-600">Position:</span>
                        <p className="text-gray-800">{member.position}</p>
                      </div>
                      {member.bio && (
                        <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
                          <span className="text-sm font-medium text-gray-600">Biography:</span>
                          <p className="text-gray-800 mt-1">{member.bio}</p>
                        </div>
                      )}
                      {member.logo && member.logo.length > 0 && member.logo[0] && (
                        <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
                          <span className="text-sm font-medium text-gray-600">Profile Picture:</span>
                          <img src={member.logo[0].link} alt={member.fullName} className="w-48 h-48 object-cover rounded-lg border mt-2" />
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
