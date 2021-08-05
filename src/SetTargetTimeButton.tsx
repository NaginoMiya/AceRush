import { FC, useState, useRef, useEffect } from "react";
import { DateTime } from "luxon";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    width: "80%",
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
    "& > *": {
      color: "#fffafa",
    },
  },
}))(Button);

type Time = {
  hour: number;
  minute: number;
  second: number;
};

type Props = {
  setRemainSec: React.Dispatch<React.SetStateAction<number>>;
  setTargetTime: React.Dispatch<React.SetStateAction<Time>>;
};

// ToDo: cookieに記録された時間or記録した時間を過ぎてるか未設定ならば現在時刻の12時間後に設定する.
let viewOptions: string[] = [];
let options: DateTime[] = [];

const SetTargetTimeButton: FC<Props> = ({ setTargetTime, setRemainSec }) => {
  // 初回リロード時にボタンに表示される時刻を生成、格納
  useEffect(() => {
    let date = DateTime.local();
    if (date.minute < 30) {
      date = date.set({ minute: 30 });
    } else {
      date = date.set({ minute: 0 });
      date = date.set({ hour: (date.hour + 1) % 24 });
    }
    viewOptions.push(`${date.hour}:${date.minute}`);
    options.push(date);
  }, []);

  // const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = () => {
    //    console.info(`You clicked ${viewOptions[selectedIndex]}`);
    const tmp = viewOptions[selectedIndex].split(":");
    setTargetTime({ hour: Number(tmp[0]), minute: Number(tmp[1]), second: 0 });
    const date = options[selectedIndex];
    localStorage.setItem(
      "myTargetTime",
      `${date.month}:${date.day}:${date.hour}:${date.minute}:${0}`
    );
    console.log(localStorage.getItem("myTargetTime"));
    setRemainSec(
      options[selectedIndex].diff(DateTime.local(), "second").seconds
    );
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    viewOptions = [];
    options = [];
    let { hour, minute } = DateTime.local();

    let tmpDate = DateTime.local();

    if (minute > 30) {
      minute = 1;
      hour = (hour + 1) % 24;
      tmpDate = tmpDate.set({ minute: 0 });
      tmpDate = tmpDate.set({ hour });
    } else {
      minute = 0;
      tmpDate = tmpDate.set({ minute: 30 });
    }
    for (let i = 0; i <= 24; i += 1) {
      viewOptions.push(`${hour % 24}:${minute % 2 ? "00" : "30"}`);
      if (minute % 2 === 0) hour += 1;
      minute += 1;
      options.push(tmpDate);
      tmpDate = tmpDate.plus({ minute: 30 });
    }
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup
          variant="contained"
          color="primary"
          ref={anchorRef}
          aria-label="split button"
        >
          <ColorButton onClick={handleClick}>
            {viewOptions[selectedIndex]}
          </ColorButton>
          <ColorButton
            aria-label="delete"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="menu"
            onClick={handleToggle}
            variant="contained"
            color="primary"
          >
            <ArrowDropDownIcon />
          </ColorButton>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            /* eslint-disable react/jsx-props-no-spreading */
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {viewOptions.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
};

export default SetTargetTimeButton;
