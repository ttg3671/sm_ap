import { useState, useEffect } from "react";

const DataForm = ({ handleSubmit, value = "", series_id = null, id = null, isAge }) => {
  const [val, setVal] = useState(value !== null && value !== undefined ? String(value) : "");

  // console.log(value, series_id, id);

  useEffect(() => {
    setVal(value !== null && value !== undefined ? String(value) : "");
  }, [value]);


  const onSubmit = (e) => {
    e.preventDefault();
    if (!val.trim()) return;
    handleSubmit(e, val, series_id, id); // Send value + optional id back to parent
    setVal(""); // Clear input after submission
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-4xl flex flex-col md:flex-row items-stretch gap-3 mb-6"
    >
      <input
        type={!isAge ? "text" : "number"}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="enter here..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <button
        type="submit"
        className="px-6 py-2 cursor-pointer bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 transition"
      >
        {id ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default DataForm;
