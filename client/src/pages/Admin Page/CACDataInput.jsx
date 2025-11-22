import { Routes, Route, NavLink } from "react-router-dom";
import CAC from "./cac";
import Members from "./members";
import Programs from "./programs";
import Posts from "./posts";
import NoPage from "./noPage";
import Partner from "./Partners";
const navLinks = [
  { path: "/admin/cac", label: "Dashboard", end: true },
  { path: "/admin/cac/members", label: "Members" },
  { path: "/admin/cac/programs", label: "Programs" },
  { path: "/admin/cac/posts", label: "Posts" },
  { path: "/admin/cac/partners", label: "Partners" },
];

const Sidebar = () => (
  <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-blue-800 to-blue-900 min-h-screen fixed left-0 top-0 shadow-2xl">
    <div className="p-6 bg-blue-900 border-b border-blue-700">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <span className="text-blue-800 font-bold text-lg">CAC</span>
        </div>
        <div>
          <h2 className="text-white text-lg font-bold">Admin Panel</h2>
          <p className="text-blue-200 text-xs">Creative Arts Chapter</p>
        </div>
      </div>
    </div>
    <nav className="flex-1 pt-6">
      {navLinks.map(({ path, label, end }) => (
        <NavLink
          key={path}
          to={path}
          end={end}
          className={({ isActive }) =>
            `block px-6 py-4 mx-3 rounded-lg transition-all duration-300 ${
              isActive 
                ? 'bg-white text-blue-800 font-semibold shadow-lg transform scale-105' 
                : 'text-blue-100 hover:bg-blue-700 hover:text-white hover:shadow-md'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  </div>
);

const MobileNav = () => (
  <div className="md:hidden">
    <div className="bg-gradient-to-r from-blue-800 to-blue-900 fixed top-0 left-0 w-full z-10 shadow-lg">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-800 font-bold">CAC</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Admin Panel</h1>
            <p className="text-blue-200 text-xs">CAC, Kakuma-Kenya</p>
          </div>
        </div>
        <nav className="flex overflow-x-auto whitespace-nowrap space-x-2">
          {navLinks.map(({ path, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                  isActive 
                    ? 'bg-white text-blue-800 shadow-md' 
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  </div>
);

const CACDataInput = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Sidebar />
      <MobileNav />
      
      <div className="md:ml-64">
        <div className="pt-24 md:pt-8 px-4 md:px-8">
          <Routes>
            <Route index element={<CAC />} />
            <Route path="members" element={<Members />} />
            <Route path="programs" element={<Programs />} />
            <Route path="posts" element={<Posts />} />
            <Route path="partners" element={<Partner />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CACDataInput;