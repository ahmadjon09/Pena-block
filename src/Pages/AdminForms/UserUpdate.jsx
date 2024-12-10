import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Axios from "../../Axios";
import { Section } from "../../Components/Section/Section";

export const UserUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState({
    newPassword: "",
  });

  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsPending(true);
        const { data } = (await Axios.get(`admin/${id}`)).data;
        for (const key in data) {
          setUserData((prev) => ({ ...prev, [key]: data[key] }));
        }
      } catch (error) {
        setIsError(error.response?.data?.message || "Хатолик юз берди.");
      } finally {
        setIsPending(false);
      }
    };
    getProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.put(`admin/${id}`, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
        phoneNumber: userData.phoneNumber,
        password: userData.newPassword,
      });
      navigate("/admins");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Section
      className={"bg-green-100 flex flex-col justify-center items-center"}
    >
      <form
        onSubmit={handleSubmit}
        className="w-[400px] flex flex-col gap-3 p-5 bg-white rounded-2xl shadow-xl"
      >
        <h1 className="text-center text-2xl font-bold">Админни янгилаш</h1>
        <input
          className="p-2 outline-none border-2 border-black rounded-2xl"
          type="text"
          placeholder="Исм"
          name="firstName"
          value={userData.firstName}
          onChange={handleInputChange}
        />
        <input
          className="p-2 outline-none border-2 border-black rounded-2xl"
          type="text"
          placeholder="Фамилия"
          name="lastName"
          value={userData.lastName}
          onChange={handleInputChange}
        />
        <input
          className="p-2 outline-none border-2 border-black rounded-2xl"
          type="number"
          placeholder="Телефон рақам"
          name="phoneNumber"
          value={userData.phoneNumber}
          onChange={handleInputChange}
        />
        <input
          className="p-2 outline-none border-2 border-black rounded-2xl"
          type="password"
          placeholder="Янги парол"
          name="newPassword"
          value={userData.newPassword}
          onChange={handleInputChange}
        />
        <div className="grid grid-cols-2 py-2 gap-3">
          <Link
            to="/"
            className="bg-black rounded-2xl flex justify-center text-white py-2"
          >
            Бекор қилиш
          </Link>
          <button
            type="submit"
            className="bg-blue-600 rounded-2xl text-white py-2"
          >
            Сақлаш
          </button>
        </div>
      </form>
    </Section>
  );
};
