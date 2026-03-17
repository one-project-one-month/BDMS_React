import { Typography } from "./ui/typography";

type CardType = "emergency" | "news" | "awareness";

type CardProps = {
  title: string;
  content: string;
  image: string;
  type: CardType;
  isActive: boolean;
};

function Card({ title, content, image, type }: CardProps) {
  return (
    <div className="bg-white max-w-5xl shadow-lg shadow-rose-300 rounded-md flex flex-col md:flex-row overflow-hidden border border-gray-100 mx-auto">
      
      {/* TEXT AREA */}
      <div className="w-full md:flex-1 pt-16 pb-6 px-8 flex flex-col">
        
        <Typography className={`text-xl font-bold ${type === "emergency" ? "text-primary" : "text-dark-primary"}`}>
          {title}
        </Typography>

        <Typography className={`my-3 leading-relaxed ${type === "emergency" ? "text-primary" : "text-dark-primary"}`}>
          {content}
        </Typography>

        {type === "emergency" && (
          <button className="bg-red-500 text-white font-semibold px-6 py-2 rounded-md w-fit mt-4 shadow-sm active:scale-95 transition-transform">
          <div className="flex items-center gap-2">
          <img src={'/assets/emergencyIcon.svg'} alt="" />
          <a href="#">
          Emergency
          </a>
          </div>
          </button>
        )}
      </div>

      {/* BORDER */}
      <div className="hidden md:block w-[3px] h-32.5 bg-primary self-center shrink-0 md:mx-20"></div>

      {/* IMAGE AREA */}
      <div className="w-full md:flex-1 flex items-center justify-center p-6">
        <img
          src={image} 
          alt={title} 
          className="w-full h-48 md:h-64 object-cover rounded-lg shadow-inner" 
        />
      </div>

    </div>
  );
}
export default Card;