import { useState, useEffect } from "react";
import { addPartner, getPartners, updatePartner, deletePartner } from "../services/AdminApi";
import LoadingScreen from "../../components/loadingScreen";   // <-- NEW

const Partner = () => {
  const [partners, setPartners] = useState([]);
  const [partnerName, setpartnerName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [logo, setLogo] = useState([]);
  const [partnershipDetails, setpartnershipDetails] = useState("");
  const [officialSite, setOfficialSite] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [view, setView] = useState("form");
  const [loading, setLoading] = useState(false);  // <-- used globally now
  const [error, setError] = useState(null);

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
      setLogo([file]);
    }
  };

  const loadPartners = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPartners();

      if (Array.isArray(data)) {
        setPartners(data);
      } else if (data?.data && Array.isArray(data.data)) {
        setPartners(data.data);
      } else {
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

  useEffect(() => {
    if (view === "list") {
      loadPartners();
    }
  }, [view]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!partnerName.trim() || !acronym.trim() || !partnershipDetails.trim() || !officialSite.trim()) {
      alert("Please fill all the blanks");
      return;
    }

    setLoading(true); // <-- GLOBAL LOADING ON

    const formData = new FormData();
    formData.append("partnerName", partnerName.trim());
    formData.append("acronym", acronym.trim());
    formData.append("partnershipDetails", partnershipDetails.trim());
    formData.append("officialSite", officialSite.trim());

    if (logo && logo.length > 0) {
      logo.forEach((file) => {
        if (file instanceof File) {
          formData.append("logo", file);
        }
      });
    }

    try {
      if (editingId) {
        const updatedPartner = await updatePartner(editingId, formData);

        setPartners((prev) =>
          prev.map((p) => (p._id === editingId ? updatedPartner : p))
        );

        alert("Partner updated successfully!");
      } else {
        const newPartner = await addPartner(formData);
        setPartners((prev) => [newPartner, ...prev]);

        alert("Partner added successfully!");
      }

      resetForm();
      setView("list");

    } catch (err) {
      alert("Failed to save Partner data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false); // <-- GLOBAL LOADING OFF
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this partner?");
    if (!confirmDelete) return;

    setLoading(true);  // <-- Show loader on delete

    try {
      await deletePartner(id);
      setPartners((prev) => prev.filter((p) => p._id !== id));
      alert("Partner deleted successfully.");
    } catch (err) {
      alert("Failed to delete partner.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (partner) => {
    setpartnerName(partner.partnerName || "");
    setAcronym(partner.acronym || "");
    setLogo(partner.logo || []);
    setpartnershipDetails(partner.partnershipDetails || "");
    setOfficialSite(partner.officialSite || "");
    setEditingId(partner._id);
    setView("form");
  };

  const cancelEdit = () => {
    resetForm();
    setView("list");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {loading && <LoadingScreen />} {/* <-- GLOBAL LOADER */}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 className="text-white text-3xl font-bold text-center">Partner Management</h1>
          <p className="text-blue-100 text-center mt-2">Partners Management</p>
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
          <span>View Partners</span>
        </button>
      </div>

      {/* ------- FORM VIEW ------- */}
      {view === "form" && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">

            {/* FORM FIELDS */}
            {[
              {
                label: "Official Name of the Partner",
                value: partnerName,
                onChange: (e) => setpartnerName(e.target.value),
                placeholder: "Enter Official Name",
                rows: 3,
              },
              {
                label: "Official Acronym",
                value: acronym,
                onChange: (e) => setAcronym(e.target.value.toUpperCase()),
                placeholder: "ABC",
                rows: 3,
              },
              {
                label: "Official Website",
                value: officialSite,
                onChange: (e) => setOfficialSite(e.target.value),
                placeholder: "example.com",
                rows: 3,
              },
              {
                label: "Partnership Information",
                value: partnershipDetails,
                onChange: (e) => setpartnershipDetails(e.target.value),
                placeholder: "Explain the partnership",
                rows: 3,
              },
            ].map(({ label, value, onChange, placeholder, rows }) => (
              <div key={label}>
                <label className="block mb-2 font-semibold text-gray-700">{label}</label>
                <textarea
                  className="border border-gray-300 rounded-lg p-3 w-full bg-white"
                  rows={rows}
                  placeholder={placeholder}
                  value={value}
                  onChange={onChange}
                />
              </div>
            ))}

            {/* LOGO UPLOAD */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Official Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="border border-gray-300 rounded-lg p-3 bg-white w-full"
              />
              {logo.length > 0 && logo[0] instanceof File && (
                <img
                  src={URL.createObjectURL(logo[0])}
                  className="w-48 h-48 mt-4 rounded-lg"
                />
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-grow bg-blue-700 text-white py-3 rounded-xl"
              >
                {editingId ? "Update Partner" : "Add Partner"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 text-gray-800 py-3 px-6 rounded-xl"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ------- LIST VIEW ------- */}
      {view === "list" && (
        <div className="space-y-6">

          {!loading && error && (
            <div className="bg-red-50 p-6 rounded-xl text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && partners.length === 0 && (
            <div className="bg-white p-8 rounded-xl text-center shadow">
              <p className="text-gray-600 font-semibold">No data found</p>
            </div>
          )}

          {!loading && !error && partners.length > 0 && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  Total Partners: {partners.length}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {partners.map((partner) => (
                  <div
                    key={partner._id}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                  >
                    <div className="flex justify-between">
                      <h2 className="text-xl font-bold">{partner.partnerName}</h2>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(partner)}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(partner._id)}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {partner.logo?.length > 0 && (
                      <img
                        src={partner.logo[0].link}
                        className="w-48 h-48 mt-4 rounded-lg"
                      />
                    )}

                    <p className="mt-2 text-gray-700">{partner.partnershipDetails}</p>

                    {partner.officialSite && (
                      <a
                        href={`https://${partner.officialSite}`}
                        className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        Visit Site
                      </a>
                    )}
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
