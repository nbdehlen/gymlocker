import { sub } from 'date-fns'

export const workouts = [
  {
    start: sub(new Date(), { days: 0, hours: 2 }),
    end: sub(new Date(), { days: 0 }),
  },
  // {
  //   start: sub(new Date(), { days: 6, hours: 2 }),
  //   end: sub(new Date(), { days: 6 }),
  // },
  // {
  //   start: sub(new Date(), { days: 5 }),
  //   end: sub(new Date(), { days: 5 }),
  // },
  // {
  //   start: sub(new Date(), { days: 4, hours: 2 }),
  //   end: sub(new Date(), { days: 4 }),
  // },
]
