
import {useState,useEffect} from "react";
import {getPosts} from "../../services/AdminApi";
import { useLoading } from "../../../context/LoadingContext";

const More = () => {
  
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const { setLoading } = useLoading();
  
  useEffect(() => {
     loadPosts();
  }, [])

  
  const loadPosts = async () => {
    try {
        setLoading(true);
        setError(null);
        const data = await getPosts();
        
       if (Array.isArray(data)) {
        setPosts(data);
      } else if (data?.data && Array.isArray(data.data)) {
        setPosts(data.data);
      } else {
        setPosts([]);
      }
    } catch (err) {
      setError('Failed to load posts');
      setPosts([]);
    }
    finally {
      setLoading(false);
    }
    
  }
  
  
  
  const inkludes = ["Get Updates on:", "Jobs", "Our Daily Works", "Admission / Joining Us", "Programs Privileges"]
  
  
  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        
         <div className="fixed w-full z-30 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow">
           <h2 className="text-xl md:text-2xl font-bold text-blue-800 px-4 md:px-6 py-4">
           CAC Blogsite
           </h2>
            <div className="bg-blue-50 px-4 md:px-6 py-2">
              <div className="flex overflow-x-auto gap-2 scrollbar-hide">
                {inkludes.map((ink, index) => (
                  <div key={index} className="flex-shrink-0">
                    <h2 className="bg-white text-blue-700 text-sm font-medium px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-50 transition-colors duration-150 cursor-pointer whitespace-nowrap">
                    {ink}
                    </h2>
                  </div>
                ))}
              </div>
            </div>
         </div>
         

           
           {error && (
             <div className="pt-32 px-4 max-w-6xl mx-auto">
               <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                 <p className="text-red-600 font-semibold">{error}</p>
               </div>
             </div>
           )}
           {posts.length > 0 ? (
            <div className="pt-32 pb-16 px-4 max-w-6xl mx-auto">
              <div className="max-w-4xl mx-auto space-y-8">
                {posts.map(post => (
                  
                 <div className="bg-white border border-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden" key={post._id}>
                 
                 <div className="p-6 md:p-8">
                   <div className="flex items-start space-x-4 mb-6">
                    <img className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-blue-600 shadow-md flex-shrink-0" src="/images/logo bg.png"/>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl md:text-2xl font-bold text-blue-800 leading-tight mb-2">
                      {post.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-blue-100">
                        <h2 className="text-sm md:text-base font-light italic text-gray-600">
                        {post.typper}
                        </h2>
                        
                       <h2 className="text-sm md:text-base font-semibold italic text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        {post.category}
                        </h2>
                      </div>
                    </div>
                   </div>
                 
                  {post.pics.length === 1 ? (
                   <div className="mb-6">
                     <div className="rounded-2xl overflow-hidden shadow-md">
                        <img className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-300" src={post.pics[0].link}/>
                      </div>
                    </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                       {post.pics.map((pic, index) => (
                         <div key={index} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                           <img className="w-full h-32 md:h-40 object-cover hover:scale-105 transition-transform duration-300" src={pic.link}/>
                         </div>
                       ))}
                      </div>
                    )}
                        <div className="prose prose-gray max-w-none">
                          <p className="text-gray-700 text-base md:text-lg leading-relaxed">{post.description}</p>
                        </div>
                 </div>
               </div>
             ))}
            </div>
          </div>
        ) : (
          <div className="pt-32 px-4 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6 text-center border border-blue-100">
              <p className="text-gray-600">No posts available</p>
            </div>
          </div>
        )}
     </div>
    
    );
};

export default More;