import React from 'react';

interface TimerProps {
    elapsedTime: number;
}

const Timer: React.FC<TimerProps> = ({ elapsedTime }) => {
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div>
            <p>Time: {formatTime(elapsedTime)}</p>
        </div>
    );
};

export default Timer;