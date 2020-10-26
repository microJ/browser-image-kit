import { base64String, ObjectURL, url } from "./types.t"

/**
 * 判断是否是 string
 * @param str
 */
export function isString(str: unknown): str is string {
  return typeof str === "string"
}

/**
 * 是否是 base64 图片
 * @param img
 */
export function isBase64StringImage(img: unknown): img is base64String {
  return isString(img) && /data:image\//.test(img)
}

/**
 * 是否是 Image DOM 元素
 * @param img
 */
export function isHTMLImageElement(img: unknown): img is HTMLImageElement {
  return Object.prototype.toString.call(img) === "[object HTMLImageElement]"
}

/**
 * 是否是 ObjectURL
 */
export function isObjectURL(str: unknown): str is ObjectURL {
  return isString(str) && /blob:/.test(str)
}

export function isFile(file: unknown): file is File {
  return Object.prototype.toString.call(file) === "[object File]"
}

// ============================= URL =============================

/**
 * 是否是 url 地址
 * @param url
 */
export function isUrl(url: unknown): url is url {
  return (
    isString(url) && (isFullUrl(url) || isUrlPath(url) || isRelativeUrl(url))
  )
}

/**
 * full url, with protocol
 * example: http://developer.mozilla.org:443/en-US/docs/Learn
 */
export function isFullUrl(url: unknown): url is url {
  return isString(url) && /^https?:\/\//i.test(url)
}

/**
 * absolute URL, Implicit domain name
 * example: /path/to/myfile.html
 */
export function isUrlPath(url: unknown): url is url {
  return isString(url) && /^\//.test(url)
}

/**
 * relative URL
 * example:
 *      images/a.png
 *      ./images/a.png
 *      ../other/images/b.png
 */
export function isRelativeUrl(url: unknown): url is url {
  return (
    isString(url) &&
    ((!isUrlPath(url) && !isFullUrl(url)) || /^(.{1,2}\/)/i.test(url))
  )
}
