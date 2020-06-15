
import PdfPrinter from 'pdfmake'
import path from 'path'
import fs from 'fs-extra'

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
  
export function pdfFromModel(model) {
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
      if (!page)
        return;
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
  