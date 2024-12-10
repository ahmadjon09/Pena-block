import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../../Axios";
import { Section } from "../../Components/Section/Section";
import {
    getClientsPending,
    getClientsSuccess,
    getClientsError,
} from "../../Toolkit/ClientSlicer";

export const NewClient = () => {
    const [error, setError] = useState("");
    const [clientData, setClientData] = useState({
        name: "",
        count: "",
        price: "",
        type: "",
        phoneNumber: "",
        unit: "son",
        totalPrice: 0,
    });
    const { isPending } = useSelector((state) => state.clients);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        dispatch(getClientsPending());

        try {
            const { data } = await Axios.post("/client/create", {
                name: clientData.name,
                count: clientData.count,
                price: clientData.totalPrice,
                type: clientData.type,
                phoneNumber: clientData.phoneNumber,
            });
            dispatch(getClientsSuccess(data.data));
            setClientData({
                name: "",
                count: 0,
                price: 0,
                type: "",
                phoneNumber: 0,
                unit: "son",
                totalPrice: 0,
            });
            navigate("/clients");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Хатолик юз берди";
            setError(errorMessage);
            dispatch(getClientsError(errorMessage));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setClientData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            const price = parseFloat(updatedData.price) || 0;
            const count = parseFloat(updatedData.count) || 0;

            // Umumiy narx faqat `count` va `price` asosida hisoblanadi
            updatedData.totalPrice = price * count;

            return updatedData;
        });
    };

    return (
        <Section>
            <form
                onSubmit={handleFormSubmit}
                className="flex flex-col space-y-3 w-full mx-auto mt-14 md:w-[500px]"
            >
                <h1 className="text-4xl text-center">Yangi Buyurtma</h1>

                <input
                    id="name"
                    type="text"
                    name="name"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    onChange={handleInputChange}
                    placeholder="Client Name"
                    value={clientData.name}
                    required
                />

                <div className="flex gap-2">
                    <input
                        id="count"
                        type="number"
                        name="count"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        onChange={handleInputChange}
                        placeholder="Soni"
                        value={clientData.count}
                        min="0"
                        required
                    />
                    <input
                        id="price"
                        type="number"
                        name="price"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        onChange={handleInputChange}
                        placeholder="Narxi"
                        value={clientData.price}
                        min="0"
                        required
                    />
                </div>

                <div className="flex gap-2">
                    <input
                        id="type"
                        type="text"
                        name="type"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        onChange={handleInputChange}
                        placeholder="Turi"
                        value={clientData.type}
                        required
                    />
                    <select
                        name="unit"
                        value={clientData.unit}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="son">son</option>
                    </select>
                </div>

                <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    pattern="[0-9]*"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    onChange={handleInputChange}
                    placeholder="Tel raqam"
                    value={clientData.phoneNumber}
                    required
                />

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                {clientData.totalPrice > 0 && (
                    <p className="text-green-500 text-lg mt-2">
                        Umumiy narx: {clientData.totalPrice.toLocaleString("uz-UZ", {
                            style: "currency",
                            currency: "UZS",
                        })}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className={`bg-green-700 w-full text-xl py-2 rounded-md text-white ${isPending ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {isPending ? "Юкланмоқда..." : "Юбориш"}
                </button>
            </form>
        </Section>
    );
};
