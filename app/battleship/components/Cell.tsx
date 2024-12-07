export default function Cell({ x, y, highlight }: { x: number, y: number, highlight: string }) {
    return (
        <div data-x={x} data-y={y} className={`cell border border-red-500 h-8 w-8 sm:h-10 sm:w-10 md:w-12 md:h-12 ${highlight || ''}`}>
            
        </div>
    );
  }
  