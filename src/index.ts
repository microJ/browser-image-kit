import { isBase64StringImage, isUrl, isHTMLImageElement, isFullUrl } from "./is"
import {
  base64String,
  ConvertImage2Base64Options,
  ObjectURL,
  FetchImageOptions,
  ImageSize,
  url,
} from "./types.t"
import { parseHeaders } from "./utils"

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
 * 使用场景举例：兼容性处理、图片大小压缩
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

  try {
    const imgObjectURL = await convertCORSImage2ObjectURL(imgUrl)
    const img = await loadImage(imgObjectURL)
    const base64 = await convertSameOriginImageDOM2Base64(img, opt)
    return base64
  } catch (err) {
    throw err
  }
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
 *
 * @param url 图片地址
 */
export async function fetchImage(
  url: url,
  { responseType = "blob" }: Partial<FetchImageOptions> = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = async function () {
      resolve(this.response as Blob)
    }
    xhr.onerror = () => {
      reject()
    }
    xhr.open("GET", url, true)
    xhr.responseType = responseType
    xhr.send()
  })
}

/**
 * conver image to Blob
 * 将网络图片转换为 Blob，可以解决图片跨域绘制问题
 * @param url 图片地址
 */
export async function convertImage2Blob(
  url: url | base64String
): Promise<Blob> {
  if (isFullUrl(url)) {
    return fetchImage(url, { responseType: "blob" })
  } else if (isBase64StringImage(url)) {
    return new Blob([url])
  } else {
    throw Error(`invalid url: ${url}`)
  }
}

/**
 * conver image to ArrayBuffer
 * 将网络图片转换为 ArrayBuffer
 * @param url 图片地址
 */
export async function convertImage2ArrayBuffer(url: url): Promise<Blob> {
  return fetchImage(url, { responseType: "arraybuffer" })
}

/**
 * conver CORS image to ObjectURL
 * The ObjectURL will be automatically recycled when the asynchronous function ends. If you need to manually recycle, please pass in the parameter autoFreeObjectURL=false, and manually recycle the ObjectURL
 * 将跨域的网络图片转换为 ObjectURL 地址。
 * 该异步函数结束时会自动回收该 ObjectURL，如果需要手动回收，请传入参数 autoFreeObjectURL=false，并手动回收该 ObjectURL
 * @param url 图片地址
 * @param autoFreeObjectURL 默认为 true，自动释放 ObjectURL 内存引用，使用 setTimeout 异步执行。如果传入 false，需要手动执行 URL.revokeObjectURL(imgObjectURL) 释放内存
 */
export async function convertCORSImage2ObjectURL(
  url: url,
  autoFreeObjectURL: boolean = true
): Promise<ObjectURL> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = async function () {
      const imgObjectURL = URL.createObjectURL(this.response as Blob)
      console.log(this.response, imgObjectURL)

      resolve(imgObjectURL)

      if (autoFreeObjectURL) {
        setTimeout(() => {
          // 自动释放内存
          URL.revokeObjectURL(imgObjectURL)
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

/**
 * 创建一个 HTMLImageElement
 * @param src
 */
export function createImgEl(src?: url | base64String): HTMLImageElement {
  const img = new Image()
  img.crossOrigin = ""

  if (src) {
    img.src = src
  }

  return img
}

/**
 * 加载图片
 * @param src
 */
export function loadImage(
  src: url | base64String | ObjectURL
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = createImgEl(src)
    img.onload = () => {
      resolve(img)
    }
    img.onerror = reject
  })
}

/**
 * 获取图片文件空间大小，单位 kb
 */
export async function getImageFileSize(
  src: url | base64String
): Promise<number> {
  if (isUrl(src)) {
    const headers = await getImageResponseHeaders(src, ["content-length"])
    return Number(headers["content-length"]) / 1000
  } else if (isBase64StringImage(src)) {
    const imgBlob = await convertImage2Blob(src)
    return imgBlob.size / 1000
  } else {
    throw Error(`invalid src: ${src}`)
  }
}

/**
 * 获取图片宽高
 */
export async function getImageSize(
  img: url | base64String | HTMLImageElement
): Promise<ImageSize> {
  let imgEl: HTMLImageElement

  if (isHTMLImageElement(img)) {
    imgEl = img
  } else if (isUrl(img) || isBase64StringImage(img)) {
    imgEl = await loadImage(img)
  } else {
    throw Error("invalid img type")
  }

  return { width: imgEl.naturalWidth, height: imgEl.naturalHeight }
}

// export async function getImageEXIF(
//   src: url | base64String | File
// ): Promise<any> {
//   let imageFile: File
//   if (isFile(src)) {
//     imageFile = src
//   } else if (isBase64StringImage(src) || isUrl(src)) {
//   }
// }

/**
 * 根据 url 获取图片某个响应头的值
 * @param url
 * @param headersKey
 */
export async function getImageResponseHeaders<T extends string>(
  url: url,
  headersKey?: T[]
): Promise<Record<T, string | string[]>> {
  return new Promise((resolve, reject) => {
    type Headers = Record<T, string | string[]>
    let headers: Headers

    const xhr = new XMLHttpRequest()
    xhr.responseType = "blob"
    xhr.open("GET", url, true)

    xhr.onreadystatechange = function () {
      if (headersKey) {
        headersKey.forEach(key => {
          headers[key] = this.getResponseHeader(key) as string
        })
        resolve(headers)
      } else {
        headers = parseHeaders(this.getAllResponseHeaders())
        resolve(headers)
      }

      this.abort()
    }
    xhr.onerror = reject

    xhr.send()
  })
}
