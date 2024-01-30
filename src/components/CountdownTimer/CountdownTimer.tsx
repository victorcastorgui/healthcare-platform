import React, { useState, useEffect } from "react";

interface ICount {
  expirationDate: Date;
}

const CountdownTimer = ({ expirationDate }: ICount) => {
  const [countdown, setCountdown] = useState(
    calculateCountdown(expirationDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(expirationDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationDate]);

  function calculateCountdown(expirationDate: Date) {
    const expirationDateObject = new Date(expirationDate);
    const currentDate = new Date();

    const timeDifference =
      expirationDateObject.getTime() - currentDate.getTime();

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, expired: timeDifference <= 0 };
  }

  return (
    <div>
      {countdown.expired ? (
        <div className="text-lg font-medium text-error">
          Payment has expired
        </div>
      ) : (
        <div className="grid grid-flow-col gap-5 justify-center items-center w-full">
          <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content w-16 justify-center items-center">
            <span className="countdown font-mono text-2xl">
              <span style={{ "--value": countdown.hours } as any}></span>
            </span>
            hours
          </div>
          <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content w-16 justify-center items-center">
            <span className="countdown font-mono text-2xl">
              <span style={{ "--value": countdown.minutes } as any}></span>
            </span>
            min
          </div>
          <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content w-16 justify-center items-center">
            <span className="countdown font-mono text-2xl">
              <span style={{ "--value": countdown.seconds } as any}></span>
            </span>
            sec
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
