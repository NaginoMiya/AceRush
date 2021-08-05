import { useState, FC, useEffect } from "react";
import { DateTime } from "luxon";
import ChangeTheme from "./ChangeThemeButton";
import SetTargetTimeButton from "./SetTargetTimeButton";

type Time = {
  hour: number;
  minute: number;
  second: number;
};

const App: FC = () => {
  const [targetTime, setTargetTime] = useState<Time>({
    hour: 0,
    minute: 0,
    second: 0,
  });
  const [remainSec, setRemainSec] = useState(
    21600 - DateTime.local().minute * 60 - DateTime.local().second
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [theme, setTheme] = useState("");

  const changeTheme = () => {
    if (theme === "rockn-roll") {
      setTheme("game");
      localStorage.setItem("myTheme", "game");
    } else {
      setTheme("rockn-roll");
      localStorage.setItem("myTheme", "rockn-roll");
    }
  };

  // 30分刻みのほうがいいかも
  const tick = (): void => {
    setRemainSec((t) => t - 1);
  };

  useEffect(() => {
    const timerId = setInterval(tick, 1000);

    return () => clearInterval(timerId);
  });

  useEffect(() => {
    const now = DateTime.local();
    const { hour, minute } = now;
    setTargetTime({
      hour: Math.floor((hour + 6) % 24),
      minute: minute < 30 ? 30 : 0,
      second: 0,
    });
    setTheme(localStorage.getItem("myTheme") ?? "rockn-roll");
  }, []);

  return (
    <div className={theme}>
      <header>
        <div className="logo">
          <p>AceRush</p>
        </div>
        <nav>
          <ul>
            <li>
              <SetTargetTimeButton
                setRemainSec={setRemainSec}
                setTargetTime={setTargetTime}
              />
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
        <div className="remaining-text">
          <h2>
            目標の時間{targetTime.hour}:
            {Math.floor(targetTime.minute / 30) * 30}まであと
            <span className="remaining">
              {Math.floor(remainSec / 1800) + 1}
            </span>
            回!
          </h2>
        </div>
        <h1>
          {Math.floor((remainSec % 1800) / 60)}:
          {Math.floor(remainSec % 1800) % 60}
        </h1>
        <h3>
          {DateTime.local().hour} : {DateTime.local().minute} :{" "}
          {DateTime.local().second}
        </h3>
      </main>
      <button type="button" onClick={changeTheme}>
        change
      </button>
    </div>
  );
};

export default App;
