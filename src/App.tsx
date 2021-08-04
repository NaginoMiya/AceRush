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
      <h1>
        {Math.floor((timeLeft % 1800) / 60)}:{Math.floor(timeLeft % 1800) % 60}
      </h1>
      <h1>目標の時間xまで、あと{Math.floor(timeLeft / 1800)}回.</h1>
      <h1>
        {nowTime.hour} : {nowTime.minute} : {nowTime.second}
      </h1>
      <ChangeTheme isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <SetTargetTime />
    </>
  );
};

export default App;
