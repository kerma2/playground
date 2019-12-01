// Load the PDFMake Library & tools to read/write locally
import fs from 'fs-extra'
import path from 'path'
import PdfPrinter from 'pdfmake'
import { format, parseISO } from 'date-fns'

// IMPORTANT TODO : reset Constant import
// import { ELEMENT_FORMAT as E, URN_TYPES } from '../../common/constants'

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

  c.push(utils.createText(college.term, 185, 193))

  c.push(utils.createText(finalResults.nbColleges, 297, 203))

  // // II - college
  const denominationY = utils.getYaxisDenomination(college.denominationType)
  if (denominationY !== 0) {
    c.push(utils.createText('x', 429, denominationY, '10'))
  } else {
    console.error("Invalid college.denominationType provided: ", college.denominationType)
  }
  college.composition.forEach(function (index) {
    const compositionY = utils.getYaxisBasedOnStatus(index)
    if (compositionY !== 0) {
      c.push(utils.createText('x', 544.5, compositionY, '10'))
    } else {
      console.error("Invalid college.composition index provided: ", index)
    }
  })

  let nbOtherStatuses = 0
  college.compositionOther.forEach(function (other) {
    c.push(utils.createBoundedText(other, 469, 223 + nbOtherStatuses * 7.8, 108, 5))
    nbOtherStatuses += 1
  })

  // III - Results 1st Round
  const date_start = format(parseISO(college.rounds[0].summary.startDate), 'ddMMyyyy')
  console.log(date_start)
  c.push(utils.createDatePart(date_start, 241, 284, 'd'))
  c.push(utils.createDatePart(date_start, 241, 284, 'm'))
  c.push(utils.createDatePart(date_start, 241, 284, 'y'))

  const time_start = format(parseISO(college.rounds[0].summary.startDate), 'hh')
  c.push(utils.createText(time_start < 10 ? '0' + time_start : time_start, 180, 293, '7', '1.5'))

  const minutes_start = format(parseISO(college.rounds[0].summary.startDate), 'hh')
  c.push(utils.createText(minutes_start < 10 ? '0' + minutes_start : minutes_start, 195, 293, '7', '1.5'))

  const time_end = format(parseISO(college.rounds[0].summary.endDate), 'hh')
  c.push(utils.createText(time_end < 10 ? '0' + time_end : time_end, 288, 293, '7', '1.5'))

  const minutes_end = format(parseISO(college.rounds[0].summary.endDate), 'mm')
  c.push(utils.createText(minutes_end < 10 ? '0' + minutes_end : minutes_end, 303, 293, '7', '1.5'))

  // Carence
  c.push(utils.createText('x', college.rounds[0].summary.deficiency ? 295 : 260, 301, '10'))

  c.push(utils.createText(college.rounds[0].summary.electorsNumber, 291, 310))
  c.push(utils.createText(college.rounds[0].summary.votesNumber, 291, 318))
  c.push(utils.createText(college.rounds[0].summary.blankVotesNumber, 291, 326))
  c.push(utils.createText(college.rounds[0].summary.validVotesNumber, 291, 334))
  c.push(utils.createText(college.rounds[0].summary.electorsNumber, 400, 303))
  c.push(utils.createText((college.rounds[0].summary.electorsNumber / 2).toFixed(2), 419, 306))
  c.push(utils.createText('x', 343, college.rounds[0].summary.quorum ? 333 : 324))

  c.push(utils.createText(college.rounds[0].summary.nbLists < 10 ? '0' + college.rounds[0].summary.nbLists.toString() : college.rounds[0].summary.nbLists, 535, 287, '9', '2'))
  c.push(utils.createText(college.rounds[0].summary.seats < 10 ? '0' + college.rounds[0].summary.seats.toString() : college.rounds[0].summary.seats, 535, 305, '9', '2'))
  c.push(utils.createText(college.rounds[0].summary.validVotesNumber, 495, 327))
  c.push(utils.createText(college.rounds[0].summary.seats, 498, 337))
  c.push(utils.createText(college.rounds[0].summary.quotient.toFixed(2), 519, 332))

  let nbCandidate = 0
  college.rounds[0].results.forEach(candidate => {
    c.push(utils.createText(candidate.user.firstname, 35, 421 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.user.lastname, 35, 426 + nbCandidate * 13.7, '5', '0', true))
    c.push(utils.createText((candidate.user.civility === 'MALE' ? 'H' : 'F'), 109, 422 + nbCandidate * 13.7, '7'))
    // c.push(utils.createText(el.syndicate, 123, 422 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.syndicate, 197, 422 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.syndicateBallot, 255, 422 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.candidateBallot, 285, 422 + nbCandidate * 13.7, '5'))

    // Only print if Quorum is true
    // if (college.rounds[0].summary.quorum) {
    c.push(utils.createText(candidate.candidateBallotSum, 315, 422 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.candidatePerList, 345, 422 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.voteAveragePerList.toFixed(2), 375, 422 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.seatsAttributedByList, 405, 422 + nbCandidate * 13.7, '5'))
    if (candidate.seatsAttributed[0]) c.push(utils.createText(candidate.seatsAttributed[0].toFixed(2), 435, 422 + nbCandidate * 13.7, '5'))
    if (candidate.seatsAttributed[1]) c.push(utils.createText(candidate.seatsAttributed[1].toFixed(2), 465, 422 + nbCandidate * 13.7, '5'))
    if (candidate.seatsAttributed[2]) c.push(utils.createText(candidate.seatsAttributed[2].toFixed(2), 495, 422 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.elected ? (candidate.user.civility === 'MALE' ? 'ÉLU' : 'ÉLUE') : '', 520, 422 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.electedByList, 545, 422 + nbCandidate * 13.7, '5'))
    // }
    nbCandidate += 1
  })
  c.push(utils.createPageBreak())
  c.push(utils.createBackground('background_2'))

  nbCandidate = 0
  if (college.rounds[1]) {
    // IV - Results 2st Round if need be
    // Date & times
    const round_2_date_start = format(parseISO(college.rounds[1].summary.startDate), 'ddMMyyyy')

    c.push(utils.createDatePart(round_2_date_start, 131, 60, 'd'))
    c.push(utils.createDatePart(round_2_date_start, 131, 60, 'm'))
    c.push(utils.createDatePart(round_2_date_start, 131, 60, 'y'))

    const time_start = format(parseISO(college.rounds[1].summary.startDate), 'hh')
    c.push(utils.createText(time_start < 10 ? '0' + time_start : time_start, 123, 69, '7', '1.5'))

    const minutes_start = format(parseISO(college.rounds[1].summary.startDate), 'hh')
    c.push(utils.createText(minutes_start < 10 ? '0' + minutes_start : minutes_start, 138, 69, '7', '1.5'))

    const time_end = format(parseISO(college.rounds[1].summary.endDate), 'hh')
    c.push(utils.createText(time_end < 10 ? '0' + time_end : time_end, 276, 69, '7', '1.5'))

    const minutes_end = format(parseISO(college.rounds[1].summary.endDate), 'mm')
    c.push(utils.createText(minutes_end < 10 ? '0' + minutes_end : minutes_end, 291, 69, '7', '1.5'))



    // Carence
    c.push(utils.createText('x', college.rounds[0].summary.deficiency ? 237 : 206.6, 75, '10'))

    c.push(utils.createText(college.rounds[0].summary.electorsNumber, 244, 86))
    c.push(utils.createText(college.rounds[0].summary.votesNumber, 244, 94.5))
    c.push(utils.createText(college.rounds[0].summary.blankVotesNumber, 244, 102.5))
    c.push(utils.createText(college.rounds[0].summary.validVotesNumber, 244, 109.5))

    c.push(utils.createText(college.rounds[0].summary.nbLists < 10 ? '0' + college.rounds[0].summary.nbLists.toString() : college.rounds[0].summary.nbLists, 465, 60, '9', '2'))
    c.push(utils.createText(college.rounds[0].summary.seats < 10 ? '0' + college.rounds[0].summary.seats.toString() : college.rounds[0].summary.seats, 465, 78, '9', '2'))
    c.push(utils.createText(college.rounds[0].summary.validVotesNumber, 428, 102))
    c.push(utils.createText(college.rounds[0].summary.seats, 430, 112))
    c.push(utils.createText(college.rounds[0].summary.quotient.toFixed(2), 450, 105))

    // Calculated Info
    // c.push(utils.createText(college.A_nbElectors, 244, 86))
    // c.push(utils.createText(college.rounds[1].B_nbVotants, 244, 94.5))
    // c.push(utils.createText(college.rounds[1].C_nbVotesBlanc, 244, 102.5))
    // c.push(utils.createText(college.rounds[1].D_nbValidVote, 244, 109.5))

    // c.push(utils.createText(college.rounds[1].D_nbValidVote, 428, 102))
    // c.push(utils.createText(college.P_nbSeats, 430, 112))
    // c.push(utils.createText(college.rounds[1].G_quotient_electoral.toFixed(2), 450, 105))
    // c.push(utils.createText(college.rounds[1].L_nbLists < 10 ? '0' + college.rounds[1].L_nbLists.toString() : college.rounds[1].L_nbLists, 465, 60, '9', '2'))
    // c.push(utils.createText(college.P_nbSeats < 10 ? '0' + college.P_nbSeats.toString() : college.P_nbSeats, 465, 78, '9', '2'))

    const candidateOffsetY = 13.0
    let nbCandidate = 0
    college.rounds[1].results.forEach(candidate => {
      c.push(utils.createText(candidate.user.firstname, 503, 201 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.user.lastname, 503, 206 + nbCandidate * candidateOffsetY, '5', '0', true))
      c.push(utils.createText((candidate.user.civility === 'MALE' ? 'H' : 'F'), 39, 202 + nbCandidate * candidateOffsetY, '7'))
      // c.push(utils.createText(el.syndicate, 123, 422 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.syndicate, 55, 202 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.syndicateBallot, 130, 202 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.candidateBallot, 166, 202 + nbCandidate * candidateOffsetY, '5'))

      // Only print if Quorum is true
      // if (college.rounds[0].summary.quorum) {
      c.push(utils.createText(candidate.candidateBallotSum, 213, 202 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.candidatePerList, 250, 202 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.voteAveragePerList.toFixed(2), 277, 202 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.seatsAttributedByList, 308, 202 + nbCandidate * candidateOffsetY, '5'))
      if (candidate.seatsAttributed[0]) c.push(utils.createText(candidate.seatsAttributed[0].toFixed(2), 344, 202 + nbCandidate * candidateOffsetY, '5'))
      if (candidate.seatsAttributed[1]) c.push(utils.createText(candidate.seatsAttributed[1].toFixed(2), 377, 202 + nbCandidate * candidateOffsetY, '5'))
      if (candidate.seatsAttributed[2]) c.push(utils.createText(candidate.seatsAttributed[2].toFixed(2), 407, 202 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.elected ? (candidate.user.civility === 'MALE' ? 'ÉLU' : 'ÉLUE') : '', 439, 202 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.electedByList, 475, 202 + nbCandidate * candidateOffsetY, '5'))
      // }
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
    // TODO: REMOVE THIS
    pdfDoc.pipe(fs.createWriteStream("./result.pdf"))
    pdfDoc.end()
    console.log(`Generated document in ${new Date() - now} ms`)
  } catch (err) {
    console.log(err)
  }

  return pdfDoc
}
