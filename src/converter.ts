import { toAstro } from './astro'
import { nStr1, solarTerm } from './constant'
import {
  lYearDays,
  leapMonth,
  leapDays,
  monthDays,
  toGanZhiYear,
  toGanZhi,
  toChinaMonth,
  toChinaDay
} from './lunar'
import { getTerm, getAnimal } from './solar'

interface ConvertResult {
  solarDate: string
  sYear: number
  sMonth: number
  sDay: number

  lunarDate: string
  lYear: number
  lMonth: number
  lDay: number

  weekday: number
  weekdayCn: string

  gzYear: string
  gzMonth: string
  gzDay: string
  animal: string

  monthCn: string
  dayCn: string

  isToday: boolean
  isLeap: boolean

  isTerm: boolean
  term: string | null

  astro: string
}

function formatDateString(year: number, month: number, date: number) {
  const formatMonth = (month > 9 ? '' : '0') + month
  const formatDate = (date > 9 ? '' : '0') + date

  return `${year}-${formatMonth}-${formatDate}`
}

/**
 * 传入阳历年月日获得详细的公历、农历object信息
 * !important! 公历参数区间1900.1.31~2100.12.31
 * @param sYear solar year
 * @param sMonth solar month
 * @param sDay solar day
 * @return JSON object
 */
export function solar2lunar(): ConvertResult
export function solar2lunar(
  sYear: number,
  sMonth: number,
  sDay: number
): ConvertResult

export function solar2lunar(
  sYear?: number,
  sMonth?: number,
  sDay?: number
): ConvertResult {
  let objDate

  if (sYear && sMonth && sDay) {
    // 年份限定、上限
    if (sYear < 1900 || sYear > 2100) {
      throw new Error(
        `The solar date to be converted ${formatDateString(
          sYear,
          sMonth,
          sDay
        )} is out of range, [1900.01.31~2100.12.31] only.`
      )
    }
    // 公历传参最下限
    if (sYear === 1900 && sMonth === 1 && sDay < 31) {
      throw new Error(
        `The solar date to be converted ${formatDateString(
          sYear,
          sMonth,
          sDay
        )} is out of range, [1900.01.31~2100.12.31] only.`
      )
    }

    objDate = new Date(sYear, sMonth! - 1, sDay)
  } else {
    // 未传参，获得当天
    objDate = new Date()
  }

  // let i,
  //   leap = 0,
  //   temp = 0

  // 修正ymd参数
  sYear = objDate.getFullYear()
  sMonth = objDate.getMonth() + 1
  sDay = objDate.getDate()

  // 计算当天距离1900年春节（1900年1月31日）的天数
  let offset =
    (Date.UTC(sYear, sMonth - 1, sDay) - Date.UTC(1900, 0, 31)) /
    (24 * 3600 * 1000)

  // let i = 0
  // let temp = 0
  // for (i = 1900; i < 2101 && offset > 0; i++) {
  //   temp = lYearDays(i)
  //   offset -= temp
  // }
  // if (offset < 0) {
  //   offset += temp
  //   i--
  // }

  let offsetYear = 1900
  let offsetYearDays = lYearDays(1900)
  while (offset - offsetYearDays >= 0) {
    offset -= offsetYearDays
    offsetYear++
    offsetYearDays = lYearDays(offsetYear)
  }

  // 是否今天
  let today = new Date(),
    isToday = false
  if (
    today.getFullYear() === sYear &&
    today.getMonth() + 1 === sMonth &&
    today.getDate() === sDay
  ) {
    isToday = true
  }

  // 星期几
  let weekday = objDate.getDay()
  const weekdayCn = '\u661f\u671f' + nStr1[weekday]

  // 数字表示周几顺应天朝周一开始的惯例
  if (weekday === 0) {
    weekday = 7
  }

  // 农历年
  const lYear = offsetYear
  const leap = leapMonth(lYear) // 闰哪个月
  let isLeap = false

  // 效验闰月
  let i,
    temp = 0
  for (i = 1; i < 13 && offset > 0; i++) {
    // 闰月
    if (leap > 0 && i === leap + 1 && !isLeap) {
      --i
      isLeap = true
      temp = leapDays(lYear) //计算农历闰月天数
    } else {
      temp = monthDays(lYear, i) //计算农历普通月天数
    }
    // 解除闰月
    if (isLeap && i === leap + 1) {
      isLeap = false
    }
    offset -= temp
  }
  // 闰月导致数组下标重叠取反
  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeap) {
      isLeap = false
    } else {
      isLeap = true
      --i
    }
  }
  if (offset < 0) {
    offset += temp
    --i
  }

  // 农历月
  const lMonth = i
  // 农历日
  const lDay = offset + 1
  // 天干地支处理
  const gzYear = toGanZhiYear(lYear)
  // 生肖
  const animal = getAnimal(lYear)

  const monthCn = (isLeap ? '\u95f0' : '') + toChinaMonth(lMonth)
  const dayCn = toChinaDay(lDay) as string

  // 当月的两个节气
  // bugfix-2017-7-24 11:03:38 use lunar Year Param `y` Not `year`
  const firstNode = getTerm(sYear, sMonth * 2 - 1) // 返回当月第一个节气日期
  const secondNode = getTerm(sYear, sMonth * 2) // 返回当月第二个节气日期

  // 依据12节气修正干支月
  const gzMonth = toGanZhi(
    (sYear - 1900) * 12 + sMonth + (sDay >= firstNode ? 12 : 11)
  )

  // 传入的日期的节气与否
  let isTerm = false
  let term = null
  if (firstNode === sDay) {
    isTerm = true
    term = solarTerm[sMonth * 2 - 2]
  } else if (secondNode === sDay) {
    isTerm = true
    term = solarTerm[sMonth * 2 - 1]
  }

  // 日柱 当月一日与1900年1月1日相差的天数
  // 1900年1月1日为干支甲戌日，offset为10
  const dayCyclical =
    (Date.UTC(sYear, sMonth - 1, 1) - Date.UTC(1900, 0, 1)) / 86400000 + 10
  const gzDay = toGanZhi(dayCyclical + sDay - 1)

  // 该日期所属的星座
  const astro = toAstro(sMonth, sDay)

  const solarDate = formatDateString(sYear, sMonth, sDay)
  const lunarDate = formatDateString(lYear, lMonth, lDay)

  // const festival = festival
  // const lFestival = lFestival

  const festivalDate = sMonth + '-' + sDay
  let lunarFestivalDate = lMonth + '-' + lDay

  // bugfix https://github.com/jjonline/calendar.js/issues/29
  // 农历节日修正：农历12月小月则29号除夕，大月则30号除夕
  // 此处取巧修正：当前为农历12月29号时增加一次判断并且把lunarFestivalDate设置为12-30以正确取得除夕
  // 天朝农历节日遇闰月过前不过后的原则，此处取农历12月天数不考虑闰月
  // 农历闰12月在本工具支持的200年区间内未出现，上一次是在1574年出现
  if (lMonth === 12 && lDay === 29 && monthDays(lYear, lMonth) === 29) {
    lunarFestivalDate = '12-30'
  }

  return {
    // festival: festival[festivalDate] ? festival[festivalDate].title : null,
    // lunarFestival: lFestival[lunarFestivalDate]
    //   ? lFestival[lunarFestivalDate].title
    //   : null,
    solarDate,
    sYear,
    sMonth,
    sDay,

    lunarDate,
    lYear,
    lMonth,
    lDay,

    weekday,
    weekdayCn,

    gzYear,
    gzMonth,
    gzDay,
    animal,

    monthCn,
    dayCn,

    isToday,
    isLeap,

    isTerm,
    term,

    astro
  }
}

/**
 * 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息
 * !important! 参数区间1900.1.31~2100.12.1
 * @param lYear lunar year
 * @param lMonth lunar month
 * @param lDay lunar day
 * @param isLeapMonth lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
 * @return JSON object
 */
export function lunar2solar(
  lYear: number,
  lMonth: number,
  lDay: number,
  isLeapMonth: boolean = false
) {
  const leapMonthOfYear = leapMonth(lYear)

  // 传参要求计算该闰月公历，但该年得出的闰月与传参的月份并不同
  if (isLeapMonth && leapMonthOfYear !== lMonth) {
    if (leapMonthOfYear > 0) {
      throw new Error(
        `The lunar month ${lMonth} of lunar year ${lYear} is not the leap month of the year.` +
          `The leap month of lunar year ${lYear} is month ${leapMonthOfYear}.`
      )
    } else {
      throw new Error(
        `The lunar month ${lMonth} of lunar year ${lYear} is not the leap month of the year.` +
          `There is no leap month in lunar year ${lYear}.`
      )
    }
  }

  // 超出了最大极限值
  if (
    (lYear === 2100 && lMonth === 12 && lDay > 1) ||
    (lYear === 1900 && lMonth === 1 && lDay < 31)
  ) {
    throw new Error(
      `The lunar date to be converted ${formatDateString(
        lYear,
        lMonth,
        lDay
      )} is out of range, [1900.01.31~2100.12.01] only.`
    )
  }

  if (lYear < 1900 || lYear > 2100) {
    throw new Error(
      `The lunar date to be converted ${formatDateString(
        lYear,
        lMonth,
        lDay
      )} is out of range, [1900.01.31~2100.12.01] only.`
    )
  }

  // 输入日期超过当月日期
  const dayInMonth = isLeapMonth ? leapDays(lYear) : monthDays(lYear, lMonth)
  if (lDay > dayInMonth) {
    throw new Error(
      `The lunar date ${lDay} is invalid, the lunar month ${lMonth} only has ${dayInMonth} days.`
    )
  }

  // 计算农历的时间差
  let offset = 0
  for (let i = 1900; i < lYear; i++) {
    offset += lYearDays(i)
  }

  const leap = leapMonth(lYear)
  for (let i = 1; i < lMonth; i++) {
    // 处理闰月
    if (leap === i) {
      offset += leapDays(lYear)
    }
    offset += monthDays(lYear, i)
  }
  // 转换闰月农历，需补充该年闰月的前一个月的时差
  if (isLeapMonth) {
    offset += monthDays(lYear, lMonth)
  }
  offset += lDay

  // 1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
  const start = Date.UTC(1900, 0, 30)
  const solarDate = new Date(offset * 86400000 + start)
  const sYear = solarDate.getUTCFullYear()
  const sMonth = solarDate.getUTCMonth() + 1
  const sDay = solarDate.getUTCDate()

  return solar2lunar(sYear, sMonth, sDay)
}
