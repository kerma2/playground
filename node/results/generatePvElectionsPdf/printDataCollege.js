import utils from './pdfUtils.js'

export function printDataCollege(c, data) {

    const { college } = data;

    // II --- college ---

  // DENOMINATION DU COLLEGE ELECTORAL
  const denominationY = utils.getYaxisDenomination(college.denominationType)
  if (denominationY !== 0) {
    c.push(utils.createText('x', 429, denominationY, '10'))
  } else {
    console.error("Invalid college.denominationType provided: ", college.denominationType)
  }
  // COMPOSITION PRECISE DU COLLEGE 
  college.composition.forEach(function (index) {
    const compositionY = utils.getYaxisBasedOnStatus(index)
    if (compositionY !== 0) {
      c.push(utils.createText('x', 544.5, compositionY, '10'))
    } else {
      console.error("Invalid college.composition index provided: ", index)
    }
  })

  // Autres Statuts
  let nbOtherStatuses = 0
  college.compositionOther.forEach(function (other) {
    c.push(utils.createBoundedText(other, 469, 223 + nbOtherStatuses * 7.8, 108, 5))
    nbOtherStatuses += 1
  })
  
  return c
}