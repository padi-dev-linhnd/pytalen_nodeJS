'use strict'

describe('sample', () => {
  test('1 + 1 = 2', async () => {
    expect(1 + 1).toEqual(2)
  })
})

import AssessmentRepository from '../../app/repositories/assessment.repository'
import Assessment from '../../models/entities/assessment.entity'

describe('check assessment', () => {
  const table = [
    {
      params: {
        id: 1,
      },
      expected: {
        name: 'assessment',
        position: 'thuc tap',
        start_date: '2022-12-27 09:45:00',
        end_date: '2022-12-28 09:45:00',
        hr_id: 1,
      },
    },
    {
      params: {
        id: 2,
      },
      expected: {
        name: 'assessment2',
        position: 'thuc tap',
        start_date: '2022-12-27 09:45:00',
        end_date: '2022-12-28 09:45:00',
        hr_id: 1,
      },
    },
  ]

  const assessmentRepository = new AssessmentRepository(Assessment)
  test.each(table)('params:$params', async ({ params, expected }) => {
    const data_assessment = await assessmentRepository.findByCondition({
      where: params,
      nest: true,
      raw: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'id', 'locked'],
      },
    })
    expect(data_assessment).toEqual(expected)
  })
})
