// import moment from "moment/src/moment";
import moment from "dayjs"
// const moment = dayjs()
export function truncateStr(str, maxLength = 100, ending = "...") {
  return str.length > maxLength
    ? str.substring(0, maxLength - ending.length) + ending
    : str
}
export function formateNumber(number = 0) {
  return Number(Number(number).toFixed(2)).toLocaleString()
}

export function partition(array, n) {
  const copy = array.slice()
  return copy.length ? [copy.splice(0, n)].concat(partition(copy, n)) : []
}

export function today() {
  return moment()
}

export function ago(date, noSuffix) {
  return moment(date).fromNow(noSuffix)
}

export function isBetween(target, from, to) {
  return moment(target).isBetween(from, to, "day", "[]") //[] means inclusive
}
export function isSameOrBefore(date, target) {
  return moment(date).isSameOrBefore(target, "day")
}
export function isSameOrAfter(date, target) {
  return moment(date).isSameOrAfter(target, "day")
}

export function datesOrdered(date1, date2) {
  return moment(date1).isBefore(moment(date2))
}

export function isDateSameOrAfter(date, from) {
  return moment(date).isSameOrAfter(moment(from))
}

export function isDateSameOrBefore(date, to) {
  return moment(date).isSameOrBefore(moment(to))
}

export function dateInRange(date, { from, to }) {
  return (
    moment(from).isSameOrAfter(moment(date)) &&
    moment(date).isSameOrBefore(moment(to))
  )
}
export function isSameDate(currentDate, dateTobeCompared) {
  return (
    moment(currentDate).format("YYYY-MM-DD") ==
    moment(dateTobeCompared).format("YYYY-MM-DD")
  )
}
export function formateDate(date, format = "MMM DD YYYY") {
  if (!date) return ""
  return moment(date).format(format)
}
export function toDDMMYYYY(date) {
  return moment(date).format("DD-MM-YYYY")
}

export function formatInputDate(date) {
  return moment(date).format("YYYY-MM-DD")
}

export function formatePhoneNumber(phoneNumber) {
  if (!phoneNumber) return phoneNumber
  return [
    phoneNumber.slice(0, 4),
    phoneNumber.slice(4, 6),
    phoneNumber.slice(6, 9),
    phoneNumber.slice(9),
  ].join(" ")
}

export function capitilize(word) {
  return word.charAt(0).toUpperCase() + word.substr(1)
}

export function getUserRole() {
  let user = localStorage.getItem("_u_k")
  user = user && JSON.parse(user)
  return user ? user.role : ""
}

export function getUserRoles() {
  let user = localStorage.getItem("_u_k")
  user = user && JSON.parse(user)
  return user ? user.roles : []
}

export const tuneColor = {
  /* eslint-disable implicit-arrow-linebreak */
  // darken: (colorValue, amount) => Color(colorValue).darken(amount).string(),
  // lighten: (colorValue, amount) => Color(colorValue).lighten(amount).string(),
}

export const buttonVariants = {
  primary: "#ec3118",
  success: "#0B875B",
  danger: "#E13C3C",
  warning: "#F89C1C",
  info: "#0fb9b1",
  secondary: "#F4F5F7",
}

export function responseFields(attributes) {
  let attrs = ""
  if (attributes.length) {
    attributes.forEach((attr) => {
      attrs += `${attr.id},`
    })
  }
  return attrs
}

export function isValidEmail(value) {
  return /.+@.+\..+/.test(value)
}

export function isRequired(value) {
  return ["", null, undefined].indexOf(value) === -1
}

export function isAlpha(value) {
  return /^[a-zA-Z][a-zßüÜöÖäÄ_][\wßüÜöÖäÄ]*$/g.test(value) // MARK: Alphabets
}

export function strongPassword(value) {
  return (
    /[a-z]/.test(value) && //MARK: checks for a-z
    /[0-9]/.test(value) && //MARK: checks for 0-9
    /\W|_/.test(value) && //MARK: checks for special char
    /[A-Z]/.test(value) && //MARK: checks for capital letterd
    value.length >= 8
  )
}

export function getErrorMessages(label, validationResult) {
  const MESSAGES = {
    required: `${label} is required`,
    email: `${label} is invalid email.`,
    sameAsPassword: `${label} did not match with Password.`,
    sameAsNewPassword: `${label} did not match with New Password.`,
    noFileSelected: "Select a file please.",
  }
  let valKeys = Object.keys(validationResult)
  let rules = Object.keys(MESSAGES).filter((key) => valKeys.includes(key))
  if (!validationResult.$invalid) return []
  return rules.reduce((messageAcc, rule) => {
    if (!validationResult[rule]) messageAcc.push(MESSAGES[rule])
    return messageAcc
  }, [])
}

export function validate(meta, rootValidationResult) {
  if (!rootValidationResult.$invalid) return null
  let errors = {}
  console.log("meta ", meta)
  meta.forEach(({ value, label }) => {
    let valueArr = value.split(".")
    let valueStr = valueArr[valueArr.length - 1]
    if (!label) label = valueStr[0].toUpperCase() + valueStr.slice(1)
    errors[valueStr] = getErrorMessages(
      label,
      getPropByString(rootValidationResult, value),
    )
  })
  return errors
}
export function getStatusColor(status = "") {
  const colors = {
    pending: "orange",
    calculated: "orange", //salary
    due: "teal", //salary
    open: "teal", //salary
    approved: "#3bb979",
    completed: "#3bb979",
    paid: "#3bb979",
    intransit: "#2B6CB0",
    verified: "#3bb979",
    active: "#3bb979",
    adjusted: "#3bb979",
    given: "#3bb979", //salary
    modified: "#2B6CB0", //
    closed: "#2B6CB0", //
    terminated: "#ffe0e0",
    inactive: "#ec3118",
    rejected: "#ec3118", //transfer
    suspended: "orange",
    "partial paid": "teal",
    ordered: "orange",
    cancelled: "#ec3118",
    received: "#3bb979",
  }
  return colors[status.toLowerCase()] || "orange"
}

export function getPropByString(obj, propString) {
  if (!propString) return obj
  var prop,
    props = propString.split(".")

  for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i]

    var candidate = obj[prop]
    if (candidate !== undefined) {
      obj = candidate
    } else {
      break
    }
  }
  if (obj) {
    if (props[i] == "$" && typeof obj == "object") {
      ++i
      if (obj.length > 0) {
        return obj.map((item) => getPropByString(item, props[i]))
      } else return []
    } else {
      return obj ? obj[props[i]] : obj
    }
  } else {
    return obj
  }
}
