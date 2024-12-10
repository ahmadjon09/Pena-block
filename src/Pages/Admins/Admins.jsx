import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../Axios";
import {
  getAdminsError,
  getAdminsPending,
  getAdminsSuccess,
} from "../../Toolkit/AdminsSlicer";
import { Pencil, Trash2 } from "lucide-react";

export const Admins = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isPending, isError } = useSelector((state) => state.admins);

  // Билдиришномаларни бошқариш учун ҳолат
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });

  useEffect(() => {
    const getAllAdmins = async () => {
      dispatch(getAdminsPending());
      try {
        const response = await Axios.get("admin");
        dispatch(getAdminsSuccess(response.data?.data || []));
      } catch (error) {
        dispatch(getAdminsError(error.response?.data?.message || "Номаълум хато"));
      }
    };
    getAllAdmins();
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Бу админни ўчиришга ишончингиз комилми?")) return;
    try {
      await Axios.delete(`admin/${id}`);
      dispatch(getAdminsSuccess(data.filter((admin) => admin._id !== id)));

      setAlert({ message: "Админ муваффақиятли ўчирилди", type: "success", visible: true });
    } catch (error) {
      setAlert({ message: error.response?.data?.message || "Админни ўчиришда хатолик юз берди", type: "error", visible: true });
    }

    setTimeout(() => {
      setAlert({ ...alert, visible: false });
    }, 3000);
  };

  return (
    <div className="p-8 bg-green-100 max-h-screen overflow-y-auto">

      {alert.visible && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition-opacity duration-300 
          ${alert.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          {alert.message}
        </div>
      )}

      <div className="w-full flex justify-between items-center p-4">
        <h1 className="text-3xl text-black">Админлар</h1>
        <button
          onClick={() => navigate("/create-admin")}
          className="bg-green-700 text-white px-4 py-2 rounded shadow hover:bg-blue-500 transition-colors"
        >
          Админ қўшиш
        </button>
      </div>

      {isPending ? (
        <table width={"100%"}>
          <tbody>
            {Array.from({ length: 1 }).map((_, index) => (
              <tr key={index} className="bg-gray-500 animate-pulse">
                <td className="py-3 px-6 border-b border-blue-500">
                  <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                </td>
                <td className="py-3 px-6 border-b border-blue-500">
                  <div className="w-24 h-4 bg-gray-600 rounded"></div>
                </td>
                <td className="py-3 px-6 border-b border-blue-500">
                  <div className="w-24 h-4 bg-gray-600 rounded"></div>
                </td>
                <td className="py-3 px-6 border-b border-blue-500">
                  <div className="w-32 h-4 bg-gray-600 rounded"></div>
                </td>
                <td className="py-3 px-4 border-b border-blue-500 text-center">
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : isError ? (
        <p className="text-red-500 text-center text-xl">Хато: {isError}</p>
      ) : data.length > 0 ? (
        <table className="min-w-full bg-blue-700 text-white shadow-lg">
          <thead className="bg-blue-500">
            <tr>
              <th className="py-3 px-6 text-left border-b border-green-700">
                Аватар
              </th>
              <th className="py-3 px-6 text-left border-b border-green-700">
                Исм
              </th>
              <th className="py-3 px-6 text-left border-b border-green-700">
                Фамилия
              </th>
              <th className="py-3 px-4 text-left border-b border-green-700">
                Телефон рақам
              </th>
              <th className="py-3 px-4 text-center border-b border-green-700">
                Ҳаракатлар
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-800">
            {data.map((admin) => (
              <tr
                key={admin._id}
                className="hover:bg-green-700 transition-colors"
              >
                <td className="py-1 px-6 border-b border-blue-500">
                  <img
                    src={
                      admin.avatar ||
                      "https://st3.depositphotos.com/5852012/15878/v/450/depositphotos_158781058-stock-illustration-photo-gallery-flat-icon-with.jpg"
                    }
                    alt="Аватар"
                    className="w-10 h-10 mt-1 rounded-full object-cover"
                  />
                </td>
                <td className="py-1 px-6 border-b border-blue-500">
                  {admin.firstName}
                </td>
                <td className="py-1 px-6 border-b border-blue-500">
                  {admin.lastName}
                </td>
                <td className="py-1 px-6 border-b border-blue-500">
                  {admin.phoneNumber}
                </td>
                <td className="py-1 px-4 border-b border-blue-500 text-center">
                  <div className="flex justify-center items-center gap-5">
                    <Link
                      to={`/edit-admin/${admin._id}`}
                      className="bg-sky-600 text-white rounded-md p-1 hover:bg-sky-700"
                    >
                      <Pencil className="text-white text-xs" />
                    </Link>
                    <button
                      onClick={() => handleDelete(admin._id)}
                      className={`bg-white ${data.length < 2 ? "hidden" : ""} rounded-md p-1" `}
                    >
                      <Trash2 className="text-green-600 text-xs hover:text-green-800 cursor-pointer" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 text-center text-lg mt-4">
          Админлар топилмади.
        </p>
      )}
    </div>
  );
};
