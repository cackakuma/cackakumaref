import { useState, useEffect } from "react";
import {getPrograms, addProgram, updateProgram, deleteProgram} from "../services/AdminApi";

const Programs = () => {
  // Form and data states
  const [programs, setPrograms] = useState([]);
  const [title, setTitle] = useState("");
  const [volume, setVolume] = useState("");
  const [pics, setPics] = useState([]);
  const [description, setDescription] = useState("");
  const [faci_name, setFaci_name] = useState("");
  const [programBenefits, setProgramBenefits] = useState([]);
  const [communityImpact, setComunityImpact] = useState([]);
  const [faci_phone, setFaci_phone] = useState("");
  const [faci_email, setFaci_email] = useState("");
  const [cohort_duration, setCohort_duration] = useState("");
  const [no_of_cohorts, setNo_of_cohorts] = useState("");

  // Edit state tracking current editing Program id
  const [editingId, setEditingId] = useState(null);

  // UI states
  const [view, setView] = useState("form"); // form or list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form values
  const resetForm = () => {
    setTitle("");
    setProgramBenefits([]);
    setComunityImpact([]);
    setPics([]);
    setDescription("");
    setFaci_name("");
    setFaci_phone("");
    setFaci_email("");
    setEditingId(null);
    setCohort_duration("");
    setNo_of_cohorts("");
    setVolume("");
    
  };

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



  // Load Program data from server
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

  // Load Programanisations when switching to list view
  useEffect(() => {
    if (view === "list") {
      loadPrograms();
    }
  }, [view]);

  // Add or update Programanisation depending on editing state
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !faci_name.trim() ||
      !faci_phone.trim() ||
      !faci_email.trim() || !cohort_duration.trim() || !no_of_cohorts.trim() || !volume.trim()
    ) {
      alert("Please fill all the blanks");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("faci_name", faci_name.trim());
    formData.append("faci_phone", faci_phone.trim());
    formData.append("faci_email", faci_email.trim());
    formData.append("cohort_duration", cohort_duration.trim());
    formData.append("no_of_cohorts", no_of_cohorts.trim());
    
    pics.forEach((pic) => {
      if (pic && pic instanceof File) {
        formData.append('pics', pic);
      }
    });
    if (programBenefits && programBenefits.length > 0) {
      formData.append('programBenefits', JSON.stringify(programBenefits));
    } else {
      formData.append('programBenefits', JSON.stringify([]));
    }
    if (communityImpact && communityImpact.length > 0) {
      formData.append('communityImpact', JSON.stringify(communityImpact));
    } else {
      formData.append('communityImpact', JSON.stringify([]));
    }

    setLoading(true);
    try {
      if (editingId) {
        // Update existing Program
        const updatedProgram = await updateProgram(editingId, formData);
          setPrograms((prev) =>
          prev.map((program) => (program._id === editingId ? updatedProgram : program))
        );
        alert("Program updated successfully!");
      } else {
        // Add new Program
        const newProgram = await addProgram(formData);
        setPrograms((prev) => [newProgram, ...prev]);
        alert("Program added successfully!");
      }
      resetForm();
      setView("list");
    } catch (err) {
      alert("Failed to save Program data. Please try again.");
      console.error(err);
    }
  };

  // Delete Programanisation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete the details of the Program?'
    );
    if (!confirmDelete) return;
    
    try {
      await deleteProgram(id);
      setPrograms((prev) => prev.filter((program) => program._id !== id));
      alert("Program deleted successfully.");
    } catch (err) {
      alert("Failed to delete Program. Please try again.");
      console.error(err);
    }
  };

  // Start editing form with selected Programanisation data
  const startEdit = (program) => {
    setTitle(program.title || "");
    setPics(program.pics || []);
    setDescription(program.description || "");
    setVolume("0");
    setProgramBenefits(program.programBenefits || [])
    setComunityImpact(program.communityImpact || [] )
    setFaci_name(program.faci_name || "");
    setFaci_phone(program.faci_phone || "");
    setFaci_email(program.faci_email || "");
    setCohort_duration(program.cohort_duration || "");
    setNo_of_cohorts(program.no_of_cohorts || "");
    setEditingId(program._id);
    setView("form");
  };

  // Cancel editing and reset form
  const cancelEdit = () => {
    resetForm();
    setView("list");
  };

  const handleVolumeChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setVolume(e.target.value);
    
    // Preserve existing pic values when possible
    const newPics = Array(count).fill("").map((_, index) => pics[index] || "");
    setPics(newPics);
    
    const newBenefit = programBenefits;
    setProgramBenefits(newBenefit);
    
    const newImpact = communityImpact;
    setComunityImpact(newImpact);
  };

  const addBenefit = () => {
    setProgramBenefits([...programBenefits, { benefit: "" }]);
  };
  const removeBenefit = () => {
    if (programBenefits.length > 0) {
      setProgramBenefits(programBenefits.slice(0, -1));
    }
  };
  const updateBenefit = (index, value) => {
    const next = [...programBenefits];
    next[index] = { benefit: value };
    setProgramBenefits(next);
  };
  const deleteBenefit = (index) => {
    const next = programBenefits.filter((_, i) => i !== index);
    setProgramBenefits(next);
  };

  const addImpact = () => {
    setComunityImpact([...communityImpact, { impact: "", details: "" }]);
  };
  const removeImpact = () => {
    if (communityImpact.length > 0) {
      setComunityImpact(communityImpact.slice(0, -1));
    }
  };
  const updateImpactField = (index, field, value) => {
    const next = [...communityImpact];
    const item = next[index] || { impact: "", details: "" };
    item[field] = value;
    next[index] = item;
    setComunityImpact(next);
  };
  const deleteImpact = (index) => {
    const next = communityImpact.filter((_, i) => i !== index);
    setComunityImpact(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-900 px-8 py-6">
          <h1 className="text-white text-3xl font-bold text-center">
            Programs Management
          </h1>
          <p className="text-blue-100 text-center mt-2">
            Manage CAC programs and their information
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
          <span>{editingId ? "Edit Program" : "Add Program"}</span>
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
          <span>View Programs</span>
        </button>
      </div>

      {view === "form" && (
       <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        
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
                            pic instanceof File ? URL.createObjectURL(pic) : pic);
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
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-gray-700">Program Benefits</label>
              <div className="flex gap-2 bg-blue-500 text-2xl">
                <button type="button" onClick={addBenefit} className="px-3 py-1 rounded-lg text-white">+</button>
                <button type="button" onClick={removeBenefit} className="px-4 py-1 bg-gray-600 text-white">-</button>
              </div>
            </div>
            {programBenefits.length === 0 && (
              <p className="text-sm text-gray-500">No benefits added</p>
            )}
            <div className="space-y-3">
              {programBenefits.map((b, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className="flex-grow border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    type="text"
                    placeholder={`Benefit ${index + 1}`}
                    value={typeof b === 'string' ? b : (b?.benefit || '')}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                  />
                  {editingId && (
                    <button type="button" onClick={() => deleteBenefit(index)} className="px-3 py-2 rounded-lg bg-red-600 text-white">Delete</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-gray-700">Community Impact</label>
              <div className="flex gap-2 bg-blue-500 text-2xl">
                <button type="button" onClick={addImpact} className="px-3 py-1 text-white">+</button>
                <button type="button" onClick={removeImpact} className="px-4 py-1 bg-gray-600 text-white">-</button>
              </div>
            </div>
            {communityImpact.length === 0 && (
              <p className="text-sm text-gray-500">No community impact items added</p>
            )}
            <div className="space-y-3">
              {communityImpact.map((ci, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                  <input
                    className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    type="text"
                    placeholder={`Impact ${index + 1}`}
                    value={ci?.impact || ''}
                    onChange={(e) => updateImpactField(index, 'impact', e.target.value)}
                  />
                  <textarea
                    className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    type="text"
                    placeholder={`Details ${index + 1}`}
                    value={ci?.details || ''}
                    onChange={(e) => updateImpactField(index, 'details', e.target.value)}
                  />
                  {editingId && (
                    <div className="md:col-span-2">
                      <button type="button" onClick={() => deleteImpact(index)} className="px-3 py-2 rounded-lg bg-red-600 text-white w-full md:w-auto">Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Official Name of the Program",
              placeholder: "Enter the Official Name without any errors",
              value: title,
              onChange: (e) => setTitle(e.target.value),
              rows: 3,
            },
            {
              label: "Describe the Program",
              placeholder: "Please go in dept and proffesionaly describe the activities of the program and who is it intended for",
              value: description,
              onChange: (e) => setDescription(e.target.value),
              rows: 3,
            },
            {
              label: "Program Facilitator Name",
              placeholder: "Set the name of the facilitator",
              value: faci_name,
              onChange: (e) => setFaci_name(e.target.value),
              rows: 3,
            },
            {
              label: "Facilitator Phone",
              placeholder: "The Program facilitator phone goes here",
              value: faci_phone,
              onChange: (e) => setFaci_phone(e.target.value),
              rows: 3,
            },
            {
              label: "Program Facilitator email address",
              placeholder: "The facilitator email address goes here",
              value: faci_email,
              onChange: (e) => setFaci_email(e.target.value),
              rows: 3,
            },
            {
              label: "Cohort Number",
              placeholder: "This is cohort number?",
              value: no_of_cohorts,
              onChange: (e) => setNo_of_cohorts(e.target.value),
              rows: 3,
            }, 
             {
              label: "The Cohort Duration",
              placeholder: "How many weeks/months will this program run per cohort before concluding",
              value: cohort_duration,
              onChange: (e) => setCohort_duration(e.target.value),
              rows: 3,
            },
           
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
          

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-grow bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 focus:ring-4 focus:ring-blue-400 transform hover:scale-105"            >
              {editingId ? "Update" : "Submit"}
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
          </div>
        </form>
        </div>
      )}

      {view === "list" && (
        <div className="space-y-6">
          {loading && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-600 font-semibold">Loading programs...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}

          {!loading && !error && programs.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600 font-semibold text-lg">No programs found</p>
              <p className="text-gray-500 mt-2">Add your first program to get started</p>
            </div>
          )}

          {!loading && !error && programs.length > 0 && (
              <>
               <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Total Programs: {programs.length}
                </h3>
                <p className="text-gray-600">Manage your CAC programs</p>
              </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">  
            {programs.map((program) => (
              <div
                key={program._id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                 <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {program.title?.charAt(0) || 'M'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{program.title}</h2>
                      <p className="text-gray-600 text-sm">{program.faci_name}</p>
                    </div>
                  </div>
                  
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(program)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(program._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
                
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             
           <div className="bg-gray-50 rounded-lg p-3">
           <span className="text-sm font-medium text-gray-600">Facilitator Name:</span>
                      
           <p className="text-gray-800 font-medium">{program.faci_name}</p>
           </div>
           
           <div className="bg-gray-50 rounded-lg p-3">
           <span className="text-sm font-medium text-gray-600">Facilitator Email:</span>
                      
           <p className="text-gray-800 font-medium">{program.faci_email}</p>
           </div>
         
           <div className="bg-gray-50 rounded-lg p-3">
           <span className="text-sm font-medium text-gray-600">Facilitator Phone:</span>
                      
           <p className="text-gray-800 font-medium">{program.faci_phone}</p>
           </div>
         
          <div className="bg-gray-50 rounded-lg p-3">
           <span className="text-sm font-medium text-gray-600">Cohort Duration:</span>
                      
           <p className="text-gray-800 font-medium">{program.cohort_duration}</p>
           </div>
         
          <div className="bg-gray-50 rounded-lg p-3">
           <span className="text-sm font-medium text-gray-600">Numbers of Cohort:</span>
                      
           <p className="text-gray-800 font-medium">{program.no_of_cohorts}</p>
           </div>
         
          {program.description && (
            <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-sm font-medium text-gray-600"> Program Description:</span>
              <p className="text-gray-800 mt-1">{program.description}</p>
                    </div>
                  )}
                  
          {program.programBenefits && program.programBenefits.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-sm font-medium text-gray-600">Program Benefits:</span>
              <ul className="list-disc list-inside mt-1 text-gray-800">
                {program.programBenefits.map((b, i) => (
                  <li key={i}>{typeof b === 'string' ? b : (b?.benefit || '')}</li>
                ))}
              </ul>
            </div>
          )}

          {program.communityImpact && program.communityImpact.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <span className="text-sm font-medium text-gray-600">Community Impact:</span>
              {program.communityImpact.map((ci, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-2">
                  <p className="text-gray-800 font-medium">{ci?.impact || ''}</p>
                  {ci?.details && <p className="text-gray-600 text-sm">{ci.details}</p>}
                </div>
              ))}
            </div>
          )}

         {program.pics && program.pics.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600">Supportive Pictures ({program.pics.length})</span>
                            <button
                              onClick={() => {
                                // Create a modal or lightbox for viewing all images
                                const imageUrls = program.pics.map(pic => pic.link);
                                const imageWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                                imageWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>program Images - ${program.title}</title>
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
                                        <h1>${program.title}</h1>
                                        <p>${program.pics.length} images</p>
                                      </div>
                                      <div class="image-container">
                                        ${imageUrls.map(url => `
                                          <div class="image-item">
                                            <img src="${url}" alt="program Image" onclick="window.open('${url}', '_blank')" />
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
                            {program.pics.map((pic, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={pic.link}
                                  alt={`program image ${index + 1}`}
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
                                      link.download = `program-image-${index + 1}`;
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
                                    onClick={() => handleDeleteImage(program._id, index)}
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
        </div>
      )}
    </div>
  );
};

export default Programs;
