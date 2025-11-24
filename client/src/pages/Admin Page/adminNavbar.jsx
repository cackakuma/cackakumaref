import {Outlet, NavLink, useLocation} from "react-router-dom";

const AdminNavBar = () => {
  const { pathname } = useLocation();
  return(
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16" class="scrollbar-hide">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CAC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-500">Creative Arts Chapter</p>
            </div>
          </div>
          
          {/* Navigation Links */}
          <ul className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            <li>
              <NavLink 
                to="/admin/cac" 
                end
                className={({ isActive}) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/admin/cac/members" 
                className={({ isActive}) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`
                }
              >
                Members
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/admin/cac/programs" 
                className={({ isActive}) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`
                }
              >
                Programs
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/admin/cac/posts" 
                className={({ isActive}) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`
                }
              >
                Posts
              </NavLink>
            </li>
            
           <li>
              <NavLink 
                to="/admin/cac/partners" 
                className={({ isActive}) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`
                }
              >
                Partners
              </NavLink>
            </li> 
            
          </ul>
          
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">A</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <Outlet />
    </>
    )
};

export default AdminNavBar;
  