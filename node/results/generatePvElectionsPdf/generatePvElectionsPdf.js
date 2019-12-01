// Load the PDFMake Library & tools to read/write locally
import fs from 'fs-extra'
import path from 'path'
import PdfPrinter from 'pdfmake'
import { format, parseISO } from 'date-fns'
import utils from './pdfUtils.js'
import { printDataEstablishment } from './printDataEstablishment.js'
import { printDataCollege } from './printDataCollege'
import { printDataFirstRoundSummary } from './printDataFirstRoundSummary'
import { printDataFirstRoundCandidates } from './printDataFirstRoundCandidates'
import { printDataSecondRoundSummary } from './printDataSecondRoundSummary'
import { printDataSecondRoundCandidates } from './printDataSecondRoundCandidates'

// IMPORTANT TODO : reset Constant import
// import { ELEMENT_FORMAT as E, URN_TYPES } from '../../common/constants'
const e = {
  unknown: '..',
  date_seperator: '/',
  hour_seperator: 'h'
}

const E = {
  DATE: 'DD/MM/YYYY',
  HOUR: 'HH:mm',
  HOUR_SPACE: 'HH mm',
  UNKNOWN_VALUE: e.unknown,
  DATE_SEPARATOR: e.date_seperator,
  HOUR_SEPARATOR: e.hour_seperator,
  DATE_UNKNOWN: e.unknown + e.date_seperator + e.unknown + e.date_seperator + e.unknown + e.unknown,
  HOUR_UNKNOWN: e.unknown + e.hour_seperator + e.unknown
}

const URN_TYPES = {
  TITULAR: 'titular',
  SUBSTITUTE: 'substitute'
}

const constants = {
  PATH_TO_REGULAR_FONT: 'fonts/RobotoMono-Medium.ttf',
  PATH_TO_TITULAR_BACKGROUND_1: './cerfa_15822_01/cerfa_15822_01_1.png',
  PATH_TO_TITULAR_BACKGROUND_2: './cerfa_15822_01/cerfa_15822_01_2.png',
  PATH_TO_SUPPLEANT_BACKGROUND_1: './cerfa_15823_01/cerfa_15823_01_1.png',
  PATH_TO_SUPPLEANT_BACKGROUND_2: './cerfa_15823_01/cerfa_15823_01_2.png'
}

function printData(data) {

  const { establishment, college, rounds } = data
  let c = []

  c.push(utils.createBackground('background_1'))

  c = printDataEstablishment(c, data);
  c = printDataCollege(c, data);
  c = printDataFirstRoundSummary(c, data)
  c = printDataFirstRoundCandidates(c, data)
  
  c.push(utils.createPageBreak())
  c.push(utils.createBackground('background_2'))

  c = printDataSecondRoundSummary(c, data)
  c = printDataSecondRoundCandidates(c, data)

  return c
}

export default function generatePvElectionsPdf(finalResults) {
  // console.log("In generatePvElectionsPdf")
  // Load the monospace fonts
  let fontPath = path.join(__dirname, constants.PATH_TO_REGULAR_FONT)
  let fonts = {
    Roboto: {
      normal: fontPath
    }
  }

  const printer = new PdfPrinter(fonts)
  // console.log("PdfPrinter Loaded")

  let background_1_data
  let background_2_data
  let content

  // Check if it's a titular of Suppleant election
  let path_to_background_1
  let path_to_background_2

  if (finalResults.voteType === URN_TYPES.TITULAR) {
    path_to_background_1 = constants.PATH_TO_TITULAR_BACKGROUND_1
    path_to_background_2 = constants.PATH_TO_TITULAR_BACKGROUND_2
  } else {
    path_to_background_1 = constants.PATH_TO_SUPPLEANT_BACKGROUND_1
    path_to_background_2 = constants.PATH_TO_SUPPLEANT_BACKGROUND_2
  }

  // Load background images
  try {
    // console.log(__dirname)
    background_1_data = fs.readFileSync(path.join(__dirname, path_to_background_1), 'base64')
    // console.log("Background 1 loaded")
    background_2_data = fs.readFileSync(path.join(__dirname, path_to_background_2), 'base64')
    // console.log("Background 2 loaded")
    content = printData(finalResults)
    // console.log("Content created")
  } catch (err) {
    console.log(err)
  }

  // Create the pdf document definition
  let docDefinition = {
    pageSize: 'A4',
    content: content,
    images: {
      background_1: `data:image/png;base64,
            ${background_1_data}`,
      background_2: `data:image/png;base64,
            ${background_2_data}`
    },
    styles: {}
  }

  let now = new Date()
  let pdfDoc
  try {
    pdfDoc = printer.createPdfKitDocument(docDefinition)
    // TODO: REMOVE THIS
    pdfDoc.pipe(fs.createWriteStream("./result.pdf"))
    pdfDoc.end()
    console.log(`Generated document in ${new Date() - now} ms`)
  } catch (err) {
    console.log(err)
  }

  return pdfDoc
}
