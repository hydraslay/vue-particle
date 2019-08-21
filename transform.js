// transform a for-http-only index.html to a double clickable html file
const fs = require('fs');
const distFile = 'dist/index.html';
console.log(`transform ${distFile} ...`);
fs.readFile(distFile, (err, data) => {
    let newFile = data.toString();
    [
        {src: '/js/', dest: 'https://raw.githubusercontent.com/hydraslay/vue-particle/master/dist/js/'},
        {src: '/css/', dest: 'https://raw.githubusercontent.com/hydraslay/vue-particle/master/dist/css/'},
        {src: '/img/', dest: 'https://raw.githubusercontent.com/hydraslay/vue-particle/master/dist/img/'},
        {src: '/favicon.ico', dest: 'https://raw.githubusercontent.com/hydraslay/vue-particle/master/dist/favicon.ico'},
        {src: '/manifest.json', dest: 'https://raw.githubusercontent.com/hydraslay/vue-particle/master/dist/manifest.json'},
    ].forEach(item => {
        newFile = newFile.split(item.src).join(item.dest)
    })
    fs.writeFileSync(distFile, newFile);
    console.log('transform ok.');
});
