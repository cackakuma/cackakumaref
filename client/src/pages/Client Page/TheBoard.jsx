import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";
import { Link } from "react-router-dom";
import Header from "./Navbars/headerPages";
import { getMembers } from "../services/AdminApi";

const TheBoard = () => {
  const [executiveMembers, setExecutiveMembers] = useState([]);
  const [programsManagers, setProgramsManagers] = useState([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await getMembers();
        // Assuming response is an array of members
        const members = response.data || response;

        // Filter based on 'typer'
        const executives = members.filter(
          (m) => m.typer && m.typer.toLowerCase().includes("executive")
        );
        const managers = members.filter(
          (m) => m.typer && m.typer.toLowerCase().includes("program")
        );

        setExecutiveMembers(executives);
        setProgramsManagers(managers);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <Header text="The Board" />

      <main className="pt-20 px-4 pb-16 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 uppercase relative inline-block mb-4">
            Our Leadership Team
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-800"></div>
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Our dedicated board members and program facilitators bring diverse expertise and passion to guide our organization's mission of empowering refugees through creative arts and education.
          </p>
        </div>

        {/* Overview Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">{executiveMembers.length}</span>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Executive Members</h3>
              <p className="text-gray-600">Strategic leadership and governance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">{programsManagers.length}</span>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Program Facilitators</h3>
              <p className="text-gray-600">Direct program delivery and mentorship</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">10+</span>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Years Experience</h3>
              <p className="text-gray-600">Combined expertise in community development</p>
            </div>
          </div>
        </section>

        {/* Executive Members Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 uppercase relative inline-block mb-4">
              Executive Board
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-800"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our executive board members provide strategic leadership and governance to ensure our organization's mission is fulfilled effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {executiveMembers.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative">
                  <img
                    className="w-full h-64 object-cover"
                    src={member.logo?.[0]?.link || "/default-avatar.jpg"}
                    alt={member.fullName}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{member.fullName}</h3>
                    <p className="text-blue-200 italic text-sm">{member.position}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-blue-800 rounded-full mr-2"></div>
                      About
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">{member.bio}</p>
                  </div>

                  <div className="flex justify-center space-x-3">
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                      <span className="text-xs font-bold">in</span>
                    </div>
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                      <span className="text-xs font-bold">@</span>
                    </div>
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                      <span className="text-xs font-bold">f</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Program Facilitators Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 uppercase relative inline-block mb-4">
              Program Facilitators
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-800"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our dedicated program facilitators bring expertise and passion to deliver transformative educational and creative programs to our community.
            </p>
          </div>

          {/* Horizontal Scrolling Cards */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-6 pb-4" style={{ width: "max-content" }}>
                {programsManagers.map((manager) => (
                  <div
                    key={manager._id}
                    className="flex-shrink-0 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 min-w-[280px] group"
                  >
                    <div className="relative">
                      <img
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        src={manager.logo?.[0]?.link || "/default-avatar.jpg"}
                        alt={manager.fullName}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-800 transition-colors duration-300">
                        {manager.fullName}
                      </h3>
                      <p className="text-blue-600 italic text-sm mb-4">{manager.position}</p>

                      <div className="flex justify-center space-x-3">
                        <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                          <span className="text-xs font-bold">in</span>
                        </div>
                        <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                          <span className="text-xs font-bold">@</span>
                        </div>
                        <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                          <span className="text-xs font-bold">f</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient fade effects */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>

          {/* Scroll indicator */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              <span className="inline-block animate-bounce">←</span> Scroll to see all facilitators{" "}
              <span className="inline-block animate-bounce">→</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TheBoard;