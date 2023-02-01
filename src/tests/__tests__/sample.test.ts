'use strict'

describe('sample', () => {
  test('1 + 1 = 2', async () => {
    expect(1 + 1).toEqual(2)
  })
})

import { AssessmentController } from '../../app/controllers/assessment.controller'
import AssessmentRepository from '../../app/repositories/assessment.repository'
import Assessment from '../../models/entities/assessment.entity'

it('list_assessment[0].id = 1', async () => {
  const assessmentController = new AssessmentController(new AssessmentRepository(Assessment))

  const list_assessment = await assessmentController.getAllWhere({})

  expect(list_assessment[0].id).toEqual(1)
})
