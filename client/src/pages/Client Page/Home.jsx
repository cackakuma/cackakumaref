
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Navbars/headerPages";
import { 
  getPartners, 
  getTestimonies, 
  getPrograms, 
  getMembers, 
  getOrgsDet 
} from "../services/AdminApi";

const DEFAULT_IMG = "/images/trial no bg image.png";

const Home = () => {
  const navigate = useNavigate();

  const [partners, setPartners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [members, setMembers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeArray = (resp) => {
    if (Array.isArray(resp)) return resp;
    if (Array.isArray(resp?.data)) return resp.data;
    if (resp && typeof resp === "object") return [resp];
    return [];
  };

  const loadAllData = async () => {
    try {
      setLoading(true);

      const [
        partnersResp,
        testimoniesResp,
        programsResp,
        membersResp,
        orgsResp
      ] = await Promise.all([
        getPartners(),
        getTestimonies(),
        getPrograms(),
        getMembers(),
        getOrgsDet()
      ]);

      setPartners(normalizeArray(partnersResp));
      setTestimonials(normalizeArray(testimoniesResp));
      setPrograms(normalizeArray(programsResp));
      setMembers(normalizeArray(membersResp));
      setOrgs(normalizeArray(orgsResp));

    } catch (error) {
      console.error("Failed to load data:", error);
      setPartners([]);
      setTestimonials([]);
      setPrograms([]);
      setMembers([]);
      setOrgs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  if (loading) return <div>Loading...</div>;

const hero = {
  heroTitle: "PRESERVING REFUGEES IDENTITY",
  heroDesc: "Creative Arts Centre (CAC) operates on a structured governancesystem designed to promote effective leadership, participation,accountability, community engagement and effective programs andservices delivery."
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header text="Creative Arts Center" />

      {/* HERO SECTION */}
      <div className="relative overflow-hidden mt-15">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-blue-800/30 z-10"></div>

        <img
          src="/images/displayerpic.png"
          alt="Creative Arts Centre"
          className="object-cover w-full h-[40vh] md:h-[50vh]"
        />

        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <img
            src={DEFAULT_IMG}
            alt="CAC Logo"
            className="w-16 h-16 md:w-20 md:h-20 object-contain bg-white/90 rounded-full p-2 shadow-lg"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-20 pt-20">
          <div className="text-center text-white px-4">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
             {hero.heroTitle}
            </h1>
            <div className="w-32 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-lg md:text-xl max-w-4xl mx-auto drop-shadow-md leading-relaxed">
          {hero.heroDesc}
            </p>
          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-wide">
                OUR OVERVIEW
              </h2>
              <div className="w-24 h-1 bg-white mt-4"></div>
            </div>
            <div className="ml-8">
              <img
                src={DEFAULT_IMG}
                alt="CAC Overview"
                className="w-24 h-24 object-contain bg-white/20 rounded-full p-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mission Vision Objective */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className={`${window.innerWidth > 550 ? "w-[60%] ml-[20%]" : "grid grid-cols-1 w-[100%]"} gap-8 text-center`}>
            {orgs.map((org) => (
              <div key={org._id}>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">M</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    Mission
                  </h3>
                  <p className="text-gray-600">{org.mission}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
                  <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">V</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    Vision
                  </h3>
                  <p className="text-gray-600">{org.vision}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
                  <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">O</span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    Objective
                  </h3>
                  <p className="text-gray-600">{org.objective}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROGRAMS */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          {programs.map((program) => (
            <div
              key={program._id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16"
            >
              <div className="space-y-4">
                <img
                  src={program.pics?.[0].link || DEFAULT_IMG}
                  alt={program.title}
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <h3 className="text-2xl font-bold text-blue-800 uppercase">
                  {program.title}
                </h3>
                <p className="text-gray-700">{program.description}</p>
              </div>

              <div className="bg-blue-50 p-8 rounded-xl">
                <h4 className="text-blue-800 text-xl font-bold uppercase mb-6">
                  Benefits of the Program
                </h4>

                {program.programBenefits?.map((benefit) => (
                  <ul key={benefit._id} className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-800 rounded-full mt-2 mr-3"></div>
                      <span>{benefit.benefit}</span>
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEADERSHIP TEAM */}
      <div className="bg-gray-50 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-800 uppercase relative inline-block">
              Our Leadership Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-xl shadow-lg hover:scale-105 transition overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={member.logo?.[0]?.link || DEFAULT_IMG}
                    alt={member.fullName}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-800">
                    {member.fullName}
                  </h3>
                  <p className="italic text-gray-500 text-sm">
                    {member.postition}
                  </p>
                  <p className="text-gray-700 mt-3">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMMUNITY IMPACT — RESTORED */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 py-16 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white uppercase relative inline-block">
              Community Impact
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white"></div>
            </h2>
            <p className="text-white mt-4 max-w-2xl mx-auto opacity-90">
              Our programs have created meaningful change in refugee
              communities through creative arts and education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-8 text-center transform hover:scale-105 transition border border-white/20">
              <div className="text-5xl font-bold text-red-500 mb-2">10,000+</div>
              <div className="w-16 h-1 bg-white mx-auto mb-4"></div>
              <p className="text-lg opacity-95">
                Refugees supported through our programs and initiatives
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-8 text-center transform hover:scale-105 transition border border-white/20">
              <div className="text-5xl font-bold text-blue-500 mb-2">5,000+</div>
              <div className="w-16 h-1 bg-white mx-auto mb-4"></div>
              <p className="text-lg opacity-95">
                Youth transformed into community-responsive leaders
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-8 text-center transform hover:scale-105 transition border border-white/20">
              <div className="text-5xl font-bold text-green-500 mb-2">5+</div>
              <div className="w-16 h-1 bg-white mx-auto mb-4"></div>
              <p className="text-lg opacity-95">
                Programs fostering connection, youth fitness, and mental
                wellbeing
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/programs")}
              className="bg-white hover:bg-blue-100 text-blue-800 font-bold py-3 px-8 rounded-full transition shadow-lg"
            >
              Explore Our Programs
            </button>
          </div>
        </div>
      </div>

      {/* PARTNERS */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-8 pb-4" style={{ width: "max-content" }}>
              {partners.map((partner) => (
                <div
                  key={partner._id}
                  className="flex-shrink-0 bg-white rounded-xl shadow-lg p-6 border border-gray-100 min-w-[200px] text-center hover:shadow-xl transition"
                >
                  <img
                    src={partner.logo?.[0].link || DEFAULT_IMG}
                    alt={partner.partnerName}
                    className="w-16 h-16 mx-auto object-contain bg-gray-50 p-2 rounded-lg"
                  />
                  <h3 className="text-sm font-semibold text-blue-800 mt-3">
                    {partner.partnerName}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testi) => (
              <div
                key={testi._id}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={DEFAULT_IMG}
                    alt={testi.fullName}
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-blue-800">
                      {testi.fullName}
                    </h3>
                    <p className="text-gray-700 italic mt-2">
                      "{testi.message}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EMAIL LIST SECTION */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-blue-800 mb-2">
                Join Our Email List
              </h2>
              <p className="text-gray-600 italic mb-6">
                Get updates about our programs and events
              </p>

              <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4">
                <input type="hidden" name="access_key" value="6f99c2f4-6476-4fa1-8ee0-5ff488566df0" />

                <input
                  type="text"
                  placeholder="Your First Name"
                  name="first_name"
                  className="w-full p-4 text-lg border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none"
                />

                <input
                  type="email"
                  placeholder="Your Email Address"
                  name="email"
                  className="w-full p-4 text-lg border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none"
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white font-bold py-4 rounded-lg transition shadow-lg"
                >
                  JOIN EMAIL LIST
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
