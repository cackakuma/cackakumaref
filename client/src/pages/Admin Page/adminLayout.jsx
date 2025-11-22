import { Outlet, NavLink } from 'react-router-dom';
import adminNavbar from './adminNavbar';

const Layout = () => {
  return (
    <>
      <adminNavbar />
      <div className="pb-16 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
        <div className="flex items-center gap-3 mx-[5%] py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CAC</span>
            </div>
            <h1 className="text-3xl font-bold text-blue-800">
              Admin Dashboard
            </h1>
          </div>
        </div>
        
        <div className="mx-[5%] mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <NavLink
                to="/admin/cac"
                end
                className={({ isActive }) =>
                  `flex-1 text-center py-4 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/cac/members"
                className={({ isActive }) =>
                  `flex-1 text-center py-4 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md'
                  }`
                }
              >
                Members
              </NavLink>
              <NavLink
                to="/admin/cac/programs"
                className={({ isActive }) =>
                  `flex-1 text-center py-4 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md'
                  }`
                }
              >
                Programs
              </NavLink>
              <NavLink
                to="/admin/cac/posts"
                className={({ isActive }) =>
                  `flex-1 text-center py-4 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md'
                  }`
                }
              >
                Posts
              </NavLink>
       
           <NavLink
                to="/admin/cac/partners"
                className={({ isActive }) =>
                  `flex-1 text-center py-4 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md'
                  }`
                }
              >
                Partners
              </NavLink>
              
            </div>
          </div>
        </div>
        
        <div className="mx-[5%]">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout; 