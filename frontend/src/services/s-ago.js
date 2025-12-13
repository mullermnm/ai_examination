/**
 * Time             Output      Future output
 * Less than 1 minute	just now	just now
 * 1-2 minutes	a minute ago	in a minute
 * 2-46 minutes	# minutes ago	in # minutes
 * 46 minutes - 2 hours	an hour ago	in an hour
 * 2-20 hours	# hours ago	in # hours
 * 20-48 hours	yesterday	tomorrow
 * 2-6 days	last week	in a week
 * 7-28 days	# weeks ago	in # weeks
 * 28 days - 2 months	last month	in a month
 * 2-11 months	# months ago	in # months
 * 11-23 months	last year	in a year
 * 2+ years	# years ago	in # years
 */

function format(diff, divisor, unit, past, future, isInTheFuture) {
  var val = Math.round(Math.abs(diff) / divisor)
  if (isInTheFuture) return val <= 1 ? future : t[cl].format.future(val, unit)
  return val <= 1 ? past : t[cl].format.past(val, unit)
}
let t = {
  en: {
    format: {
      future: (val, unit) => "in" + val + " " + unit + "s",
      past: (val, unit) => val + " " + unit + "s ago",
    },
    justNow: "just now",
    minute: {
      self: "minute",
      past: "a minute ago",
      future: "in a minute",
    },
    hour: {
      self: "hour",
      past: "an hour ago",
      future: "in an hour",
    },
    day: {
      self: "day",
      past: "yesterday",
      future: "tomorrow",
    },
    week: {
      self: "week",
      past: "last week",
      future: "in a week",
    },
    month: {
      self: "month",
      past: "last month",
      future: "in a month",
    },
    year: {
      self: "year",
      past: "last year",
      future: "in year",
    },
  },
  g: {
    format: {
      future(val, unit) {
        return "in" + val + " " + this.pluralize(unit)
      },
      past(val, unit) {
        return "vor " + val + " " + this.pluralize(unit)
      },
      pluralize(unit) {
        let suffix = unit.endsWith("e") ? "n" : "en"
        return unit + suffix
      },
    },
    justNow: "gerade jetzt",
    minute: {
      self: "Minute",
      past: "vor einer Minute",
      future: "in einer Minute",
    },
    hour: {
      self: "Stunde",
      past: "vor einer Stunde",
      future: "in einer Stunde",
    },
    day: {
      self: "Tag",
      past: "gestern",
      future: "Morgen",
    },
    week: {
      self: "Woche",
      past: "letzte Woche",
      future: "in einer Woche",
    },
    month: {
      self: "Monat",
      past: "letzte Monat",
      future: "in einem Monat",
    },
    year: {
      self: "Jahr",
      past: "letztes Jahr",
      future: "im Jahr",
    },
  },
}

let cl = "g" //current language
var units = [
  {
    max: 2760000,
    value: 60000,
    name: "minute",
  },
  {
    max: 72000000,
    value: 3600000,
    name: "hour",
  },
  {
    max: 518400000,
    value: 86400000,
    name: "day",
  },
  {
    max: 2419200000,
    value: 604800000,
    name: "week",
  },
  {
    max: 28512000000,
    value: 2592000000,
    name: "month",
  },
]

export function ago({ date, language, max }) {
  cl = ["en", "g"].includes(language) ? language : "en" //fallback='g
  var diff = Date.now() - date.getTime()
  if (Math.abs(diff) < 60000) return t[cl]["justNow"]
  for (var i = 0; i < units.length; i++) {
    if (Math.abs(diff) < units[i].max || (max && units[i].name === max)) {
      return format(
        diff,
        units[i].value,
        t[cl][units[i].name].self,
        t[cl][units[i].name].past,
        t[cl][units[i].name].future,
        diff < 0,
      )
    }
  }
  return format(
    diff,
    31536000000,
    t[cl].year.self,
    t[cl].year.past,
    t[cl].year.future,
    diff < 0,
  )
}
