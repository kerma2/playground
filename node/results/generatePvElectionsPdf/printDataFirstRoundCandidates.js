import utils from './pdfUtils.js'
import { format, parseISO } from 'date-fns'

export function printDataFirstRoundCandidates(c, data) {

  const { rounds } = data;

  let nbCandidate = 0
  rounds[0].results.forEach(candidate => {
    c.push(utils.createText(candidate.user.firstname, 35, 421 + nbCandidate * 13.7, '5', candidate.elected))
    c.push(utils.createText(candidate.user.lastname, 35, 426 + nbCandidate * 13.7, '5', '0', candidate.elected))
    c.push(utils.createText((candidate.user.civility === 'MALE' ? 'H' : 'F'), 109, 422 + nbCandidate * 13.7, '7'))
    // c.push(utils.createText(el.syndicate, 123, 422 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.syndicate, 197, 422 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.syndicateBallot, 255, 422 + nbCandidate * 13.7, '5'))
    c.push(utils.createText(candidate.candidateBallot, 285, 422 + nbCandidate * 13.7, '5'))

    // Only print if Quorum is true
    // if (rounds[0].summary.quorum) {
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
  
  return c
}