import nodemailer from 'nodemailer'

export function Invite_candidate(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'linhtru2001@gmail.com',
      pass: 'lnmubgvtwcbnaykm',
    },
  })
  var mainOptions = {
    from: 'Nguyen Danh Linh',
    to: email,
    subject: 'invitation to take the test',
    text: `http://localhost:3000/api/v1/candidate/login/?token=${token}`,
  }
  transporter.sendMail(mainOptions)
  return
}

export function format_data_invite(dataReq: any, id_candidate: any) {
  return {
    candidate_id: id_candidate,
    hr_id: dataReq.hr_id,
    assessment_id: dataReq.assessment_id,
  }
}
