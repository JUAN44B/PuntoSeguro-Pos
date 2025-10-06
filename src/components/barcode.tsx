'use client';

const Barcode = ({ text }: { text: string }) => {
    if (!text) return null;
    
    const bars = text.split('').map((char, i) => {
        const value = (char.charCodeAt(0) % 3) + 1;
        return <rect key={i} x={i * 4} y="0" width={value * 1.5} height="40" fill="black" />;
    });
    return (
        <div className="flex flex-col items-center">
            <svg height="40" className='w-full max-w-[200px]'>{bars}</svg>
            <p className="text-xs tracking-[0.2em] font-mono mt-1">{text}</p>
        </div>
    );
};

export default Barcode;
