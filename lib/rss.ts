import { get } from 'request'
import { parseString } from 'xml2js'
import { CONFIG } from './config'

export interface News {
  title: string
  description: string
  link: string
  date: string
}

export default class RSS {
  public constructor(
    type: string,
    callback: (rss: News[], error: Error) => void
  ) {
    const URL = `/${type}`
    const uri = `${CONFIG.BASE}${CONFIG.RSS}${URL}`

    get(
      { uri },
      (error, response, body): void => {
        parseString(
          body,
          (err, result): void => {
            const { length } = result.rss.channel[0].item
            const rss: News[] = []

            for (let i = 0; i < length; i += 1) {
              const obj: News = {
                title: result.rss.channel[0].item[i].title[0],
                description: result.rss.channel[0].item[i].description[0],
                link: result.rss.channel[0].item[i].link[0],
                date: result.rss.channel[0].item[i].pubDate[0],
              }

              rss.push(obj)
            }

            callback(rss, err)
          }
        )
      }
    )
  }
}
