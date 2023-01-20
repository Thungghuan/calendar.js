import {
  lunarInfo,
  solarMonth,
  gan,
  zhi,
  animals,
  solarTerm,
  sTermInfo,
  nStr1,
  nStr2,
  nStr3
} from './constant'

/**
 * 返回农历y年一整年的总天数
 * @param y lunar Year
 * @return Number
 * @eg `let count = calendar.lYearDays(1987) // 387`
 */
function lYearDays(y: number) {
  let i,
    sum = 348
  for (i = 0x8000; i > 0x8; i >>= 1) {
    sum += lunarInfo[y - 1900] & i ? 1 : 0
  }
  return sum + leapDays(y)
}

/**
 * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
 * @param y lunar Year
 * @return Number (0-12)
 * @eg `let leapMonth = calendar.leapMonth(1987) // 6`
 */
function leapMonth(y: number) {
  return lunarInfo[y - 1900] & 0xf
}

/**
 * 返回农历y年闰月的天数 若该年没有闰月则返回0
 * @param y lunar Year
 * @return Number (0、29、30)
 * @eg `let leapMonthDay = calendar.leapDays(1987) // 29`
 */
function leapDays(y: number) {
  if (leapMonth(y) > 0) {
    return lunarInfo[y - 1900] & 0x10000 ? 30 : 29
  }
  return 0
}

/**
 * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
 * @param y lunar Year
 * @param m lunar Month
 * @return Number (-1、29、30)
 * @eg `let MonthDay = calendar.monthDays(1987,9) // 29`
 */
function monthDays(y: number, m: number) {
  if (m > 12 || m < 1) {
    return -1
  } // 月份参数从1至12，参数错误返回-1
  return lunarInfo[y - 1900] & (0x10000 >> m) ? 30 : 29
}

/**
 * 返回公历(!)y年m月的天数
 * @param y solar Year
 * @param m solar Month
 * @return Number (-1、28、29、30、31)
 * @eg `let solarMonthDay = calendar.leapDays(1987) // 30`
 */
function solarDays(y: number, m: number) {
  if (m > 12 || m < 1) {
    return -1
  } // 若参数错误 返回-1
  const ms = m - 1
  if (ms === 1) {
    // 2月份的闰平规律测算后确认返回28或29
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28
  } else {
    return solarMonth[ms]
  }
}

/**
 * 农历年份转换为干支纪年
 * @param  lYear 农历年的年份数
 * @return Cn string
 */
function toGanZhiYear(lYear: number) {
  var ganKey = (lYear - 3) % 10
  var zhiKey = (lYear - 3) % 12
  if (ganKey === 0) ganKey = 10 //如果余数为0则为最后一个天干
  if (zhiKey === 0) zhiKey = 12 //如果余数为0则为最后一个地支
  return gan[ganKey - 1] + zhi[zhiKey - 1]
}

/**
 * 传入offset偏移量返回干支
 * @param offset 相对甲子的偏移量
 * @return Cn string
 */
function toGanZhi(offset: number) {
  return gan[offset % 10] + zhi[offset % 12]
}

/**
 * 传入公历(!)y年获得该年第n个节气的公历日期
 * @param y y公历年(1900-2100)
 * @param n n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起
 * @return day Number
 * @eg `let _24 = calendar.getTerm(1987,3) // _24=4, 意即1987年2月4日立春`
 */
function getTerm(y: number, n: number) {
  if (y < 1900 || y > 2100 || n < 1 || n > 24) {
    return -1
  }
  const _table = sTermInfo[y - 1900]
  const _calcDay = []
  for (let index = 0; index < _table.length; index += 5) {
    const chunk = parseInt('0x' + _table.substr(index, 5)).toString()
    _calcDay.push(chunk[0], chunk.substr(1, 2), chunk[3], chunk.substr(4, 2))
  }
  return parseInt(_calcDay[n - 1])
}

/**
 * 传入农历数字月份返回汉语通俗表示法
 * @param m lunar month
 * @return Cn string
 * @eg `let cnMonth = calendar.toChinaMonth(12) // '腊月'`
 */
function toChinaMonth(m: number) {
  if (m > 12 || m < 1) {
    return -1
  } //若参数错误 返回-1

  return nStr3[m - 1] + '\u6708' //加上月字
}

/**
 * 传入农历日期数字返回汉字表示法
 * @param d lunar day
 * @return Cn string
 * @eg `let cnDay = calendar.toChinaDay(21) // '廿一'`
 */
function toChinaDay(d: number) {
  let s
  switch (d) {
    case 10:
      s = '\u521d\u5341' // 初十
      break
    case 20:
      s = '\u4e8c\u5341' // 二十
      break
    case 30:
      s = '\u4e09\u5341' // 三十
      break
    default:
      s = nStr2[Math.floor(d / 10)]
      s += nStr1[d % 10]
  }
  return s
}

/**
 * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
 * @param y year
 * @return Cn string
 * @eg `let animal = calendar.getAnimal(1987) // '兔'`
 */
function getAnimal(y: number) {
  return animals[(y - 4) % 12]
}

/**
 * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
 * !important! 公历参数区间1900.1.31~2100.12.31
 * @param yPara  solar year
 * @param mPara  solar month
 * @param dPara  solar day
 * @return JSON object
 * @eg:console.log(calendar.solar2lunar(1987,11,01));
 */
function solar2lunar(y: number, m: number, d: number) {
  // let y = parseInt(yPara);
  // let m = parseInt(mPara);
  // let d = parseInt(dPara);
  // 年份限定、上限
  if (y < 1900 || y > 2100) {
    return -1 // undefined转换为数字变为NaN
  }
  // 公历传参最下限
  if (y === 1900 && m === 1 && d < 31) {
    return -1
  }

  // 未传参  获得当天
  let objDate
  if (!y) {
    objDate = new Date()
  } else {
    objDate = new Date(y, m - 1, d)
  }
  let i,
    leap = 0,
    temp = 0
  //修正ymd参数
  y = objDate.getFullYear()
  m = objDate.getMonth() + 1
  d = objDate.getDate()
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
    isTodayObj.getFullYear() === y &&
    isTodayObj.getMonth() + 1 === m &&
    isTodayObj.getDate() === d
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
  const sm = m - 1
  const gzY = toGanZhiYear(year)

  // 当月的两个节气
  // bugfix-2017-7-24 11:03:38 use lunar Year Param `y` Not `year`
  const firstNode = getTerm(y, m * 2 - 1) //返回当月「节」为几日开始
  const secondNode = getTerm(y, m * 2) //返回当月「节」为几日开始

  // 依据12节气修正干支月
  let gzM = toGanZhi((y - 1900) * 12 + m + 11)
  if (d >= firstNode) {
    gzM = toGanZhi((y - 1900) * 12 + m + 12)
  }

  //传入的日期的节气与否
  let isTerm = false
  let Term = null
  if (firstNode === d) {
    isTerm = true
    Term = solarTerm[m * 2 - 2]
  }
  if (secondNode === d) {
    isTerm = true
    Term = solarTerm[m * 2 - 1]
  }
  //日柱 当月一日与 1900/1/1 相差天数
  const dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10
  const gzD = toGanZhi(dayCyclical + d - 1)
  //该日期所属的星座
  // const astro = toAstro(m, d)

  const solarDate = y + '-' + m + '-' + d
  const lunarDate = year + '-' + month + '-' + day

  // const festival = festival
  // const lFestival = lFestival

  const festivalDate = m + '-' + d
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
    cYear: y,
    cMonth: m,
    cDay: d,
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
 * 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
 * !important! 参数区间1900.1.31~2100.12.1
 * @param y  lunar year
 * @param m  lunar month
 * @param d  lunar day
 * @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
 * @return JSON object
 * @eg `console.log(calendar.lunar2solar(1987,9,10))`
 */
function lunar2solar(
  y: number,
  m: number,
  d: number,
  isLeapMonth: boolean = false
) {
  // y = parseInt(y)
  // m = parseInt(m)
  // d = parseInt(d)
  isLeapMonth = !!isLeapMonth
  const leapOffset = 0
  const _leapMonth = leapMonth(y)
  const leapDay = leapDays(y)
  if (isLeapMonth && _leapMonth !== m) {
    return -1
  } //传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
  if ((y === 2100 && m === 12 && d > 1) || (y === 1900 && m === 1 && d < 31)) {
    return -1
  } //超出了最大极限值
  const day = monthDays(y, m)
  let _day = day
  //bugFix 2016-9-25
  //if month is leap, _day use leapDays method
  if (isLeapMonth) {
    _day = leapDays(y)
  }
  if (y < 1900 || y > 2100 || d > _day) {
    return -1
  } //参数合法性效验

  //计算农历的时间差
  let offset = 0
  let i
  for (i = 1900; i < y; i++) {
    offset += lYearDays(i)
  }
  let leap = 0,
    isAdd = false
  for (i = 1; i < m; i++) {
    leap = leapMonth(y)
    if (!isAdd) {
      //处理闰月
      if (leap <= i && leap > 0) {
        offset += leapDays(y)
        isAdd = true
      }
    }
    offset += monthDays(y, i)
  }
  //转换闰月农历 需补充该年闰月的前一个月的时差
  if (isLeapMonth) {
    offset += day
  }
  //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
  const strap = Date.UTC(1900, 1, 30, 0, 0, 0)
  const calObj = new Date((offset + d - 31) * 86400000 + strap)
  const cY = calObj.getUTCFullYear()
  const cM = calObj.getUTCMonth() + 1
  const cD = calObj.getUTCDate()

  return solar2lunar(cY, cM, cD)
}
