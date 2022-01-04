import fs from 'fs'
import path from 'path'
import config from '../util/config-parser'
import { ParameterizedContext } from 'koa'

interface Rule {
  reg: RegExp
  type: number
  cmt: string
}

interface _Rule {
  id: number
  reg: string
  type: number
  cmt: string
}

class Waf {
  private static instance: Waf
  public static getInstance(): Waf {
    if (!Waf.instance) {
      Waf.instance = new Waf()
    }
    return Waf.instance
  }

  constructor() {
    this.load()
  }

  private types: {
    [key: string]: string
  } = {}

  private rules: {
    [key: string]: Rule
  } = {}

  private entries: { [key: string]: RegExp } = {}

  private load = () => {
    this.types = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'wafTypes.json')).toString()
    )
    const rulesJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'wafRules.json')).toString()
    )

    for (const key in this.types) {
      this.types[this.types[key]] = key
    }
    rulesJson.forEach((rule: _Rule) => {
      this.rules[rule.id] = {
        reg: new RegExp(rule.reg),
        type: rule.type,
        cmt: rule.cmt,
      }
      this.entries[rule.id] = new RegExp(rule.reg)
    })
  }

  private parseNumString = (numString: string) => {
    const substrings = numString.split(',')
    const numArr: number[] = []
    substrings.forEach(function (item) {
      if (item) {
        const tmpArr = item.split('-')
        if (tmpArr.length == 2) {
          const low = parseInt(tmpArr[0])
          const high = parseInt(tmpArr[1])
          for (let i = low; i <= high; i++) {
            numArr.push(i)
          }
        } else {
          numArr.push(parseInt(tmpArr[0]))
        }
      }
    })
    return numArr
  }

  private detect = (test: string, excludes: number[]) => {
    for (const key in this.entries) {
      if (!excludes.includes(parseInt(key))) {
        if (this.entries[key].test(test) === true) {
          return key
        }
      }
    }
    return 0
  }

  public scan = (ctx: ParameterizedContext) => {
    if (config.waf) {
      const urlExcludeRules = this.parseNumString(config.waf_url_exclude_rules)
      const urlResult = this.detect(ctx.url, urlExcludeRules)
      if (urlResult) {
        return {
          id: urlResult,
          type: this.types[this.rules[urlResult].type],
          cmt: this.rules[urlResult].cmt,
          location: 'url',
        }
      }
      const headerExcludeRules = this.parseNumString(
        config.waf_header_exclude_rules
      )
      const headerResult = this.detect(
        JSON.stringify(ctx.headers),
        headerExcludeRules
      )
      if (headerResult) {
        return {
          id: headerResult,
          type: this.types[this.rules[headerResult].type],
          cmt: this.rules[headerResult].cmt,
          location: 'header',
        }
      }
      const bodyExcludeRules = this.parseNumString(
        config.waf_body_exclude_rules
      )
      const bodyResult = this.detect(
        JSON.stringify(ctx.request.body),
        bodyExcludeRules
      )
      if (bodyResult) {
        return {
          id: bodyResult,
          type: this.types[this.rules[bodyResult].type],
          cmt: this.rules[bodyResult].cmt,
          location: 'body',
        }
      }
    }
    return null
  }
  public test = (test: string, excludes: number[]): string|0 => {
    if (process.env.NODE_ENV === 'test') {
      return this.detect(test, excludes)
    }
    return 0
  }
}
export default Waf
