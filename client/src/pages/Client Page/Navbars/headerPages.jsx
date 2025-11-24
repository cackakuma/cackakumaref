import GeneralNavbar  from "./GeneralNavbar";


const Header = ({text})=> {
    return(
           
        <div className="flex items-center bg-blue-700 fixed top-0 left-0 w-full z-45 shadow-lg">
        <div className="flex items-center p-3 max-w-7xl mx-auto w-full">
          <img 
            className="h-10 w-10 object-cover bg-white rounded-lg" 
            src="/images/trial no bg image.png" 
            alt="CAC Logo"
          />
          <h2 className="pl-5 text-xl md:text-2xl font-bold text-white">{text}</h2>
        </div>    
        <GeneralNavbar />
      </div>
    )
}

export default Header;