import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrograms } from "../../services/AdminApi";

const ProgramsNav = () => {
  const [navLinks, setNavLinks] = useState([{ to: "/programs/more", label: "More" }]);

  const slugify = (title) => (
    (title || "program")
      .toLowerCase()
      .replace(/[^a-z0-9\s_-]/g, "")
      .trim()
      .replace(/\s+/g, "_")
  );

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await getPrograms();
        const programs = Array.isArray(resp) ? resp : (resp?.data || []);
        const dynamic = programs.map(p => ({
          to: `/programs/${slugify(p.title)}`,
          label: p.title || "Program"
        }));
        setNavLinks([...dynamic, { to: "/programs/more", label: "More" }]);
      } catch {
        setNavLinks([
          { to: "/programs/more", label: "More" }
        ]);
      }
    };
    load();
  }, []);

  return (
    <nav className="fixed top-16 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-5 py-2 snap-x snap-mandatory">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-none px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 min-w-max ${
                  isActive
                    ? "bg-gradient-to-br from-blue-800 to-blue-500 text-white shadow-md "
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default ProgramsNav;