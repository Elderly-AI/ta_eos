import { makeStyles, Theme } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { IMath } from "../Math";
import {Fade} from "@material-ui/core";
import {calcDirectCodeHighDigitsResponseStep} from "../../../data/Models";
import classNames from "classnames";

// Забивка пустого места при сдвиге
const placeholder = 9;

const useStyles = makeStyles((theme: Theme) => ({
  layout: {
    display: "grid",
    gap: theme.spacing(3),
    gridTemplateColumns: "repeat(3, 1fr)",
    gridArea: "math",
  },
  showBit: {
    "& > p": {
      margin: 0,
      textAlign: "end",
      fontSize: "20px",
    },
  },
  showPow: {
    "& > p": {
      display: "flex",
      justifyContent: "flex-start",
    },
  },
  res: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  row: {
    margin: 0,
    fontSize: "20px",
    minHeight: "25px",
    position: "relative",
  },
  space: {
    margin: 0,
    fontSize: "20px",
    color: "rgb(238, 238, 238)",
  },
  final: {
    borderTop: "1px solid black",
    minHeight: "24px",
  },
  stretch: {
    border: "1px dotted black",
  },
  up: {
    fontSize: "12px",
  },
  down: {
    fontSize: "7px",
  },
  bit: {
    width: "12px",
    textAlign: "center",
  },
  number: {
    display: "flex",
    justifyContent: "flex-end",
  },
  minHeight: {
    minHeight: "25px",
  },
  regularPlus : {
    position: "absolute",
    bottom: "39px",
    left: "-13px",
  },
  lastRow: {
    borderBottom: "1px solid black",
  },
}));

export interface ShiftResProps {
  input: IMath;
  res: calcDirectCodeHighDigitsResponseStep[];
  tmpRow: number;
}

const ShiftRes = ({ res, input, tmpRow }: ShiftResProps) => {
  const classes = useStyles();
  const [savedInput, setSavedInput] = useState<IMath>({} as IMath);

  useEffect(() => {
    setSavedInput(input);
  }, [res]);

  const getValueRow = (num: number, val: string, count: number) => {
    const res: any[] = [];

    val.split('').map((bit, index) => {
      if (index >= (val.length / 2)) {
        return res.push(<div className={classes.bit}>{bit}</div>);
      }
    });

    return <Fade in={tmpRow > count} timeout={{enter: 1500, exit: 0}}><span className={classNames(classes.number, classes.minHeight)}>{res}</span></Fade>;
  };

  const getRow = (num: number, val: string, count: number, isfinal = false) => {
    const res: any[] = [];
    if (!val) {
      return [];
    }
    let styles = isfinal ? classNames(classes.number, classes.final) :
        classNames(classes.minHeight, classes.number);

    if (!val.includes('1')) {
      for (let i = 0; i < Math.floor(val.length / 2) + num; ++i) {
        res.push(<div className={classes.bit}>{0}</div>);
      }
    } else {
      let wasOneBit = false;
      val.split("").map((bit, index) => {
        wasOneBit = !wasOneBit ? !wasOneBit && bit === '1' : true;
        if (wasOneBit) {
          return res.push(<div className={classes.bit}>{bit}</div>);
        }
      });
    }

    return <Fade in={tmpRow > count} timeout={{enter: 1500, exit: 0}}><span className={styles}>{res}</span></Fade>;
  };

  const getShowBit = (row: calcDirectCodeHighDigitsResponseStep, num: number) => {
    if (row.binDec) {
      console.log(num, res.length - 1);
      return (
          <Fade in={tmpRow > num} timeout={{enter: 1500, exit: 0}}>
            <p>
              <p className={classes.row}>
              </p>
              <p className={classes.row}>
                b<sub className={classes.down}>{row.index}</sub>={row.binDec}
              </p>
              <p className={classes.row}>{num === res.length - 2 ? 'П =' : ''}</p>
            </p>
          </Fade>
      );
    }
  };

  return (
    <div className={classes.layout}>
      <div className={classes.showBit}>
        <p className={classes.minHeight}>A</p>
        <p className={classes.minHeight}>B</p>
        {res.map((row, num) => getShowBit(row, num))}
      </div>
      <div className={classes.res}>
        <p className={classes.row}>{savedInput.firstVal}</p>
        <p className={classNames(classes.row, classes.lastRow)}>
          {savedInput.secondVal}
        </p>
        {res.map((row, index, arr) => {
          if (index < arr.length - 1) {
            return <p className={classes.row}>
              {getRow(index, row.partialSum + '0', index)}
              {getValueRow(index, row.value, index)}
              {getRow(index, arr[index + 1].partialSum, index, true)}
              {index !== res.length - 1 ? <Fade in={tmpRow > index} timeout={{enter: 1500, exit: 0}}><div className={classes.regularPlus}>+</div></Fade> : ''}
            </p>;
          }
        })}
      </div>
      <div>
        <p className={classNames(classes.space, classes.minHeight)}>{placeholder}</p>
        <p className={classNames(classes.space, classes.minHeight)}>{placeholder}</p>
        {res.map((row, index) =>
            <Fade in={tmpRow > index} timeout={{enter: 1500, exit: 0}}>
              <div>
                <p className={classes.row}>
                  {index !== 0 ? '2·S' : 'S'}<sub className={classes.down}>{row.index}</sub>
                </p>
                <p className={classes.row}>
                  |A|
                </p>
                {index !== res.length - 2 ? <p className={classes.row}>
                  S<sub className={classes.down}>{+row.index + 1}</sub>
                </p> : ""}
              </div>
            </Fade>
        )}
      </div>
    </div>
  );
};

export default ShiftRes;
