import { useState, FC, useEffect } from "react";
import { DateTime } from "luxon";
import ChangeTheme from "./ChangeTheme";
import SetTargetTime from "./SetTargetTime";

const App: FC = () => {
  const limitTime = 1.5;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 30分刻みのほうがいいかも
  const [timeLeft, setTimeLeft] = useState<number>(limitTime * 60 * 60);
  const [nowTime, setNowTime] = useState(DateTime.local());
  const tick = (): void => setTimeLeft((t) => t - 1);

  const process = () => {
    tick();
    setNowTime(nowTime.plus({ second: 1 }));
  };

  useEffect(() => {
    const timerId = setInterval(process, 1000);
    // const timerId = setInterval(DateTime.local(), 1000);

    return () => clearInterval(timerId);
  });

  return (
    <>
      <header>
        <div className="logo">
          <p>AceRush</p>
        </div>
        <nav>
          <ul>
            <li>
              <SetTargetTime />
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
      <main className="background">
        <div className="remaining-text">
          <h2>目標の時間20:00まであと<span className="remaining">{Math.floor(timeLeft / 1800)}</span>回!</h2>
        </div>
        <h1>
          {Math.floor((timeLeft % 1800) / 60)}:
          {Math.floor(timeLeft % 1800) % 60}
        </h1>
        <h3>
          {DateTime.local().hour} : {DateTime.local().minute} :{" "}
          {DateTime.local().second}
        </h3>
      </main>
    </>
  );
};

export default App;
