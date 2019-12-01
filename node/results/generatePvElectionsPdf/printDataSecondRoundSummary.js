import utils from './pdfUtils.js'
import { format, parseISO } from 'date-fns'

export function printDataSecondRoundSummary(c, data) {

  const { rounds } = data;
  if (rounds[1]) {
    // IV - Results 2st Round if need be
    // Date & times
    const round_2_date_start = format(parseISO(rounds[1].summary.startDate), 'ddMMyyyy')

    c.push(utils.createDatePart(round_2_date_start, 131, 60, 'd'))
    c.push(utils.createDatePart(round_2_date_start, 131, 60, 'm'))
    c.push(utils.createDatePart(round_2_date_start, 131, 60, 'y'))

    const time_start = format(parseISO(rounds[1].summary.startDate), 'hh')
    c.push(utils.createText(time_start < 10 ? '0' + time_start : time_start, 123, 69, '7', '1.5'))

    const minutes_start = format(parseISO(rounds[1].summary.startDate), 'hh')
    c.push(utils.createText(minutes_start < 10 ? '0' + minutes_start : minutes_start, 138, 69, '7', '1.5'))

    const time_end = format(parseISO(rounds[1].summary.endDate), 'hh')
    c.push(utils.createText(time_end < 10 ? '0' + time_end : time_end, 276, 69, '7', '1.5'))

    const minutes_end = format(parseISO(rounds[1].summary.endDate), 'mm')
    c.push(utils.createText(minutes_end < 10 ? '0' + minutes_end : minutes_end, 291, 69, '7', '1.5'))



    // Carence
    c.push(utils.createText('x', rounds[0].summary.deficiency ? 237 : 206.6, 75, '10'))

    c.push(utils.createText(rounds[0].summary.electorsNumber, 244, 86))
    c.push(utils.createText(rounds[0].summary.votesNumber, 244, 94.5))
    c.push(utils.createText(rounds[0].summary.blankVotesNumber, 244, 102.5))
    c.push(utils.createText(rounds[0].summary.validVotesNumber, 244, 109.5))

    c.push(utils.createText(rounds[0].summary.nbLists < 10 ? '0' + rounds[0].summary.nbLists.toString() : rounds[0].summary.nbLists, 465, 60, '9', '2'))
    c.push(utils.createText(rounds[0].summary.seats < 10 ? '0' + rounds[0].summary.seats.toString() : rounds[0].summary.seats, 465, 78, '9', '2'))
    c.push(utils.createText(rounds[0].summary.validVotesNumber, 428, 102))
    c.push(utils.createText(rounds[0].summary.seats, 430, 112))
    c.push(utils.createText(rounds[0].summary.quotient.toFixed(2), 450, 105))
  }
  return c
}