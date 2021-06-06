export default function getRandomDateWithinPeriod(from: Date, to: Date): Date {
  const fromTime = from.getTime()
  const toTime = to.getTime()
  const randomDate = new Date(fromTime + Math.random() * (toTime - fromTime))

  return randomDate
}
