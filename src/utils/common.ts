import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import BN from 'bn.js'
import { keyring } from '@polkadot/ui-keyring'

export const getUserName = (address: string) => {
  try {
    return keyring.getAddress(address, null)?.meta?.name || address.slice(0, 4) + '...' + address.slice(-4)
  } catch (error) {
    return ''
  }
}

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
 * @description Return Balance
 * @param {string} bal number to be processed
 * @param {number} decimal
 * @param {number} unit
 * @returns {BN}
 */
export const reduceDenomToBalance = (bal: number, decimal: number, unit?: number) => {
  if (bal == 0) {
    return new BN(0)
  }
  const unitDecimal = unit ? unit + decimal : decimal
  const strBal = bal.toString()
  const arrDecimalBal = strBal.split('.')
  const minorityBal = (arrDecimalBal[1] || '').padEnd(unitDecimal, '0').substr(0, unitDecimal)
  const balanceStr = arrDecimalBal[0] == '0' ? minorityBal : arrDecimalBal[0].concat(minorityBal)

  return new BN(balanceStr)
}

export const defaultUnitIndex = 5

const units = {
  femto: -15,
  pico: -12,
  nano: -9,
  micro: -6,
  milli: -3,
  default: 0,
  Kilo: 3,
  Mill: 6,
  Bill: 9,
  Tril: 12
}

export const setDefaultUnitName = (defaultName: string) => {
  units[defaultUnitIndex] = defaultName
}

export const getUnit = (unitType: string) => {
  return units[unitType]
}

/**
 * @description Find the key of an object by value
 * @param {object} target - Object to be searched for
 * @param {string} value - Value to be found
 * @returns {string} key  Returned key
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
