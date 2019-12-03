import utils from './pdfUtils.js'
import { format, parseISO } from 'date-fns'

export function printDataFirstRoundSummary(c, data) {

    const { rounds } = data;
    
    // III - Results 1st Round
    const date_start = format(parseISO(rounds[0].summary.startDate), 'ddMMyyyy')
    console.log(date_start)
    c.push(utils.createDatePart(date_start, 241, 284, 'd'))
    c.push(utils.createDatePart(date_start, 241, 284, 'm'))
    c.push(utils.createDatePart(date_start, 241, 284, 'y'))
  
    const time_start = format(parseISO(rounds[0].summary.startDate), 'HH')
    c.push(utils.createText(time_start < 10 ? '0' + time_start : time_start, 180, 293, '7', '1.5'))
  
    const minutes_start = format(parseISO(rounds[0].summary.startDate), 'mm')
    c.push(utils.createText(minutes_start < 10 ? '0' + minutes_start : minutes_start, 195, 293, '7', '1.5'))
  
    const time_end = format(parseISO(rounds[0].summary.endDate), 'HH')
    c.push(utils.createText(time_end < 10 ? '0' + time_end : time_end, 288, 293, '7', '1.5'))
  
    const minutes_end = format(parseISO(rounds[0].summary.endDate), 'mm')
    c.push(utils.createText(minutes_end < 10 ? '0' + minutes_end : minutes_end, 303, 293, '7', '1.5'))
  
    // Carence
    c.push(utils.createText('x', rounds[0].summary.deficiency ? 295 : 260, 301, '10'))
  
    c.push(utils.createText(rounds[0].summary.electorsNumber, 291, 310))
    c.push(utils.createText(rounds[0].summary.votesNumber, 291, 318))
    c.push(utils.createText(rounds[0].summary.blankVotesNumber, 291, 326))
    c.push(utils.createText(rounds[0].summary.validVotesNumber, 291, 334))
    c.push(utils.createText(rounds[0].summary.electorsNumber, 400, 303))
    c.push(utils.createText((rounds[0].summary.electorsNumber / 2).toFixed(2), 419, 306))
    c.push(utils.createText('x', 343, rounds[0].summary.quorum ? 333 : 324))
  
    c.push(utils.createText(rounds[0].summary.nbLists < 10 ? '0' + rounds[0].summary.nbLists.toString() : rounds[0].summary.nbLists, 535, 287, '9', '2'))
    c.push(utils.createText(rounds[0].summary.seats < 10 ? '0' + rounds[0].summary.seats.toString() : rounds[0].summary.seats, 535, 305, '9', '2'))
    c.push(utils.createText(rounds[0].summary.validVotesNumber, 495, 327))
    c.push(utils.createText(rounds[0].summary.seats, 498, 337))
    c.push(utils.createText(rounds[0].summary.quotient.toFixed(2), 519, 332))
  
  return c
}