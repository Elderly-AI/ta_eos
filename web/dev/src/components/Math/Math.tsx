import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import {blue, grey} from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React, {ChangeEvent, useState} from "react";
import CustomInput, {CustomInputProps} from "../CustomInput/CustomInput";
import Res from "./HighDigitsLeftShift";
import RightRes from "./HighDigitsRightShift";
import DataService from "../../data/DataService";
import {calcDirectCodeResponse, calcDirectCodeHighDigitsResponseStep} from "../../data/Models";
import SumShift from "./SumShift/SumShift";
import FactorShift from "./FactorShift/FactorShift";

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        gridArea: "header",
    },
    container: {
        gridTemplateAreas: `
      '. header .'
      '. inputs .'
    `,
        padding: "32px 32px",
        display: "grid",
        gridTemplateRows: "1fr",
        alignItems: "center",
        width: theme.spacing(24),
        height: theme.spacing(24),
        backgroundColor: grey[200],
        borderRadius: "16px",
        transition: "all 0.5s",
    },
    containerGetted: {
        transition: "all 0.5s",
        justifyContent: "initial",
        gridTemplateColumns: "repeat(3,1fr)",
        gridTemplateAreas: `
      '. header .'
      'inputs math steps'
    `,
    },
    selected: {
        gridTemplateRows: "0.1fr 1fr",
        justifyItems: "center",
        padding: "32px 32px",
        transition: "all 0.5s",
        width: theme.spacing(200),
        height: theme.spacing(54),
        rowGap: "20px",
    },
    select: {
        justifySelf: "flex-start",
    },
    inputs: {
        transition: "all 0.5s",
        display: "grid",
        gridArea: "inputs",
        gap: theme.spacing(4),
    },
    res: {
        transition: "all 0.5s",
        gridArea: "math",
    },
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

/**
 * Объявление методов умножения
 */
export enum multiplyEnum {
  NONE = "",
  DIRECT_HIGH_DIGITS_SHIFT_RIGHT = "Прямой код со старших разрядов сдвигом вправо",
  DIRECT_HIGH_DIGITS_SHIFT_LEFT = "Прямой код со со старших разрядов сдвигом влево",
  DIRECT_LOW_DIGITS_SHIFT_LEFT = "Прямой код со с младших разрядов сдвигом влево",
}

export enum shiftEnum {
    NONE = "",
    sumShift = "Сдвиг суммы частичных произведений",
    factorShift = "Сдвиг множимого",
}

/**
 * Интерфейс для инпутов
 */
export interface IMath {
    firstVal: string;
    secondVal: string;
}

/**
 * Перечисляем инпуты чтобы их потом отриосвать
 */
const inputs: CustomInputProps[] = [
    {
        id: "firstVal",
        label: "Число A",
    },
    {
        id: "secondVal",
        label: "Число B",
    },
];

const Math = () => {
    const classes = useStyles();
    const [multiply, setMultiply] = useState<string>(multiplyEnum.NONE);
    const [shiftType, setShiftType] = useState(shiftEnum.NONE);
    const [math, setMath] = useState<IMath>({} as IMath);
    const [res, setRes] = useState<calcDirectCodeHighDigitsResponseStep[]>([]);
    const [tmpPoint, setPoint] = useState<number>(-1);
    let MultipleTypeSelector: JSX.Element | null;

    switch (multiply) {
        case multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_LEFT:
            MultipleTypeSelector = <Res input={math} res={res} tmpRow={tmpPoint}/>;
            break;
        case multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_RIGHT:
            MultipleTypeSelector =  <RightRes input={math} stepsRes={res} tmpRow={tmpPoint}/>;
            break;
        case multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_LEFT:
            MultipleTypeSelector =  <div/>;
            break;
        default:
            MultipleTypeSelector = null;
            break;
    }

    const changeShiftType = (multiple: string) => {
        switch (multiple as multiplyEnum) {
            case multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_RIGHT:
            case multiplyEnum.DIRECT_LOW_DIGITS_SHIFT_LEFT:
                setShiftType(shiftEnum.factorShift);
                break;
            case multiplyEnum.DIRECT_HIGH_DIGITS_SHIFT_LEFT:
                setShiftType(shiftEnum.sumShift);
                break;
        }
    }

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setRes([]);
        setMultiply(event.target.value as string);
        changeShiftType(event.target.value as string);
    };

    const inputHandleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        setMath({...math, [e?.target?.id]: e.target.value});
    };

    const setDirectCodeResult = ({Sequence}: calcDirectCodeResponse) => {
        setPoint(0);
        setPoint(0);
        setRes(Sequence);
    }

    const sendDirectHighShiftLeft = () => {
        const { firstVal, secondVal } = math;

        const grid = firstVal.length > secondVal.length ? firstVal.length : secondVal.length;

        DataService.directCodeHighLeftShift({multiplier: firstVal, factor: secondVal, gridSize: grid})
            .then((data) => setDirectCodeResult(data));
    };

    const sendDirectHighShiftRight = () => {
        const { firstVal, secondVal } = math;

        const grid = firstVal.length > secondVal.length ? firstVal.length : secondVal.length;

        DataService.directCodeHighRightShift({multiplier: firstVal, factor: secondVal, gridSize: grid})
            .then((data) => setDirectCodeResult(data));
    };

    const sendDirectLowShiftLeft = () => {
        const { firstVal, secondVal } = math;

        const grid = firstVal.length > secondVal.length ? firstVal.length : secondVal.length;

        DataService.directCodeLowLeftShift({multiplier: firstVal, factor: secondVal, gridSize: grid})
            .then((data) => setDirectCodeResult(data));
    };

    /**
     * Сюда закидываем новые методы
     * Пишем их в кейсы, не забывая объявить в перечислениях
     */
    const sendMath = () => {
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
            default:
                console.error("нет такого метода");
                break;
        }
    };

    return (
        <Paper
            className={`${classes.container} ${
                multiply === multiplyEnum.NONE ? "" : classes.selected
            } 
      ${res.length > 0 ? classes.containerGetted : ""}`}
            variant="outlined"
        >
            <div className={classes.header}>
                <FormControl
                    className={multiply === multiplyEnum.NONE ? "" : classes.select}
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
                ""
            )}

            {res.length > 0 && tmpPoint > -1 ?
                MultipleTypeSelector : (
                ""
            )}

            {res.length > 0 ? (
                shiftType === shiftEnum.sumShift ?
                <SumShift res={res} tmpPoint={tmpPoint} setPoint={setPoint}/> :
                <FactorShift res={res} tmpPoint={tmpPoint} setPoint={setPoint}/>
            ) : (
                ""
            )}
        </Paper>
    );
};

export default Math;
