import { makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { grey } from "@material-ui/core/colors";
import { useState } from "react";
import Registration from "./Registration";
import Login from "./Login";

const animDur = 500;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  layout: {
    overflow: "hidden",
    padding: "32px 32px",
    width: theme.spacing(64),
    backgroundColor: grey[200],
    borderRadius: "16px",
    transition: "all 0.5s ease-in-out"
  },
  tabBar: {
    marginBottom: theme.spacing(2),
    "& .MuiTabs-flexContainer": {
      justifyContent: "center",
    },
  },
  login: {
    height: theme.spacing(30),
  },
  reg: {
    height: theme.spacing(64),
  },
  close: {
    height: theme.spacing(3.5)
  },
  tab: {

  }
}));

export interface IRegistrationForm {
  email: string;
  password: string;
  name: string;
  sumname: string;
  patronymic: string;
  group: string;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Form = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [anim, setAnim] = useState<string>(classes.login);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTimeout(() => {setValue(newValue)}, animDur)
    close();
  };

  const close = () => {
    setAnim(classes.close);
    setTimeout(() => {
      return setAnim(value ? classes.login : classes.reg)
    }, animDur)
  }

  return (
    <div className={classes.root}>
      <Paper className={`${classes.layout} ${anim}`} variant="outlined">
        <AppBar className={classes.tabBar} position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Вход" {...a11yProps(0)} />
            <Tab label="Регистрация" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Login />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Registration />
        </TabPanel>
      </Paper>
    </div>
  );
};

export default Form;
