export function format_data_assessment_gametype(list_data_gametype: any, assessment_id: any) {
  list_data_gametype.map((item, index) => {
    list_data_gametype[index] = {
      assessment_id: assessment_id,
      gametype_id: item,
    }
  })
}
