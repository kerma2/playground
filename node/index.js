import '@babel/polyfill'
import fs from 'fs-extra'

import generatePvElectionsPdf from './results/generatePvElection'

const results = {
	voteType: "titular",
	establishment: {
		name: "GS VOTE",
		siret: "01234567891234",
		address: {
			street: "34 Rue de Bayard",
			code: "31000",
			city: "Toulouse"
		},
		idcc: 123,
		nbColleges: 2,
	},
	college: {
		term: 5,
		denominationType: 0, // Enum avec 0: collège unique, 1, 2, 3 et 4: autre collège
		composition: [1, 5, 2, 7], // Array de nombres correspondant aux catégories, 7: Autres
		compositionOther: ["Autre 1", "Autre 2" ], // Autres catégories 
		denomination: "",
		statuses: "",
	},
	rounds: [
		{
			summary: {
				startDate: "2019-12-01T09:52:02.024Z",
				endDate: "2019-12-01T09:52:02.024Z",
				seats: 2,
				deficiency: false,
				electorsNumber: 16,
				votesNumber: 1,
				blankVotesNumber: 0,
				validVotesNumber: 1,
				candidates:
					[{
						userId: '5EMfkLzuaB7aGojx2',
						votes: 1,
						elected: false,
						logo: ''
					},
					{
						userId: 'FjRweKJJaMCuqZ4Yb',
						votes: 1,
						elected: false,
						logo: ''
					}],
				quorum: false,
				quotient: 0.5,
				nbLists: 3
			},
			results: [
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'FEMALE' },
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12,
					candidateBallotSum: 14,
					candidatePerList: 2, //nombre de candidat dans la liste 
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11], // Siège selon la règles de la plus forte moyenne
					elected: true
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: false,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: false,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 13, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: false,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
				{
					user: { firstname: 'Philippe', lastname: 'Larcher', civility: 'MALE' }, // TODO: Ajouter civility
					syndicate: "CGT",
					syndicateBallot: 16, //nombre de bulletin de la liste
					candidateBallot: 12, // Nombre de voix receuillies par chaque 
					candidateBallotSum: 14, // Total des voies
					candidatePerList: 2, //nombre de candidat dans la liste
					seatsAttributedByList: 1, //Nombre de siège selon la règle du quotient
					electedByList: 2, // Nombre de sièges attribué en tout
					voteAveragePerList: 12, // Moyenne des voix dans la listes
					seatsAttributed: [11, 12, 13], // Siège selon la règles de la plus forte moyenne 
					elected: true,
				},
			]
		},
	]
}

async function main() {
	const pdf = generatePvElectionsPdf(results);
	pdf.pipe(fs.createWriteStream("./pv.pdf"))
	pdf.end()
	console.log("ok")
}

main()
