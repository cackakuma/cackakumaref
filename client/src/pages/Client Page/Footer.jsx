import { useEffect, useState } from "react";
import { getPrograms, getPartners } from "../services/AdminApi";

const Footer = () => {
  
  const newYear = new Date();
  
  const [quickLinks, setQuickLinks] = useState([]);
  const [partners, setPartners] = useState([])
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
        const partnersResp = await getPartners();
        const programs = Array.isArray(resp) ? resp : (resp?.data || []);
        setQuickLinks(programs.map(p => ({ name: p.title || "Program", path: `/programs/${slugify(p.title)}` })));
        setPartners(Array.isArray(partnersResp) ? partnersResp : (partnersResp?.data || []))
      } catch (e) {
        setQuickLinks([]);
        setPartners([]);
        console.error("Error fetching programs or partners for footer:", e.message);
      }
    };
    load();
  }, []);


  const socialLinks = [
    { name: "Facebook", icon: "/images/fb.png", url: "https://www.facebook.com/" },
    { name: "Instagram", icon: "/images/ig.png", url: "https://www.instagram.com/" },
    { name: "LinkedIn", icon: "/images/in.png", url: "https://www.linkedin.com/" },
    { name: "TikTok", icon: "/images/tk.png", url: "https://www.tiktok.com/" },
    { name: "YouTube", icon: "/images/yt.png", url: "https://www.youtube.com/" }
  ];
  
  return(
    <>
    <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              Quick Links
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-white"></div>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path}
                    className="text-blue-100 hover:text-white transition-colors duration-300 text-sm hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Partners */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              Our Partners
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-white"></div>
            </h3>
            <ul className="space-y-3">
            
              {partners.map((partner) => (
                <li key={partner._id}>
                  <a href={`https://www.${partner.officialSite}`} >
                  <span className="text-blue-100 text-sm">
                    {partner.partnerName}
                  </span>
                </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              Contact Us
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-white"></div>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-200 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Kakuma 3, Zone 2, Block 6,<br/>
                    Opposite Burundian Market, Near Don Bosco,<br/>
                    CAC-Kakuma, Kenya
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <p className="text-blue-100 text-sm">cackakuma@cac.org</p>
                  <p className="text-blue-100 text-sm">+254756893110</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <p className="text-blue-100 text-sm">+254796496853</p>
                  <p className="text-blue-100 text-sm">Fulgence Niyukuri, Communication Officer</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Media & Help Desk */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              Follow Us
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-white"></div>
            </h3>
            
            {/* Social Media Links */}
            <div className="flex flex-wrap gap-3 mb-6">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all duration-300 hover:scale-110"
                >
                  <img 
                    src={social.icon} 
                    alt={social.name}
                    className="w-6 h-6 object-contain"
                  />
                </a>
              ))}
            </div>
            
            {/* Help Desk */}
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Help Desk & Feedback</h4>
              <p className="text-blue-100 text-sm mb-2">communityhelpfeed@cac.org</p>
              <p className="text-blue-200 text-xs">
                Raise any issue or provide feedback on our services
              </p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-blue-700 mt-12 pt-6">
          <div className="text-center">
            <p className="text-blue-200 text-sm">
              © {newYear.getFullYear()} Creative Arts Centre (CAC). All rights reserved.
            </p>
            <p className="text-blue-300 text-xs mt-2">
              Empowering refugees through creative arts and education
            </p>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}

export default Footer;