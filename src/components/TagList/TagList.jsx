import React from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { incrementPosition } from '../../redux/position/position.actions';

const TagList = ({ tags, className, handleClick, type_id=null, existingItems=[] }) => {
  const dispatch = useDispatch();
  const position = useSelector(state => state.position.value);

  // Helper function to check if item already exists
  const isItemAdded = (tagId) => {
    const result = existingItems.some(item => {
      const matches = item.type_id === parseInt(tagId, 10) && 
                     item.type === String(type_id).trim();
      console.log('TagList checking:', { tagId, type_id, item, matches });
      return matches;
    });
    console.log('TagList isItemAdded result:', { tagId, type_id, result, existingItems });
    return result;
  };

  return (
    <div
      className={`${className} w-full flex sm:justify-start items-center gap-3 whitespace-nowrap overflow-x-auto hide-scrollbar`}
    >
      {tags.map((tag, index) => {
        const isAdded = isItemAdded(tag.id);
        return (
          <motion.button
            key={tag.id || index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: isAdded ? 1 : 1.05 }}
            whileTap={{ scale: isAdded ? 1 : 0.95 }}
            className={`${
              isAdded 
                ? 'bg-gray-600/50 cursor-not-allowed text-gray-400 border border-gray-500/50' 
                : 'bg-gradient-to-r from-amber-500 to-emerald-500 cursor-pointer text-white hover:from-amber-600 hover:to-emerald-600 border border-transparent shadow-lg'
            } px-6 py-3 rounded-xl font-medium transition-all duration-200 flex-shrink-0 backdrop-blur-sm`}
            onClick={() => {
              if (!isAdded) {
                handleClick(tag.id, tag.name, type_id, position);
              }
            }}
            disabled={isAdded}
            title={isAdded ? `"${tag.name}" is already added` : `Add "${tag.name}" to home page`}
          >
            <span className="flex items-center gap-2">
              {tag.name} 
              {isAdded && (
                <span className="text-green-400 text-sm">✓</span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default TagList;