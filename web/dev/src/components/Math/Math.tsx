import React, {ChangeEvent, useState} from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import {blue, grey} from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@mui/styles';
import CustomInput, {CustomInputProps} from '@CustomInput';
import HighDigitsLeftShift from './HighDigitsLeftShift';
import LowDigitsLeftShift from './LowDigitsLeftShift';
import HighDigitsRightShift from './HighDigitsRightShift';
import LowDigitsRightShift from './LowDigitsRightShift';
import AdditionalCorrectiveStep from './AitionalCorrectiveStep';
import DataService from '@data/DataService';
import {calcMultipleResponse, calcMultipleResponseStep} from '@data/Models';
import SumShift from './SumShift';
import FactorShift from './FactorShift';
import Validator from '@utils/Validator';
import {createTheme} from '@mui/material';

const theme = createTheme();

const useStyles = makeStyles(() => ({
    header: {
        gridArea: 'header',
    },
    container: {
        gridTemplateAreas: `
      '. header .'
      '. inputs .'
    `,
        padding: '32px 32px',
        display: 'grid',
        gridTemplateRows: '1fr',
        alignItems: 'center',
        width: theme.spacing(24),
        height: theme.spacing(24),
        backgroundColor: grey[200],
        borderRadius: '16px',
        transition: 'all 0.5s',
    },
    containerGot: {
        transition: 'all 0.5s',
        justifyContent: 'initial',
        gridTemplateColumns: 'repeat(3,1fr)',
        gridTemplateAreas: `
      '. header .'
      'inputs math steps'
    `,
    },
    selected: {
        gridTemplateRows: '0.1fr 1fr',
        justifyItems: 'center',
        padding: '32px 32px',
        transition: 'all 0.5s',
        width: theme.spacing(200),
        height: theme.spacing(54),
        rowGap: '20px',
    },
    select: {
        justifySelf: 'flex-start',
    },
    inputs: {
        transition: 'all 0.5s',
        display: 'grid',
        gridArea: 'inputs',
        gap: theme.spacing(4),
    },
    res: {
        transition: 'all 0.5s',
        gridArea: 'math',
    },
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

/**
 * Объявление методов умножения
 */
export enum multiplyEnum {
  NONE = '',
  DIRECT_HIGH_DIGITS_SHIFT_RIGHT = 'Прямой код со старших разрядов сдвигом вправо',
  DIRECT_HIGH_DIGITS_SHIFT_LEFT = 'Прямой код со со старших разрядов сдвигом влево',
  DIRECT_LOW_DIGITS_SHIFT_LEFT = 'Прямой код с младших разрядов сдвигом влево',
  DIRECT_LOW_DIGITS_SHIFT_RIGHT = 'Прямой код с младших разрядов сдвигом вправо',
  ADDITIONAL_CORRECTIVE_STEP = 'Дополнительный код с корректирующим шагом',
}

export enum shiftEnum {
    NONE = '',
    sumShift = 'Сдвиг суммы частичных произведений',
    factorShift = 'Сдвиг множимого',
}

/**
 * Интерфейс для инпутов
 */
export interface IMath {
    firstVal: string;
    secondVal: string;
}

const Math = () => {
    const classes = useStyles();
    const [multiply, setMultiply] = useState<multiplyEnum>(multiplyEnum.NONE);
    const [shiftType, setShiftType] = useState(shiftEnum.NONE);
    const [math, setMath] = useState<IMath>({} as IMath);
    const [res, setRes] = useState<calcMultipleResponseStep[]>([]);
    const [tmpPoint, setPoint] = useState<number>(-1);
    const [val1Error, setVal1Error] = useState('');
    const [val2Error, setVal2Error] = useState('');
    /**
     * Перечисляем инпуты чтобы их потом отрисовать
     */
    const inputs: CustomInputProps[] = [
        {
            id: 'firstVal',
            label: 'Число A',
            errorMessage: val1Error,
        },
        {
            id: 'secondVal',
            label: 'Число B',
            errorMessage: val2Error,
        },
    ];

    let MultipleTypeSelector: JSX.Element | null;

    switch (multiply) {
    case multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_LEFT:
        MultipleTypeSelector = <HighDigitsLeftShift input={math} stepsRes={res} tmpRow={tmpPoint}/>;
        break;
    case multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_RIGHT:
        MultipleTypeSelector = <HighDigitsRightShift input={math} stepsRes={res} tmpRow={tmpPoint}/>;
        break;
    case multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_LEFT:
        MultipleTypeSelector = <LowDigitsLeftShift input={math} stepsRes={res} tmpRow={tmpPoint}/>;
        break;
    case multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_RIGHT:
        MultipleTypeSelector = <LowDigitsRightShift input={math} stepsRes={res} tmpRow={tmpPoint}/>;
        break;
    case multiplyEnum.ADDITIONAL_CORRECTIVE_STEP:
        MultipleTypeSelector = <AdditionalCorrectiveStep input={math} stepsRes={res} tmpRow={tmpPoint}/>;
        break;
    default:
        MultipleTypeSelector = null;
        break;
    }

    const changeShiftType = (multiple: string) => {
        switch (multiple as multiplyEnum) {
        case multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_RIGHT:
        case multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_LEFT:
        case multiplyEnum.ADDITIONAL_CORRECTIVE_STEP:
            setShiftType(shiftEnum.factorShift);
            break;
        case multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_RIGHT:
        case multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_LEFT:
            setShiftType(shiftEnum.sumShift);
            break;
        }
    };

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setRes([]);
        setMultiply(event.target.value as multiplyEnum);
        changeShiftType(event.target.value as string);
    };

    const inputHandleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        setMath({...math, [e?.target?.id]: e.target.value});
    };

    const setDirectCodeResult = ({Sequence}: calcMultipleResponse) => {
        setPoint(0);
        setPoint(0);
        setRes(Sequence);
    };

    const sendDirectHighShiftLeft = () => {
        const {firstVal, secondVal} = math;

        const grid = firstVal.length > secondVal.length ? firstVal.length : secondVal.length;

        DataService.directCodeHighLeftShift({multiplier: firstVal, factor: secondVal, gridSize: grid})
            .then((data) => setDirectCodeResult(data));
    };

    const sendDirectHighShiftRight = () => {
        const {firstVal, secondVal} = math;

        const grid = firstVal.length > secondVal.length ? firstVal.length : secondVal.length;

        DataService.directCodeHighRightShift({multiplier: firstVal, factor: secondVal, gridSize: grid})
            .then((data) => setDirectCodeResult(data));
    };

    const sendDirectLowShiftLeft = () => {
        const {firstVal, secondVal} = math;

        const grid = firstVal.length > secondVal.length ? firstVal.length : secondVal.length;

        DataService.directCodeLowLeftShift({multiplier: firstVal, factor: secondVal, gridSize: grid})
            .then((data) => setDirectCodeResult(data));
    };

    const sendDirectLowShiftRight = () => {
        const {firstVal, secondVal} = math;

        const grid = firstVal.length > secondVal.length ? firstVal.length : secondVal.length;

        DataService.directCodeLowRightShift({multiplier: firstVal, factor: secondVal, gridSize: grid})
            .then((data) => setDirectCodeResult(data));
    };

    const sendAdditionalCorrectiveStep = () => {
        const {firstVal, secondVal} = math;

        const grid = firstVal.length > secondVal.length ? firstVal.length - 1 : secondVal.length - 1;

        DataService.additionalCodeCorrectiveStep({multiplier: firstVal, factor: secondVal, gridSize: grid})
            .then((data) => setDirectCodeResult(data));
    };

    /**
     * Сюда закидываем новые методы
     * Пишем их в кейсы, не забывая объявить в перечислениях
     */
    const sendMath = () => {
        // eslint-disable-next-line
        let errorVal1, errorVal2;
        setVal1Error(errorVal1 = Validator.validateBinaryNumber(math.firstVal));
        setVal2Error(errorVal2 = Validator.validateBinaryNumber(math.secondVal));
        if (errorVal1 || errorVal2) {
            return;
        }

        switch (multiply) {
        case multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_LEFT:
            sendDirectHighShiftLeft();
            break;
        case multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_RIGHT:
            sendDirectHighShiftRight();
            break;
        case multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_LEFT:
            sendDirectLowShiftLeft();
            break;
        case multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_RIGHT:
            sendDirectLowShiftRight();
            break;
        case multiplyEnum.ADDITIONAL_CORRECTIVE_STEP:
            sendAdditionalCorrectiveStep();
            break;
        default:
            console.error('Нет такого метода');
            break;
        }
    };

    return (
        <Paper
            className={`${classes.container} ${
                multiply === multiplyEnum.NONE ? '' : classes.selected
            } 
      ${res.length > 0 ? classes.containerGot : ''}`}
            variant="outlined"
        >
            <div className={classes.header}>
                <FormControl
                    className={multiply === multiplyEnum.NONE ? '' : classes.select}
                >
                    <InputLabel id="select-multipy-label">Умножение</InputLabel>
                    <Select
                        labelId="select-multipy-label"
                        id="select-multiply"
                        value={multiply}
                        onChange={handleChange}
                    >
                        {/* Добавляем селект для выбора способа умножения */}
                        <MenuItem value={multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_LEFT}>
                            {multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_LEFT}
                        </MenuItem>
                        <MenuItem value={multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_RIGHT}>
                            {multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_RIGHT}
                        </MenuItem>
                        <MenuItem value={multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_LEFT}>
                            {multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_LEFT}
                        </MenuItem>
                        <MenuItem value={multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_RIGHT}>
                            {multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_RIGHT}
                        </MenuItem>
                        <MenuItem value={multiplyEnum.ADDITIONAL_CORRECTIVE_STEP}>
                            {multiplyEnum.ADDITIONAL_CORRECTIVE_STEP}
                        </MenuItem>
                    </Select>
                    <FormHelperText>Выберите способ умножения</FormHelperText>
                </FormControl>
            </div>
            {multiply !== multiplyEnum.NONE ? (
                <div className={classes.inputs}>
                    <div>
                        {inputs.map((input) => (
                            <CustomInput
                                handler={inputHandleChange}
                                key={input.id}
                                {...input}
                            />
                        ))}
                    </div>
                    <Button onClick={sendMath} variant="contained" color="primary">
                        Решить
                    </Button>
                </div>
            ) : (
                ''
            )}

            {res.length > 0 && tmpPoint > -1 ?
                MultipleTypeSelector : (
                    ''
                )}

            {res.length > 0 ? (
                shiftType === shiftEnum.sumShift ?
                    <SumShift multipleType={multiply} res={res} tmpPoint={tmpPoint} setPoint={setPoint}/> :
                    <FactorShift multipleType={multiply} res={res} tmpPoint={tmpPoint} setPoint={setPoint}/>
            ) : (
                ''
            )}
        </Paper>
    );
};

export default Math;
