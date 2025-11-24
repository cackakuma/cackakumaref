import { useState, useEffect } from "react";
import { addPartner, getPartners, updatePartner, deletePartner } from "../services/AdminApi";

const Partner = () => {
  // Form and data states
  const [partners, setPartners] = useState([]);
  const [partnerName, setpartnerName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [logo, setLogo] = useState([]);
  const [partnershipDetails, setpartnershipDetails] = useState("");
  const [officialSite, setOfficialSite] = useState("");

  // Edit state tracking current editing partner id
  const [editingId, setEditingId] = useState(null);

  // UI states
  const [view, setView] = useState("form"); // form or list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form values
  const resetForm = () => {
    setpartnerName("");
    setAcronym("");
    setLogo([]);
    setpartnershipDetails("");
    setOfficialSite("");
    setEditingId(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo([file]); // Store as array with single file
    }
  };

  // Load partner data from server
  const loadPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPartners();
      if (Array.isArray(data)) setPartners(data);
      else if (data?.data && Array.isArray(data.data)) setPartners(data.data);
      else {
        setPartners([]);
        setError("Unexpected data format from API");
      }
    } catch (err) {
      setError("Failed to load data from server");
      setPartners([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load Partner when switching to list view
  useEffect(() => {
    if (view === "list") {
      loadPartners();
    }
  }, [view]);

  // Add or update Partner depending on editing state
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !partnerName.trim() ||
      !acronym.trim() ||
      !partnershipDetails.trim() || !officialSite.trim()
    ) {
      alert("Please fill all the blanks");
      return;
    }

    const formData = new FormData();
    formData.append('partnerName', partnerName.trim());
    formData.append('acronym', acronym.trim());
    formData.append('partnershipDetails', partnershipDetails.trim());
    formData.append('officialSite', officialSite.trim());

    if (logo && logo.length > 0) {
      logo.forEach((file) => {
        if (file instanceof File) {
          formData.append('logo', file);
        } 
      });
    }

    try {
      if (editingId) {
        // Update existing partner
        const updatedpartner = await updatePartner(editingId, formData);
        setPartners((prev) =>
          prev.map((partner) => (partner._id === editingId ? updatedpartner : partner))
        );
        alert("Partner updated successfully!");
      } else {
        // Add new partner
        const newpartner = await addPartner(formData);
        setPartners((prev) => [newpartner, ...prev]);
        alert("Partner added successfully!");
      }
      resetForm();
      setView("list");
    } catch (err) {
      alert("Failed to save Partner data. Please try again.");
      console.error(err);
    }
  };







  // Delete Partner
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete the details of the Partner?'
    );
    if (!confirmDelete) return;
    
    try {
      await deletePartner(id);
      setPartners((prev) => prev.filter((partner) => partner._id !== id));
      alert("Partner deleted successfully.");
    } catch (err) {
      alert("Failed to delete Partner. Please try again.");
      console.error(err);
    }
  };

  // Start editing form with selected Partner data
  const startEdit = (partner) => {
    setpartnerName(partner.partnerName || "");
    setAcronym(partner.acronym || "");
    setLogo(partner.logo || []);
    setpartnershipDetails(partner.partnershipDetails || "");
    setOfficialSite(partner.officialSite || "");
    setEditingId(partner._id);
    setView("form");
  };

  // Cancel editing and reset form
  const cancelEdit = () => {
    resetForm();
    setView("list");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
    
     <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 className="text-white text-3xl font-bold text-center">
            Partner Management
          </h1>
          <p className="text-blue-100 text-center mt-2">
            Partners Management
          </p>
        </div>
      </div>

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
          <span>{editingId ? "Edit Partner" : "Add Partner"}</span>
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
          <span>View Partners</span>
        </button>
      </div>

      {view === "form" && (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} 
         className="space-y-6 max-w-4xl mx-auto">
          {[
            {
              label: "Official Name of the Partner",
              placeholder: "Enter the Official Name without any errors",
              value: partnerName,
              onChange: (e) => setpartnerName(e.target.value),
              rows: 3,
            },
            {
              label: "Official Shorthand Name (Acronym)",
              placeholder: "Official acronym in uppercase",
              value: acronym,
              onChange: (e) => setAcronym(e.target.value.toUpperCase()),
              rows: 3,
            },
            {
              label: "Partner's Official Website",
              placeholder: `Official Site of your partner`,
              value: officialSite,
              onChange: (e) => setOfficialSite(e.target.value),
              rows: 3,
            },
            {
              label: "Partnership Information",
              placeholder: "Describe in details the nature of the partnership and how it work for benefit of all the parties involved and the community of this organisation ",
              value: partnershipDetails,
              onChange: (e) => setpartnershipDetails(e.target.value),
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
          
          <div className="flex flex-col mt-4">
            <label className="mb-2 font-semibold text-gray-700">Official Logo </label>
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
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-grow bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-md transition focus:ring-4 focus:ring-blue-400"
            >
         {editingId ? "Update Partner" : "Add Partner"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-xl shadow-md transition"
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
              <p className="text-blue-600 font-semibold">Loading Partner details...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}
          
         {!loading && !error && partners.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600 font-semibold text-lg">No data found</p>
              <p className="text-gray-500 mt-2">Add your Partner details to get started</p>
            </div>
          )}

         {!loading &&
            !error &&
            partners.length > 0 &&
            (<>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Total Partners: {partners.length}
                </h3>
                <p className="text-gray-600">Partners View Portal</p>
              </div>
              
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {partners.map((partner) => (
              <div
                key={partner._id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {partner.partnerName?.charAt(0) || 'Partners'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{partner.partnerName}</h2>
                      <p className="text-gray-600 text-sm">{partner.acronym}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(partner)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(partner._id)}
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
          {partner.partnershipDetails && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">Partnership Details:</span>
                      <p className="text-gray-800 mt-1">{partner.partnershipDetails}</p>
                    </div>
                  )}
                  
               {partner.logo && partner.logo.length > 0 && partner.logo[0] && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">Partner Logo:</span>
                      <img 
                        src={partner.logo[0].link}
                        alt={partner.partnerName}
                        className="w-48 h-48 object-cover rounded-lg border border-gray-300 shadow-sm mt-2"
                      />
                    </div>
                  )}
               
               {partner.officialSite && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600 mr-4">Official Website:</span>
                      <a
                        href={`https://${partner.officialSite}`}
                        className="inline-block mt-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 font-bold transition-colors duration-300 text-sm"
                      >
                        {partner.officialSite}
                      </a>
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

export default Partner;
