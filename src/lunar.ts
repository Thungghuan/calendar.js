import { gan, lunarInfo, nStr1, nStr2, nStr3, zhi } from './constant'

/**
 * 返回农历y年一整年的总天数
 * @param lYear lunar Year
 * @return Number
 */
export function lYearDays(lYear: number) {
  let sum = 348
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += lunarInfo[lYear - 1900] & i ? 1 : 0
  }
  return sum + leapDays(lYear)
}

/**
 * 返回农历lYear年闰月是哪个月；若lYear年没有闰月，则返回0
 * @param lYear lunar Year
 * @return Number (0-12)
 */
export function leapMonth(lYear: number) {
  return lunarInfo[lYear - 1900] & 0xf
}

/**
 * 返回农历lYear年闰月的天数 若该年没有闰月则返回0
 * @param lYear lunar Year
 * @return Number (0、29、30)
 */
export function leapDays(lYear: number) {
  if (leapMonth(lYear) > 0) {
    return lunarInfo[lYear - 1900] & 0x10000 ? 30 : 29
  }
  return 0
}

/**
 * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
 * @param lYear lunar Year
 * @param lMonth lunar Month
 * @return Number (-1、29、30)
 */
export function monthDays(lYear: number, lMonth: number) {
  // 月份参数从1至12，参数错误返回-1
  if (lMonth > 12 || lMonth < 1) {
    return -1
  }
  return lunarInfo[lYear - 1900] & (0x10000 >> lMonth) ? 30 : 29
}

/**
 * 农历年份转换为干支纪年
 * @param lYear 农历年的年份数
 * @return Cn string
 */
export function toGanZhiYear(lYear: number) {
  // let ganKey = (lYear - 3) % 10
  // let zhiKey = (lYear - 3) % 12
  // if (ganKey === 0) ganKey = 10 // 如果余数为0则为最后一个天干
  // if (zhiKey === 0) zhiKey = 12 // 如果余数为0则为最后一个地支
  // return gan[ganKey - 1] + zhi[zhiKey - 1]

  const ganKey = (lYear - 4) % 10
  const zhiKey = (lYear - 4) % 12

  return gan[ganKey] + zhi[zhiKey]
}

/**
 * 传入offset偏移量返回干支
 * @param offset 相对甲子的偏移量
 * @return Cn string
 */
export function toGanZhi(offset: number) {
  return gan[offset % 10] + zhi[offset % 12]
}

/**
 * 传入农历数字月份返回汉语通俗表示法
 * @param lMonth lunar month
 * @return Cn string
 */
export function toChinaMonth(lMonth: number) {
  // 若参数错误，返回-1
  if (lMonth > 12 || lMonth < 1) {
    return -1
  }

  return nStr3[lMonth - 1] + '\u6708' //加上月字
}

/**
 * 传入农历日期数字返回汉字表示法
 * @param lDay lunar day
 * @return Cn string
 */
export function toChinaDay(lDay: number) {
  // 若参数错误，返回-1
  if (lDay < 1 || lDay > 30) {
    return -1
  }

  switch (lDay) {
    case 10:
      return '\u521d\u5341' // 初十
    case 20:
      return '\u4e8c\u5341' // 二十
    case 30:
      return '\u4e09\u5341' // 三十
    default:
      return nStr2[Math.floor(lDay / 10)] + nStr1[lDay % 10]
  }
}
