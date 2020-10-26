import { base64String, ConvertImage2Base64Options, ObjectURL, FetchImageOptions, ImageSize, url } from "./types.t";
/**
 * whether browser support webp
 * 判断浏览器是否支持 webp
 */
export declare const checkWebpSupport: () => boolean;
/**
 * Receive the image url and return a base64 string
 * 将图片利用 canvas 转换为 base64
 * 使用场景举例：兼容性处理、图片大小压缩
 * @param imgUrl 图片地址。响应头一定要包含 Access-Control-Allow-Origin
 * @param options 配置参数
 */
export declare function convertImage2Base64(imgUrl: url, options?: Partial<ConvertImage2Base64Options>): Promise<base64String>;
/**
 * convert same-origin image DOM to base64
 * 利用同源图片 DOM 导出 base64
 * @param img
 * @param type  仅 chrome 支持 webp
 * @param quality 质量 0-1，默认 0.92
 */
export declare function convertSameOriginImageDOM2Base64(img: HTMLImageElement, options: ConvertImage2Base64Options): base64String;
/**
 *
 * @param url 图片地址
 */
export declare function fetchImage(url: url, { responseType }?: Partial<FetchImageOptions>): Promise<Blob>;
/**
 * conver image to Blob
 * 将网络图片转换为 Blob，可以解决图片跨域绘制问题
 * @param url 图片地址
 */
export declare function convertImage2Blob(url: url | base64String): Promise<Blob>;
/**
 * conver image to ArrayBuffer
 * 将网络图片转换为 ArrayBuffer
 * @param url 图片地址
 */
export declare function convertImage2ArrayBuffer(url: url): Promise<Blob>;
/**
 * conver CORS image to ObjectURL
 * The ObjectURL will be automatically recycled when the asynchronous function ends. If you need to manually recycle, please pass in the parameter autoFreeObjectURL=false, and manually recycle the ObjectURL
 * 将跨域的网络图片转换为 ObjectURL 地址。
 * 该异步函数结束时会自动回收该 ObjectURL，如果需要手动回收，请传入参数 autoFreeObjectURL=false，并手动回收该 ObjectURL
 * @param url 图片地址
 * @param autoFreeObjectURL 默认为 true，自动释放 ObjectURL 内存引用，使用 setTimeout 异步执行。如果传入 false，需要手动执行 URL.revokeObjectURL(imgObjectURL) 释放内存
 */
export declare function convertCORSImage2ObjectURL(url: url, autoFreeObjectURL?: boolean): Promise<ObjectURL>;
/**
 * 创建一个 HTMLImageElement
 * @param src
 */
export declare function createImgEl(src?: url | base64String): HTMLImageElement;
/**
 * 加载图片
 * @param src
 */
export declare function loadImage(src: url | base64String | ObjectURL): Promise<HTMLImageElement>;
/**
 * 获取图片文件空间大小，单位 kb
 */
export declare function getImageFileSize(src: url | base64String): Promise<number>;
/**
 * 获取图片宽高
 */
export declare function getImageSize(img: url | base64String | HTMLImageElement): Promise<ImageSize>;
/**
 * 根据 url 获取图片某个响应头的值
 * @param url
 * @param headersKey
 */
export declare function getImageResponseHeaders<T extends string>(url: url, headersKey?: T[]): Promise<Record<T, string | string[]>>;
