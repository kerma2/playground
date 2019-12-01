import '@babel/polyfill'
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { renderPDF } from './exportPdf'

// const Template = ({ questions }) => (
// 	<Layout>
// 	  {questions.map(question => {
// 		const { type, data } = question.chart
// 		return (
// 		  <Question key={question.id}>
// 			<QuestionHeader title={question.name} />
// 			<Chart type={type} data={data} />
// 		  </Question>
// 		)
// 	  })}
// 	</Layout>
//   )

const Document = ({children}) => (
	<div>
		TEST
		{children}
	</div>
)

export function renderTemplate({ data, language, title }) {
	return ReactDOMServer.renderToStaticMarkup(
		React.createElement(Document, { data, language, title }, "HELLO WOROLD")
	)
}

async function main() {

	const html = renderTemplate({ data: "1", language: "2", file: "3",})
	const pdf = await renderPDF(html);

}

main()
