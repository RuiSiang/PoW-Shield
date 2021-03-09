import randomstring from 'randomstring'
import { Verifier } from '../lib/pow'

class Pow {
  constructor(initDifficulty: number) {
    this.difficulty = initDifficulty
  }

  public parseAndVerify = async (
    requestBody: string,
    session: { difficulty: number; prefix: string }
  ) => {
    if (!session.difficulty || !session.prefix) {
      return false
    }
    const nonce = Buffer.from((await JSON.parse(requestBody)).data)
    return await this.verify(nonce, session.difficulty, session.prefix)
  }

  public getProblem = async () => {
    return {
      difficulty: this.difficulty,
      prefix: randomstring.generate({ length: 16, charset: 'hex' }),
    }
  }

  private difficulty: number

  private verify = async (
    nonce: Buffer,
    difficulty: number,
    prefix: string
  ) => {
    return await this.verifier.check(nonce, difficulty, prefix)
  }
  private verifier = new Verifier({
    validity: 60 * 1000,
  })
}

export default Pow
