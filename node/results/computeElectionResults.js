import { PV_STATUSES, COLLEGE_LABELS } from './constants'
import { getNbVotesForCandidate, getWinnerCandidate } from './candidatesResults'
import {
  getWinnerList,
  getTotalNbSeats,
  getListOfCandidate,
  getLowestRankedElected,
  getCandidateWithMostVotes,
  getCandidateWithMostVotesInListWithSeats
} from './listsResults'

function getDenominationBasedOnStatuses(college) {
  let found = false
  const statuses = college.statuses

  if (college.name.toUpperCase().includes('UNIQUE')) return COLLEGE_LABELS.COLLEGE_UNIQUE

  if (
    (found = statuses.find(
      status =>
        status !== PV_STATUSES.OUVRIERS &&
        status !== PV_STATUSES.EMPLOYES &&
        status !== PV_STATUSES.TECHNICIENS &&
        status !== PV_STATUSES.AGENTS_DE_MAITRISE &&
        status !== PV_STATUSES.INGENIEURS &&
        status !== PV_STATUSES.CADRES
    ))
  ) {
    // console.log("Des statuts \'autre\' ont étés trouvés (" + found + "),la dénomination du collège sera donc \'autre collège\'")
    return COLLEGE_LABELS.AUTRE_COLLEGE
  }
  if ((found = statuses.find(status => status === PV_STATUSES.INGENIEURS || status === PV_STATUSES.CADRES))) {
    // console.log("Le statut " + found + " a été trouvé, la dénomination du collège sera donc \'3ème collège\'")
    return COLLEGE_LABELS.TROISIEME_COLLEGE
  }
  if ((found = statuses.find(status => status === PV_STATUSES.TECHNICIENS || status === PV_STATUSES.AGENTS_DE_MAITRISE))) {
    // console.log("Le statut " + found + " a été trouvé, la dénomination du collège sera donc \'2ème collège\'")
    return COLLEGE_LABELS.DEUXIEME_COLLEGE
  }
  if ((found = statuses.find(status => status === PV_STATUSES.OUVRIERS || status === PV_STATUSES.EMPLOYES))) {
    // console.log("Le statut " + found + " a été trouvé, la dénomination du collège sera donc \'1er collège\'")
    return COLLEGE_LABELS.PREMIER_COLLEGE
  }
  // console.error("ERROR:   Aucun statut correspondant n'a été trouvé afin de déterminer la dénomation du collège")
}

function getUnresolvedReservedSeats(college, lists) {
  const unresolved = []
  college.reserved.map(reserved => {
    let total = 0
    lists.map(list => {
      list.candidates.map(candidate => {
        if (candidate.status === reserved.status && candidate.elected === true) total += 1
      })
    })
    const nbUnresolvedForThisStatus = reserved.nb - total
    for (let i = 0; i < nbUnresolvedForThisStatus; i += 1) {
      unresolved.push(reserved.status)
    }
  })
  return unresolved
}

function getLeastFavoredElected(lists, reserved) {
  // On crée un array contenant tous les élus
  const elected = []
  lists.map(l => {
    l.candidates.map(c => {
      if (c.elected && !reserved.some(s => c.status === s)) elected.push(c)
    })
  })
  // On sélection le moins favorisé en comparant:
  let minRank = -1
  let leastFavored = null
  elected.map(e => {
    // leur rank
    if (e.rank < minRank || minRank === -1) {
      minRank = e.rank
      leastFavored = e
    } else if (e.rank === minRank && leastFavored != null) {
      // en cas d'égalité, on compare le nombre de votes
      if (e.nbVotes < leastFavored.nbVotes) {
        minRank = e.rank
        leastFavored = e
      }
      // En cas d'égalité encore, on compare leur date de naissance
      else if (e.rank === minRank) {
        const potentialLeastFavored = new Date(e.birth)
        const leastFavored = new Date(leastFavored.birth)
        if (potentialLeastFavored.getTime() < leastFavored.getTime()) {
          minRank = e.rank
          leastFavored = e
        }
      }
    }
  })
  return leastFavored
}

function getReservedPotentialCandidates(status, lists) {
  // On crée un array contenant tous les candidats non élus ayant le status reservé
  const reserved = []
  lists.map(l => {
    l.candidates.map(c => {
      if (c.status === status && c.elected === false) reserved.push(c)
    })
  })
  return reserved
}

function computeRound(finalResults, nbRound) {
  // On déstructure college de finalResults et les listes de college.rounds[round].
  const { college } = finalResults
  const round = college.rounds[college.rounds.findIndex(round => round.nbr === nbRound)]
  const { lists } = round

  // On calcule les champs qui étaient initalisés à -1 précédemment.
  lists.map(list => {
    list.T_totalVotes = list.candidates.reduce((n, candidate) => n + candidate.nbVotes, 0)
    list.N_nbCandidates = list.candidates.length
    list.V_avgVotes = list.T_totalVotes / list.N_nbCandidates
    list.K_nbSeats = round.G_quotient_electoral !== 0 ? Math.floor(list.V_avgVotes / round.G_quotient_electoral) : 0
  })

  // console.log('Quotient: ', round.G_quotient_electoral)

  // ---- élus ----

  // sièges à attribuer de base (sans les sièges additionels)
  lists.map(list => {
    let nbSeatsForList = list.K_nbSeats
    while (nbSeatsForList > 0) {
      const winnerCandidate = getWinnerCandidate(list, lists.length === 1)
      if (winnerCandidate !== -1) list.candidates[winnerCandidate].elected = true
      nbSeatsForList -= 1
    }
  })

  // ---- Attribution des sieges additionels ----

  const nbElected = lists.reduce((n, list) => n + list.candidates.filter(candidate => candidate.elected === true).length, 0)
  let nbSeatsLeft = college.P_nbSeats - nbElected
  // On passe dans cette boucle pour chaque siège restant à attribuer
  for (let nb = 0; nb < nbSeatsLeft; nb++) {
    // calcul du rapport (V / (K+1)) pour ce siège
    lists.map(list => {
      list.additionalSeats.push({ value: list.V_avgVotes / (getTotalNbSeats(list) + 1), winner: false })
    })
    // On récupère la liste gagnante du siège
    const winnerListId = getWinnerList(lists, nb)
    const winnerList = lists.find(l => winnerListId && l._id.toString() === winnerListId.toString())
    if (winnerList) {
      winnerList.additionalSeats[nb].winner = true
      // On récupère le candidat gagnant dans cette liste
      const winnerCandidate = getWinnerCandidate(winnerList, lists.length === 1)
      if (winnerCandidate !== -1) {
        winnerList.candidates[winnerCandidate].elected = true
        // console.log("Le candidat " + winnerList.candidates[winnerCandidate].lastname + " de la liste " + winnerList.name + " a été élu")
      }
    }
  }

  // Calcul du nombre d'élus par liste
  lists.map(list => {
    list.nbElected = list.candidates.filter(c => c.elected === true).length
  })

  // ---- Sièges réservés ----

  const unresolved = getUnresolvedReservedSeats(college, lists)
  unresolved.map(unresolvedStatus => {
    // console.log("Il manque à attribuer un siège réservé pour le status " + unresolvedStatus)
    const potentialCandidates = getReservedPotentialCandidates(unresolvedStatus, lists)
    if (potentialCandidates.length === 1) {
      const onlyPossibleCandidate = potentialCandidates[0]
      const onlyPossibleList = getListOfCandidate(lists, onlyPossibleCandidate)
      if (onlyPossibleList.nbElected > 0) {
        // Si une seule liste comporte un candidat de la catégorie réservée et que cette liste obtient au moins un siège,
        // le siège est attribué au candidat de la catégorie réservée quels que soient son nombre de voix et son ordre de présentation
        const lowestRankedElected = getLowestRankedElected(onlyPossibleList)
        lowestRankedElected.elected = false
        onlyPossibleCandidate.elected = true
        // console.log("Le candidat " + onlyPossibleCandidate.lastname + " de la liste " + onlyPossibleList.name + " a été ÉLU à la place du candidat + " + lowestRankedElected.lastname + ", car son siège est réservé ( " + unresolvedStatus + " ).")
      } else if (onlyPossibleList.nbElected === 0) {
        // si la seule liste comprenant un candidat de la catégorie réservée n’a obtenu aucun siège,
        // ce candidat devra cependant être élu à la place du candidat le moins favorisé de l’autre ou des autres listes
        // We have to look for le candidat le moins favorisé des autres liste et le déélire pour élire notre réservé
        const leastFavored = getLeastFavoredElected(lists, college.reserved)
        leastFavored.elected = false
        onlyPossibleCandidate.elected = true
        // console.log("Le candidat " + onlyPossibleCandidate.lastname + " de la liste " + onlyPossibleList.name + " a été ÉLU à la place du candidat + " + leastFavored.lastname + ", car son siège est réservé ( " + unresolvedStatus + " ).")
      }
    } else if (potentialCandidates.length > 1) {
      // Si plusieurs listes, ayant obtenu des sièges, posssèdent un candidat appartenant à la catégorie concernée,
      // le candidat de la catégorie réservée qui a obtenu le plus grand nombre de voix dans sa catégorie professionnelle
      // est élu à la place du dernier candidat élu par sa liste
      let winner = getCandidateWithMostVotesInListWithSeats(lists, potentialCandidates)
      if (!winner || winner === null) {
        // Cas où aucun des potentialCandidates n'a de liste avec un siège attribué.
        winner = getCandidateWithMostVotes(lists, potentialCandidates)
        const leastFavored = getLeastFavoredElected(lists, college.reserved)
        leastFavored.elected = false
        winner.elected = true
        // console.log("Le candidat " + winner.lastname + " a été ÉLU à la place du candidat + " + leastFavored.lastname + ", car son siège est réservé ( " + unresolvedStatus + " ).")
      } else {
        const winnerList = getListOfCandidate(lists, winner)
        const lowestRankedElected = getLowestRankedElected(winnerList)
        lowestRankedElected.elected = false
        winner.elected = true
        // console.log("Le candidat " + winner.lastname + " de la liste " + winnerList.name + " a été ÉLU à la place du candidat + " + lowestRankedElected.lastname + ", car son siège est réservé ( " + unresolvedStatus + " ).")
      }
    } else {
      // Si au premier tour aucune organisation syndicale n’a présenté de candidat dans la catégorie réservée,
      // le siège réservé ne peut être attribué à un candidat n’appartenant pas à cette catégorie.
      // Même si le quorum a été atteint au premier tour, on doit alors procéder à un second tour de scrutin avec candidatures libres et attribution du siège réservé au scrutin majoritaire.

      // TRIGGER A SECOND ELECTION HERE
      finalResults.triggerNextRound = true
      // console.log("TRIGGER A SECOND ELECTION")
      // console.log("Aucun siège n'a pu être attribué au statut réservé " + unresolvedStatus + " car il n'y a pas de candidats dans ces critères.")
    }
  })

  // Recalcul du nombre d'élus par liste
  lists.map(list => {
    list.nbElected = list.candidates.filter(c => c.elected === true).length
  })

  return finalResults
}

export default function getFinalResults(nbRound, { result }, type, titularResults) {
  // On déstructure les result de l'input, et on en crée une copie dans finalResults.

  const finalResults = result
  finalResults.college.voteType = type
  // On déstructure college de finalResults
  const { college } = finalResults
  const round = college.rounds.find(round => round.nbr === nbRound)
  const { lists } = round

  round.urn.map(list => {
    if (list.candidates === null) list.candidates = []
  })
  // Ici on calcule les champs requis dans le Cerfa. Certaines données sont dupliquées à des fins de clareté.
  // le nom des attributs commencent par la lettre dont il est question dans le cerfa.
  college.denomination = getDenominationBasedOnStatuses(college)
  college.P_nbSeats = result.college.seats
  college.A_nbElectors = result.college.workforce
  round.L_nbLists = lists.length
  round.B_nbVotants = round.urn.length
  round.C_nbVotesBlanc = round.urn.filter(list => list.listId === null || list.candidates.every(candidate => candidate.checked)).length
  round.D_nbValidVote = round.B_nbVotants - round.C_nbVotesBlanc
  round.G_quotient_electoral = college.P_nbSeats !== 0 ? round.D_nbValidVote / college.P_nbSeats : 0
  round.deficiency = round.L_nbLists === 0

  // Calcul du quorum
	const roundOne = college.rounds[college.rounds.findIndex(round => round.nbr === 1)]
	const votesRoundOne = roundOne.urn ? roundOne.urn : roundOne.urns.find(u => u.type === type).results.votes
	const roundOneValidVote =
		votesRoundOne.length - votesRoundOne.filter(list => list.listId === null || list.candidates.every(candidate => candidate.checked)).length

	college.quorum = roundOneValidVote >= college.A_nbElectors / 2 ? true : false

  // On fait pareil pour les listes, en leur ajoutant des attribus initialisés à -1
  // Le but étant toujours de gagner en clarté et savoir ce que contiennent nos objets list.
  lists.map(list => {
    list.organisation = list.confederation
    list.nbValidVotes = round.urn.filter(vote => vote.listId && vote.listId.toString() === list._id.toString()).length
    list.T_totalVotes = -1
    list.N_nbCandidates = -1
    list.V_avgVotes = -1
    list.K_nbSeats = -1
    list.additionalSeats = [] // Ici c'est un array d'objets de la forme list.additionalSeats[n] = {value: number, highest: boolean},
    // value étant la moyenne pour le siège n, et highest indique si c'est la plus haute moyenne
    list.nbElected = -1

    // On ajoute aux candidats des attributs présents dans la liste, afin de faciliter certains calculs plus tard
    list.candidates.map(candidate => {
      candidate.gender = candidate.civility.toUpperCase() === 'MONSIEUR' ? 'H' : 'F'
      candidate.listId = list._id
      candidate.organisation = list.confederation
      candidate.nbVotes = getNbVotesForCandidate(list, candidate, round.urn)
      candidate.isTitular =
        titularResults &&
        titularResults.college.rounds[titularResults.college.rounds.findIndex(round => round.nbr === nbRound)].lists.find(l => {
          const user = l.candidates.find(c => {
            return c.userId.toHexString() === candidate.userId.toHexString()
          })
          return user && user.elected
        })
      candidate.elected = false
      candidate.ratureMoreThan10percent = false
    })
  })

  // Ajout de l'attribut raturé ou pas. On passe dans chacun des candidats
  // et on calcule si le nombre de ratures est supérieur à 10%. Dans ce cas, on set ratureMoreThan10percent à true.
  lists.map(list => {
    list.candidates.map((candidate, index) => {
      candidate.ratureMoreThan10percent = list.nbValidVotes - candidate.nbVotes > 0.1 * list.nbValidVotes
    })
    list.nbElected = list.candidates.filter(c => c.elected === true).length
  })

  const results = computeRound(finalResults, nbRound, type)

  // Check de la nécéssité de refaire une élection
  finalResults.triggerNextRound = nbRound === 1 && (!college.quorum || round.deficiency || college.seats > lists.reduce((a, list) => a + list.nbElected, 0))

  // Si le quorum est atteint, on calcule les résulats pour le round
  return results
}
