import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Axios from "../../Axios";
import { Section } from "../../Components/Section/Section";

export const UpdateClient = () => {
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
                const { data } = (await Axios.get(`client/getone/${id}`)).data;
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
            const { data } = await Axios.put(`client/${id}`, {
                gmail: userData.gmail,
                address: userData.address,
                password: userData.newPassword,
            });
            navigate("/clients");
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
                <h1 className="text-center text-2xl font-bold">Клиентлар янгилаш</h1>
                <input
                    className="p-2 outline-none border-2 border-black rounded-2xl"
                    type="email"
                    placeholder="Gmail рақам"
                    name="gmail"
                    value={userData.gmail}
                    onChange={handleInputChange}
                />

                <select
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2 w-full"
                >
                    <option value="Поп ТТБ">Поп ТТБ</option>
                    <option value="Чуст ТТБ">Чуст ТТБ</option>
                    <option value="Туракургон ТТБ">Туракургон ТТБ</option>
                    <option value="Косонсой ТТБ">Косонсой ТТБ</option>
                    <option value="Мингбулок ТТБ">Мингбулок ТТБ</option>
                    <option value="Норин ТТБ">Норин ТТБ</option>
                    <option value="Наманган ТТБ">Наманган ТТБ</option>
                    <option value="Учкургон ТТБ">Учкургон ТТБ</option>
                    <option value="Уйчи ТТБ">Уйчи ТТБ</option>
                    <option value="Чорток ТТБ">Чорток ТТБ</option>
                    <option value="Янгикургон ТТБ">Янгикургон ТТБ</option>
                    <option value="Давлатобод ТТБ">Давлатобод ТТБ</option>
                    <option value="Наманган ШТБ">Наманган ШТБ</option>
                    <option value="Янги Наманган ТТБ">Янги Наманган ТТБ</option>
                </select>
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
                        to="/clients"
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
