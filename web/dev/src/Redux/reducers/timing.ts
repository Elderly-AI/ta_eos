enum timingENUM {
  GET_TIMINGS = "GET_TIMINGS",
}

export type timingT = string[];

const initialState: string[] = [
  "8:40 — 10:15",
  "10:25 — 12:00",
  "12:50 — 14:25",
  "14:35 — 16:10",
  "16:20 — 17:55",
  "18:00 — 19:35",
  "19:45 — 21:20",
];

type getTiming = {
  type: timingENUM.GET_TIMINGS;
  payload: string[];
};

export type timingAction = getTiming;

export default function timing(
  state: timingT = initialState,
  action: timingAction
) {
  switch (action.type) {
    case timingENUM.GET_TIMINGS:
      return action.payload;
    default:
      return state;
  }
}

export { timingENUM };
