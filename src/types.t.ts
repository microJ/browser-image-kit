export interface toDataURLImageTypesMap {
  jpeg: "jpeg"
  png: "png"
  webp: "webp"
}

export type toDataURLImageType = keyof toDataURLImageTypesMap
export type ObjectURL = string
export type url = string
export type base64String = string

export class ConvertImage2Base64Options {
  /**
   * target image type
   * 将图片转换后的目标类型
   */
  type: toDataURLImageType = "png"

  /**
   * image size scaling factor
   * default is 1
   * 指定转换后的图片的大小缩放比例。默认值 1
   */
  scaling: number = 1

  /**
   * set target image width
   * higher priority than scaling
   * 指定转换后的图片的宽度
   * 优先级比 scaling 高
   */
  width: number | undefined = undefined

  /**
   * set target image height
   * higher priority than scaling
   * 指定转换后的图片的高度
   * 优先级比 scaling 高
   */
  height: number | undefined = undefined

  /**
   * a Number between 0 and 1 indicating the image quality to use for image formats
   * default is 0.92
   * 画质压缩参数。取值范围 0-1，默认值 0.92
   */
  quality: number = 0.92
}

export interface ImageSize {
  /**
   * unit: px
   * 图片的宽，单位 px
   */
  width: number
  /**
   * unit: px
   * 图片的高，单位 px
   */
  height: number
}

export interface FetchImageOptions {
  responseType: "arraybuffer" | "blob"
}
