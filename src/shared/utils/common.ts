export const arrayToObjectByKey = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<T[K] extends number | string ? T[K] : never, T | undefined> => {
  const map = new Map()

  array.forEach((current) => {
    const mapKey = current[key]
    map.set(mapKey, current)
  })

  return Object.fromEntries(map)
}
