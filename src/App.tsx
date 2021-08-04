import { useState, FC, useEffect } from "react";
import { DateTime } from "luxon";
import SetTargetTimeButton from "./ChangeTheme";

const App: FC = () => {
  const limitTime = 1.5;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 30分刻みのほうがいいかも
  const [timeLeft, setTimeLeft] = useState<number>(limitTime * 60 * 60);
  const tick = (): void => setTimeLeft((t) => t - 1);
  useEffect(() => {
    const timerId = setInterval(tick, 1000);
    // const timerId = setInterval(DateTime.local(), 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <>
      <h1>
        {Math.floor((timeLeft % 1800) / 60)}:{Math.floor(timeLeft % 1800) % 60}
      </h1>
      <h1>目標の時間xまで、あと{Math.floor(timeLeft / 1800)}回.</h1>
      <h1>
        {DateTime.local().hour} : {DateTime.local().minute} :{" "}
        {DateTime.local().second}
      </h1>
      <SetTargetTimeButton
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default App;
