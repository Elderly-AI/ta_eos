import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";
import React, {Dispatch, SetStateAction, useState} from "react";
import {calcDirectCodeHighDigitsResponseStep} from "@data/Models";

interface SumShiftProps {
    res: calcDirectCodeHighDigitsResponseStep[],
    tmpPoint: number,
    setPoint: Dispatch<SetStateAction<number>>,
}

const useStyles = makeStyles((theme: Theme) => ({
    steps: {
        justifyItems: "center",
        alignItems: "center",
        gridArea: "steps",
        display: "grid",
        gap: theme.spacing(1),
        width: "100%",
    },
    stepInput: {
        width: "100%",
        color: blue[800],
        "&:not(:last-child)": {
            marginBottom: theme.spacing(2),
        },
        "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            "& input": {},
            "& fieldset": {
                borderColor: blue[800],
            },
        },
    },
}));

const SumShift: React.FC<SumShiftProps> = ({res, tmpPoint, setPoint}) => {
    const [sumStep, setSumStep] = useState<string>(''); // тут лежит то, что написано в инпуте текущего шага
    const [valueStep, setValueStep] = useState<string>(''); // тут лежит то, что написано в инпуте текущего шага
    const [buttonWasClicked, setButtonWasClicked] = useState(false);
    const classes = useStyles();

    const onSumStepChange = (event: any) => {
        setSumStep(event.target.value);
        if (buttonWasClicked) {
            setButtonWasClicked(false);
        }    };

    const onValueStepChange = (event: any) => {
        setValueStep(event.target.value);
        if (buttonWasClicked) {
            setButtonWasClicked(false);
        }    };

    const nextStep = () => {
        setButtonWasClicked(false);
        if (tmpPoint < res.length) {
            // setStepValue(res[tmpPoint + 1].value as string);
            setPoint(tmpPoint + 1);
        } else {
            setPoint(tmpPoint + 1);
        }
    };

    const checkStepClick = () => {
        if (+sumStep === +res[tmpPoint].partialSum && +valueStep === +res[tmpPoint].value) {
            setSumStep('');
            setValueStep('');
            nextStep();
            return;
        }
        setButtonWasClicked(true);
    };

    return (<div className={classes.steps}>
        <TextField
            value={sumStep}
            id="stepSumVal"
            className={classes.stepInput}
            onChange={onSumStepChange}
            key="stepVal"
            variant="outlined"
            label="Текущая сумма"
            error={buttonWasClicked && +sumStep !== +res[tmpPoint].partialSum}
        />
        <TextField
            value={valueStep}
            id="stepShiftedSumVal"
            className={classes.stepInput}
            onChange={onValueStepChange}
            key="stepVal"
            variant="outlined"
            label="Сдвиг слагаемого"
            error={buttonWasClicked && +valueStep !== +(res[tmpPoint].value)}
        />
        <Button
            onClick={checkStepClick}
            disabled={tmpPoint >= res.length}
            id="nextStepButton"
            variant="contained"
            color="primary"
        >
            Следующий шаг
        </Button>
        <Button
            onClick={nextStep}
            disabled={tmpPoint >= res.length}
            id="nextStepButton"
            variant="contained"
            color="primary"
        >
            Подсказать значение
        </Button>
    </div>);
}

export default SumShift;
