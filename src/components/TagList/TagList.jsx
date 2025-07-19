import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { incrementPosition } from '../../redux/position/position.actions';

const TagList = ({ tags, className, handleClick, type_id=null }) => {
  const dispatch = useDispatch();
  const position = useSelector(state => state.position.value);

  // console.log(position);
  // console.log(type_id);

  return (
    <div
      className={`${className} w-full flex sm:justify-center items-center gap-4 whitespace-nowrap overflow-x-auto hide-scrollbar`}
    >
      {tags.map((tag, index) => (
        <button
          key={tag.id || index}
          className={`bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex-shrink-0`} // Add flex-shrink-0
          onClick={() => handleClick(tag.id, tag.name, type_id, position)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default TagList;