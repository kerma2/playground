import { getWinnerCandidate } from './candidatesResults'

export function getTotalNbSeats(list) {
    return list.K_nbSeats + list.additionalSeats.filter(additionalSeat => additionalSeat.winner === true).length 
}

export function getListOfCandidate(lists, candidate) {
    // lists.find(l => l.candidates.find(c => c.id === candidate.id))
    let list = null 
    lists.map((l) => {
        l.candidates.map((c) => {
            if (c.id === candidate.id)
                list = l 
        })
    })
    return list 
}

export function getWinnerList(lists, seat) {
    let highest = 0
    let winnerListId = ''
    lists.filter(list => !list.candidates.every(candidate => candidate.elected || candidate.isTitular)).map(list => {
        if (highest !== 0 && list.additionalSeats[seat].value === highest) {
            // Cas où deux listes on la même moyenne. On va chercher la liste qui a le plus de voies
            const highestList = lists.find(l => (l._id.toString() === winnerListId.toString() && l._id.toString() !== list._id.toString()))
            // console.log("la liste " + list.name + " a la même moyenne que la liste " + highestList.name)
            if (list.T_totalVotes === highestList.T_totalVotes) {
                // Cas où les deux listes on la même moyenne ET le même nombre de voies.
                // console.log("la liste " + list.name + " a la même moyenne ET le même nombre de voies que la liste " + highestList.name)
                const potentialWinnerCandidate1 = list.candidates[getWinnerCandidate(list,  lists.length === 1)]
                const potentialWinnerCandidate2 = highestList.candidates[getWinnerCandidate(highestList,  lists.length === 1)]
                const potentialWinnerCandidate1Birth = new Date(potentialWinnerCandidate1.birth.date) 
                const potentialWinnerCandidate2Birth = new Date(potentialWinnerCandidate2.birth.date) 
                // on compare la date de naissance et celui qui a la valeur la plus petite en secondes (donc né le plus tot) l'emporte
                if (potentialWinnerCandidate1Birth.getTime() < potentialWinnerCandidate2Birth.getTime()) {
                    highest = list.additionalSeats[seat].value 
                    winnerListId = list._id 
                    // console.log("Le candidat " + potentialWinnerCandidate1.lastname + " est plus agé que le candidat " + potentialWinnerCandidate2.lastname + " le siège revient donc à la liste ", list.name)
                }
                // else {
                //     console.log("Le candidat " + potentialWinnerCandidate2.lastname + " est plus agé que le candidat " + potentialWinnerCandidate1.lastname + " le siège revient donc à la liste ", highestList.name)
                // }
            } else if (list.T_totalVotes > highestList.T_totalVotes) {
                // console.log("Mais la liste " + list.name + " a plus de voies que la liste " + winnerListId)
                highest = list.additionalSeats[seat].value 
                winnerListId = list._id 
            }
        } else if (list.additionalSeats[seat].value > highest) {
            highest = list.additionalSeats[seat].value 
            winnerListId = list._id 
        }
    })

    // if (winnerListId !== null)
    //     console.log("La plus forte moyenne du siège additionel éventuel " + seat + " est attribué à " + winnerListId)
    // else
    //     console.error("ERROR: La plus forte moyenne du siège additionel éventuel " + seat + " n'a pas été trouvée")
    return winnerListId 
}

export function getLowestRankedElected(list) {
    let lowestRank = -1 
    let lowestCandidate = null 
    list.candidates.map((c) => {
        if (c.elected && (lowestRank === -1 || c.rank > lowestCandidate)) {
            lowestRank = c.rank 
            lowestCandidate = c 
        }
    })
    return lowestCandidate 
}

export function getCandidateWithMostVotes(lists, candidates) {
    let mostVotes = -1 
    let mostVotesCandidate = null 
    candidates.map((c) => {
        const listOfCandidate = getListOfCandidate(lists, c) 
        if ((c.nbVotes > mostVotes || mostVotes === -1)) {
            mostVotes = c.nbVotes 
            mostVotesCandidate = c 
        }
    })
    return mostVotesCandidate 
}

export function getCandidateWithMostVotesInListWithSeats(lists, candidates) {
    let mostVotes = -1 
    let mostVotesCandidate = null 
    candidates.map((c) => {
        const listOfCandidate = getListOfCandidate(lists, c) 
        if (listOfCandidate.nbElected > 0 && (c.nbVotes > mostVotes || mostVotes === -1)) {
            mostVotes = c.nbVotes 
            mostVotesCandidate = c 
        }
    })
    return mostVotesCandidate 
}
