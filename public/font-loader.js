// This script will be executed in the browser to ensure the font is loaded
;(() => {
  // Create a style element
  const style = document.createElement("style")

  // Add the font-face declaration
  style.textContent = `
    @font-face {
      font-family: 'Super Lobster';
      src: url('/fonts/SuperLobster.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    
    * {
      font-family: 'Super Lobster', cursive !important;
    }
  `

  // Append to the head
  document.head.appendChild(style)

  // Create a link element for preloading
  const link = document.createElement("link")
  link.rel = "preload"
  link.href = "/fonts/SuperLobster.woff2"
  link.as = "font"
  link.type = "font/woff2"
  link.crossOrigin = "anonymous"

  // Append to the head
  document.head.appendChild(link)
})()
