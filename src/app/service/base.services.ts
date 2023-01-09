export function ValidateEmail(list_email) {
  const validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  let check = true
  list_email.forEach((item) => {
    if (item.match(validRegex) == null) {
      check = false
    }
  })
  return check
}
