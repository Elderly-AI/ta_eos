import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { blue, grey, red } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React, { ChangeEvent, useState } from "react";
import CustomInput, { CustomInputProps } from "../CustomInput/CustomInput";
import Res from "./ShiftRes";
import RightRes from "./RightShift";
import URLS from "../../config/urls";
import TextField from "@material-ui/core/TextField";

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
  DIRECT_SHIFT_RIGHT = "Прямой код со сдвигом вправо",
  DIRECT_SHIFT_LEFT = "Прямой код со сдвигом влево",
}

/**
 * Интерфейс для инпутов
 */
export interface IMath {
  firstVal: string;
  secondVal: string;
}

/**
 * Интерфейс для результата примера (если на беке он меняется, то надо поменять и тут)
 */
export interface IResult {
  index: number | null;
  bin_dec: string | null;
  value: string;
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
  const [math, setMath] = useState<IMath>({} as IMath);
  const [res, setRes] = useState<IResult[]>({} as IResult[]);
  const [tmpPoint, setPoint] = useState<number>(-1);
  const [tmpStep, setStep] = useState<string>(""); // тут лежит то, что написано в инпуте текущего шага
  const [stepValue, setStepValue] = useState<string>(""); // а тут последнее значение, которое юзер отправил в ответ (чтобы поле error у инпута работало)

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRes([]);
    setMultiply(event.target.value as string);
  };

  const inputHandleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setMath({ ...math, [e?.target?.id]: e.target.value });
  };

  const sendDirectShiftLeft = () => {
    const { firstVal, secondVal } = math;
    const newUrl: string = URLS.math.directCode.leftShift(firstVal, secondVal);

    fetch(newUrl)
      .then((res) => res.json())
      .then((json) => {
        if (json && json.length > 0) {
          setStepValue(json[0].value as string);
        }
        setPoint(0);
        setRes(json);
      });
  };

  const sendDirectShiftRight = () => {
    const { firstVal, secondVal } = math;
    const newUrl: string = URLS.math.directCode.rightShift(firstVal, secondVal);

    fetch(newUrl)
        .then((res) => res.json())
        .then((json) => {
          if (json && json.length > 0) {
            setStepValue(json[0].value as string);
          }
          setPoint(0);
          setRes(json);
        });
  };

  /**
   * Сюда закидываем новые методы
   * Пишем их в кейсы, не забывая объявить в перечислениях
   */
  const sendMath = () => {
    switch (multiply) {
      case multiplyEnum.DIRECT_SHIFT_LEFT:
        sendDirectShiftLeft();
        break;
      case multiplyEnum.DIRECT_SHIFT_RIGHT:
        sendDirectShiftRight();
        break;
      default:
        console.error("нет такого метода");
        break;
    }
  };

  const onStepChange = (event: any) => {
    setStep(event.target.value);
  };

  const nextStep = () => {
    if (tmpPoint < res.length - 1) {
      setStepValue(res[tmpPoint + 1].value as string);
      setPoint(tmpPoint + 1);
    } else {
      setPoint(tmpPoint + 1);
    }
  };

  const checkStepClick = () => {
    setStepValue(tmpStep as string);
    if (tmpStep === res[tmpPoint].value) {
      setStep('');
      nextStep();
    }
  };

  const checker = (): boolean => {
    // console.log('CHECKER >>> ' ,res[tmpPoint].value, '===', stepValue, 'tmpPoint = ', tmpPoint);
    return (
      res[tmpPoint < res.length - 1 ? tmpPoint : res.length - 1].value !==
      stepValue
    );
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
            <MenuItem value={multiplyEnum.DIRECT_SHIFT_LEFT}>
              {multiplyEnum.DIRECT_SHIFT_LEFT}
            </MenuItem>
            <MenuItem value={multiplyEnum.DIRECT_SHIFT_RIGHT}>
              {multiplyEnum.DIRECT_SHIFT_RIGHT}
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

      {res.length > 0 && tmpPoint > -1 ? (
          multiply == multiplyEnum.DIRECT_SHIFT_LEFT ?
            <Res input={math} res={res} tmpRow={tmpPoint} /> :
            <RightRes input={math} res={res} tmpRow={tmpPoint} />
      ) : (
        ""
      )}

      {res.length > 0 ? (
        <div className={classes.steps}>
          <TextField
            value={tmpStep}
            id="stepVal"
            className={classes.stepInput}
            onChange={onStepChange}
            key="stepVal"
            variant="outlined"
            label="Промежуточный результат"
            error={checker()}
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
        </div>
      ) : (
        ""
      )}
    </Paper>
  );
};

export default Math;
