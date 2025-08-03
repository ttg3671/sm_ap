import { useState } from "react";
import { MdEdit, MdDelete, MdAddToQueue } from "react-icons/md";
import { HiViewGrid } from "react-icons/hi";

const DataList = ({ itemList, isAge, isCategory, isHome, isUser=false, isSeason = false, onEdit, onDelete, getEpisode, addEpisode }) => {
  // console.log(itemList);

  const [positions, setPositions] = useState({}); // Positions is now an object.

  const handleUpdateLocalPosition = (itemId, type, newPosition) => {
    // console.log(itemId, type, newPosition);

    // Update only the position for the specific itemId
    setPositions(prevPositions => ({
      ...prevPositions,
      [itemId]: newPosition,  // Update the position for the specific itemId
    }));

    onEdit(itemId, type, newPosition);
  };

  return (
    <table className="min-w-full text-sm text-gray-800">
      <thead className="bg-gray-200 text-left text-gray-600 uppercase text-xs tracking-wider">
        <tr>
          <th className="px-6 py-4">ID</th>
          <th className="px-6 py-4">
            {isSeason ? "Season Number" : !isAge ? "Name" : !isUser ? "Email" : "Age"}
          </th>
          {isUser && (
            <>
              <th className="px-6 py-4">Subscription Status</th>
            </>
          )}

          {isHome && (
            <>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Edit Position</th>
              <th className="px-6 py-4">Delete</th>
            </>
          )}

          {!isCategory && !isHome && (
            <>
              <th className="px-6 py-4">Edit</th>
              <th className="px-6 py-4">Delete</th>
            </>
          )}

          {isSeason && (
            <>
              <th className="px-6 py-6">Add Episodes</th>
              <th className="px-6 py-6">View Episodes</th>
            </>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {itemList.map((item, index) => (
          <tr key={`${item?.id}-${index}`} className="hover:bg-gray-50 transition duration-200">
            <td className="px-6 py-4 font-medium">{index+1}</td>
            <td className="px-6 py-4">{item?.name || item?.age || item?.season_number || item?.email}</td>

            {isUser && (
              <td className="px-6 py-4 font-medium">
                {item?.subscriptionStatus}
              </td>
            )}

            {isHome && (
                <>
                  <td className="px-6 py-4 font-medium">
                    {item?.position}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {/* Input field for video_id */}
                    <input
                      type="number"
                      value={positions[item.id]}
                      onChange={(e) => handleUpdateLocalPosition(item?.id, item?.type, e.target.value)}
                      className="w-24 px-2 py-1 border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDelete(item?.id)}
                      className="cursor-pointer text-red-600 hover:text-red-800"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </>
            )}


            {!isCategory && !isHome && (
              <>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onEdit(item?.id, item?.season_number)}
                    className="cursor-pointer text-indigo-600 hover:text-indigo-800"
                  >
                    <MdEdit size={20} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(item?.id)}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </>
            )}

            {isSeason && (
              <>
                <td className="px-6 py-4">
                  <button
                    onClick={() => addEpisode(item?.id, item?.season_number)}
                    className="cursor-pointer text-yellow-600 hover:text-yellow-800"
                  >
                    <MdAddToQueue size={20} />
                  </button>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => getEpisode(item?.id)}
                    className="cursor-pointer text-green-600 hover:text-green-800"
                  >
                    <HiViewGrid size={20} />
                  </button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataList;