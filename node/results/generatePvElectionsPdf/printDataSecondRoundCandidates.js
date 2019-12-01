import utils from './pdfUtils.js'
import { format, parseISO } from 'date-fns'

export function printDataSecondRoundCandidates(c, data) {

  const { rounds } = data;

  const candidateOffsetY = 13.0
  let nbCandidate = 0
  if (rounds[1]) {
    rounds[1].results.forEach(candidate => {
      c.push(utils.createText(candidate.user.firstname, 503, 201 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.user.lastname, 503, 206 + nbCandidate * candidateOffsetY, '5', '0', true))
      c.push(utils.createText((candidate.user.civility === 'MALE' ? 'H' : 'F'), 39, 202 + nbCandidate * candidateOffsetY, '7'))
      // c.push(utils.createText(el.syndicate, 123, 422 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.syndicate, 55, 202 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.syndicateBallot, 130, 202 + nbCandidate * candidateOffsetY, '5'))
      c.push(utils.createText(candidate.candidateBallot, 166, 202 + nbCandidate * candidateOffsetY, '5'))

      // Only print if Quorum is true
      // if (rounds[0].summary.quorum) {
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