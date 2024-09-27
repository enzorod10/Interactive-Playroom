enum Statuses {
    "absent",
    "present",
    "correct",
    "guessing",
  }
  
  type CharStatus = keyof typeof Statuses;
  
  type Props = {
    value: string;
    onLetterClick?: (letter: string) => void;
    status: CharStatus;
    type: "keyboard" | "cell";
  };
  
  export default function Key({ value, status, onLetterClick, type }: Props) {
    function handleOnLetterClick() {
      if (onLetterClick) onLetterClick(value);
    }
  
    // Define Tailwind classes based on status
    const bgClass =
      status === "correct"
        ? "bg-green-500"
        : status === "present"
        ? "bg-orange-500"
        : status === "absent"
        ? "bg-gray-700"
        : "bg-transparent";
  
    const borderClass =
      status === "correct"
        ? "border-green-500"
        : status === "present"
        ? "border-orange-500"
        : status === "absent"
        ? "border-transparent"
        : "border-white";
  
    const sizeClass =
      type === "keyboard"
        ? "w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32" // Responsive size for keyboard
        : "w-14 h-14"; // Fixed size for cell
  
    return (
      <div
        className={`border-2 ${borderClass} ${bgClass} rounded-sm transition-all duration-500 ${sizeClass} flex items-center justify-center cursor-pointer`}
        onClick={handleOnLetterClick}
      >
        <span className="font-bold text-xs lg:text-xl">{value}</span>
      </div>
    );
  }
  