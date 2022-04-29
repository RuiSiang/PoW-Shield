import randomstring from 'randomstring'
import Verifier from './pow/verifier'
import NoSql from './util/nosql';

class Pow {
  private nosql: NoSql = NoSql.getInstance()

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

  public getProblem = (): { prefix: string } => {
    return {
      prefix: randomstring.generate({ length: 16, charset: 'hex' }),
    }
  }

  private verify = async (
    nonce: Buffer,
    difficulty: number,
    prefix: string
  ): Promise<boolean> => {
    if (!this.verifier.check(nonce, difficulty, prefix)) {
      await this.nosql.incr(`stats:bad_nonce`)
      return false
    }
    return true
  }
  private verifier = new Verifier({
    validity: 60 * 1000,
  })
}

export default Pow
