const showCOC = document.getElementById('show-coc')
const closeCOC = document.getElementById('close-coc')
const COC = document.getElementById('coc')

if (showCOC) {
  showCOC.addEventListener('click', e => {
    e.preventDefault()
    COC.classList.add('show')
    document.body.classList.add('lock')
  })
}

closeCOC.addEventListener('click', e => {
  e.preventDefault()
  COC.classList.add('hide')
  document.body.classList.remove('lock')

  setTimeout(() => {
    COC.classList.remove('show', 'hide')
  }, 1000)
})
