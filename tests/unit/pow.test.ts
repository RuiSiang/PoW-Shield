import Pow from '../../service/pow-service'
import { Solver } from '../../service/pow/solver'

let pow: Pow // skipcq: JS-0309
let solver: Solver // skipcq: JS-0309

beforeAll(() => {
  pow = new Pow()
  solver = new Solver()
})

describe(`PoW service`, () => {
  let powData: any // skipcq: JS-0309, JS-0323
  it('should be able to generate problems', () => {
    powData = pow.getProblem()
    expect(powData.prefix).toMatch(/[0-9a-f]{16}/)
  })

  it('should be able to generate nonce for problem', () => {
    powData.nonce = JSON.stringify(solver.solve(13, powData.prefix).toJSON())
    expect(powData.nonce).not.toBeNull()
  })

  it('should be able to verify nonce validity', async () => {
    expect(
      await pow.parseAndVerify(powData.nonce, {
        difficulty: 13,
        prefix: powData.prefix,
      })
    ).toBeTruthy()
  })
})
