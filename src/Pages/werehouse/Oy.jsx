import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import Axios from "../../Axios";
import { getClientsPending, getClientsSuccess, getClientsError } from "../../Toolkit/ClientSlicer";

export function Oy() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data, isPending, isError } = useSelector((state) => state.clients);
    const [filteredData, setFilteredData] = useState(data);
    const [selectedWich, setSelectedWich] = useState(null);

    useEffect(() => {
        const getAllClients = async () => {
            dispatch(getClientsPending());
            try {
                const response = await Axios.get("client");
                dispatch(getClientsSuccess(response.data || []));
            } catch (error) {
                dispatch(getClientsError(error.response?.data?.message || "Номаълум хато (get client)"));
            }
        };
        getAllClients();
    }, [dispatch]);

    useEffect(() => {
        // Filter data by `wich` if a filter is active
        if (selectedWich) {
            setFilteredData(data.filter((client) => client.wich === selectedWich));
        } else {
            setFilteredData(data);
        }
    }, [selectedWich, data]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("uz-UZ", { style: "currency", currency: "UZS" }).format(price);
    };

    // Group data by month and calculate totals
    const monthlyIncome = filteredData.reduce((acc, client) => {
        const month = moment(client.createdAt).tz("Asia/Tashkent").format("MM.YYYY");
        if (!acc[month]) {
            acc[month] = 0;
        }
        acc[month] += client.price || 0; // Add the client's price to the total for the month
        return acc;
    }, {});

    const totalsArray = Object.entries(monthlyIncome).map(([month, total]) => ({
        month,
        income: total,
    }));

    return (
        <div className="p-8 bg-green-100 max-h-screen overflow-y-auto">
            {/* Clients Table */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Clients</h2>
                <table className="min-w-full bg-gray-800 text-white shadow-lg">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="py-3 px-6 text-left">Wich</th>
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((client) => (
                            <tr
                                key={client._id}
                                className="odd:bg-gray-700 even:bg-gray-600 cursor-pointer hover:bg-gray-500"
                                onClick={() => setSelectedWich(client.wich)}
                            >
                                <td className="py-2 px-6 border-b">{client.wich}</td>
                                <td className="py-2 px-6 border-b">{client.name}</td>
                                <td className="py-2 px-6 border-b">{formatPrice(client.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Monthly Income Report */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-700">
                    {selectedWich ? `Oylik Daromad (${selectedWich})` : "Oylik Daromad"}
                </h2>
                <button
                    onClick={() => setSelectedWich(null)}
                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Clear Filter
                </button>
                <table className="min-w-full bg-gray-800 text-white shadow-lg">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="py-3 px-6 text-left">Oy</th>
                            <th className="py-3 px-6 text-left">Jami Daromad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {totalsArray.map((total) => (
                            <tr key={total.month} className="odd:bg-gray-700 even:bg-gray-600">
                                <td className="py-2 px-6 border-b">{total.month}</td>
                                <td className="py-2 px-6 border-b">{formatPrice(total.income)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
