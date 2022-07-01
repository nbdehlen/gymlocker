function compare<Type>(a: Type, b: Type): number {
  if (a > b) {
    return +1
  }
  if (a < b) {
    return -1
  }
  return 0
}

export default function mergeOnKey<Type>(
  a: Partial<Type[]>,
  b: Partial<Type[]>,
  joinKey: keyof Type,
  defaultData: Partial<Type>
): Partial<Type[]> {
  const arrOne = a.map((obj) => obj && obj[joinKey as keyof Type])
  const arrTwo = b.map((obj) => obj && obj[joinKey as keyof Type])
  const set = new Set([...arrTwo, ...arrOne])

  const bbb: Partial<Type>[] = [...set]
    .map((k) => {
      const aa = a.filter((entry) => entry && entry[joinKey as keyof Type] === k)[0]
      const bb = b.filter((entry) => entry && entry[joinKey as keyof Type] === k)[0]
      return {
        [joinKey]: k,
        ...defaultData,
        ...aa,
        ...bb,
      }
    })
    .sort((a, b) => {
      // TODO: Make generic
      // sort by ast_count if a.count and b.count is the same value
      return compare(a.count, b.count) || compare(a.ast_count, b.ast_count)
    })

  return bbb
}
