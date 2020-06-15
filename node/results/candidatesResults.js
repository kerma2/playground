export function getNbVotesForCandidate(list, candidate, urn) {
    let nbVotes = 0
    let concernedUrn = urn.filter(vote => vote.listId && vote.listId.toString() === list._id.toString())
    concernedUrn.map(vote => {
        vote.candidates.map((candidateInVote) => {
            if (candidateInVote.userId.toString() === candidate.userId.toString() && candidateInVote.checked === false) {
                nbVotes += 1
            }
        })
    })
    return nbVotes
}

export function getWinnerCandidate(list, uniqueList) {
    let highestRank = -1
    let highestVotes = -1
    let winnerIndex = -1
    // On regarde d'abord les candidats non raturés et on compare leur rank pour prendre le meilleur
    list.candidates.map((candidate, index) => {
        if (candidate.ratureMoreThan10percent === false
            && !candidate.elected
            && !candidate.isTitular 
            && candidate.nbVotes > 0
            && (candidate.rank < highestRank || highestRank === -1)) {
            highestRank = candidate.rank
            winnerIndex = index
        }
    })
    // S'il le candidat est trouvé, on le renvoie
    if (winnerIndex !== -1)
        return winnerIndex
    // Sinon, on regarde les candidats raturés et on compare leur nombre de votes
    list.candidates.map((candidate, index) => {

        if (candidate.ratureMoreThan10percent === true
            && !candidate.elected
            && !candidate.isTitular
            && (candidate.nbVotes > 0 || uniqueList)
            && (candidate.nbVotes > highestVotes || highestVotes === -1)) {
            highestVotes = candidate.nbVotes
            winnerIndex = index
        }
    })

    // if (winnerIndex === -1)
    //     console.log("ERROR : could not find winnerCandidate")

    return winnerIndex
}