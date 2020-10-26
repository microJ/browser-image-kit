import { base64String, ObjectURL, url } from "./types.t";
/**
 * 判断是否是 string
 * @param str
 */
export declare function isString(str: unknown): str is string;
/**
 * 是否是 base64 图片
 * @param img
 */
export declare function isBase64StringImage(img: unknown): img is base64String;
/**
 * 是否是 Image DOM 元素
 * @param img
 */
export declare function isHTMLImageElement(img: unknown): img is HTMLImageElement;
/**
 * 是否是 ObjectURL
 */
export declare function isObjectURL(str: unknown): str is ObjectURL;
export declare function isFile(file: unknown): file is File;
/**
 * 是否是 url 地址
 * @param url
 */
export declare function isUrl(url: unknown): url is url;
/**
 * full url, with protocol
 * example: http://developer.mozilla.org:443/en-US/docs/Learn
 */
export declare function isFullUrl(url: unknown): url is url;
/**
 * absolute URL, Implicit domain name
 * example: /path/to/myfile.html
 */
export declare function isUrlPath(url: unknown): url is url;
/**
 * relative URL
 * example:
 *      images/a.png
 *      ./images/a.png
 *      ../other/images/b.png
 */
export declare function isRelativeUrl(url: unknown): url is url;
