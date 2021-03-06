import Pow from '../../service/pow-service'
import { Solver } from '../../service/pow/solver'

let pow: Pow
let solver: Solver

beforeAll(() => {
  pow = new Pow(3)
  solver = new Solver()
})

describe(`PoW service`, () => {
  let powData: any
  it('should be able to generate problems', async () => {
    powData = await pow.getProblem()
    expect(powData.difficulty).toEqual(3)
    expect(powData.prefix).toMatch(/[0-9a-f]{16}/)
  })

  it('should be able to generate nonce for problem', async () => {
    powData.nonce = JSON.stringify(
      (await solver.solve(powData.difficulty, powData.prefix)).toJSON()
    )
    expect(powData.nonce).not.toBeNull()
  })

  it('should be able to verify nonce validity', async () => {
    expect(
      await pow.parseAndVerify(powData.nonce, {
        difficulty: powData.difficulty,
        prefix: powData.prefix,
      })
    ).toBeTruthy()
  })
})
