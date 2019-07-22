import request from 'request'
import cheerio from 'cheerio'
import { CONFIG } from './config'

interface Player {
  playerId: string
  kills: number
  assists: number
  deaths: number
  kast: number
  kdd: number
  adr: number
  fkd: number
  rating: number
}

interface TeamInfo {
  name: string
  breakdown: string
  rating: string
  firstKills: string
  clutchesWon: string
  players: Player[]
}

/**
 * Creates an instance of Matches.
 *
 * @param {string} mapId
 * @param {any} callback
 *
 * @memberOf Matches
 */
export default function get(mapId: string, callback: any) {
  const uri = `${CONFIG.BASE}/${mapId}`

  request({ uri }, (error, response, body) => {
    const $ = cheerio.load(body, {
      normalizeWhitespace: true,
    })

    const map = $(
      '.stats-match-map:not(.inactive) .dynamic-map-name-full'
    ).text()

    const team1Info = {} as TeamInfo
    const team2Info = {} as TeamInfo

    const teamsInfoEl = $('.match-info-box-con')
    team1Info.name = teamsInfoEl.find('.team-left a').text()
    team2Info.name = teamsInfoEl.find('.team-right a').text()

    const statsRows = teamsInfoEl.find('.match-info-row .right')

    const breakdownRow = statsRows.eq(0)
    const teamRatingRow = statsRows.eq(1)
    const firstKillsRow = statsRows.eq(2)
    const clutchesWonRow = statsRows.eq(3)

    const breakdownSpans = breakdownRow.find('span')
    team1Info.breakdown = breakdownSpans.eq(0).text()
    team2Info.breakdown = breakdownSpans.eq(1).text()

    const teamRating = teamRatingRow.text().split(' : ')
    team1Info.rating = teamRating[0]
    team2Info.rating = teamRating[1]

    const firstKills = firstKillsRow.text().split(' : ')
    team1Info.firstKills = firstKills[0]
    team2Info.firstKills = firstKills[1]

    const clutchesWon = clutchesWonRow.text().split(' : ')
    team1Info.clutchesWon = clutchesWon[0]
    team2Info.clutchesWon = clutchesWon[1]

    const teamsStatsTables = $('.stats-match .stats-table')

    team1Info.players = getPlayers($, teamsStatsTables.eq(0))
    team2Info.players = getPlayers($, teamsStatsTables.eq(1))

    callback({ map: map, teams: [team1Info, team2Info] }, error)
  })
}

function getPlayers($: CheerioStatic, tableEl: Cheerio) {
  const players: any[] = []

  tableEl.find('tbody tr').each((i: number, element: CheerioElement) => {
    const el = $(element)

    const player = {} as Player

    player.playerId = el.find('td.st-player a').text()
    player.kills = parseInt(
      el
        .find('td.st-kills')
        .text()
        .match(/^\d+/)[0]
    )
    player.assists = parseInt(
      el
        .find('td.st-assists')
        .text()
        .match(/^\d+/)[0]
    )
    player.deaths = parseInt(el.find('td.st-deaths').text())
    player.kast = parseFloat(
      el
        .find('td.st-kdratio')
        .text()
        .match(/^[\d\.]+/)[0]
    )
    player.kdd = parseInt(el.find('td.st-kddiff').text())
    player.adr = parseFloat(el.find('td.st-adr').text())
    player.fkd = parseInt(el.find('td.st-fkdiff').text())
    player.rating = parseFloat(el.find('td.st-rating').text())

    players.push(player)
  })

  return players
}
