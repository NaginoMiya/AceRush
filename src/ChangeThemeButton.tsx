import { FC, useState, useRef } from "react";
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
import { grey } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    width: "80%",
    color: theme.palette.getContrastText(grey[800]),
    backgroundColor: grey[800],
    "&:hover": {
      backgroundColor: grey[900],
    },
    "& > *": {
      color: "#fffafa",
    },
  },
}))(Button);

type Props = {
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

const themeOptions: string[] = ["normal", "reverse", "rock", "game"];

const ChangeThemeButton: FC<Props> = ({ setTheme }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(
    themeOptions.findIndex(
      (x) => (localStorage.getItem("myTheme") ?? "normal") === x
    )
  );

  const handleClick = () => {
    //    console.info(`You clicked ${viewOptions[selectedIndex]}`);
    setTheme(themeOptions[selectedIndex]);
    localStorage.setItem("myTheme", themeOptions[selectedIndex]);
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
    <div>
      <ButtonGroup
        variant="contained"
        color="primary"
        ref={anchorRef}
        aria-label="split button"
      >
        <ColorButton onClick={handleClick}>
          {themeOptions[selectedIndex]}
        </ColorButton>
        <ColorButton
          aria-label="delete"
          aria-controls={open ? "menu-list-grow" : undefined}
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
                <MenuList id="menu-list-grow" className="menu-list-wraper">
                  {themeOptions.map((option, index) => (
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
    </div>
  );
};

export default ChangeThemeButton;
