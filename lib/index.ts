import Results, { Result } from './results'
import RSS, { News } from './rss'
import Matches, { Stats } from './matches'

export const getNews = (cb: (response: News[]) => void) => new RSS('news', cb)
export const getResults = (cb: (response: Result[]) => void) => new Results(cb)
export const getMatches = (id: string, cb: (response: Stats[]) => void) =>
  new Matches(id, cb)
