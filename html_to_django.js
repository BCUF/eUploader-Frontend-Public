let fs = require('fs');
const appName = "file_repo";
const dist = './dist/e-uploader-frontend';
let files = fs.readdirSync(dist);
const index = `${dist}/index.html`;
let content = fs.readFileSync(index, 'utf-8');
content = '{% load static %}\n' + content;
files.forEach((file) => {
    if(file.endsWith(".js") || file.endsWith(".css") || file.endsWith(".ico")){
        let replaceText = `{% static '${appName}/${file}' %}`;
        console.log(`Replacing ${file} with ${replaceText} ...`)
        content = content.replaceAll(file, replaceText);
    }
    
});
fs.writeFileSync(`${dist}/index.html`, content, 'utf-8', function (err) {
    console.log(err);
});