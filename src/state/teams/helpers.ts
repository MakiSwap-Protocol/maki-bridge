import merge from 'lodash/merge'
import teamsList from 'config/constants/teams'
import { getProfileContract } from 'utils/contractHelpers'
import { Team } from 'config/constants/types'
import { TeamsById, TeamResponse } from 'state/types'
import { multicallv2 } from 'utils/multicall'
import profileAbi from 'config/abi/pancakeProfile.json'

const profileContract = getProfileContract()

export const getTeam = async (teamId: number): Promise<Team> => {
  try {
    const {
      0: teamName,
      2: numberUsers,
      3: numberPoints,
      4: isJoinable,
    } = await profileContract.getTeamProfile(teamId)
    const staticTeamInfo = teamsList.find((staticTeam) => staticTeam.id === teamId)

    return merge({}, staticTeamInfo, {
      isJoinable,
      name: teamName,
      users: numberUsers,
      points: numberPoints,
    })
  } catch (error) {
    return null
  }
}

/**
 * Gets on-chain data and merges it with the existing static list of teams
 */
export const getTeams = async (): Promise<TeamsById> => {
  try {
    const teamsById = teamsList.reduce((accum, team) => {
      return {
        ...accum,
        [team.id]: team,
      }
    }, {})
    const nbTeams = await profileContract.numberTeams()
    const calls = []
    for (let i = 1; i <= nbTeams; i++) {
      calls.push({
        address: profileContract.address,
        name: 'getTeamProfile',
        params: [i],
      })
    }
    const teamData = await multicallv2(profileAbi, calls)
    const onChainTeamData = teamData.reduce((accum, team, index) => {
      const { 0: teamName, 2: numberUsers, 3: numberPoints, 4: isJoinable } = team

      return {
        ...accum,
        [index + 1]: {
          name: teamName,
          users: Number(numberUsers),
          points: Number(numberPoints),
          isJoinable,
        },
      }
    }, {})

    return merge({}, teamsById, onChainTeamData)
  } catch (error) {
    return null
  }
}
