export type authUser = {
  name: string,
  email: string,
  group: string,
  role: string,
  password: string,
}

export type authLoginRequest = {
  email: string,
  password: string,
  group: string,
}

export type authRegisterRequest = {
  user: authUser
}

export type authSafeUser = {
  name: string,
  email: string,
  group: string,
  role: string,
}

export type SearchResult = {
    users: Array<SearchUser>,
}

export type SearchUser = {
  name: string,
  email: string,
  group: string,
  role: string,
  userId: string,
}

export type calcMultipleRequest = {
  multiplier: string,
  factor: string,
  gridSize: number,
}

export type calcMultipleResponseStep = {
  index: string,
  binDec: string,
  value: string,
  partialSum: string,
}

export type calcMultipleResponse = {
  Sequence: calcMultipleResponseStep[]
}

export type protobufAny = {
  type: string,
}

export type rpcStatus = {
  code: number,
  message: string,
  details: protobufAny,
}

export type metricsMetric = {
  methodName: string,
  date: string,
  metricData?: any,
  userId: string
}

export type metricsMetricsArray = {
  metrics: metricsMetric[]
}
