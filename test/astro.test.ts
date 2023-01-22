import { expect, test } from 'vitest'
import { toAstro } from '../src/astro'

test('get astor of solar day', () => {
  expect(toAstro(1, 19)).eq('摩羯座')
  expect(toAstro(1, 20)).eq('水瓶座')
  expect(toAstro(2, 19)).eq('双鱼座')
  expect(toAstro(11, 13)).eq('天蝎座')
  expect(toAstro(11, 30)).eq('射手座')
  expect(toAstro(12, 31)).eq('摩羯座')
})

test('invalid date input', () => {
  expect(() => toAstro(0, 1)).toThrow(
    'The solar month 0 is out of range, expeted [1-12].'
  )
  expect(() => toAstro(13, 1)).toThrow()

  expect(() => toAstro(4, 31)).toThrow(
    `The solar day 31 in solar month 4 is out of range, expeted [1-30].`
  )
})
