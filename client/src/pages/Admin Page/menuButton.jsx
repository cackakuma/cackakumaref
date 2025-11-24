const Menu = () => {
  return(
    <div className="fixed top-4 right-4 z-50">
      <button className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <div className="flex flex-col space-y-1 w-6 h-6">
          <div className="w-full h-0.5 bg-gray-700 group-hover:bg-blue-600 transition-colors duration-300"></div>
          <div className="w-full h-0.5 bg-gray-700 group-hover:bg-blue-600 transition-colors duration-300"></div>
          <div className="w-full h-0.5 bg-gray-700 group-hover:bg-blue-600 transition-colors duration-300"></div>
        </div>
      </button>
    </div>
  )
};