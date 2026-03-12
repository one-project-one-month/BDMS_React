import {
  ExclamationTriangleIcon,
}from "@heroicons/react/24/outline";

type CardProps = {
  title: string;
  description: string;
  emergencyButton: string;
  category: string;
  time: string;
  image: string;
};

function Card({ title, description, time, image,emergencyButton, category }: CardProps) {
  return (

    <div className="bg-white max-w-5xl shadow-md rounded-md flex flex-col md:flex-row overflow-hidden">

      {/* TEXT AREA */}
      <div className="md:w-2/3 p-8">
       <h3
        className={`text-lg font-semibold ${
          title.includes("Urgent")
            ? "text-red-500"
            : "text-dark-primary"
        }`} >
        {title}
         </h3>

        <p className={`my-3 ${description.includes('We urgently need B+ blood donors. A patient in critical condition requires immediate transfusion. Please contact us if you can donate') ? "text-rose-500" : "text-dark-primary"}`}>
        {description}
        </p>

        <button className={`bg-red-500 text-white font-semibold px-4 flex py-3 rounded-md ${category.includes('emergency') ? "block" : "hidden"}`}><ExclamationTriangleIcon className="w-6 h-6 mx-1" />
        <a href="#"> {emergencyButton}</a>
       </button>
        
        <div className={`mt-6 ${time.includes('7 hours ago') ? "text-red-600" : "text-dark-primary"}`}>
          {time}
        </div>
         
      </div>
      
     {/* BORDER */}
    <div className="hidden md:block w-1 h-[130px] bg-red-500 self-center"></div>

      {/* IMAGE AREA */}
      <div className="w-full md:w-1/3 flex items-center justify-center p-6">
        <img
          src={image}
          className="w-full md:max-h-40 object-contain"
        />

      </div>

    </div>

  );
}

export default Card;