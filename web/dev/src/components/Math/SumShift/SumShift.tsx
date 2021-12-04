import React, {Dispatch, SetStateAction, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {blue} from '@material-ui/core/colors';
import {calcDirectCodeHighDigitsResponseStep} from '@data/Models';

interface SumShiftProps {
    res: calcDirectCodeHighDigitsResponseStep[],
    tmpPoint: number,
    setPoint: Dispatch<SetStateAction<number>>,
}

const useStyles = makeStyles((theme: Theme) => ({
    steps: {
        justifyItems: 'center',
        alignItems: 'center',
        gridArea: 'steps',
        display: 'grid',
        gap: theme.spacing(1),
        width: '100%',
    },
    stepInput: {
        'width': '100%',
        'color': blue[800],
        '&:not(:last-child)': {
            marginBottom: theme.spacing(2),
        },
        '& .MuiOutlinedInput-root': {
            'borderRadius': '16px',
            '& input': {},
            '& fieldset': {
                borderColor: blue[800],
            },
        },
    },
}));

const SumShift: React.FC<SumShiftProps> = ({res, tmpPoint, setPoint}) => {
    const [sumStep, setSumStep] = useState<string>(''); // тут лежит то, что написано в инпуте текущего шага
    const [shiftedSumStep, setShiftedSumStep] = useState<string>(''); // тут лежит то, что написано в
    // инпуте текущего шага
    const [termStep, setTermStep] = useState<string>(''); // тут лежит то, что написано в инпуте текущего шага
    const [buttonWasClicked, setButtonWasClicked] = useState(false);
    const classes = useStyles();

    const onSumStepChange = (event: any) => {
        setSumStep(event.target.value);
        if (buttonWasClicked) {
            setButtonWasClicked(false);
        }
    };

    const onShiftedSumStepChange = (event: any) => {
        setShiftedSumStep(event.target.value);
        if (buttonWasClicked) {
            setButtonWasClicked(false);
        }
    };

    const onTermStepChange = (event: any) => {
        setTermStep(event.target.value);
        if (buttonWasClicked) {
            setButtonWasClicked(false);
        }
    };

    const nextStep = () => {
        setButtonWasClicked(false);
        if (tmpPoint < res.length - 1) {
            setPoint(tmpPoint + 1);
        } else {
            setPoint(tmpPoint + 1);
        }
    };

    const checkStepClick = () => {
        if (+termStep === +res[tmpPoint].value &&
            +sumStep === +res[tmpPoint + 1].partialSum &&
            +shiftedSumStep === +(res[tmpPoint].partialSum + '0')) {
            setSumStep('');
            setShiftedSumStep('');
            setTermStep('');
            nextStep();
            return;
        }
        setButtonWasClicked(true);
    };

    return (<div className={classes.steps}>
        <TextField
            value={shiftedSumStep}
            id="stepShiftedSumVal"
            className={classes.stepInput}
            onChange={onShiftedSumStepChange}
            key="stepVal"
            variant="outlined"
            label="Сдвиг суммы"
            error={buttonWasClicked && +shiftedSumStep !== +(res[tmpPoint].partialSum + '0')}
        />
        <TextField
            value={termStep}
            id="stepTermVal"
            className={classes.stepInput}
            onChange={onTermStepChange}
            key="stepVal"
            variant="outlined"
            label="Слагаемое"
            error={buttonWasClicked && +termStep !== +res[tmpPoint].value}
        />
        <TextField
            value={sumStep}
            id="stepSumVal"
            className={classes.stepInput}
            onChange={onSumStepChange}
            key="stepVal"
            variant="outlined"
            label="Текущая сумма"
            error={buttonWasClicked && +sumStep !== +res[tmpPoint + 1].partialSum}
        />
        <Button
            onClick={checkStepClick}
            disabled={tmpPoint >= res.length - 1}
            id="nextStepButton"
            variant="contained"
            color="primary"
        >
            Следующий шаг
        </Button>
        <Button
            onClick={nextStep}
            disabled={tmpPoint >= res.length - 1}
            id="nextStepButton"
            variant="contained"
            color="primary"
        >
            Подсказать значение
        </Button>
    </div>);
};

export default SumShift;
