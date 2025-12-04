const LoadingScreen = () => {
  return (
    <div className="fixed top-20 inset-0 bg-white bg-opacity-40 flex items-center justify-center z-[9999]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );
};

export default LoadingScreen;
