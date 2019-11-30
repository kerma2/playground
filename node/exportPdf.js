import puppeteer from 'puppeteer'

export async function renderPDF(html) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    // pass the html string as data text/html so we don't have to visit a url
    await page.goto(`data text/html,${html}`, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({ format: 'A4' })
    await browser.close()
    return pdf
}