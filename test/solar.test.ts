import { expect, test } from 'vitest'
import { getAnimal, getTerm, solarDays } from '../src/solar'

test('invalid solar month', () => {
  expect(solarDays(2023, -1)).eq(-1)
  expect(solarDays(2023, 13)).eq(-1)
})

test('days in a solar month of a solar year', () => {
  expect(solarDays(2023, 1)).eq(31)
  expect(solarDays(2023, 2)).eq(28)
  expect(solarDays(2023, 7)).eq(31)
  expect(solarDays(2023, 8)).eq(31)
  expect(solarDays(2023, 11)).eq(30)
  expect(solarDays(2023, 12)).eq(31)
  expect(solarDays(2024, 2)).eq(29)
})

test('solar year that out of range', () => {
  expect(getTerm(1899, 1)).eq(-1)
  expect(getTerm(2101, 1)).eq(-1)
})

test('index of term out of range', () => {
  expect(getTerm(2023, 0)).eq(-1)
  expect(getTerm(2023, 25)).eq(-1)
})

test('nth term in a solar year', () => {
  expect(getTerm(2023, 3)).eq(4)
  expect(getTerm(2023, 24)).eq(22)
})

test('animal of solar year', () => {
  expect(getAnimal(2022)).eq('虎')
  expect(getAnimal(2023)).eq('兔')
  expect(getAnimal(2024)).eq('龙')
})
