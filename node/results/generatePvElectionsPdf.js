// Load the PDFMake Library & tools to read/write locally
import fs from 'fs-extra'
import path from 'path'
import PdfPrinter from 'pdfmake'
import { format } from 'date-fns'

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

import utils from './pdfUtils.js'

const constants = {
  PATH_TO_REGULAR_FONT: 'fonts/RobotoMono-Medium.ttf',
  PATH_TO_TITULAR_BACKGROUND_1: './cerfa_15822_01/cerfa_15822_01_1.png',
  PATH_TO_TITULAR_BACKGROUND_2: './cerfa_15822_01/cerfa_15822_01_2.png',
  PATH_TO_SUPPLEANT_BACKGROUND_1: './cerfa_15823_01/cerfa_15823_01_1.png',
  PATH_TO_SUPPLEANT_BACKGROUND_2: './cerfa_15823_01/cerfa_15823_01_2.png'
}

function createContent(finalResults) {
  // console.log("In createContent")
  const { company, college, establishments } = finalResults
  const c = []
  const establishment = finalResults.establishment
  // I - etablisment
  c.push(utils.createBackground('background_1'))
  c.push(utils.createSiretPart(establishment.siret, 202, 109, 1))
  c.push(utils.createSiretPart(establishment.siret, 202, 109, 2))
  c.push(utils.createSiretPart(establishment.siret, 202, 109, 3))
  c.push(utils.createSiretPart(establishment.siret, 202, 109, 4))
  c.push(utils.createText(company.name, 156, 120))
  c.push(utils.createText(establishment.address.street, 142, 130))
  c.push(utils.createText(establishment.address.code, 150, 147, '10', '4'))
  c.push(utils.createText(establishment.address.city, 224, 148))

  establishment.idcc = establishment.idcc.toString()
  const idccLengthDiff = 4 - establishment.idcc.length
  let idccZeroCharchters = ''

  if (idccLengthDiff > 0) for (let i = 0; i < idccLengthDiff; i++) idccZeroCharchters += '0'

  c.push(utils.createText(idccZeroCharchters + establishment.idcc, 222, 159, '10', '2'))

  c.push(utils.createText(college.term, 185, 192))
  if (company.infos.previous) {
    const date_previous = format(company.infos.previous, E.DATE)
    c.push(utils.createDatePart(date_previous, 250, 236, 'd'))
    c.push(utils.createDatePart(date_previous, 250, 236, 'm'))
    c.push(utils.createDatePart(date_previous, 250, 236, 'y'))
  }
  // II - college
  c.push(utils.createText('x', 429, utils.getYaxisDenomination(college.denomination), '10'))
  college.statuses.forEach(function(status) {
    c.push(utils.createText('x', 544.5, utils.getYaxisBasedOnStatus(status), '10'))
  })
  let nbOtherStatuses = 0
  college.statuses.forEach(function(status) {
    // Case where status is other
    if (utils.getYaxisBasedOnStatus(status) === 220) {
      c.push(utils.createBoundedText(status, 469, 223 + nbOtherStatuses * 7.8, 108, 5))
      nbOtherStatuses += 1
    }
  })

  // III - Results 1st Round
  // Date & times
  const date_start = format(college.rounds[0].dates.start, E.DATE)
  c.push(utils.createDatePart(date_start, 241, 284, 'd'))
  c.push(utils.createDatePart(date_start, 241, 284, 'm'))
  c.push(utils.createDatePart(date_start, 241, 284, 'y'))

  const time_start = format(college.rounds[0].dates.start, E.HOUR_SPACE)
  c.push(utils.createText(time_start < 10 ? '0' + time_start : time_start, 180, 293, '7', '1.5'))
  // c.push(utils.createText('00', 195, 293, '7', '1.5'))

  const time_end = format(college.rounds[0].dates.end, E.HOUR_SPACE)
  c.push(utils.createText(time_end < 10 ? '0' + time_end : time_end, 288, 293, '7', '1.5'))
  // c.push(utils.createText('00', 303, 293, '7', '1.5'))

  // Deficiency
  c.push(utils.createText('x', college.rounds[0].lists.length === 0 ? 295 : 260, 301, '10'))
  // Calculated Info
  c.push(utils.createText(college.A_nbElectors, 291, 310))
  c.push(utils.createText(college.rounds[0].B_nbVotants, 291, 318))
  c.push(utils.createText(college.rounds[0].C_nbVotesBlanc, 291, 326))
  c.push(utils.createText(college.rounds[0].D_nbValidVote, 291, 334))
  c.push(utils.createText(college.A_nbElectors, 400, 303))
  c.push(utils.createText((college.A_nbElectors / 2).toFixed(2), 419, 306))
  c.push(utils.createText('x', 343, college.quorum ? 333 : 324))
  c.push(utils.createText(college.rounds[0].L_nbLists < 10 ? '0' + college.rounds[0].L_nbLists.toString() : college.rounds[0].L_nbLists, 535, 287, '9', '2'))
  c.push(utils.createText(college.P_nbSeats < 10 ? '0' + college.P_nbSeats.toString() : college.P_nbSeats, 535, 305, '9', '2'))
  c.push(utils.createText(college.rounds[0].D_nbValidVote, 495, 327))
  c.push(utils.createText(college.P_nbSeats, 498, 337))
  c.push(utils.createText((Math.round(college.rounds[0].G_quotient_electoral * 100) / 100).toFixed(2), 519, 332))

  let nbCandidate = 0
  college.rounds[0].lists.forEach(list => {
    list.candidates.forEach(candidate => {
      c.push(utils.createText(candidate.firstname, 35, 421 + nbCandidate * 13.7, '5'))
      c.push(utils.createText(candidate.lastname, 35, 426 + nbCandidate * 13.7, '5', '0', true))
      c.push(utils.createText(candidate.gender, 109, 422 + nbCandidate * 13.7, '7'))
      c.push(utils.createText(list.name, 123, 422 + nbCandidate * 13.7, '5'))
      c.push(utils.createText(list.organisation, 197, 422 + nbCandidate * 13.7, '5'))
      c.push(utils.createText(list.nbValidVotes, 255, 422 + nbCandidate * 13.7, '5'))
      c.push(utils.createText(candidate.nbVotes, 285, 422 + nbCandidate * 13.7, '5'))

      // Only print if Quorum is true
      if (college.quorum === true) {
        c.push(utils.createText(list.T_totalVotes, 315, 422 + nbCandidate * 13.7, '5'))
        c.push(utils.createText(list.N_nbCandidates, 345, 422 + nbCandidate * 13.7, '5'))
        c.push(utils.createText(list.V_avgVotes.toFixed(2), 375, 422 + nbCandidate * 13.7, '5'))
        c.push(utils.createText(list.K_nbSeats, 405, 422 + nbCandidate * 13.7, '5'))
        if (list.additionalSeats[0]) c.push(utils.createText(list.additionalSeats[0].value.toFixed(2), 435, 422 + nbCandidate * 13.7, '5'))
        if (list.additionalSeats[1]) c.push(utils.createText(list.additionalSeats[1].value.toFixed(2), 465, 422 + nbCandidate * 13.7, '5'))
        if (list.additionalSeats[2]) c.push(utils.createText(list.additionalSeats[2].value.toFixed(2), 495, 422 + nbCandidate * 13.7, '5'))
        c.push(utils.createText(candidate.elected ? (candidate.gender === 'H' ? 'ÉLU' : 'ÉLUE') : '', 520, 422 + nbCandidate * 13.7, '5'))
        c.push(utils.createText(list.nbElected, 545, 422 + nbCandidate * 13.7, '5'))
      }
      nbCandidate += 1
    })
    nbCandidate += 1
  })
  c.push(utils.createPageBreak())
  c.push(utils.createBackground('background_2'))

  nbCandidate = 0
  if (college.round === 2) {
    // IV - Results 2st Round if need be
    // Date & times
    const date_start = format(college.rounds[1].dates.start, E.DATE)
    c.push(utils.createDatePart(date_start, 131, 60, 'd'))
    c.push(utils.createDatePart(date_start, 131, 60, 'm'))
    c.push(utils.createDatePart(date_start, 131, 60, 'y'))

    const time_start = format(college.rounds[1].dates.start, E.HOUR_SPACE)
    c.push(utils.createText(time_start < 10 ? '0' + time_start : time_start, 123, 69, '7', '1.5'))
    //c.push(utils.createText('00', 138, 69, '7', '1.5'))
    const time_end = format(college.rounds[1].dates.end, E.HOUR_SPACE)
    c.push(utils.createText(time_end < 10 ? '0' + time_end : time_end, 276, 69, '7', '1.5'))
    //c.push(utils.createText('00', 291, 69, '7', '1.5'))
    // Deficiency
    c.push(utils.createText('x', college.rounds[1].deficiency ? 237 : 206.6, 75, '10'))

    // Calculated Info
    c.push(utils.createText(college.A_nbElectors, 244, 86))
    c.push(utils.createText(college.rounds[1].B_nbVotants, 244, 94.5))
    c.push(utils.createText(college.rounds[1].C_nbVotesBlanc, 244, 102.5))
    c.push(utils.createText(college.rounds[1].D_nbValidVote, 244, 109.5))

    c.push(utils.createText(college.rounds[1].D_nbValidVote, 428, 102))
    c.push(utils.createText(college.P_nbSeats, 430, 112))
    c.push(utils.createText(college.rounds[1].G_quotient_electoral.toFixed(2), 450, 105))
    c.push(utils.createText(college.rounds[1].L_nbLists < 10 ? '0' + college.rounds[1].L_nbLists.toString() : college.rounds[1].L_nbLists, 465, 60, '9', '2'))
    c.push(utils.createText(college.P_nbSeats < 10 ? '0' + college.P_nbSeats.toString() : college.P_nbSeats, 465, 78, '9', '2'))

    college.rounds[1].lists.forEach(list => {
      list.candidates.forEach(candidate => {
        c.push(utils.createText(candidate.firstname, 503, 201 + nbCandidate * 13.6, '5'))
        c.push(utils.createText(candidate.lastname, 503, 206 + nbCandidate * 13.6, '5', '0', true))
        c.push(utils.createText(candidate.gender, 39, 202 + nbCandidate * 13.6, '7'))
        c.push(utils.createText(list.name, 55, 202 + nbCandidate * 13.6, '5'))

        c.push(utils.createText(list.nbValidVotes, 130, 202 + nbCandidate * 13.6, '5'))
        c.push(utils.createText(candidate.nbVotes, 166, 202 + nbCandidate * 13.6, '5'))

        c.push(utils.createText(list.T_totalVotes, 213, 202 + nbCandidate * 13.6, '5'))
        c.push(utils.createText(list.N_nbCandidates, 250, 202 + nbCandidate * 13.6, '5'))
        c.push(utils.createText(list.V_avgVotes.toFixed(2), 277, 202 + nbCandidate * 13.6, '5'))
        c.push(utils.createText(list.K_nbSeats, 308, 202 + nbCandidate * 13.6, '5'))
        if (list.additionalSeats[0]) c.push(utils.createText(list.additionalSeats[0].value.toFixed(2), 344, 202 + nbCandidate * 13.6, '5'))
        if (list.additionalSeats[1]) c.push(utils.createText(list.additionalSeats[1].value.toFixed(2), 377, 202 + nbCandidate * 13.6, '5'))
        if (list.additionalSeats[2]) c.push(utils.createText(list.additionalSeats[2].value.toFixed(2), 407, 202 + nbCandidate * 13.6, '5'))
        c.push(utils.createText(candidate.elected ? (candidate.gender === 'H' ? 'ÉLU' : 'ÉLUE') : '', 439, 202 + nbCandidate * 13.6, '5'))
        c.push(utils.createText(list.nbElected, 475, 202 + nbCandidate * 13.6, '5'))

        nbCandidate += 1
      })
      nbCandidate += 1
    })
  }

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

  if (finalResults.college.voteType === URN_TYPES.TITULAR) {
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
    content = createContent(finalResults)
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
    // pdfDoc.pipe(fs.createWriteStream(constants.PATH_TO_EXPORT))
    // pdfDoc.end()
    // console.log(`Generated document in ${new Date() - now} ms`)
  } catch (err) {
    console.log(err)
  }

  return pdfDoc
}
