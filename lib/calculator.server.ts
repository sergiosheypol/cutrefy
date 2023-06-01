export const toMilliseconds = (minute: number, second: number): number => {
  return (minute * 60 + second) * 1000
}