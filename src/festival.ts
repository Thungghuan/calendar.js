type FestivalKey = `${number}-${number}`

interface Festival {
  [K: FestivalKey]: string | string[]
}

/**
 * 阳历节日
 */
const basicSolarFestival: Festival = {
  '1-1': '元旦节',
  '2-14': '情人节',
  '5-1': '劳动节',
  '5-4': '青年节',
  '6-1': '儿童节',
  '9-10': '教师节',
  '10-1': '国庆节',
  '12-25': '圣诞节',

  '3-8': '妇女节',
  '3-12': '植树节',
  '4-1': '愚人节',
  '5-12': '护士节',
  '7-1': '建党节',
  '8-1': '建军节',
  '12-24': '平安夜'
}

/**
 * 农历节日
 */
const basicLunarFestival: Festival = {
  '12-30': '除夕',
  '1-1': '春节',
  '1-15': '元宵节',
  '2-2': '龙抬头',
  '5-5': '端午节',
  '7-7': '七夕节',
  '7-15': '中元节',
  '8-15': '中秋节',
  '9-9': '重阳节',
  '10-1': '寒衣节',
  '10-15': '下元节',
  '12-8': '腊八节',
  '12-23': '北方小年',
  '12-24': '南方小年'
}

export function getSolarFestival(
  sMonth: number,
  sDay: number
): string | string[] {
  const festivalDate: FestivalKey = `${sMonth}-${sDay}`
  if (festivalDate in basicSolarFestival) {
    return basicSolarFestival[festivalDate]
  } else {
    return []
  }
}

export function getLunarFestival(
  lMonth: number,
  lDay: number
): string | string[] {
  const festivalDate: FestivalKey = `${lMonth}-${lDay}`
  if (festivalDate in basicLunarFestival) {
    return basicLunarFestival[festivalDate]
  } else {
    return []
  }
}
