import { expect, test } from 'vitest'
import {
  lYearDays,
  leapMonth,
  leapDays,
  monthDays,
  toGanZhiYear,
  toGanZhi,
  toChinaDay,
  toChinaMonth
} from '../src/lunar'

function dayDiff(start: string, end: string) {
  return (Date.parse(end) - Date.parse(start)) / (24 * 3600 * 1000)
}

test('calculate the total days in a lunar years', () => {
  expect(lYearDays(1987)).eq(dayDiff('1987-01-29', '1988-02-17')) // 384

  expect(lYearDays(2022)).eq(dayDiff('2022-02-01', '2023-01-22'))
})

test('get the leap month of a lunar year', () => {
  expect(leapMonth(1987)).eq(6)
  expect(leapMonth(2022)).eq(0)
  expect(leapMonth(2023)).eq(2)
})

test('get the days in the leap month of a lunar year', () => {
  expect(leapDays(1987)).eq(29)
  expect(leapDays(2022)).eq(0)
  expect(leapDays(2023)).eq(dayDiff('2023-03-22', '2023-04-20'))
})

test('get the days in a lunar month (not leap) of a lunar year', () => {
  expect(monthDays(1987, 9)).eq(29)
  expect(monthDays(2023, 1)).eq(dayDiff('2023-01-22', '2023-02-20'))
})

test('get the ganzhi of a lunar year', () => {
  expect(toGanZhiYear(1984)).eq('甲子')
  expect(toGanZhiYear(2022)).eq('壬寅')
  expect(toGanZhiYear(2023)).eq('癸卯')
  expect(toGanZhiYear(2043)).eq('癸亥')
})

test('get the ganzhi calculated by offset', () => {
  expect(toGanZhi(0)).eq('甲子')
  expect(toGanZhi(2022 - 1984)).eq('壬寅')
  expect(toGanZhi(2023 - 1984)).eq('癸卯')
  expect(toGanZhi(59)).eq('癸亥')
})

test('get the Chinese name of a lunar month', () => {
  expect(toChinaMonth(0)).eq(-1)
  expect(toChinaMonth(1)).eq('正月')
  expect(toChinaMonth(10)).eq('十月')
  expect(toChinaMonth(11)).eq('冬月')
  expect(toChinaMonth(12)).eq('腊月')
  expect(toChinaMonth(13)).eq(-1)
})

test('get the Chinese name of a lunar day', () => {
  expect(toChinaDay(0)).eq(-1)
  expect(toChinaDay(1)).eq('初一')
  expect(toChinaDay(10)).eq('初十')
  expect(toChinaDay(11)).eq('十一')
  expect(toChinaDay(20)).eq('二十')
  expect(toChinaDay(21)).eq('廿一')
  expect(toChinaDay(30)).eq('三十')
  expect(toChinaDay(31)).eq(-1)
})
