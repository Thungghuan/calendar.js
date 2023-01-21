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

/**
 * 传入阳历年月日获得详细的公历、农历object信息
 * !important! 公历参数区间1900.1.31~2100.12.31
 * @param sYear solar year
 * @param sMonth solar month
 * @param sDay solar day
 * @return JSON object
 * @eg `console.log(solar2lunar(1987,11,01))`
 */
export function solar2lunar(sYear: number, sMonth: number, sDay: number) {
  // 年份限定、上限
  if (sYear < 1900 || sYear > 2100) {
    return -1 // undefined转换为数字变为NaN
  }
  // 公历传参最下限
  if (sYear === 1900 && sMonth === 1 && sDay < 31) {
    return -1
  }

  // 未传参  获得当天
  let objDate
  if (!sYear) {
    objDate = new Date()
  } else {
    objDate = new Date(sYear, sMonth - 1, sDay)
  }
  let i,
    leap = 0,
    temp = 0
  //修正ymd参数
  sYear = objDate.getFullYear()
  sMonth = objDate.getMonth() + 1
  sDay = objDate.getDate()
  let offset =
    (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) -
      Date.UTC(1900, 0, 31)) /
    86400000
  for (i = 1900; i < 2101 && offset > 0; i++) {
    temp = lYearDays(i)
    offset -= temp
  }
  if (offset < 0) {
    offset += temp
    i--
  }

  //是否今天
  let isTodayObj = new Date(),
    isToday = false
  if (
    isTodayObj.getFullYear() === sYear &&
    isTodayObj.getMonth() + 1 === sMonth &&
    isTodayObj.getDate() === sDay
  ) {
    isToday = true
  }
  //星期几
  let nWeek = objDate.getDay(),
    cWeek = nStr1[nWeek]
  //数字表示周几顺应天朝周一开始的惯例
  if (nWeek === 0) {
    nWeek = 7
  }
  //农历年
  const year = i
  leap = leapMonth(i) //闰哪个月
  let isLeap = false

  //效验闰月
  for (i = 1; i < 13 && offset > 0; i++) {
    //闰月
    if (leap > 0 && i === leap + 1 && isLeap === false) {
      --i
      isLeap = true
      temp = leapDays(year) //计算农历闰月天数
    } else {
      temp = monthDays(year, i) //计算农历普通月天数
    }
    //解除闰月
    if (isLeap === true && i === leap + 1) {
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
  //农历月
  const month = i
  //农历日
  const day = offset + 1
  //天干地支处理
  const sm = sMonth - 1
  const gzY = toGanZhiYear(year)

  // 当月的两个节气
  // bugfix-2017-7-24 11:03:38 use lunar Year Param `y` Not `year`
  const firstNode = getTerm(sYear, sMonth * 2 - 1) //返回当月「节」为几日开始
  const secondNode = getTerm(sYear, sMonth * 2) //返回当月「节」为几日开始

  // 依据12节气修正干支月
  let gzM = toGanZhi((sYear - 1900) * 12 + sMonth + 11)
  if (sDay >= firstNode) {
    gzM = toGanZhi((sYear - 1900) * 12 + sMonth + 12)
  }

  //传入的日期的节气与否
  let isTerm = false
  let Term = null
  if (firstNode === sDay) {
    isTerm = true
    Term = solarTerm[sMonth * 2 - 2]
  }
  if (secondNode === sDay) {
    isTerm = true
    Term = solarTerm[sMonth * 2 - 1]
  }
  //日柱 当月一日与 1900/1/1 相差天数
  const dayCyclical = Date.UTC(sYear, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10
  const gzD = toGanZhi(dayCyclical + sDay - 1)
  //该日期所属的星座
  // const astro = toAstro(m, d)

  const solarDate = sYear + '-' + sMonth + '-' + sDay
  const lunarDate = year + '-' + month + '-' + day

  // const festival = festival
  // const lFestival = lFestival

  const festivalDate = sMonth + '-' + sDay
  let lunarFestivalDate = month + '-' + day

  // bugfix https://github.com/jjonline/calendar.js/issues/29
  // 农历节日修正：农历12月小月则29号除夕，大月则30号除夕
  // 此处取巧修正：当前为农历12月29号时增加一次判断并且把lunarFestivalDate设置为12-30以正确取得除夕
  // 天朝农历节日遇闰月过前不过后的原则，此处取农历12月天数不考虑闰月
  // 农历润12月在本工具支持的200年区间内仅1574年出现
  if (month === 12 && day === 29 && monthDays(year, month) === 29) {
    lunarFestivalDate = '12-30'
  }
  return {
    date: solarDate,
    lunarDate: lunarDate,
    // festival: festival[festivalDate] ? festival[festivalDate].title : null,
    // lunarFestival: lFestival[lunarFestivalDate]
    //   ? lFestival[lunarFestivalDate].title
    //   : null,
    lYear: year,
    lMonth: month,
    lDay: day,
    Animal: getAnimal(year),
    IMonthCn: (isLeap ? '\u95f0' : '') + toChinaMonth(month),
    IDayCn: toChinaDay(day),
    cYear: sYear,
    cMonth: sMonth,
    cDay: sDay,
    gzYear: gzY,
    gzMonth: gzM,
    gzDay: gzD,
    isToday: isToday,
    isLeap: isLeap,
    nWeek: nWeek,
    ncWeek: '\u661f\u671f' + cWeek,
    isTerm: isTerm,
    Term: Term
    // astro: astro
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
 * @eg `console.log(lunar2solar(1987,9,10))`
 */
export function lunar2solar(
  lYear: number,
  lMonth: number,
  lDay: number,
  isLeapMonth: boolean = false
) {
  const leapOffset = 0
  const _leapMonth = leapMonth(lYear)
  const leapDay = leapDays(lYear)
  if (isLeapMonth && _leapMonth !== lMonth) {
    return -1
  } //传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
  if (
    (lYear === 2100 && lMonth === 12 && lDay > 1) ||
    (lYear === 1900 && lMonth === 1 && lDay < 31)
  ) {
    return -1
  } //超出了最大极限值
  const day = monthDays(lYear, lMonth)
  let _day = day
  //bugFix 2016-9-25
  //if month is leap, _day use leapDays method
  if (isLeapMonth) {
    _day = leapDays(lYear)
  }
  if (lYear < 1900 || lYear > 2100 || lDay > _day) {
    return -1
  } //参数合法性效验

  //计算农历的时间差
  let offset = 0
  let i
  for (i = 1900; i < lYear; i++) {
    offset += lYearDays(i)
  }
  let leap = 0,
    isAdd = false
  for (i = 1; i < lMonth; i++) {
    leap = leapMonth(lYear)
    if (!isAdd) {
      //处理闰月
      if (leap <= i && leap > 0) {
        offset += leapDays(lYear)
        isAdd = true
      }
    }
    offset += monthDays(lYear, i)
  }
  //转换闰月农历 需补充该年闰月的前一个月的时差
  if (isLeapMonth) {
    offset += day
  }
  //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
  const strap = Date.UTC(1900, 1, 30, 0, 0, 0)
  const calObj = new Date((offset + lDay - 31) * 86400000 + strap)
  const cY = calObj.getUTCFullYear()
  const cM = calObj.getUTCMonth() + 1
  const cD = calObj.getUTCDate()

  return solar2lunar(cY, cM, cD)
}
