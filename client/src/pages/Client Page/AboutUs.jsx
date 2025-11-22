import { useEffect, useState } from 'react';
import { getOrgsDet, getPartners } from "../services/AdminApi";
import Header from "./Navbars/headerPages";

const InputFields = ({placeholders, buttonText, textArea}) => {
  const [formType, setFormType] = useState('Pick a type');
  const [result, setResult] = useState("");
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    setIsSending(true);
    const formData = new FormData(event.target);
    formData.append("access_key", "6b77448f-e277-43b3-9967-5dbc20af14a0");
    formData.append("form_type", formType);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
      setFormType('Pick a type');
    } else {
      setResult("Error");
    }
    setIsSending(false);
  };

  return (
    <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <select 
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg border-2 border-blue-100 
            text-gray-700 text-sm focus:border-blue-500 focus:ring-2 
            focus:ring-blue-500/20 transition-all duration-200 outline-none"
        >
          <option value="Pick a type">Pick a type</option>
          <option value="Enquiry">Enquiry</option>
          <option value="Testimony">Testimony</option>
        </select>

        <input 
          name="name"
          className="w-full px-4 py-3 rounded-lg border-2 border-blue-100 
            text-gray-700 text-sm placeholder-gray-400
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
            transition-all duration-200 outline-none"
          placeholder={placeholders?.[0]?.placeholder || "First Name"}
          required
        />

        <input 
          type="email"
          name="email"
          className="w-full px-4 py-3 rounded-lg border-2 border-blue-100 
            text-gray-700 text-sm placeholder-gray-400
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
            transition-all duration-200 outline-none"
          placeholder={placeholders?.[1]?.placeholder || "Email Address"}
          required
        />

        <textarea 
          name="message"
          className="w-full px-4 py-3 rounded-lg border-2 border-blue-100 
            text-gray-700 text-sm placeholder-gray-400 min-h-[120px]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
            transition-all duration-200 outline-none resize-none"
          placeholder={textArea}
          required
        />

        <button 
          type="submit"
          disabled={formType === 'Pick a type' || isSending}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 
            text-white font-medium rounded-lg shadow-md hover:shadow-lg
            transition-all duration-200 text-sm uppercase tracking-wide
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? "Sending..." : buttonText}
        </button>
        <span className="block text-center text-sm text-gray-600">{result}</span>
      </form>
    </div>
  );
};

const InfoButton = ({ label, content, gradient }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <button 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`w-full p-4 rounded-xl text-left ${gradient}
        text-white font-medium shadow hover:shadow-lg 
        transition-all duration-300`}
    >
      <div className="flex justify-between items-center">
        <span>{label}</span>
        <svg 
          className={`w-5 h-5 transform transition-transform duration-300
            ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isExpanded && (
        <p className="mt-4 text-sm opacity-90 leading-relaxed">
          {content}
        </p>
      )}
    </button>
  );
};

const AboutUs = () => {
  const [org, setOrg] = useState(null);
  const [partners, setPartners] = useState([]);
  
  const integrity = [
      {
      virtue: "Transparency: We maintain open communication and accountability in all our operations, ensuring stakeholders have clear visibility into our programs and impact."
       },
      {
      virtue: "Integrity: We uphold the highest ethical standards in our work, treating all community members with dignity, respect, and fairness."
       },
    {
      virtue: "Excellence: We strive for the highest quality in program delivery, continuously improving our services to better serve refugee communities."
       },
     {
      virtue: "Inclusivity: We create welcoming spaces where all community members, regardless of background, can participate and thrive in our programs."
       },
 {
      virtue: "Collaboration: We work closely with community members, partners, and stakeholders to ensure our programs meet real needs and create lasting positive change."
       },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const orgResp = await getOrgsDet();
        const orgs = Array.isArray(orgResp) ? orgResp : (orgResp?.data || []);
        setOrg(orgs[0] || null);
      } catch (e) {
        setOrg(null);
      }
      try {
        const partResp = await getPartners();
        const parts = Array.isArray(partResp) ? partResp : (partResp?.data || []);
        setPartners(parts);
      } catch (e) {
        setPartners([]);
      }
    };
    load();
  }, []);
  
  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header text="About Us" />
      
      <main className="pt-20 px-4 pb-16 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 uppercase relative inline-block mb-4">
            About Creative Arts Centre
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-800"></div>
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Discover our mission, values, and the dedicated team working to empower refugees through creative arts and education.
          </p>
        </div>

        {/* Organization Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              className="w-20 h-20 rounded-xl object-cover bg-gray-50 p-2 shadow-md" 
              src={org?.logo?.[0]?.link || "/images/trial no bg image.png"}
              alt="CAC Logo"
            />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            {org?.orgName || "Creative Arts Centre (CAC)"}
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {org?.description || "Creative Arts Centre (CAC) is a community-based organization dedicated to empowering refugees through creative arts, education, and skill development programs."}
          </p>
        </div>

        <div className="space-y-12">
          {/* Mission, Vision & Objectives Section */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-800 uppercase relative inline-block mb-4">
                Our Foundation
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-800"></div>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our core principles that guide everything we do at Creative Arts Centre.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-lg font-bold">M</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-800">Mission</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {org?.mission || "To empower refugees through creative arts, education, and community development programs."}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-lg font-bold">V</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">Vision</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {org?.vision || "A world where refugees can thrive through creative expression while building bridges to new communities."}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-500">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-lg font-bold">O</span>
                  </div>
                  <h3 className="text-xl font-bold text-purple-800">Objectives</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {org?.objective || "To provide accessible creative arts programs, build strong community partnerships, and develop leadership skills among refugees."}
                </p>
              </div>
            </div>
          </section>

          {/* Integrity Section */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-800 uppercase relative inline-block mb-4">
                Our Values & Integrity
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-800"></div>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We take great pride in helping youths transform their lives. These core values guide our work and ensure we maintain the highest standards in everything we do.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(org?.integrity || []).map((it, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 mt-1 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{it?.impact}</h4>
                      {it?.details && (
                        <p className="text-gray-700 leading-relaxed">{it.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Partners Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-6">
              Partners and Collaborators
            </h2>
            <p className="text-gray-600 mb-6">
              We work with trusted organizations and partners to deliver impactful programs and services to refugee communities.
            </p>
            
            {/* Horizontal Scrolling Partners */}
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-6 pb-4" style={{width: 'max-content'}}>
                  {partners.map((partner, index) => (
                    <a 
                      key={index}
                      href={partner.officialSite ? (partner.officialSite.startsWith('http') ? partner.officialSite : `https://${partner.officialSite}`) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 min-w-[200px] text-center group"
                    >
                      <div className="mb-4">
                        <img 
                          src={partner.logo?.[0]?.link || "/images/trial no bg image.png"} 
                          alt={partner.acronym}
                          className="w-16 h-16 mx-auto object-contain rounded-lg bg-gray-50 p-2 group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-blue-800 group-hover:text-blue-600 transition-colors duration-300">
                        {partner.acronym}
                      </h3>
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Gradient fade effects */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Scroll indicator */}
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                <span className="inline-block animate-bounce">←</span> Scroll to see all our partners <span className="inline-block animate-bounce">→</span>
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-800 uppercase relative inline-block mb-4">
                Get in Touch With Us
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-800"></div>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We'd love to hear from you! Share any thoughts, inquiries, or testimonies. Please categorize whether you're sending an enquiry or sharing a testimony.
              </p>
            </div>
            
            <InputFields 
              placeholders={[
                {placeholder: "First Name"}, 
                {placeholder: "Email Address"}
              ]} 
              buttonText="Send Email" 
              textArea="Please input Your Message"
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
