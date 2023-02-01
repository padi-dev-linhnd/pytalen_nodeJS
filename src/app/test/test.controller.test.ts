import { Sum } from '../service/test.service'

it('check Sum', () => {
  const sum = Sum(1, 2)
  expect(sum).toBe(3)
})
