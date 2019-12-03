import PdfPrinter from 'pdfmake'
import path from 'path'
import fs from 'fs-extra'
import { format, parseISO } from 'date-fns'

Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}

export function printModel(model) {
  let fontPath = path.join(__dirname, 'fonts/RobotoMono-Medium.ttf')
  let fonts = {
    Roboto: {
      normal: fontPath
    }
  }

  const printer = new PdfPrinter(fonts)

  let images = {};
  let content = [];

  model.pages.forEach((page, pageIndex) => {
    if (pageIndex > 0) {
      content.push({
        absolutePosition: { x: 0, y: 0 },
        text: '',
        fontSize: 1,
        pageBreak: 'after'
      })
    }
    if (page.backgroundAbsolutePath) {
      const name = "background_" + Object.keys(images).length
      const background_data = fs.readFileSync(page.backgroundAbsolutePath, 'base64')
      images[name] = `data:image/png;base64,${background_data}`;
      content.push({
        image: name,
        width: 595, // standard A4 with for screen resolution
        // height: 800,
        absolutePosition: { x: 0, y: 0 }
      })
    }
    page.textElements.forEach((el) => {
      if (el.type && el.type === 'array') { // If node is of type array and textData is array        
        // console.log(el.dataSource)
        if (el.dataSource && el.dataSource.forEach && el.fields.forEach) {
          el.dataSource.forEach((row, rowIndex) => {
            el.fields.forEach((field, colIndex) => {
              const text = Object.byString(row, field.textData)

              content.push({
                text: text,
                absolutePosition: {
                  x: field.x,
                  y: field.y ? (field.y + (el.offset * rowIndex)) : (el.y + (el.offset * rowIndex)),
                },
                fontSize: field.fontSize ? field.fontSize : el.fontSize ? el.fontSize : 9,
                characterSpacing: field.charSpacing ? field.charSpacing : el.charSpacing ? el.charSpacing : '0',
                decoration: (field.underlineOnCondition && Object.byString(row, field.underlineOnCondition) === true) ? 'underline' : el.decoration
              })
            })
          })

        } else if (el.textData && el.textData.forEach) {
          el.textData.forEach((text, index) => {
            content.push({
              text: text,
              absolutePosition: {
                x: el.x,
                y: el.y + (el.offset * index)
              },
              fontSize: el.fontSize ? el.fontSize : 9,
              characterSpacing: el.charSpacing ? el.charSpacing : '0',
              decoration: (el.underlineOnCondition && el.underlineOnCondition[index] === true) ? 'underline' : el.decoration
            })
          })
        }

      } else { // If it's a normal node
        content.push({
          text: el.text,
          absolutePosition: {
            x: el.x,
            y: el.y
          },
          fontSize: el.fontSize ? el.fontSize : 9,
          characterSpacing: el.charSpacing ? el.charSpacing : '0',
          decoration: el.decoration
        })
      }
    })
  })

  let docDefinition = {
    pageSize: 'A4',
    content: content,
    images: images,
    styles: {}
  }

  let now = new Date()
  let pdfDoc;
  try {
    pdfDoc = printer.createPdfKitDocument(docDefinition)
    // pdfDoc.pipe(fs.createWriteStream("./resultFromParser.pdf"))
    // pdfDoc.end()
    // console.log(`Generated document in ${new Date() - now} ms`)
  } catch (err) {
    console.log(err)
  }

  return pdfDoc;
}

export function createModel(data) {
  return {
    pages: [
      {
        backgroundAbsolutePath: path.join(__dirname, './generatePvElectionsPdf/cerfa_15822_01/cerfa_15822_01_1.png'),
        textElements: [
          {
            text: data.establishment.siret[0],
            x: 202,
            y: 109,
            fontSize: 9,
            charSpacing: 2.4
          },
          {
            text: data.establishment.siret[1],
            x: 230,
            y: 109,
            fontSize: 9,
            charSpacing: 2.4
          },
          {
            text: data.establishment.siret[2],
            x: 258,
            y: 109,
            fontSize: 9,
            charSpacing: 2.4
          },
          {
            text: data.establishment.siret[3],
            x: 286,
            y: 109,
            fontSize: 9,
            charSpacing: 2.4
          },
          {
            text: data.establishment.name,
            x: 156,
            y: 120,
          },
          {
            text: data.establishment.address.street,
            x: 142,
            y: 130
          },
          {
            text: data.establishment.address.code,
            x: 150,
            y: 147,
            fontSize: 10,
            charSpacing: 4
          },
          {
            text: data.establishment.address.city,
            x: 224,
            y: 148,
          },
          {
            text: data.establishment.idcc,
            x: 222,
            y: 159,
            fontSize: 10,
            charSpacing: 2
          },
          {
            text: data.college.term,
            x: 185,
            y: 193,
          },
          {
            text: data.establishment.nbColleges,
            x: 297,
            y: 203,
          },
          {
            text: data.college.denominationType === 0 ? 'x' : '',
            x: 429,
            y: 144,
            fontSize: 10
          },
          {
            text: data.college.denominationType === 1 ? 'x' : '',
            x: 429,
            y: 164,
            fontSize: 10
          },
          {
            text: data.college.denominationType === 2 ? 'x' : '',
            x: 429,
            y: 184,
            fontSize: 10
          },
          {
            text: data.college.denominationType === 3 ? 'x' : '',
            x: 429,
            y: 203,
            fontSize: 10
          },
          {
            text: data.college.denominationType === 4 ? 'x' : '',
            x: 429,
            y: 223,
            fontSize: 10
          },
          {
            text: data.college.composition.includes(1) ? 'x' : '',
            x: 544.5,
            y: 145,
            fontSize: 10
          },
          {
            text: data.college.composition.includes(2) ? 'x' : '',
            x: 544.5,
            y: 157,
            fontSize: 10
          },
          {
            text: data.college.composition.includes(3) ? 'x' : '',
            x: 544.5,
            y: 170,
            fontSize: 10
          },
          {
            text: data.college.composition.includes(4) ? 'x' : '',
            x: 544.5,
            y: 182,
            fontSize: 10
          },
          {
            text: data.college.composition.includes(5) ? 'x' : '',
            x: 544.5,
            y: 195,
            fontSize: 10
          },
          {
            text: data.college.composition.includes(6) ? 'x' : '',
            x: 544.5,
            y: 208,
            fontSize: 10
          },
          {
            text: data.college.composition.includes(7) ? 'x' : '',
            x: 544.5,
            y: 220,
            fontSize: 10
          },
          {
            type: 'array',
            offset: 7.8,
            x: 469,
            y: 223,
            textData: data.college.compositionOther,
            fontSize: 5
          },
          {
            text: data.rounds[0].summary.startDate.day,
            x: 241,
            y: 284,
            fontSize: 8,
            charSpacing: 3
          },
          {
            text: data.rounds[0].summary.startDate.month,
            x: 264,
            y: 284,
            fontSize: 8,
            charSpacing: 3
          },
          {
            text: data.rounds[0].summary.startDate.year,
            x: 286,
            y: 284,
            fontSize: 8,
            charSpacing: 3
          },
          {
            text: data.rounds[0].summary.startDate.hour,
            x: 180,
            y: 293.5,
            fontSize: 7,
            charSpacing: 1.5
          },
          {
            text: data.rounds[0].summary.startDate.minutes,
            x: 195,
            y: 293.5,
            fontSize: 7,
            charSpacing: 1.5
          },
          {
            text: data.rounds[0].summary.endDate.hour,
            x: 288,
            y: 293.5,
            fontSize: 7,
            charSpacing: 1.5
          },
          {
            text: data.rounds[0].summary.endDate.minutes,
            x: 303,
            y: 293.5,
            fontSize: 7,
            charSpacing: 1.5
          },
          {
            text: data.rounds[0].summary.deficiency === true ? 'x' : '',
            x: 295,
            y: 301,
            fontSize: 10
          },
          {
            text: data.rounds[0].summary.deficiency === false ? 'x' : '',
            x: 260,
            y: 301,
            fontSize: 10
          },
          {
            text: data.rounds[0].summary.electorsNumber,
            x: 291,
            y: 310,
          },
          {
            text: data.rounds[0].summary.votesNumber,
            x: 291,
            y: 318,
          },
          {
            text: data.rounds[0].summary.blankVotesNumber,
            x: 291,
            y: 326,
          },
          {
            text: data.rounds[0].summary.validVotesNumber,
            x: 291,
            y: 334,
          },
          {
            text: data.rounds[0].summary.electorsNumber,
            x: 400,
            y: 303,
          },
          {
            text: (data.rounds[0].summary.electorsNumber / 2).toFixed(2),
            x: 419,
            y: 306,
          },
          {
            text: data.rounds[0].summary.quorum === true ? 'x' : '',
            x: 343,
            y: 333,
          },
          {
            text: data.rounds[0].summary.quorum === false ? 'x' : '',
            x: 343,
            y: 324,
          },
          {
            text: data.rounds[0].summary.nbLists,
            x: 535,
            y: 287,
            fontSize: 9,
            charSpacing: 2
          },
          {
            text: data.rounds[0].summary.seats,
            x: 535,
            y: 305,
            fontSize: 9,
            charSpacing: 2
          },
          {
            text: data.rounds[0].summary.validVotesNumber,
            x: 495,
            y: 327,
          },
          {
            text: data.rounds[0].summary.seats,
            x: 498,
            y: 337,
          },
          {
            text: data.rounds[0].summary.quotient.toFixed(2),
            x: 519,
            y: 332,
          },
          {
            type: 'array',
            
            offset: 13.7,
            y: 422,
            dataSource: data.rounds[0].results,
            fields: [
              {
                textData: 'user.firstname',
                x: 35,
                y: 421,
                fontSize: 5,
                underlineOnCondition: 'elected'
              },
              {
                textData: 'user.lastname',
                x: 35,
                y: 427,
                fontSize: 5,
                underlineOnCondition: 'elected'
              },
              {
                textData: 'user.genderLetter',
                x: 110,
                fontSize: 7,
              },
              {
                textData: 'syndicate',
                x: 197,
                fontSize: 5,
              },
              {
                textData: 'syndicateBallot',
                x: 255,
                fontSize: 5,
              },
              {
                textData: 'candidateBallot',
                x: 285,
                fontSize: 5,
              },
              {
                textData: 'candidateBallotSum',
                x: 315,
                fontSize: 5,
              },
              {
                textData: 'candidatePerList',
                x: 345,
                fontSize: 5,
              },
              {
                textData: 'voteAveragePerList',
                x: 375,
                fontSize: 5,
              },
              {
                textData: 'seatsAttributedByList',
                x: 405,
                fontSize: 5,
              },
              {
                textData: 'seatsAttributed[0]',
                x: 435,
                fontSize: 5,
              },
              {
                textData: 'seatsAttributed[1]',
                x: 465,
                fontSize: 5,
              },
              {
                textData: 'seatsAttributed[2]',
                x: 495,
                fontSize: 5,
              },
              {
                textData: 'electedPrint',
                x: 524,
                fontSize: 5,
              },
              {
                textData: 'electedByList',
                x: 545,
                fontSize: 5,
              },
            ]
          },
        ]
      },
      {
        backgroundAbsolutePath: path.join(__dirname, './generatePvElectionsPdf/cerfa_15822_01/cerfa_15822_01_2.png'),
        textElements: [
          {
            text: data.rounds[1].summary.startDate.day,
            x: 131,
            y: 60,
            fontSize: 8,
            charSpacing: 3
          },
          {
            text: data.rounds[1].summary.startDate.month,
            x: 154,
            y: 60,
            fontSize: 8,
            charSpacing: 3
          },
          {
            text: data.rounds[1].summary.startDate.year,
            x: 176,
            y: 60,
            fontSize: 8,
            charSpacing: 3
          },
          {
            text: data.rounds[1].summary.startDate.hour,
            x: 123,
            y: 69,
            fontSize: 7,
            charSpacing: 1.5
          },
          {
            text: data.rounds[1].summary.startDate.minutes,
            x: 138,
            y: 69,
            fontSize: 7,
            charSpacing: 1.5
          },
          {
            text: data.rounds[1].summary.endDate.hour,
            x: 276,
            y: 69,
            fontSize: 7,
            charSpacing: 1.5
          },
          {
            text: data.rounds[1].summary.endDate.minutes,
            x: 291,
            y: 69,
            fontSize: 7,
            charSpacing: 1.5
          },
          {
            text: data.rounds[1].summary.deficiency === true ? 'x' : '',
            x: 237,
            y: 75,
            fontSize: 10
          },
          {
            text: data.rounds[1].summary.deficiency === false ? 'x' : '',
            x: 206.6,
            y: 75,
            fontSize: 10
          },
          {
            text: data.rounds[1].summary.electorsNumber,
            x: 244,
            y: 86,
          },
          {
            text: data.rounds[1].summary.votesNumber,
            x: 244,
            y: 94.5,
          },
          {
            text: data.rounds[1].summary.blankVotesNumber,
            x: 244,
            y: 102.5,
          },
          {
            text: data.rounds[1].summary.validVotesNumber,
            x: 244,
            y: 109.5,
          },
          {
            text: data.rounds[1].summary.nbLists,
            x: 465,
            y: 60,
            fontSize: 9,
            charSpacing: 2
          },
          {
            text: data.rounds[1].summary.seats,
            x: 465,
            y: 78,
            fontSize: 9,
            charSpacing: 2
          },
          {
            text: data.rounds[1].summary.validVotesNumber,
            x: 428,
            y: 102,
          },
          {
            text: data.rounds[1].summary.seats,
            x: 430,
            y: 112,
          },
          {
            text: data.rounds[1].summary.quotient.toFixed(2),
            x: 450,
            y: 105,
          },
          {
            type: 'array',
            
            offset: 13.0,
            y: 202,
            dataSource: data.rounds[1].results,
            fields: [
              {
                textData: 'user.firstname',
                x: 503,
                y: 200,
                fontSize: 5,
                underlineOnCondition: 'elected'
              },
              {
                textData: 'user.lastname',
                x: 503,
                y: 206,
                fontSize: 5,
                underlineOnCondition: 'elected'
              },
              {
                textData: 'user.genderLetter',
                x: 41,
                fontSize: 7,
              },
              {
                textData: 'syndicate',
                x: 55,
                fontSize: 5,
              },
              {
                textData: 'syndicateBallot',
                x: 130,
                fontSize: 5,
              },
              {
                textData: 'candidateBallot',
                x: 166,
                fontSize: 5,
              },
              {
                textData: 'candidateBallotSum',
                x: 213,
                fontSize: 5,
              },
              {
                textData: 'candidatePerList',
                x: 250,
                fontSize: 5,
              },
              {
                textData: 'voteAveragePerList',
                x: 277,
                fontSize: 5,
              },
              {
                textData: 'seatsAttributedByList',
                x: 308,
                fontSize: 5,
              },
              {
                textData: 'seatsAttributed[0]',
                x: 344,
                fontSize: 5,
              },
              {
                textData: 'seatsAttributed[1]',
                x: 377,
                fontSize: 5,
              },
              {
                textData: 'seatsAttributed[2]',
                x: 407,
                fontSize: 5,
              },
              {
                textData: 'electedPrint',
                x: 439,
                fontSize: 5,
              },
              {
                textData: 'electedByList',
                x: 475,
                fontSize: 5,
              },
            ]
          }
        ]
      },
    ]
  }
}