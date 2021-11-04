import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import BN from 'bn.js'

/**
 * @description Return true if the address is a legitamate Polkadot address and false if it is not
 * @param {string} address
 * @returns {boolean}
 */
export const isValidAddressPolkadotAddress = (address: string) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))
    return true
  } catch (error) {
    return false
  }
}

/**
 * @description Return true if the address is a legitamate Polkadot address and false if it is not
 * @param {string} bal number to be processed
 * @param {string} unit
 * @param {string} decimal
 * @returns {BN}
 */
export const reduceDenomToBalance = (bal: number, unit: number, decimal: number) => {
  if (bal == 0) {
    return new BN(0)
  }
  const unitDecimal = unit + decimal
  const strBal = bal.toString()
  const arrDecimalBal = strBal.split('.')
  const minorityBal = (arrDecimalBal[1] || '').padEnd(unitDecimal, '0').substr(0, unitDecimal)
  return new BN(arrDecimalBal[0].concat(minorityBal))
}

export const defaultUnitIndex = 5
const arrUnitPrefixes = [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12]
const arrUnitNames = ['femto', 'pico', 'nano', 'micro', 'milli', 'default', 'Kilo', 'Mill', 'Bill', 'Tril']

export const setDefaultUnitName = (defaultName: string) => {
  arrUnitNames[defaultUnitIndex] = defaultName
}

export const getUnitNames = () => {
  return arrUnitNames
}

export const getUnit = (unitType: string) => {
  const index = arrUnitNames.findIndex(elem => elem === unitType)
  return arrUnitPrefixes[index]
}

/**
 * @description 判断传入的日期是否过期
 * @param {string} endTime - 过期的时间
 * @returns {boolean}
 */
export const isValidDate = (endTime: string) => {
  const nowTimeStamp = new Date().getTime()
  const endTimeStamp = new Date(endTime.replaceAll('-', '/')).getTime()

  // 过期
  if (nowTimeStamp > endTimeStamp) {
    return false
  }
  return true
}

/**
 * @description 异步加载  一段js放在 header
 * @param {object} url - js 的 url
 * @param {function} callback - 成功回调
 * @returns { promise<any>}} promise
 */
export function loadScript(url: string) {
  return new Promise(() => {
    try {
      const script: any = document.createElement('script')
      script.type = 'text/javascript'
      if (script.readyState) {
        //IE
        script.onreadystatechange = function() {
          if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onreadystatechange = null
            Promise.resolve(0)
          }
        }
      } else {
        //Others: Firefox, Safari, Chrome, and Opera
        script.onload = function() {
          Promise.resolve(0)
        }
      }
      script.src = url
      document.body.appendChild(script)
    } catch (e) {
      Promise.reject(e)
    }
  })
}

/**
 * @description 通过值查找对象的 key
 * @param {object} target - 要查找的对象
 * @param {string} value - 要查找的值
 * @returns {string} key  返回的 key
 */
export function findKeyByValue(target: { [key: string]: string }, value: string): string {
  const keys = Reflect.ownKeys(target) as Array<string>
  for (let i = 0; i < keys.length; i++) {
    if (target[keys[i]] === value) {
      return keys[i]
    }
  }
  return ''
}

/**
 * @description 将 utc 格式转换为北京时间
 * @param {string} date -utc 时间字符串
 * @returns {string} 北京时间
 */
export function utc2Beijing(date: string) {
  const timestamp: Date = new Date(Date.parse(date))
  let time: number = timestamp.getTime()
  time = time / 1000

  // 增加8个小时，北京时间比utc时间多八个时区
  time = time + 8 * 60 * 60

  // 时间戳转为时间
  const beijingDatetime: any = new Date(parseInt(time + '') * 1000)

  const year = beijingDatetime.getFullYear()
  let month: string | number = beijingDatetime.getMonth() + 1
  if (month < 10) {
    month = `0${month}`
  }
  let day = beijingDatetime.getDate()
  if (day < 10) {
    day = `0${day}`
  }
  let hour = beijingDatetime.getHours()
  if (hour < 10) {
    hour = `0${hour}`
  }
  let minute = beijingDatetime.getMinutes()
  if (minute < 10) {
    minute = `0${minute}`
  }
  let second = beijingDatetime.getSeconds()
  if (second < 10) {
    second = `0${second}`
  }

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

/* eslint-disable */
export function HtmlEncode(text: string) {
  return text
    .replace(/&/g, '&')
    .replace(/\"/g, '"')
    .replace(/</g, '<')
    .replace(/>/g, '>')
}

// base64 encode
export function base64Decode(data: string) {
  const b64 =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let o1
  let o2
  let o3
  let h1
  let h2
  let h3
  let h4
  let bits
  let i = 0
  let ac = 0
  let dec = ''
  let tmpArr: any = []
  if (!data) {
    return data
  }
  data += ''
  do {
    h1 = b64.indexOf(data.charAt(i++))
    h2 = b64.indexOf(data.charAt(i++))
    h3 = b64.indexOf(data.charAt(i++))
    h4 = b64.indexOf(data.charAt(i++))
    bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4
    o1 = (bits >> 16) & 0xff
    o2 = (bits >> 8) & 0xff
    o3 = bits & 0xff
    if (h3 === 64) {
      tmpArr[ac++] = String.fromCharCode(o1)
    } else if (h4 === 64) {
      tmpArr[ac++] = String.fromCharCode(o1, o2)
    } else {
      tmpArr[ac++] = String.fromCharCode(o1, o2, o3)
    }
  } while (i < data.length)
  dec = tmpArr.join('')
  dec = utf8Decode(dec)
  return dec
}

// is valid keypress
export function checkKey(iKey: number) {
  if (iKey === 32 || iKey === 229) {
    return true
  } /* space和exception */
  if (iKey > 47 && iKey < 58) {
    return true
  } /* number */
  if (iKey > 64 && iKey < 91) {
    return true
  } /* string */
  if (iKey > 95 && iKey < 108) {
    return true
  } /* num keyboard 1 */
  if (iKey > 108 && iKey < 112) {
    return true
  } /* num keyboard 2 */
  if (iKey > 185 && iKey < 193) {
    return true
  } /* punctuation 1 */
  if (iKey > 218 && iKey < 223) {
    return true
  } /* num keyboard 2 */
  return false
}

export function isAndroidMobileDevice() {
  return /android/i.test(navigator.userAgent.toLowerCase())
}

export function isAppleMobileDevice() {
  return /iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent.toLowerCase())
}

export function isDigit(value: string) {
  const patrn = /^[0-9]*$/
  if (patrn.exec(value) == null || value === '') {
    return false
  } else {
    return true
  }
}

export function isMobileUserAgent() {
  return /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(
    window.navigator.userAgent.toLowerCase()
  )
}

export function isViewportOpen() {
  return !!document.getElementById('wixMobileViewport')
}

export function getOffset(e: MouseEvent) {
  const target: EventTarget | null = e.target
  if (target) {
    const pageCoord: any = getPageCoord(target)
    const eventCoord: any = {
      X: window.pageXOffset + e.clientX,
      Y: window.pageYOffset + e.clientY
    }

    const offsetCoord: any = {
      X: eventCoord.X - pageCoord.X,
      Y: eventCoord.Y - pageCoord.Y
    }
    return offsetCoord
  }
}

export function getPageCoord(element: any) {
  const coord = { X: 0, Y: 0 }
  if (element) {
    while (element) {
      coord.X += element.offsetLeft
      coord.Y += element.offsetTop
      element = element.offsetParent
    }
  }
  return coord
}

export function utf8Decode(strData: string) {
  let tmpArr: any = []
  let i = 0
  let ac = 0
  let c1 = 0
  let c2 = 0
  let c3 = 0
  strData += ''
  while (i < strData.length) {
    c1 = strData.charCodeAt(i)
    if (c1 < 128) {
      tmpArr[ac++] = String.fromCharCode(c1)
      i++
    } else if (c1 > 191 && c1 < 224) {
      c2 = strData.charCodeAt(i + 1)
      tmpArr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63))
      i += 2
    } else {
      c2 = strData.charCodeAt(i + 1)
      c3 = strData.charCodeAt(i + 2)
      tmpArr[ac++] = String.fromCharCode(
        ((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
      )
      i += 3
    }
  }
  return tmpArr.join('')
}
