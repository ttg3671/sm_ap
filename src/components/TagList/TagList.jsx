import React from "react";
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
      className={`${className} w-full flex sm:justify-center items-center gap-4 whitespace-nowrap overflow-x-auto hide-scrollbar`}
    >
      {tags.map((tag, index) => {
        const isAdded = isItemAdded(tag.id);
        return (
          <button
            key={tag.id || index}
            className={`${
              isAdded 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-blue-500 cursor-pointer text-white hover:bg-blue-600'
            } px-4 py-2 rounded-md transition-colors flex-shrink-0`}
            onClick={() => {
              if (!isAdded) {
                handleClick(tag.id, tag.name, type_id, position);
              }
            }}
            disabled={isAdded}
            title={isAdded ? `"${tag.name}" is already added` : `Add "${tag.name}" to home page`}
          >
            {tag.name} {isAdded && '✓'}
          </button>
        );
      })}
    </div>
  );
};

export default TagList;