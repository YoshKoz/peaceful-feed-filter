const _api = typeof browser !== 'undefined' ? browser : chrome

document.getElementById('save').addEventListener('click', async () => {
  const val = document.getElementById('extra').value
  const keywords = val.split(/\n/).map(s => s.trim()).filter(Boolean)
  await _api.storage.local.set({ extraKeywords: keywords })
  document.getElementById('status').textContent = 'Saved!'
  setTimeout(() => document.getElementById('status').textContent = '', 2000)
})

_api.storage.local.get('extraKeywords').then(r => {
  if (r.extraKeywords) {
    document.getElementById('extra').value = r.extraKeywords.join('\n')
  }
})
