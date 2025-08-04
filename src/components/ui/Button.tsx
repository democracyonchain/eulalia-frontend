import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  variant?: "default" | "success" | "destructive";
}

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "default"
}: ButtonProps) => {
  const baseStyle = "text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors";
  const variants: Record<string, string> = {
    default: "bg-blue-700 hover:bg-blue-800",
    success: "bg-green-600 hover:bg-green-700",
    destructive: "bg-red-600 hover:bg-red-700"
  };

  const finalClass = `${baseStyle} ${variants[variant] || variants.default} ${className}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={finalClass}>
      {children}
    </button>
  );
};

export default Button;
