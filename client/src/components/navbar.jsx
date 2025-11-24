import { NavLink, useLocation } from 'react-router-dom'; 

export default function Navbar() { 
  const { pathname } = useLocation(); // Determine current page name for display
 const currentPage = pathname === '/' ? 'home' : pathname.startsWith('/about') ? 'about' : pathname.startsWith('/services') ? ( pathname === '/services' ? 'works' : pathname.includes('randoms') ? 'randoms' : pathname.includes('joshins') ? 'joshins' : 'services' ) : ''; 
 
return ( 
  
<nav className="p-4 bg-gray-800 text-white flex items-center justify-between"> 
   <div className="text-lg font-bold">Current: {currentPage}
    </div> 
    
   <ul className="flex bg-red-500 top-0 py-2 px-10 gap-2 justifty-between items-center"> 
   
      <NavLink to="/" className={({ isActive }) => isActive ? 'underline' : ''}>Home
      </NavLink>
    
      <NavLink to="/about" className={({ isActive }) => isActive ? 'underline' : ''}>About</NavLink> 
    
      <NavLink to="/services" className={({ isActive }) => pathname.startsWith('/services') ? 'underline' : ''}>services</NavLink> 
      
   </ul>
   
</nav> 
); 
} 