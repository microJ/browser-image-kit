interface toDataURLImageTypesMap {
  jpeg: "jpeg"
  png: "png"
  webp: "webp"
}

type toDataURLImageType = keyof toDataURLImageTypesMap
type DOMString = string
type url = string
type base64String = string

class ConvertImage2Base64Options {
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

/**
 * whether browser support webp
 * 判断浏览器是否支持 webp
 */
export const checkWebpSupport: () => boolean = ((
  isSupportWebp?: boolean
) => () => {
  if (isSupportWebp === undefined) {
    try {
      isSupportWebp =
        document
          .createElement("canvas")
          .toDataURL("image/webp", 0.5)
          .indexOf("data:image/webp") === 0
    } catch (err) {
      isSupportWebp = false
    }
  }
  return isSupportWebp
})()

/**
 * Receive the image url and return a base64 string
 * 将图片利用 canvas 转换为 base64
 * 使用场景：iOS bg-image 兼容性处理、图片大小压缩
 * @param imgUrl 图片地址。响应头一定要包含 Access-Control-Allow-Origin
 * @param options 配置参数
 */
export async function convertImage2Base64(
  imgUrl: url,
  options?: Partial<ConvertImage2Base64Options>
): Promise<base64String> {
  const opt: ConvertImage2Base64Options = Object.assign(
    new ConvertImage2Base64Options(),
    options
  )

  const img = new Image()
  img.crossOrigin = ""

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const base64: base64String = convertSameOriginImageDOM2Base64(img, opt)
      resolve(base64)
    }
    img.onerror = () => {
      reject()
    }

    convertCORSImage2DOMString(imgUrl).then(imgDOMString => {
      img.src = imgDOMString
    })
  })
}

/**
 * convert same-origin image DOM to base64
 * 利用同源图片 DOM 导出 base64
 * @param img
 * @param type  仅 chrome 支持 webp
 * @param quality 质量 0-1，默认 0.92
 */
export function convertSameOriginImageDOM2Base64(
  img: HTMLImageElement,
  options: ConvertImage2Base64Options
): base64String {
  const { type, scaling, width, height, quality } = options

  const trulyQuality = quality > 1 ? 1 : quality
  const w: number = width || img.width * scaling
  const h: number = height || img.height * scaling

  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  ctx!.drawImage(img, 0, 0, w, h)
  return canvas.toDataURL(`image/${type}`, trulyQuality)
}

/**
 * conver CORS image to DOMString
 * The DOMString will be automatically recycled when the asynchronous function ends. If you need to manually recycle, please pass in the parameter autoFreeDOMString=false, and manually recycle the DOMString
 * 将跨域的网络图片转换为 DOMString 地址。
 * 该异步函数结束时会自动回收该 DOMString，如果需要手动回收，请传入参数 autoFreeDOMString=false，并手动回收该 DOMString
 * @param url 图片地址
 * @param autoFreeDOMString 默认为 true，自动释放 DOMString 内存引用，使用 setTimeout 异步执行。如果传入 false，需要手动执行 URL.revokeObjectURL(imgDOMString) 释放内存
 */
export async function convertCORSImage2DOMString(
  url: url,
  autoFreeDOMString: boolean = true
): Promise<DOMString> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = async function () {
      const imgDOMString = URL.createObjectURL(this.response as Blob)
      console.log(this.response, imgDOMString)

      resolve(imgDOMString)

      if (autoFreeDOMString) {
        setTimeout(() => {
          // 自动释放内存
          URL.revokeObjectURL(imgDOMString)
        })
      }
    }
    xhr.onerror = () => {
      reject()
    }
    xhr.open("GET", url, true)
    xhr.responseType = "blob"
    xhr.send()
  })
}
