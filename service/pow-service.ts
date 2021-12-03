import randomstring from 'randomstring'
import Verifier from './pow/verifier'

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
    return this.verify(nonce, session.difficulty, session.prefix)
  }

  public getProblem = (): { difficulty: number; prefix: string } => {
    return {
      difficulty: this.difficulty,
      prefix: randomstring.generate({ length: 16, charset: 'hex' }),
    }
  }

  private difficulty: number

  private verify = (
    nonce: Buffer,
    difficulty: number,
    prefix: string
  ): boolean => {
    return this.verifier.check(nonce, difficulty, prefix)
  }
  private verifier = new Verifier({
    validity: 60 * 1000,
  })
}

export default Pow
