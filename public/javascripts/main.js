const runSolver = async (difficulty, prefix) => {
  const solver = new powSolver() // skipcq: JS-0125
  const nonce = await solver.solve(difficulty, prefix)
  document.querySelector('.calculating td.blink').innerHTML = 'V'
  document.querySelector('.calculating td.blink').classList.remove('blink')
  document.querySelector('.submitting').style.display = 'table-row'
  return nonce
}

const sendResult = async (nonce, redirect) => {
  try {
    const response = await fetch('/pow', {
      method: 'POST',
      body: JSON.stringify(nonce),
    })
    window.responseStatus=response.status
    window.nonceSent=true
    if (response.status === 200) {
      document.querySelector('.submitting td.blink').innerHTML = 'V'
      document.querySelector('.submitting td.blink').classList.remove('blink')
      setInterval(() => {
        document.querySelector('.success').style.display = 'table-row'
      }, 500)
      setInterval(() => {
        if (redirect) {
          window.location.href = `${redirect}`
        } else {
          window.location.href = '/'
        }
      }, 3000)
    } else {
      document.querySelector('.submitting td.blink').innerHTML = 'X'
      document.querySelector('.submitting td.blink').classList.remove('blink')
      setInterval(() => {
        document.querySelector('.failed').style.display = 'table-row'
      }, 500)
      setInterval(() => {
        window.location.reload()
      }, 3000)
    }
  } catch (err) {
    console.log('Error')
  }
}

window.init = (difficulty, prefix, redirect) => {
  setTimeout(async () => {
    const nonce = await runSolver(difficulty, prefix)
    setTimeout(async () => {
      await sendResult(nonce, redirect)
    }, 500)
  }, 1500)
}