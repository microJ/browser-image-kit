interface toDataURLImageTypesMap {
    jpeg: "jpeg";
    png: "png";
    webp: "webp";
}
declare type toDataURLImageType = keyof toDataURLImageTypesMap;
declare type DOMString = string;
declare type url = string;
declare type base64String = string;
declare class ConvertImage2Base64Options {
    /**
     * target image type
     * 将图片转换后的目标类型
     */
    type: toDataURLImageType;
    /**
     * image size scaling factor
     * default is 1
     * 指定转换后的图片的大小缩放比例。默认值 1
     */
    scaling: number;
    /**
     * set target image width
     * higher priority than scaling
     * 指定转换后的图片的宽度
     * 优先级比 scaling 高
     */
    width: number | undefined;
    /**
     * set target image height
     * higher priority than scaling
     * 指定转换后的图片的高度
     * 优先级比 scaling 高
     */
    height: number | undefined;
    /**
     * a Number between 0 and 1 indicating the image quality to use for image formats
     * default is 0.92
     * 画质压缩参数。取值范围 0-1，默认值 0.92
     */
    quality: number;
}
/**
 * whether browser support webp
 * 判断浏览器是否支持 webp
 */
export declare const checkWebpSupport: () => boolean;
/**
 * Receive the image url and return a base64 string
 * 将图片利用 canvas 转换为 base64
 * 使用场景：iOS bg-image 兼容性处理、图片大小压缩
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
 * conver CORS image to DOMString
 * The DOMString will be automatically recycled when the asynchronous function ends. If you need to manually recycle, please pass in the parameter autoFreeDOMString=false, and manually recycle the DOMString
 * 将跨域的网络图片转换为 DOMString 地址。
 * 该异步函数结束时会自动回收该 DOMString，如果需要手动回收，请传入参数 autoFreeDOMString=false，并手动回收该 DOMString
 * @param url 图片地址
 * @param autoFreeDOMString 默认为 true，自动释放 DOMString 内存引用，使用 setTimeout 异步执行。如果传入 false，需要手动执行 URL.revokeObjectURL(imgDOMString) 释放内存
 */
export declare function convertCORSImage2DOMString(url: url, autoFreeDOMString?: boolean): Promise<DOMString>;
export {};
