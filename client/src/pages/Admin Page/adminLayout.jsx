import { Outlet } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminLayout = () => {
  const { loading } = useLoading();

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
          <LoadingSpinner size="lg" />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default AdminLayout;