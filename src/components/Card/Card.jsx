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
        <div className="w-full max-w-sm mx-auto">
            <div
                key={dataList?.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
                {dataList?.poster_image && (
                    <div className="relative overflow-hidden rounded-t-2xl">
                        <img
                            src={
                                typeof dataList?.poster_image === 'string'
                                    ? `${BASE_URL}${dataList?.poster_image}`
                                    : URL.createObjectURL(dataList?.poster_image)
                            }
                            alt={dataList?.title}
                            className="w-full h-48 object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                )}

                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{dataList?.title}</h3>

                        {!trending && (
                            <div className="mb-4 flex items-center justify-center gap-2">
                                <label htmlFor={`position-${dataList?.slider_id}`} className="text-sm text-gray-600 font-medium">
                                    Position:
                                </label>
                                <input
                                    id={`position-${dataList?.slider_id}`}
                                    type="number"
                                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={position}
                                    onChange={handlePositionChange}
                                    min={1}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 justify-center items-center mt-4">
                        {!trending && (
                            <>
                                <button
                                    onClick={() => onUpdate(dataList?.slider_id, dataList?.id, dataList?.type, position)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => onDelete(dataList?.slider_id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                        {trending && (
                            <button
                                onClick={() => onDelete(dataList?.id, dataList?.category_id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;