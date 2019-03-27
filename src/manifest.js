
module.exports = {
  name: 'ciblage Marketing',
  version: '1.5',
  description: 'ciblage Marketing est un app de web scraping qui permette de récupérer tout les membres d\'un groupe facebook',
  author: 'Andriamihaja Heldino herbert',
  manifest_version: 2,
  icons: { '16': 'icons/logo16.png','48': 'icons/logo48.png', '128': 'icons/logo128.png' },
  permissions: [
    '*://*/*',
    "storage", 
    "tabs", 
    "alarms", 
    "downloads",  
    "declarativeContent",
    "activeTab",
    "webRequest"
  ],
  page_action: {
    default_title: 'scraping',
    default_popup: 'pages/popup.html'
  },
  background: {
    "scripts": ["js/background.js"],
    "persistent": true
  },
  //devtools_page: 'pages/devtools.html',
  options_page: 'pages/options.html',
  content_scripts: [{
    js: [ 'js/inject.js' ],
    matches: ['https://www.facebook.com/*'],
    all_frames: true
  }],
  content_security_policy: "script-src https://cdn.rawgit.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net 'self' 'unsafe-eval' ; object-src 'self'",
  //web_accessible_resources: [ 'panel.html', 'js/content.js' ] 
}