import { sub } from 'date-fns'

export const workouts = [
  {
    start: sub(new Date(), { days: 0, hours: 2 }),
    end: sub(new Date(), { days: 0 }),
  },
]
