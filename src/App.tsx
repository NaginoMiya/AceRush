import { useState, FC, useEffect } from "react";
import { DateTime } from "luxon";
import ChangeTheme from "./ChangeTheme";
import SetTargetTimeButton from "./SetTargetTimeButton";

type Time = {
  hour: number;
  minute: number;
  second: number;
};

const App: FC = () => {
  //  const limitTime = 0.01;
  const [targetTime, setTargetTime] = useState<Time>({
    hour: 0,
    minute: 0,
    second: 0,
  });
  const [remainSec, setRemainSec] = useState(
    21600 - DateTime.local().minute * 60 - DateTime.local().second
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 30分刻みのほうがいいかも
  //  const [timeLeft, setTimeLeft] = useState<number>(limitTime);

  const tick = (): void => {
    setRemainSec((t) => t - 1);
  };

  useEffect(() => {
    const timerId = setInterval(tick, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const now = DateTime.local();
    const { hour, minute } = now;
    setTargetTime({
      hour: Math.floor((hour + 6) % 24),
      minute: minute < 30 ? 30 : 0,
      second: 0,
    });
  }, []);

  return (
    <>
      <header>
        <div className="logo">
          <p>AceRush</p>
        </div>
        <nav>
          <ul>
            <li>
              <p>theme</p>
            </li>
            <li>
              <ChangeTheme
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <h2>
          目標の時間{targetTime.hour}:{Math.floor(targetTime.minute / 30) * 30}
          まで
        </h2>
        <h2>あと{Math.floor(remainSec / 1800) + 1}回.</h2>
        <h1>
          {Math.floor((remainSec % 1800) / 60)}:
          {Math.floor(remainSec % 1800) % 60}
        </h1>
        <h3>
          {DateTime.local().hour} : {DateTime.local().minute} :{" "}
          {DateTime.local().second}
        </h3>
      </main>
      <SetTargetTimeButton
        setRemainSec={setRemainSec}
        setTargetTime={setTargetTime}
      />
    </>
  );
};

export default App;
