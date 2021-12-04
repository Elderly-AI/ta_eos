import { makeStyles, Theme } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { IMath } from "@Math";
import {Fade} from "@material-ui/core";
import {calcDirectCodeHighDigitsResponseStep} from "@data/Models";
import classNames from "classnames";

// Забивка пустого места при сдвиге
const placeholder = 9;

const useStyles = makeStyles((theme: Theme) => ({
    layout: {
        display: "grid",
        gap: theme.spacing(4),
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
        position: "relative",
    },
    lastRow: {
        // borderBottom: "1px solid black",
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
    superDown: { // почему-то тэг sub не работает, поэтому херачим костыли
        alignSelf: "flex-end",
        fontSize: "7px",
    },
    minHeight: {
        minHeight: "25px",
    },
    regularPlus : {
        position: "absolute",
        bottom: "14px",
        left: "-13px",
    },
}));

export interface RightShiftResProps {
    input: IMath;
    stepsRes: calcDirectCodeHighDigitsResponseStep[];
    tmpRow: number;
}

const LowDigitsRightShift = ({ stepsRes, input, tmpRow }: RightShiftResProps) => {
    const classes = useStyles();
    const [savedInput, setSavedInput] = useState<IMath>({} as IMath);

    useEffect(() => {
        setSavedInput(input);
    }, [stepsRes]);

    const getValueRow = (num: number, val: string, count: number) => {
        const res: any[] = [];
        if (!val) {
            return [];
        }

        val.split('').map((bit, index) => {
            if (index >= (val.length / 2) - num) {
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
            for (let i = 0; i < val.length; ++i) {
                res.push(<div className={classes.bit}>{0}</div>);
            }
        } else {
            val.split("").map((bit, index) => {
                if (index !== 0 || +bit === 1 || num !== stepsRes.length - 1) {
                    return res.push(<div className={classes.bit}>{bit}</div>);
                } else {
                    return res.push(<div className={classes.space}>{placeholder}</div>);
                }
            });
        }

        return <Fade in={tmpRow > count} timeout={{enter: 1500, exit: 0}}><span className={styles}>{res}</span></Fade>;
    };


    const getShowBit = (row: calcDirectCodeHighDigitsResponseStep, num: number) => {
        if (row.binDec) {
            return (
                <Fade in={tmpRow > num} timeout={{enter: 1500, exit: 0}}>
                    <p>
                        <p className={classes.row}/>
                        <p className={classes.row}>
                            b<sub className={classes.down}>
                            {stepsRes.length - (row.index as unknown as number) - 1}
                        </sub>
                            ={row.binDec}
                        </p>
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
                {stepsRes.map((row, num) => getShowBit(row, num))}
            </div>
            <div className={classes.res}>
                <p className={classes.row}>{savedInput.firstVal}</p>
                <p className={`${classes.row} ${classes.lastRow}`}>
                    {savedInput.secondVal}
                </p>
                {stepsRes.map((row, index) => {
                    return <p className={classes.row}>
                        {getRow(Number(row.index), row.partialSum, index, true)}
                        {getValueRow(Number(row.index), row.value, index)}
                        {index !== stepsRes.length - 1 ? <Fade in={tmpRow > index} timeout={{enter: 1500, exit: 0}}><div className={classes.regularPlus}>+</div></Fade> : ''}
                    </p>
                })}
            </div>
            <div className={classes.showPow}>
                <p className={classNames(classes.space, classes.minHeight)}>{placeholder}</p>
                <p className={classNames(classes.space, classes.minHeight)}>{placeholder}</p>
                {stepsRes.map((row, index) =>
                    index !== stepsRes.length - 1 ? (
                        <Fade in={tmpRow > index} timeout={{enter: 1500, exit: 0}}>
                            <div>
                                <p className={classes.row}>
                                    S<sub className={classes.down}>{`${row.index}`}</sub>
                                </p>
                                <p className={classes.row}>
                                    |A|·2<sup className={classes.up}>{`-${stepsRes.length - +row.index - 1}`}</sup>
                                </p>
                            </div>
                        </Fade>
                    ) : (
                        ''
                    )
                )}
            </div>
        </div>
    );
};

export default LowDigitsRightShift;
