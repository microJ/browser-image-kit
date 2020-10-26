const ignoreDuplicateOf = [
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent",
]

export function parseHeaders(headers: string) {
  const parsed: Record<string, string | string[]> = {}
  let key: string
  let val: string
  let i: number

  if (!headers) {
    return parsed
  }

  headers.split("\n").forEach(line => {
    i = line.indexOf(":")
    key = line.substr(0, i).trim().toLowerCase()
    val = line.substr(i + 1).trim()

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return
      }
      if (key === "set-cookie") {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat(val)
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val
      }
    }
  })

  return parsed
}
