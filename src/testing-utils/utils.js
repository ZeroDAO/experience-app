import fs from 'fs'

export const DAYS = 24 * 60 * 60

export function read(name) {
  return JSON.parse(fs.readFileSync(`./src/testing-utils/data/${name}.json`, 'utf8'))
}

export function write(name, data) {
  fs.writeFileSync(`./src/testing-utils/data/${name}.json`, JSON.stringify(data, '', '\t'))
}

export function getWeight(source, target) {
  const value = target - source
  if (value < 3) {
    return 1
  } else if (value < 8) {
    return 2
  } else if (value < 21) {
    return 3
  } else if (value < 55) {
    return 4
  } else if (value < 149) {
    return 5
  } else if (value < 404) {
    return 6
  } else if (value < 1097) {
    return 7
  } else {
    return 8
  }
}
