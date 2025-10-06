import { cn } from "@/lib/utils";

const LogoIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 200 40" 
        className={cn("text-primary", className)}
        {...props}
    >
        <rect width="200" height="40" rx="4" fill="currentColor" />
        <text 
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fill="white" 
            fontSize="28" 
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            letterSpacing="4"
        >
            A|L|I|R|U
        </text>
    </svg>
);


const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <svg
        viewBox="0 0 300 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
      >
        <rect x="0" y="5" width="300" height="50" fill="#2196F3" />
        <text
          x="150"
          y="32"
          fontFamily="Arial, sans-serif"
          fontSize="30"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
          letterSpacing="4"
        >
          A|L|I|R|U
        </text>
        <text
          x="150"
          y="75"
          fontFamily="PT Sans, sans-serif"
          fontSize="18"
          fill="black"
          textAnchor="middle"
        >
          Refacciones para Remolques
        </text>
        <g transform="translate(20, 90)">
          <path d="M0 10 H20 V5 H230 V10 H250 L255 15 H260 V10 H280" stroke="black" strokeWidth="2" fill="none" />
          <path d="M40 5 C35 0, 55 0, 50 5" stroke="black" strokeWidth="2" fill="none" />
          <path d="M190 5 C185 0, 205 0, 200 5" stroke="black" strokeWidth="2" fill="none" />
          
          <circle cx="170" cy="20" r="5" stroke="black" strokeWidth="1.5" fill="white" />
          <circle cx="170" cy="20" r="2" fill="black" />
          
          <circle cx="185" cy="20" r="5" stroke="black" strokeWidth="1.5" fill="white" />
          <circle cx="185" cy="20" r="2" fill="black" />
        </g>
      </svg>
    </div>
  );
};

Logo.Icon = LogoIcon;

export default Logo;
