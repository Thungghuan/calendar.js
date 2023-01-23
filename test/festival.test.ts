import { expect, test } from 'vitest'
import { getLunarFestival, getSolarFestival } from '../src/festival'

test('get basic solar festival', () => {
  expect(getSolarFestival(1, 1)).eq('元旦节')
  expect(getSolarFestival(10, 1)).eq('国庆节')
  expect(getSolarFestival(12, 31)).toMatchObject([])
})

test('get basic lunar festival', () => {
  expect(getLunarFestival(1, 1)).eq('春节')
  expect(getLunarFestival(8, 15)).eq('中秋节')
  expect(getLunarFestival(12, 30)).eq('除夕')
  expect(getLunarFestival(3, 3)).toMatchObject([])
})
