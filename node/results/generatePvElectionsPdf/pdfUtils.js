import { PV_STATUSES, COLLEGE_LABELS } from '../constants'

function getDatePart(date, part) {
  let str = date.replace(/\D/g, '')

  if (part === 'd') return str.substring(0, 2)
  if (part === 'm') return str.substring(2, 4)
  if (part === 'y') return str.substring(4, 8)
}

function createDatePart(date, x, y, part) {
  const offset = part === 'd' ? 0 : part === 'm' ? 23 : 45
  const datePart = {
    absolutePosition: { x: x + offset, y: y },
    text: this.getDatePart(date, part),
    fontSize: 8,
    characterSpacing: '3'
  }

  return datePart
}

function getSiretDigits(siret, part) {
  let str = siret.replace(/\s/g, '')
  if (part === 1) return str.substring(0, 3)
  if (part === 2) return str.substring(3, 6)
  if (part === 3) return str.substring(6, 9)
  if (part === 4) return str.substring(9, 14)
}

function createSiretPart(siret, x, y, part) {
  const siretPart = {
    absolutePosition: { x: x + (part - 1) * 28, y: y },
    text: this.getSiretDigits(siret, part),
    fontSize: 9,
    characterSpacing: '2.4'
  }
  return siretPart
}

function getYaxisBasedOnStatus(status) {
  switch (status) {
    case 1:
      return 145
    case 2:
      return 157
    case 3:
      return 170
    case 4:
      return 182
    case 5:
      return 195
    case 6:
      return 208
    case 7:
      return 220
    default:
      return 0
  }
}

function getYaxisDenomination(denomination) {
  switch (denomination) {
    case 0:
      return 144
    case 1:
      return 164
    case 2:
      return 184
    case 3:
      return 203
    case 4:
      return 223
    default:
      return 0
  }
}

function createText(text, x, y, fontSize = '8', characterSpacing = '0', underlined = false) {
  return {
    absolutePosition: { x: x, y: y },
    text: text,
    fontSize: fontSize,
    characterSpacing: characterSpacing,
    decoration: underlined ? 'underline' : ''
  }
}
function createBoundedText(text, x, y, width, fontSize = '8', characterSpacing = '0') {
  let newFontSize = fontSize

  while (text.length * newFontSize > width) {
    newFontSize -= 0.1
  }
  return {
    absolutePosition: { x: x, y: y },
    text: text,
    fontSize: newFontSize,
    characterSpacing: characterSpacing
  }
}
function createBackground(imageName) {
  return {
    image: imageName,
    width: 595, // standard A4 with for screen resolution
    // height: 800,
    absolutePosition: { x: 0, y: 0 }
  }
}
function createPageBreak() {
  return {
    absolutePosition: { x: 0, y: 0 },
    text: '',
    fontSize: 1,
    pageBreak: 'after'
  }
}

export default {
  getDatePart: getDatePart,
  createDatePart: createDatePart,
  getSiretDigits: getSiretDigits,
  createSiretPart: createSiretPart,
  getYaxisBasedOnStatus: getYaxisBasedOnStatus,
  getYaxisDenomination: getYaxisDenomination,
  createText: createText,
  createBoundedText: createBoundedText,
  createBackground: createBackground,
  createPageBreak: createPageBreak
}
