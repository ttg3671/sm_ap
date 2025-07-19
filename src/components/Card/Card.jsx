import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_IMG_URL;

const Card = ({ dataList, onDelete, onUpdate, trending = "false" }) => {
    const [position, setPosition] = useState(
        typeof dataList?.position === 'number' ? dataList.position : 0
    );

    const handlePositionChange = (e) => {
        const newValue = e.target.value;
        const numericValue = newValue === '' ? '' : parseInt(newValue, 10);

        setPosition(numericValue);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border-0">
            <div
                key={dataList?.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col p-4 items-center"
            >
                {dataList?.poster_image && (
                    <img
                        src={
                            typeof dataList?.poster_image === 'string'
                                ? `${BASE_URL}${dataList?.poster_image}`
                                : URL.createObjectURL(dataList?.poster_image)
                        }
                        alt={dataList?.title}
                        className="w-full h-32 object-cover transition-transform duration-500 ease-in-out hover:scale-105 rounded-xl"
                        loading="lazy"
                    />
                )}

                <div className="mt-4 text-center w-full">
                    <h3 className="text-lg font-semibold">{dataList?.title}</h3>

                    {!trending && (
                        <div className="mt-2 flex items-center justify-center gap-2">
                            <label htmlFor={`position-${dataList?.slider_id}`} className="text-sm text-gray-600">
                                Position:
                            </label>
                            <input
                                id={`position-${dataList?.slider_id}`}
                                type="number"
                                className="w-16 border rounded-md px-2 py-1 text-center text-sm"
                                value={position}
                                onChange={handlePositionChange}
                                min={1}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-4 mb-2 flex gap-2 justify-center items-center">
                    {!trending && (
                        <>
                            <button
                                onClick={() => onUpdate(dataList?.slider_id, dataList?.id, dataList?.type, position)}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => onDelete(dataList?.slider_id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                            >
                                Delete
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => onDelete(dataList?.id, dataList?.category_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;