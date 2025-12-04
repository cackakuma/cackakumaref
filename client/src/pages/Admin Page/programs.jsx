
import { useState, useEffect } from "react";
import {
  addProgram,
  getPrograms,
  updateProgram,
  deleteProgram,
} from "../services/AdminApi";
import LoadingScreen from "../../components/loadingScreen";

const Programs = () => {
  // Form and data states
  const [programs, setPrograms] = useState([]);
  const [programName, setProgramName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [logo, setLogo] = useState([]);
  const [description, setDescription] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [objective, setObjective] = useState("");
  const [integrity, setIntegrity] = useState([]);

  // Edit state
  const [editingId, setEditingId] = useState(null);

  // UI states
  const [view, setView] = useState("form"); // form or list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form
  const resetForm = () => {
    setProgramName("");
    setAcronym("");
    setLogo([]);
    setDescription("");
    setMission("");
    setVision("");
    setObjective("");
    setIntegrity([]);
    setEditingId(null);
  };

  // File input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogo([file]);
  };

  // Integrity handlers
  const addIntegrity = () =>
    setIntegrity([...integrity, { impact: "", details: "" }]);
  const removeIntegrity = () =>
    integrity.length > 0 && setIntegrity(integrity.slice(0, -1));
  const updateIntegrityField = (index, field, value) => {
    const next = [...integrity];
    next[index] = { ...next[index], [field]: value };
    setIntegrity(next);
  };
  const deleteIntegrity = (index) =>
    setIntegrity(integrity.filter((_, i) => i !== index));

  // Load programs
  const loadPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPrograms();
      if (Array.isArray(data)) setPrograms(data);
      else if (data?.data && Array.isArray(data.data)) setPrograms(data.data);
      else {
        setPrograms([]);
        setError("Unexpected data format from API");
      }
    } catch (err) {
      setError("Failed to load data from server");
      setPrograms([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "list") loadPrograms();
  }, [view]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !programName.trim() ||
      !acronym.trim() ||
      !description.trim() ||
      !mission.trim() ||
      !vision.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("programName", programName.trim());
    formData.append("acronym", acronym.trim());
    formData.append("description", description.trim());
    formData.append("mission", mission.trim());
    formData.append("vision", vision.trim());
    formData.append("objective", objective.trim());
    formData.append("integrity", JSON.stringify(integrity));
    logo.forEach((file) => file instanceof File && formData.append("logo", file));

    try {
      if (editingId) {
        const updatedProgram = await updateProgram(editingId, formData);
        setPrograms((prev) =>
          prev.map((prog) => (prog._id === editingId ? updatedProgram : prog))
        );
        alert("Program updated successfully!");
      } else {
        const newProgram = await addProgram(formData);
        setPrograms((prev) => [newProgram, ...prev]);
        alert("Program added successfully!");
      }
      resetForm();
      setView("list");
    } catch (err) {
      alert("Failed to save program data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete program
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this program?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await deleteProgram(id);
      setPrograms((prev) => prev.filter((prog) => prog._id !== id));
      alert("Program deleted successfully.");
    } catch (err) {
      alert("Failed to delete program. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit program
  const startEdit = (prog) => {
    setProgramName(prog.programName || "");
    setAcronym(prog.acronym || "");
    setLogo(prog.logo || []);
    setDescription(prog.description || "");
    setMission(prog.mission || "");
    setVision(prog.vision || "");
    setObjective(prog.objective || "");
    setIntegrity(prog.integrity || []);
    setEditingId(prog._id);
    setView("form");
  };

  const cancelEdit = () => {
    resetForm();
    setView("list");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 relative">
      {/* GLOBAL LOADING */}
      {loading && <LoadingScreen />}

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 className="text-white text-3xl font-bold text-center">
            Program Management
          </h1>
          <p className="text-blue-100 text-center mt-2">
            Manage Programs and related information
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() =>
            programs.length > 0
              ? startEdit(programs[0])
              : (() => {
                  resetForm();
                  setView("form");
                })()
          }
          className={`px-8 py-3 font-semibold rounded-xl shadow-lg flex items-center space-x-2 ${
            view === "form"
              ? "bg-blue-600 text-white transform scale-105"
              : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
          }`}
        >
          <span>{editingId ? "Edit Program" : "Add Program"}</span>
        </button>

        <button
          onClick={() => setView("list")}
          className={`px-8 py-3 font-semibold rounded-xl shadow-lg flex items-center space-x-2 ${
            view === "list"
              ? "bg-blue-600 text-white transform scale-105"
              : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
          }`}
        >
          <span>View Programs</span>
        </button>
      </div>

      {/* FORM VIEW */}
      {view === "form" && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            {[
              {
                label: "Official Name",
                value: programName,
                onChange: (e) => setProgramName(e.target.value),
                placeholder: "Enter Official Name",
              },
              {
                label: "Acronym",
                value: acronym,
                onChange: (e) => setAcronym(e.target.value.toUpperCase()),
                placeholder: "ABC",
              },
              {
                label: "Program Description",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "Program description",
              },
              {
                label: "Mission",
                value: mission,
                onChange: (e) => setMission(e.target.value),
                placeholder: "Mission statement",
              },
              {
                label: "Vision",
                value: vision,
                onChange: (e) => setVision(e.target.value),
                placeholder: "Vision statement",
              },
              {
                label: "Objective",
                value: objective,
                onChange: (e) => setObjective(e.target.value),
                placeholder: "Objective",
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <div key={label} className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">{label}</label>
                <textarea
                  className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}
                />
              </div>
            ))}

            {/* Integrity */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Integrity Items</label>
              <div className="flex gap-2 mb-2">
                <button type="button" onClick={addIntegrity} className="px-3 py-1 bg-blue-600 text-white rounded-lg">+</button>
                <button type="button" onClick={removeIntegrity} className="px-3 py-1 bg-gray-600 text-white rounded-lg">-</button>
              </div>
              {integrity.length === 0 && <p className="text-gray-500">No integrity items</p>}
              {integrity.map((it, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <input
                    className="border border-gray-300 rounded-lg p-2"
                    type="text"
                    placeholder={`Impact ${i + 1}`}
                    value={it.impact}
                    onChange={(e) => updateIntegrityField(i, "impact", e.target.value)}
                  />
                  <input
                    className="border border-gray-300 rounded-lg p-2"
                    type="text"
                    placeholder={`Details ${i + 1}`}
                    value={it.details}
                    onChange={(e) => updateIntegrityField(i, "details", e.target.value)}
                  />
                  {editingId && (
                    <button type="button" onClick={() => deleteIntegrity(i)} className="bg-red-600 text-white rounded-lg px-2 py-1 md:col-span-2">Delete</button>
                  )}
                </div>
              ))}
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Logo</label>
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} className="border border-gray-300 rounded-lg p-2 w-full" />
              {logo.length > 0 && logo[0] instanceof File && (
                <img src={URL.createObjectURL(logo[0])} className="w-48 h-48 mt-4 rounded-lg" />
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button type="submit" className="flex-grow bg-blue-700 text-white py-3 rounded-xl">{editingId ? "Update Program" : "Add Program"}</button>
              {editingId && <button type="button" onClick={cancelEdit} className="bg-gray-300 text-gray-800 py-3 px-6 rounded-xl">Cancel</button>}
            </div>
          </form>
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="space-y-6">
          {!loading && error && <div className="bg-red-50 p-6 rounded-xl text-center text-red-600">{error}</div>}
          {!loading && !error && programs.length === 0 && <div className="bg-white p-8 rounded-xl text-center shadow"><p className="text-gray-600 font-semibold">No data found</p></div>}

          {!loading && !error && programs.length > 0 && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800">Total Programs: {programs.length}</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {programs.map((prog) => (
                  <div key={prog._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex justify-between">
                      <h2 className="text-xl font-bold">{prog.programName}</h2>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(prog)} className="bg-blue-600 text-white px-3 py-2 rounded-lg">Edit</button>
                        <button onClick={() => handleDelete(prog._id)} className="bg-red-600 text-white px-3 py-2 rounded-lg">Delete</button>
                      </div>
                    </div>
                    {prog.logo?.length > 0 && <img src={prog.logo[0].link} className="w-48 h-48 mt-4 rounded-lg" />}
                    <p className="mt-2 text-gray-700">{prog.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="bg-gray-50 rounded-lg p-3"><span className="font-medium text-gray-600">Mission:</span><p>{prog.mission}</p></div>
                      <div className="bg-gray-50 rounded-lg p-3"><span className="font-medium text-gray-600">Vision:</span><p>{prog.vision}</p></div>
                      <div className="bg-gray-50 rounded-lg p-3"><span className="font-medium text-gray-600">Objective:</span><p>{prog.objective}</p></div>
                      {prog.integrity?.length > 0 && (
                        <div className="md:col-span-2 bg-gray-50 rounded-lg p-3">
                          <span className="font-medium text-gray-600">Integrity:</span>
                          <div className="space-y-2 mt-2">
                            {prog.integrity.map((it, i) => (
                              <div key={i} className="border border-gray-200 rounded-lg p-2">
                                <p className="text-gray-800">{it.impact}</p>
                                {it.details && <p className="text-gray-600 text-sm">{it.details}</p>}
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
        </div>
      )}
    </div>
  );
};

export default Programs;
