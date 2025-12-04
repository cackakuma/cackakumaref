const LoadingScreen = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-50 backdrop-blur-sm pointer-events-none min-h-screen">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );
};

export default LoadingScreen;
