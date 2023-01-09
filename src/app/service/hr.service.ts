import bcrypt from 'bcrypt'

export function format_data_hr(dataReq: any) {
  const data_hr = dataReq
  delete data_hr.Game_type
  data_hr.password = bcrypt.hashSync(data_hr.password, 10)
  return data_hr
}

export function format_data_gametype(data_gametype: any, hr_id: any) {
  data_gametype.map((item, index) => {
    data_gametype[index] = {
      gametype_id: item,
      hr_id: hr_id,
    }
  })
  return data_gametype
}
