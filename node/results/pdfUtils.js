import { PV_STATUSES, COLLEGE_LABELS } from './constants'

function getDatePart(date, part) {
  let str = date.replace(/\D/g, '')

  if (part === 'd') return str.substring(0, 2)
  if (part === 'm') return str.substring(2, 4)
  if (part === 'y') return str.substring(4, 8)
}

function createDatePart(siret, x, y, part) {
  const offset = part === 'd' ? 0 : part === 'm' ? 23 : 45
  const datePart = {
    absolutePosition: { x: x + offset, y: y },
    text: this.getDatePart(siret, part),
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
    case PV_STATUSES.OUVRIERS:
      return 145
    case PV_STATUSES.EMPLOYES:
      return 157
    case PV_STATUSES.TECHNICIENS:
      return 170
    case PV_STATUSES.AGENTS_DE_MAITRISE:
      return 182
    case PV_STATUSES.INGENIEURS:
      return 195
    case PV_STATUSES.CADRES:
      return 208
    default:
      return 220
  }
}

function getYaxisDenomination(denomination) {
  switch (denomination) {
    case COLLEGE_LABELS.COLLEGE_UNIQUE:
      return 144
    case COLLEGE_LABELS.PREMIER_COLLEGE:
      return 164
    case COLLEGE_LABELS.DEUXIEME_COLLEGE:
      return 184
    case COLLEGE_LABELS.TROISIEME_COLLEGE:
      return 203
    case COLLEGE_LABELS.AUTRE_COLLEGE:
      return 223
    default:
      return 223
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
