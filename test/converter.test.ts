import { describe, expect, test } from 'vitest'
import { solar2lunar, lunar2solar } from '../src/converter'

describe('test solar2lunar convert result', () => {
  const result = solar2lunar(2023, 1, 22)

  test('get solar data', () => {
    expect(result.solarDate).eq('2023-01-22')
    expect(result.sYear).eq(2023)
    expect(result.sMonth).eq(1)
    expect(result.sDay).eq(22)
  })

  test('get lunar data', () => {
    expect(result.lunarDate).eq('2023-01-01')
    expect(result.lYear).eq(2023)
    expect(result.lMonth).eq(1)
    expect(result.lDay).eq(1)
  })

  test('get weekday date', () => {
    expect(result.weekday).eq(7)
    expect(result.weekdayCn).eq('星期日')
  })

  test('get ganzhi data and animal of year', () => {
    expect(result.gzYear).eq('癸卯')
    expect(result.gzMonth).eq('癸丑')
    expect(result.gzDay).eq('庚辰')
    expect(result.animal).eq('兔')
  })

  test('get lunar data in Chinese', () => {
    expect(result.monthCn).eq('正月')
    expect(result.dayCn).eq('初一')
  })
})

describe('test other properties of the convert result', () => {
  const result = solar2lunar(2023, 1, 22)

  const today = new Date()
  test('check if a solar day today', () => {
    expect(
      solar2lunar(today.getFullYear(), today.getMonth() + 1, today.getDate())
        .isToday
    ).true

    expect(
      solar2lunar(
        today.getFullYear() - 1,
        today.getMonth() + 1,
        today.getDate()
      ).isToday
    ).false
  })

  const dayInLeapMonth = new Date('2023-04-19')
  test('check if a solar day in a leap month', () => {
    expect(result.isLeap).false

    expect(
      solar2lunar(
        dayInLeapMonth.getFullYear(),
        dayInLeapMonth.getMonth() + 1,
        dayInLeapMonth.getDate()
      ).isLeap
    ).true
  })

  const termDay = new Date('2023-06-21')
  const termDayResult = solar2lunar(
    termDay.getFullYear(),
    termDay.getMonth() + 1,
    termDay.getDate()
  )
  test('check if a solar day is a term', () => {
    expect(result.isTerm).false
    expect(result.term).null

    expect(termDayResult.isTerm).true
    expect(termDayResult.term).eq('夏至')
  })
})

describe('test lunar2solar convert result', () => {
  const result = lunar2solar(2023, 1, 1)

  test('get solar data', () => {
    expect(result.solarDate).eq('2023-01-22')
    expect(result.sYear).eq(2023)
    expect(result.sMonth).eq(1)
    expect(result.sDay).eq(22)
  })

  test('get lunar data', () => {
    expect(result.lunarDate).eq('2023-01-01')
    expect(result.lYear).eq(2023)
    expect(result.lMonth).eq(1)
    expect(result.lDay).eq(1)
  })

  test('get weekday date', () => {
    expect(result.weekday).eq(7)
    expect(result.weekdayCn).eq('星期日')
  })

  test('get ganzhi data and animal of year', () => {
    expect(result.gzYear).eq('癸卯')
    expect(result.gzMonth).eq('癸丑')
    expect(result.gzDay).eq('庚辰')
    expect(result.animal).eq('兔')
  })

  test('get lunar data in Chinese', () => {
    expect(result.monthCn).eq('正月')
    expect(result.dayCn).eq('初一')
  })
})
