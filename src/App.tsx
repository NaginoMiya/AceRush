import { useState, FC, useEffect } from "react";
import { DateTime } from "luxon";
import ChangeThemeButton from "./ChangeThemeButton";
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

    const dateString = localStorage.getItem("myTargetTime");
    if (dateString !== null) {
      const tmp = dateString.split(":");
      const date = DateTime.local().set({
        month: Number(tmp[0]),
        day: Number(tmp[1]),
        hour: Number(tmp[2]),
        minute: Number(tmp[3]),
        second: Number(tmp[4]),
      });
      const diffSec = date.diff(DateTime.local(), "second").seconds;
      if (diffSec >= 0) {
        setRemainSec(diffSec);
        setTargetTime({
          hour: Number(tmp[2]),
          minute: Number(tmp[3]),
          second: 0,
        });
      } else {
        // 期限切れの場合：6時間後にセット
        setRemainSec(
          21600 - DateTime.local().minute * 60 - DateTime.local().second
        );
        setTargetTime({
          hour: Math.floor((hour + 6) % 24),
          minute: minute < 30 ? 30 : 0,
          second: 0,
        });
      }
    } else {
      // 初接続の場合：6時間後にセット
      setRemainSec(
        21600 - DateTime.local().minute * 60 - DateTime.local().second
      );
      setTargetTime({
        hour: Math.floor((hour + 6) % 24),
        minute: minute < 30 ? 30 : 0,
        second: 0,
      });
    }
  }, []);

  // 0パディング用
  const zeroPadding = (n: number): string => {
    let s = `${n}`;
    if (s.length < 2) s = `0${s}`;

    return s;
  };

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
              <ChangeThemeButton setTheme={setTheme} />
            </li>
          </ul>
        </nav>
      </header>
      <main className="background">
        <div className="remaining-text">
          <h2>
            目標の時間{targetTime.hour}:
            {zeroPadding(Math.floor(targetTime.minute / 30) * 30)}まであと
            <span className="remaining">
              {Math.floor(remainSec / 1800) + 1}
            </span>
            回!
          </h2>
        </div>
        <h1>
          {zeroPadding(Math.floor((remainSec % 1800) / 60))}:
          {zeroPadding(Math.floor(remainSec % 1800) % 60)}
        </h1>
        <h3>
          {zeroPadding(DateTime.local().hour)} :{" "}
          {zeroPadding(DateTime.local().minute)} :{" "}
          {zeroPadding(DateTime.local().second)}
        </h3>
      </main>
      <button type="button" onClick={changeTheme}>
        change
      </button>
    </div>
  );
};

export default App;
