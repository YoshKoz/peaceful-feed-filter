;(() => {
const DEFAULT_PATTERN = /\b(passed away|funeral|grief|died|tragic|RIP(?!ple)|devastating|rest in peace|in memor(iam|y)|obituary|survived by|end of life|battling illness|gone too soon|forever in our hearts|will be deeply missed|in loving memory|passed on|died suddenly|mourning|my condolences|my sympathy|heartfelt condolences|overleden|begrafenis|rouw|condoleance|gecondoleerd|rust in vrede|herdenking|uitvaart|terminaal|innige deelneming|laatste eer|nabestaanden|heel veel sterkte|sterkte gewenst|woorden schieten tekort)\b/i

const SELECTORS = {
  'www.linkedin.com':   '.occludable-update, .feed-shared-update-v2, [data-id*="urn:li:activity"]',
  'x.com':              'article[data-testid="tweet"]',
  'twitter.com':        'article[data-testid="tweet"]',
  'www.facebook.com':   'div[role="article"]',
  'www.instagram.com':  'article',
  'www.reddit.com':     'shreddit-post, div.Post, div[data-testid="post-container"], div.md',
  'old.reddit.com':     'div.thing, div.link',
  'www.youtube.com':    'ytd-rich-item-renderer, ytd-video-renderer, ytd-reel-item-renderer',
  'www.tiktok.com':     'div[class*="DivItemContainer"], div[data-e2e="recommend-list-item"], div[class*="VideoFeed"]',
}

const _api = typeof browser !== 'undefined' ? browser : chrome

function getSelector() {
  for (const [host, sel] of Object.entries(SELECTORS)) {
    if (location.hostname === host || location.hostname.endsWith('.' + host)) return sel
  }
  return 'article, [class*="post"], [class*="Post"], [class*="feed"], [class*="Feed"], [data-testid*="post"]'
}

let pattern = DEFAULT_PATTERN
const selector = getSelector()
let observer

function buildPattern(extra) {
  if (!extra || !extra.length) return DEFAULT_PATTERN
  const esc = extra.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(DEFAULT_PATTERN.source + '|' + esc.join('|'), 'i')
}

function loadExtra() {
  try {
    _api.storage.local.get('extraKeywords', r => {
      pattern = buildPattern(r.extraKeywords)
    })
  } catch (e) {}
}

_api.storage.onChanged.addListener(changes => {
  if (changes.extraKeywords) {
    pattern = buildPattern(changes.extraKeywords.newValue)
  }
})

function dimPost(el) {
  if (el.dataset.pf) return
  el.dataset.pf = '1'
  el.style.setProperty('opacity', '0.35', 'important')
  el.style.setProperty('transition', 'opacity 0.2s', 'important')
  el.addEventListener('mouseenter', () => el.style.setProperty('opacity', '1', 'important'))
  el.addEventListener('mouseleave', () => el.style.setProperty('opacity', '0.35', 'important'))
}

function walkTree(root) {
  if (!root || !root.nodeType) return
  if (root.nodeType === 1) {
    if (root.matches(selector)) {
      if (pattern.test(root.textContent)) dimPost(root)
      return
    }
    for (const c of root.children) walkTree(c)
    const sr = root.shadowRoot
    if (sr) walkTree(sr)
  } else if (root.nodeType === 11 || root.nodeType === 9) {
    for (const c of root.children) walkTree(c)
  }
}

function onMutation(mutations) {
  for (const m of mutations) {
    for (const n of m.addedNodes) walkTree(n)
  }
}

function init() {
  const root = document.body || document.documentElement
  walkTree(root)
  observer = new MutationObserver(onMutation)
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true })
  loadExtra()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
})()
