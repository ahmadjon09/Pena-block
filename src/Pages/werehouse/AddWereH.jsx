import React, { useState } from "react";
import Axios from "../../Axios";
import { Section } from "../../Components/Section/Section";
import { useDispatch, useSelector } from "react-redux";
import { getClientsPending, getClientsSuccess, getClientsError } from "../../Toolkit/ClientSlicer";
import { useNavigate } from "react-router-dom";

export const AddWereH = () => {
    const [error, setError] = useState("");
    const [warehouseData, setWarehouseData] = useState({
        name: "",
        phoneNumber: "",
    });
    const { isPending } = useSelector((state) => state.clients);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        dispatch(getClientsPending());
        try {
            const res = await Axios.post("/warehouse/create", warehouseData);
            dispatch(getClientsSuccess(res.data));
            setWarehouseData({ name: "", phoneNumber: "" });
            navigate("/");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Хатолик юз берди";
            setError(errorMessage);
            dispatch(getClientsError(errorMessage));
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWarehouseData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <Section>
            <form
                onSubmit={handleFormSubmit}
                className="flex flex-col space-y-4 w-full mx-auto mt-14 md:w-[500px]"
            >
                <h1 className="text-4xl text-center">Yangi Ombor</h1>

                <label htmlFor="name" className="sr-only">Ombor Ismi</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    onChange={handleInputChange}
                    value={warehouseData.name}
                    placeholder="Ombor nomi"
                    required
                />

                <label htmlFor="phoneNumber" className="sr-only">Telefon Raqam</label>
                <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    onChange={handleInputChange}
                    value={warehouseData.phoneNumber}
                    placeholder="Telefon raqam"
                    required
                />

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                    type="submit"
                    disabled={isPending}
                    className={`bg-green-700 w-full text-xl py-2 rounded-md text-white ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {isPending ? "Юкланмоқда..." : "Юбориш"}
                </button>
            </form>
        </Section>
    );
};
