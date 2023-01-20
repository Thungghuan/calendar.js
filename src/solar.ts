import { animals, solarMonth, sTermInfo } from './constant'

/**
 * 返回公历sYear年sMonth月的天数
 * @param sYear solar Year
 * @param sMonth solar Month
 * @return Number (-1、28、29、30、31)
 * @eg `let solarMonthDay = solarDays(1987, 2) // 28`
 */
export function solarDays(sYear: number, sMonth: number) {
  // 若参数错误，返回-1
  if (sMonth > 12 || sMonth < 1) {
    return -1
  }

  if (sMonth === 2) {
    // 2月份的闰平规律测算后确认返回28或29
    return (sYear % 4 === 0 && sYear % 100 !== 0) || sYear % 400 === 0 ? 29 : 28
  } else {
    return solarMonth[sMonth - 1]
  }
}

/**
 * 传入公历sYear年获得该年第n个节气的公历日期
 * @param sYear solar year(1900-2100)
 * @param n n二十四节气中的第几个节气(1~24)，从n=1(小寒)算起
 * @return day Number
 * @eg `let _24 = getTerm(1987,3) // _24=4, 意即1987年2月4日立春`
 */
export function getTerm(sYear: number, n: number) {
  if (sYear < 1900 || sYear > 2100 || n < 1 || n > 24) {
    return -1
  }
  const _table = sTermInfo[sYear - 1900]
  const _calcDay = []
  for (let index = 0; index < _table.length; index += 5) {
    const chunk = parseInt('0x' + _table.substring(index, index + 5)).toString()
    _calcDay.push(
      chunk[0],
      chunk.substring(1, 3),
      chunk[3],
      chunk.substring(4, 6)
    )
  }
  return parseInt(_calcDay[n - 1])
}

/**
 * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
 * @param sYear solar year
 * @return Cn string
 * @eg `let animal = getAnimal(1987) // '兔'`
 */
export function getAnimal(sYear: number) {
  return animals[(sYear - 4) % 12]
}
