import { astro } from './constant'

/**
 * 公历月、日判断所属星座
 * @param  sMonth solar month
 * @param  sDay solar day
 * @return Cn string
 */
export function toAstro(sMonth: number, sDay: number) {
  if (sMonth < 1 || sMonth > 12) {
    throw new Error(
      `The solar month ${sMonth} is out of range, expeted [1-12].`
    )
  }

  const maxDayInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (sDay < 1 || sDay > maxDayInMonths[sMonth - 1]) {
    throw new Error(
      `The solar day ${sDay} in solar month ${sMonth} is out of range, expeted [1-${
        maxDayInMonths[sMonth - 1]
      }].`
    )
  }

  const arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22]

  return astro[sMonth - (sDay < arr[sMonth - 1] ? 1 : 0)] + '\u5ea7' //座
}
