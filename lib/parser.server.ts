export const parseString = (s: FormDataEntryValue | null): string => {
  if (typeof s === 'string') {
      return "" + s
  }
  return ""
}

export const parseNumber = (n: FormDataEntryValue | null): number => {
  if (typeof n === 'string') {
      return Number(n)
  }
  return -1
}