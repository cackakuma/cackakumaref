import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const GeneralNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "HOME", exact: true },
    { to: "/programs", label: "PROGRAMS" },
    { to: "/board", label: "THE BOARD" },
    { to: "/about", label: "ABOUT CAC" }
  ];

  const Navbar = () => {
    return(
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="fixed top-4 right-4 w-[75%] max-w-[250px]">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-gray-100">
            {/* Close Button */}
            <button 
              className="flex items-center justify-center w-6 h-6 ml-auto mb-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Navigation Links */}
            <nav className="space-y-1">
              {navLinks.map(({ to, label, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center w-full p-3 text-xs font-medium rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
                    }`
                  }
                >
                  <span>{label}</span>
                  {({ isActive }) => isActive && (
                    <svg className="w-3 h-3 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Contact Information */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-800 mb-2">Contact Us</h3>
              <div className="space-y-1.5">
                <div className="flex items-start space-x-1.5">
                  <svg className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[10px] text-gray-600 leading-tight">
                    Kakuma Refugees Camp<br/>
                    Kakuma 3, Zone 6, Block 6<br/>
                    Near Burundian Market
                  </p>
                </div>
                <div className="flex items-center space-x-1.5">
                  <svg className="w-3 h-3 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <p className="text-[10px] text-gray-600">+254796496853</p>
                </div>
                <div className="flex items-center space-x-1.5">
                  <svg className="w-3 h-3 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <p className="text-[10px] text-gray-600">cackakuma@cac.org</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
 
  const MenuBar = () => {
    return (
      <div 
        className="fixed z-20 top-4 right-4 cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-lg p-2 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex flex-col space-y-1 w-4 h-4">
            <div className="w-full h-0.5 bg-gray-700 group-hover:bg-blue-600 transition-colors duration-300"></div>
            <div className="w-full h-0.5 bg-gray-700 group-hover:bg-blue-600 transition-colors duration-300"></div>
            <div className="w-full h-0.5 bg-gray-700 group-hover:bg-blue-600 transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    );
  };

  return(
    <div className="z-20">
      {isOpen ? <Navbar /> : <MenuBar />}
    </div>
  );
}

export default GeneralNavbar;