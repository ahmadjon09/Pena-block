import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import Axios from '../../Axios';
import { getClientError, getClientPending, getClientSuccess } from '../../Toolkit/OneClientSlicer';
import { Eye } from 'lucide-react';

export function OneClient() {
  const { id } = useParams();
  const { data, isPending, isError } = useSelector((state) => state.onclient);
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' });
  const [devices, setDevices] = useState([]); // Changed to hold fetched device data

  useEffect(() => {
    const getOneClient = async () => {  
      dispatch(getClientPending());
      try {
        const response = await Axios.get(`client/getone/${id}`);
        const clientData = response.data.data;

        const deviceRequests = clientData.devices.map((deviceId) =>
          Axios.get(`devices/${deviceId}`)
        );
        const deviceResponses = await Promise.all(deviceRequests);
        const fetchedDevices = deviceResponses.map((res) => res.data);

        setDevices(fetchedDevices);
        dispatch(getClientSuccess(clientData));
      } catch (error) {
        dispatch(getClientError(error.message || 'Номаълум хато'));
      }
    };

    getOneClient();
  }, [dispatch, id]);

  const handleDelete = async (clientId) => {
    // Implement delete logic here
  };

  return (
    <div className="p-8 bg-green-100 max-h-screen overflow-y-auto">
      {alert.visible && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition-opacity duration-300 ${alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
        >
          {alert.message}
        </div>
      )}

      <div className="w-full flex justify-center items-center p-4">
        <h1 className="text-3xl text-black">{data.address}</h1>
      </div>
      {isPending ? (
        <table width="100%">
          <tbody>
            {Array.from({ length: 1 }).map((_, index) => (
              <tr key={index} className="bg-gray-500 animate-pulse">
                <td className="py-3 px-6 border-b border-blue-500">
                  <div className="w-24 h-4 bg-gray-600 rounded"></div>
                </td>
                <td className="py-3 px-6 border-b border-blue-500">
                  <div className="w-24 h-4 bg-gray-600 rounded"></div>
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
      ) : Object.keys(data).length > 0 ? (
        <table className="min-w-full bg-blue-700 text-white shadow-lg">
          <thead className="bg-blue-500">
            <tr>
              <th className="py-3 px-6 text-left border-b border-green-700">Тиббий аппарат номи</th>
              <th className="py-3 px-6 text-left border-b border-green-700">Ишлаб чиқарган давлат</th>
              <th className="py-3 px-4 text-center border-b border-green-700">Завод рақами</th>
              <th className="py-3 px-4 text-center border-b border-green-700">Ишлаб чиқарилган йили</th>
              <th className="py-3 px-4 text-center border-b border-green-700">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-800">
            {devices.length > 0 ? (
              devices.map((item) => (
                <tr key={item._id} className={`hover:bg-green-700 transition-colors ${item.technicalCondition ? '' : 'bg-red-400'}`}>
                  <td className="py-1 px-6 border-b border-blue-500">{item.deviceName}</td>
                  <td className="py-1 px-6 border-b border-blue-500">{item.country}</td>
                  <td className="py-1 px-6 border-b border-blue-500">{item.factoryNumber}</td>
                  <td className="py-1 px-6 border-b border-blue-500">{item.yearOfProduction}</td>
                  <td className="py-1 px-4 border-b border-blue-500 text-center">
                    <Eye />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-3xl">No Devices</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 text-center text-lg mt-4">Client топилмади.</p>
      )}
    </div>
  );
}
