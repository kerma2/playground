import '@babel/polyfill'

// import computeElectionResults from './results/computeElectionResults'
import generatePvElectionsPdf from './results/generatePvElectionsPdf'

const obj = {
	params: {

	},
	results: {
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
		quotient: 0.5
	}
}

async function main() {
	// generatePvElectionsPdf(results);
	console.log("ok")


}

main()
