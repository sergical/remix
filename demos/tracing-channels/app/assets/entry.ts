let btn = document.getElementById('fetch-btn')
let result = document.getElementById('result')

btn?.addEventListener('click', async () => {
  let res = await fetch('/ping')
  let data = await res.json()
  if (result) result.textContent = JSON.stringify(data, null, 2)
})
