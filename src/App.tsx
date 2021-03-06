import { useState, FC, useEffect } from "react";
import { DateTime } from "luxon";
import ChangeThemeButton from "./ChangeThemeButton";
import SetTargetTimeButton from "./SetTargetTimeButton";
import Logo from "./acerush.png";

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
  const tick = (): void => {
    setRemainSec((t) => t - 1);
    if (remainSec < 0) {
      // 時間切れの場合：6時間後にセット
      setRemainSec(
        21600 - DateTime.local().minute * 60 - DateTime.local().second
      );
      setTargetTime({
        hour: Math.floor((DateTime.local().hour + 6) % 24),
        minute: DateTime.local().minute < 30 ? 30 : 0,
        second: 0,
      });
    }
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
    setTheme(localStorage.getItem("myTheme") ?? "normal");

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
          <p><img src={Logo} alt="test6.png" width="90" height="60"/></p>
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
      <main>
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
      <div className="smartphone-nav">
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
      </div>
      <footer>
        <p>
          AceRushは目的の時間まで30分単位であと何回あるか可視化できるアプリです.
          1時間だと長く感じるけど、30分だと短く感じるし思ったより回数が少ないよね.{" "}
        </p>
        <p>
          made by <a href="https://github.com/NagiNoMiya">@NagiNoMiya</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
