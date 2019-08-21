// transform a for-http-only index.html to a double clickable html file
const fs = require('fs');
const distFile = 'dist/index.html';
console.log(`transform ${distFile} ...`);
fs.readFile(distFile, (err, data) => {
    let newFile = data.toString();
    [
        {src: '/js/', dest: '/docs/js/'},
        {src: '/css/', dest: '/docs/css/'},
        {src: '/img/', dest: '/docs/img/'},
        {src: '/favicon.ico', dest: '/docs/favicon.ico'},
        {src: '/manifest.json', dest: '/docs/manifest.json'},
    ].forEach(item => {
        newFile = newFile.split(item.src).join(item.dest)
    })
    fs.writeFileSync(distFile, newFile);
    console.log('transform ok.');
});
