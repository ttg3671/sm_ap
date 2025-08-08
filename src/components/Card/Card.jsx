import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_IMG_URL;

const Card = ({ dataList, onDelete, onUpdate, trending = "false", isSlider = "true" }) => {
    const [position, setPosition] = useState(
        typeof dataList?.position === 'number' ? dataList.position : 0
    );

    const handlePositionChange = (e) => {
        const newValue = e.target.value;
        const numericValue = newValue === '' ? '' : parseInt(newValue, 10);

        setPosition(numericValue);
    };

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState(null); // Store ID and type

    const confirmDelete = () => {
        if (deleteInfo) {
          onDelete(...deleteInfo); // Spread args: video_id, category_id, etc.
        }
        setShowConfirm(false);
        setDeleteInfo(null);
    };

    const handleDelete = (...args) => {
        setDeleteInfo(args);
        setShowConfirm(true);
    };

    // console.log(dataList);

    return (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border-0">
            <div
                key={dataList?.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col p-4 items-center"
            >
                {isSlider && dataList?.poster_image && (
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

                {isSlider && (
                    <>
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
                                        className="bg-blue-500 cursor-pointer text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dataList?.slider_id)}
                                        className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => handleDelete(dataList?.id, dataList?.category_id)}
                                className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}

                {!isSlider && (
                    <>
                       <img
                            src={
                                typeof dataList?.thumbnail_url === 'string'
                                    ? `${BASE_URL}${dataList?.thumbnail_url}`
                                    : URL.createObjectURL(dataList?.thumbnail_url)
                            }
                            alt={dataList?.video}
                            className="w-full h-32 object-cover transition-transform duration-500 ease-in-out hover:scale-105 rounded-xl"
                            loading="lazy"
                        />

                        <div className="mt-4 mb-2 flex gap-2 justify-center items-center">
                            <>
                                <button
                                    onClick={() => onUpdate(dataList?.video)}
                                    className="bg-blue-500 cursor-pointer text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => handleDelete(dataList?.video)}
                                    className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                                >
                                    Delete
                                </button>
                            </>
                        </div>
                    </>
                )}
            </div>
        </div>
        {showConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm">
                <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                <p className="text-gray-700 mb-6">Are you sure you want to delete this item?</p>
                <div className="flex justify-end gap-4">
                  <button
                    className="px-4 py-2 cursor-pointer rounded border border-gray-300 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setShowConfirm(false);
                      setDeleteInfo(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 cursor-pointer rounded bg-red-500 text-white text-sm hover:bg-red-600"
                    onClick={() => onDelete(dataList?.video || dataList?.slider_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
        )}
        </>
    );
};

export default Card;