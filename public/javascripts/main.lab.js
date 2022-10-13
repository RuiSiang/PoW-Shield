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
    await fetch('/pow', {
      method: 'POST',
      body: JSON.stringify(nonce),
    }).then(response => {
      window.responseStatus = response.status
      window.nonceSent = true
      if (response.status === 200) {
        document.querySelector('.submitting td.blink').innerHTML = 'V'
        document.querySelector('.submitting td.blink').classList.remove('blink')
        document.querySelector('.success').style.display = 'table-row'
        if (redirect) {
          window.location.href = `${redirect}`
        } else {
          window.location.href = '/'
        }
      } else {
        document.querySelector('.submitting td.blink').innerHTML = 'X'
        document.querySelector('.submitting td.blink').classList.remove('blink')
        document.querySelector('.failed').style.display = 'table-row'
        window.location.reload()
      }
    })
  } catch (err) {
    console.log('Error')
  }
}

window.init = (difficulty, prefix, redirect) => {
  runSolver(difficulty, prefix).then(nonce => {
    sendResult(nonce, redirect)
  })
}