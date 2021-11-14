import { blue } from "@material-ui/core/colors";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Math from "../Math"

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: blue[800],
  },

}));

const Home = () => {
  const classes = useStyles();
  console.log('dir')
  return (
    <div className={classes.container}>
      <Math />
    </div>
  );
};

export default Home;
