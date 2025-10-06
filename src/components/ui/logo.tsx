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
            fontSize="24" 
            fontFamily="'PT Sans', sans-serif"
            fontWeight="bold"
            letterSpacing="6"
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
        <rect x="0" y="5" width="300" height="50" fill="hsl(var(--primary))" rx="4" />
        <text
          x="150"
          y="32"
          fontFamily="'PT Sans', sans-serif"
          fontSize="28"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
          letterSpacing="8"
        >
          A|L|I|R|U
        </text>
        <text
          x="150"
          y="80"
          fontFamily="PT Sans, sans-serif"
          fontSize="18"
          fill="hsl(var(--foreground))"
          textAnchor="middle"
        >
          Refacciones para Remolques
        </text>
        
      </svg>
    </div>
  );
};

Logo.Icon = LogoIcon;

export default Logo;
