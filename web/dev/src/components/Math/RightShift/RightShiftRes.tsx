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
        alignItems: "flex-start",
    },
    row: {
        margin: 0,
        fontSize: "20px",
        minHeight: "25px",
    },
    lastRow: {
        borderBottom: "1px solid black",
    },
    space: {
        margin: 0,
        fontSize: "20px",
        color: "rgb(238, 238, 238)",
    },
    final: {
        borderTop: "1px solid black",
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
    },
    superDown: { // почему-то тэг sub не работает, поэтому херачим костыли
        alignSelf: "flex-end",
        fontSize: "7px",
    },
    minHeight: {
        minHeight: "25px",
    }
}));

export interface RightShiftResProps {
    input: IMath;
    res: calcDirectCodeHighDigitsResponseStep[];
    tmpRow: number;
}

const RightShiftRes = ({ res, input, tmpRow }: RightShiftResProps) => {
    const classes = useStyles();
    const [savedInput, setSavedInput] = useState<IMath>({} as IMath);

    useEffect(() => {
        setSavedInput(input);
    }, [res]);

    const getRow = (count: number, val: string, num: number, arr: calcDirectCodeHighDigitsResponseStep[]) => {
        const res: any[] = [];

        // это для строки с результатом выражения
        if (Number(count) === val.length / 2) {
            if (!val.includes('1')) {
                for (let i = 0; i < val.length; ++i) {
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

            return <Fade in={tmpRow > num} timeout={{enter: 1500, exit: 0}}><div className={classes.final}><span className={classes.number}>{res}</span></div></Fade>;
        }


        val.split('').map((bit, index) => {
            if (index >= val.length / 2 - count) {
                return res.push(<div className={classes.bit}>{bit}</div>);
            }
        });

        return <Fade in={tmpRow > num} timeout={{enter: 1500, exit: 0}}><span className={classes.number}>{res}</span></Fade>;
    };

    const getShowBit = (row: calcDirectCodeHighDigitsResponseStep, num: number) => {
        if (row.binDec !== null) {
            return (
                <Fade in={tmpRow > num} timeout={{enter: 1500, exit: 0}}>
            <p className={classes.row}>
                b<sub className={classes.down}>{res.length - (row.index as unknown as number) - 1}</sub>={row.binDec}
                </p>
                </Fade>
        );
        }
        return <Fade in={tmpRow > num} timeout={{enter: 1500, exit: 0}}><p className={classes.row}>П =</p></Fade>;
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
        <p className={`${classes.row} ${classes.lastRow}`}>
    {savedInput.secondVal}
    </p>
    {res.map((row, index, arr) => {
        // TODO вот тут тот самый костыль, чтобы пока что нормально работало отображение решения
        return <p className={classes.row}>{getRow(Number(row.index), row.value ? row.value : row.partialSum, index, arr)}</p>
    })}
    </div>
    <div className={classes.showPow}>
    <p className={classNames(classes.space, classes.minHeight)}>{placeholder}</p>
        <p className={classNames(classes.space, classes.minHeight)}>{placeholder}</p>
    {res.map((row, index) =>
        index !== res.length - 1 ? (
            <Fade in={tmpRow > index} timeout={{enter: 1500, exit: 0}}>
        <p className={classes.row}>
            A·2<sup className={classes.up}>{`-${row.index}`}</sup>&nbsp;b
            <sub className={classes.superDown}>{res.length - (row.index as unknown as number) - 1}</sub>
        </p>
        </Fade>
    ) : (
        ''
    )
    )}
    </div>
    </div>
);
};

export default RightShiftRes;
