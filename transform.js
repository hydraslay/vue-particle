// transform a for-http-only index.html to a double clickable html file
const fs = require('fs');
const distFile = 'dist/index.html';
console.log(`transform ${distFile} ...`);
fs.readFile(distFile, (err, data) => {
    let newFile = data.toString();
    [
        {src: '/js/', dest: '/doc/js/'},
        {src: '/css/', dest: '/doc/css/'},
        {src: '/img/', dest: '/doc/img/'},
        {src: '/favicon.ico', dest: '/doc/favicon.ico'},
        {src: '/manifest.json', dest: '/doc/manifest.json'},
    ].forEach(item => {
        newFile = newFile.split(item.src).join(item.dest)
    })
    fs.writeFileSync(distFile, newFile);
    console.log('transform ok.');
});
