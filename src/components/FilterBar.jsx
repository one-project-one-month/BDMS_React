function FilterBar({ category, setCategory }) {

  const baseStyle = "flex items-center gap-2 px-4 py-2 rounded shadow w-fit";

  const inactive = "border-1 border-mauve-400 text-gray-500";

  const active =  "bg-red-500 text-white";

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">

      <button
        onClick={() => setCategory("all")}
        className={`${baseStyle} ${category === "all" ? active : inactive}`}
      >
        All
      </button>

      <button
        onClick={() => setCategory("emergency")}
        className={`${baseStyle} ${category === "emergency" ? active : inactive}`}
      >
       <img src={'/assets/emergency2.png'} alt="" className="w-7 h-7" />
        Emergency
      </button>

      <button
        onClick={() => setCategory("news")}
        className={`${baseStyle} ${category === "news" ? active : inactive}`}
      >
         <img src={'/assets/news.png'} alt="" className="w-7 h-7" />
        News
      </button>

      <button
        onClick={() => setCategory("awareness")}
        className={`${baseStyle} ${category === "awareness" ? active : inactive}`}
      >
        <img src={'/assets/awareness.png'} alt="" className="w-7 h-7" />
        Awareness
      </button>

    </div>
  );
}

export default FilterBar;