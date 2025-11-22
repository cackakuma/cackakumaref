const NoDataMessage = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default NoDataMessage;