
module.exports = {
  name: 'IFS-NOTE-VOCAL',
  version: '0.0.3',
  description: 'Ajout de node vocale a infusionsoft',
  author: 'Andriamihaja Heldino herbert',
  manifest_version: 2,
  icons: {
    "128": "icons/icon.png"
  },
  permissions: [
    '*://*.therapiequantique.net/*', 
    "https://*.infusionsoft.com/*",
    "storage", 
    "tabs", 
    "alarms", 
    "downloads",  
    "declarativeContent",
    "activeTab",
    "webRequest",
    "cookies"
  ],
  /*
    page_action: {
      default_title: 'scraping',
      default_popup: 'pages/popup.html'
    },
  */
  background: {
    "scripts": ["js/background.js"],
    "persistent": true
  },
  //devtools_page: 'pages/devtools.html',
  //options_page: 'pages/options.html',
  content_scripts: [{
    js: [ 'js/inject.js' ],
    matches: ['https://*.infusionsoft.com/*'],
    //all_frames: true
  },{
    js: [ 'js/inject.js' ],
    matches: ['https://*.fusedesk.com/app/*'],
    //all_frames: true
  }],
  content_security_policy: "script-src https://cdn.rawgit.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net 'self' 'unsafe-eval' ; object-src 'self'",
  //web_accessible_resources: [ 'panel.html', 'js/content.js' ] 
}