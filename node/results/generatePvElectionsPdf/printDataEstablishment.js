import utils from './pdfUtils.js'

export function printDataEstablishment(c, data) {

  const { establishment, college } = data;

  // I --- Etablissement ---
  // Company Siret
  c.push(utils.createSiretPart(establishment.siret, 202, 109, 1))
  c.push(utils.createSiretPart(establishment.siret, 202, 109, 2))
  c.push(utils.createSiretPart(establishment.siret, 202, 109, 3))
  c.push(utils.createSiretPart(establishment.siret, 202, 109, 4))

  // Company Infos
  c.push(utils.createText(establishment.name, 156, 120))
  c.push(utils.createText(establishment.address.street, 142, 130))
  c.push(utils.createText(establishment.address.code, 150, 147, '10', '4'))
  c.push(utils.createText(establishment.address.city, 224, 148))

  establishment.idcc = establishment.idcc.toString()
  const idccLengthDiff = 4 - establishment.idcc.length
  let idccZeroCharchters = ''

  if (idccLengthDiff > 0) for (let i = 0; i < idccLengthDiff; i++) idccZeroCharchters += '0'

  c.push(utils.createText(idccZeroCharchters + establishment.idcc, 222, 159, '10', '2'))
  c.push(utils.createText(college.term, 185, 193))
  c.push(utils.createText(establishment.nbColleges, 297, 203))
  return c;
}