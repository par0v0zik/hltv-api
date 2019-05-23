import request from 'request'
import cheerio from 'cheerio'
import { CONFIG } from './config'

export interface Stats {
  playerName: string
  playerId: string
  kills: number
  deaths: number
  plusMinus: number
  adr: number
  kast: number
  rating: number
}

export default class Matches {
  public constructor(
    matchId: string,
    callback: (stats: Stats[], error: Error) => void
  ) {
    const uri = `${CONFIG.BASE}/${matchId}`

    request(
      { uri },
      (error, response, body): void => {
        const $ = cheerio.load(body, {
          normalizeWhitespace: true,
        })

        const stats: Stats[] = []

        const allContent = $('.matchstats').find('#all-content')

        const team1Stats = allContent
          .children('table.table')
          .first()
          .children('tbody')
        const list1 = team1Stats.children('tr').not('.header-row')

        list1.each(
          (i, element): void => {
            const el = $(element)
            const playerName = el
              .find('.players .gtSmartphone-only')
              .text()
              .replace(/'/g, '')
            const playerId = el
              .find('.players')
              .children('a')
              .attr('href')
            const kills = parseInt(
              el
                .find('td.kd')
                .text()
                .split('-')[0],
              10
            )
            const deaths = parseInt(
              el
                .find('td.kd')
                .text()
                .split('-')[1],
              10
            )
            const plusMinus = parseInt(el.find('td.plus-minus').text(), 10)
            const adr = parseFloat(el.find('td.adr').text())
            const kast = parseFloat(el.find('td.kast').text())
            const rating = parseFloat(el.find('td.rating').text())

            const objData: Stats = {
              playerName,
              playerId,
              kills,
              deaths,
              plusMinus,
              adr,
              kast,
              rating,
            }

            stats.push(objData)
          }
        )

        const team2Stats = allContent
          .children('table.table')
          .last()
          .children('tbody')
        const list2 = team2Stats.children('tr').not('.header-row')

        list2.each(
          (i, element): void => {
            const el = $(element)
            const playerName = el
              .find('.players .gtSmartphone-only')
              .text()
              .replace(/'/g, '')
            const playerId = el
              .find('.players')
              .children('a')
              .attr('href')
            const kills = parseInt(
              el
                .find('td.kd')
                .text()
                .split('-')[0],
              10
            )
            const deaths = parseInt(
              el
                .find('td.kd')
                .text()
                .split('-')[1],
              10
            )
            const plusMinus = parseInt(el.find('td.plus-minus').text(), 10)
            const adr = parseFloat(el.find('td.adr').text())
            const kast = parseFloat(el.find('td.kast').text())
            const rating = parseFloat(el.find('td.rating').text())

            const objData: Stats = {
              playerName,
              playerId,
              kills,
              deaths,
              plusMinus,
              adr,
              kast,
              rating,
            }

            stats.push(objData)
          }
        )

        callback(stats, error)
      }
    )
  }
}
