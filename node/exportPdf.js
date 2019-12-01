import puppeteer from 'puppeteer'

export async function renderPDF(html) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()

    await page.setViewport({width: 794, height: 1122, deviceScaleFactor: 2});

    // pass the html string as data text/html so we don't have to visit a url
    // await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' })

    await page.goto(`http://localhost:3000/`, { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({ format: 'A4', path: "export.pdf", printBackground: true })
    await browser.close()
    return pdf
}