const fs = require('fs');

const svgContent = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3c72"/>
      <stop offset="100%" stop-color="#2a5298"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)"/>
  <path d="M ${size*0.3} ${size*0.25} L ${size*0.7} ${size*0.25} C ${size*0.75} ${size*0.25} ${size*0.75} ${size*0.3} ${size*0.75} ${size*0.3} L ${size*0.75} ${size*0.75} L ${size*0.5} ${size*0.62} L ${size*0.25} ${size*0.75} L ${size*0.25} ${size*0.3} C ${size*0.25} ${size*0.25} ${size*0.3} ${size*0.25} Z" fill="#ffffff" opacity="0.95"/>
  <circle cx="${size*0.65}" cy="${size*0.65}" r="${size*0.16}" fill="#ffc107"/>
  <path d="M ${size*0.65} ${size*0.55} L ${size*0.68} ${size*0.62} L ${size*0.75} ${size*0.63} L ${size*0.7} ${size*0.68} L ${size*0.71} ${size*0.75} L ${size*0.65} ${size*0.71} L ${size*0.59} ${size*0.75} L ${size*0.6} ${size*0.68} L ${size*0.55} ${size*0.63} L ${size*0.62} ${size*0.62} Z" fill="#1e3c72"/>
</svg>`;

fs.writeFileSync('icon-192.svg', svgContent(192), 'utf8');
fs.writeFileSync('icon-512.svg', svgContent(512), 'utf8');
console.log('Icones PWA (icon-192.svg e icon-512.svg) criados com sucesso!');
