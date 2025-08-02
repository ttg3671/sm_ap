import { useState } from "react";
import { motion } from "framer-motion";
import { MdEdit, MdDelete, MdAddToQueue } from "react-icons/md";
import { HiViewGrid } from "react-icons/hi";

const DataList = ({ 
  itemList, 
  isAge, 
  isCategory, 
  isHome, 
  isUser = false, 
  isSeason = false, 
  onEdit, 
  onDelete, 
  getEpisode, 
  addEpisode,
  page = 1,
  totalPages = 1,
  onPageChange = () => {}
}) => {
  const [positions, setPositions] = useState({});

  const handleUpdateLocalPosition = (itemId, type, newPosition) => {
    setPositions(prevPositions => ({
      ...prevPositions,
      [itemId]: newPosition,
    }));

    onEdit(itemId, type, newPosition);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-700 to-gray-600 border-b border-gray-500">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  ID
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  {isSeason ? "Season Number" : !isAge ? "Name" : !isUser ? "Email" : "Age"}
                </div>
              </th>
              {isUser && (
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    Subscription Status
                  </div>
                </th>
              )}

              {isHome && (
                <>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      Position
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      Edit Position
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      Actions
                    </div>
                  </th>
                </>
              )}

              {!isCategory && !isHome && (
                <>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      Edit
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      Delete
                    </div>
                  </th>
                </>
              )}

              {isSeason && (
                <>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Add Episode
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      View Episodes
                    </div>
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-gradient-to-br from-gray-800 to-gray-700 divide-y divide-gray-600">
            {itemList.map((item, index) => (
              <motion.tr 
                key={`${item?.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 transition-all duration-200 group"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center text-white font-bold">
                      {index+1}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {item?.name || item?.age || item?.season_number || item?.email}
                </td>

              {isUser && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
                    {item?.subscriptionStatus}
                  </span>
                </td>
              )}

              {isHome && (
                <>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      {item?.position}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={positions[item.id] || ''}
                      onChange={(e) => handleUpdateLocalPosition(item?.id, item?.type, e.target.value)}
                      className="w-24 px-3 py-2 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                      placeholder="Position"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(item?.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 border border-red-500/30"
                    >
                      <MdDelete size={18} />
                    </motion.button>
                  </td>
                </>
              )}

              {!isCategory && !isHome && (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(item?.id, item?.name || item?.season_number)}
                      className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-200 border border-emerald-500/30"
                    >
                      <MdEdit size={18} />
                    </motion.button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(item?.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 border border-red-500/30"
                    >
                      <MdDelete size={18} />
                    </motion.button>
                  </td>
                </>
              )}

              {isSeason && (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addEpisode(item?.id, item?.season_number)}
                      className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 hover:text-green-300 transition-all duration-200 border border-green-500/30"
                    >
                      <MdAddToQueue size={18} />
                    </motion.button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => getEpisode(item?.id)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 hover:text-blue-300 transition-all duration-200 border border-blue-500/30"
                    >
                      <HiViewGrid size={18} />
                    </motion.button>
                  </td>
                </>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
      </div>

      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center mt-8 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-lg border border-gray-600"
            >
              Previous
            </motion.button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                      page === pageNum
                        ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-lg border border-gray-600"
            >
              Next
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DataList;
