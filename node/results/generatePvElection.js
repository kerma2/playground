import PdfPrinter from 'pdfmake'
import path from 'path'
import fs from 'fs-extra'
import { format, parseISO } from 'date-fns'
import { createModel } from './model'
import { pdfFromModel } from './modelParser'

function toDetailDateObj(ISOdate) {
  const date = parseISO(ISOdate);
  const obj = {
    day: format(date, 'dd'),
    month: format(date, 'MM'),
    year: format(date, 'yyyy'),
    hour: format(date, 'HH'),
    minutes: format(date, 'mm'),
  }
  return obj;
}

function preprocessResults(results) {

  let processed = results;

  // Splitting of Siret into Array
  processed.establishment.siret = [
    results.establishment.siret.substr(0, 3),
    results.establishment.siret.substr(3, 3),
    results.establishment.siret.substr(6, 3),
    results.establishment.siret.substr(9, 5),
  ]

  processed.rounds = results.rounds.map((round) => {

    let processedRound = round;
    processedRound.summary.startDate = toDetailDateObj(round.summary.startDate);
    processedRound.summary.endDate = toDetailDateObj(round.summary.endDate);
    processedRound.summary.nbLists = round.summary.nbLists < 10 ? '0' + round.summary.nbLists : round.summary.nbLists;
    processedRound.summary.seats = round.summary.seats < 10 ? '0' + round.summary.seats : round.summary.seats;

    processedRound.results = round.results.map(candidate => {
      let processedCandidate = candidate;

      processedCandidate.user.genderLetter = candidate.user.civility === 'MALE' ? 'H' : 'F';
      processedCandidate.voteAveragePerList = candidate.voteAveragePerList.toFixed(2);
      if (candidate.seatsAttributed[0]) processedCandidate.seatsAttributed[0] = candidate.seatsAttributed[0].toFixed(2);
      if (candidate.seatsAttributed[1]) processedCandidate.seatsAttributed[1] = candidate.seatsAttributed[1].toFixed(2);
      if (candidate.seatsAttributed[2]) processedCandidate.seatsAttributed[2] = candidate.seatsAttributed[2].toFixed(2);

      processedCandidate.electedPrint = candidate.elected ? (candidate.user.civility === 'MALE' ? 'ÉLU' : 'ÉLUE') : '';

      return processedCandidate;
    })

    return processedRound;
  })

  return processed;
}

export default function generatePvElection(results) {

  const processed = preprocessResults(results)
  const model = createModel(processed)
  const pdf = pdfFromModel(model)
  return pdf;
}