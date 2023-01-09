export function format_data_question_gametype1_and_dataReq(
  data_question_gametype1: any,
  dataReq: any,
  data_results,
) {
  dataReq.question_id = data_question_gametype1.id
  data_question_gametype1.time_question = data_question_gametype1.level * 20
  // data_question_gametype1.total_time = data_question_gametype1.Gametype.total_time
  // data_question_gametype1.total_question = data_question_gametype1.Gametype.total_question
  data_question_gametype1.question_number = data_results.list_question_id.length + 1
  data_question_gametype1.total_points = data_results.total_points
  data_question_gametype1.time_remaining = data_question_gametype1.level * 20
  delete data_question_gametype1.Gametype
  delete data_question_gametype1.Answer
  delete data_question_gametype1.createdAt
  delete data_question_gametype1.updatedAt
}

export function format_data_question_gametype2_and_dataReq(
  data_question_gametype2: any,
  dataReq: any,
  data_results,
  time_remaining,
) {
  dataReq.question_id = data_question_gametype2[0].id
  const list_answer = ['dung', 'sai']
  const total_time = data_question_gametype2[0].Gametype.total_time
  const total_question = data_question_gametype2[0].Gametype.total_question
  data_question_gametype2[0].list_answer = list_answer
  data_question_gametype2[0].total_time = total_time
  data_question_gametype2[0].question_number = data_results.list_question_id.length + 1
  data_question_gametype2[0].total_points = data_results.total_points
  data_question_gametype2[0].time_remaining = time_remaining
  delete data_question_gametype2[0].Answer
  delete data_question_gametype2[0].Gametype
}

export function format_data_question_gametype2(data_result: any, time_remaining, data_results) {
  const list_answer = []
  const total_time = data_result[0].Gametype.total_time
  const total_question = data_result[0].Gametype.total_question
  data_result.map((item) => {
    list_answer.push(item.Question.Answer.answer)
  })
  delete data_result[0].Question.Answer
  delete data_result[0].Question.level
  data_result[0].Question.list_answer = list_answer
  data_result[0].Question.total_time = total_time
  data_result[0].Question.time_remaining = time_remaining
  data_result[0].Question.question_number = data_results.list_question_id.length
  data_result[0].Question.total_points = data_results.total_points
}

export function format_data_question_gametype1(data_result: any, time_remaining, data_results) {
  const total_question = data_result[0].Gametype.total_question
  const time_question = data_result[0].Question.level * 20
  delete data_result[0].Question.Answer
  data_result[0].Question.time_question = time_question
  data_result[0].Question.time_remaining = time_remaining
  data_result[0].Question.question_number = data_results.list_question_id.length
  data_result[0].Question.total_points = data_results.total_points
}

export function time_used(stringDate: any) {
  const StartDate = new Date(stringDate)
  const start = Date.UTC(
    StartDate.getFullYear(),
    StartDate.getMonth(),
    StartDate.getDate(),
    StartDate.getHours(),
    StartDate.getMinutes(),
    StartDate.getSeconds(),
  )
  const EndDate = new Date()
  const now = Date.UTC(
    EndDate.getFullYear(),
    EndDate.getMonth(),
    EndDate.getDate(),
    EndDate.getHours(),
    EndDate.getMinutes(),
    EndDate.getSeconds(),
  )
  return (now - start) / 1000
}
