/* Importing packages and variables */
const { domain } = require('./../config.json');
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');


/* Call watcher */
let watcher = chokidar.watch(`/var/www/${domain}/upload/end/`, {ignored: /^\./, persistent: true});

watcher
    .on('add', function(path) {console.log('File', path, 'has been added'); postProc(path);})

function postProc(filename) {
    const change = filename;
    const postproc = change.split(`/www/${domain}/upload/end/`).pop();
    const end = postproc.replace('/','').split('.');

    let user = end[0];
    let newfile = end[1] + '.' + end[2];    

    fs.mkdirSync(`/var/www/${domain}/users/` + user + '/' + end[1]);
    
    fs.chmod(path.join(__dirname, `/var/www/${domain}/users/` + user + '/' + end[1]), '755', (err => {
        if (err) {
            return console.error(err);
        }
    }));  


    fs.rename(`/var/www/${domain}/upload/end/` + postproc.replace('/','') , `/var/www/${domain}/users/` + user + '/' + end[1] + '/' + newfile , (end) => {
	    console.log("moved")
    });

    let userConfig = JSON.parse(fs.readFileSync(`../users/${user}/config.json`));
    const author = userConfig.author;

    const authorJSON = {
        "type":"link",
        "version":"1.0",
        "author_name": author.name,
    }
    
    const authorConfigPath = `../users/${user}/author.json`;
    if (fs.existsSync(authorConfigPath)) {
        let authorConfig = JSON.parse(fs.readFileSync(authorConfigPath));

        if (authorConfig.author === author) {
            return;
        } else {
            fs.rmSync(path.join(__dirname, authorConfigPath), { recursive: true, force: true });
            fs.writeFileSync(authorConfigPath, JSON.stringify(authorJSON, null, 2));
        }
    } else {
        fs.writeFileSync(authorConfigPath, JSON.stringify(authorJSON));
    }


    let content;

    if (userConfig.description == " " && userConfig.author == " ") {
        const metaTags = `<meta name="twitter:card" content="summary_large_image"> <meta name="twitter:image" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta name="twitter:image:src" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta property="og:image" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta property="og:title" content="${userConfig.title}"> <meta name="twitter:title" content="${userConfig.title}">`;

        content = `<html> <head> ${metaTags} <script src="https://cdn.tailwindcss.com"></script> </head> <style> body { height: 75vh; background: #1f2329; color: #ffffff; } @media screen and (min-height: 700px) { .div { margin-top: 12.5%;} } @media screen and (max-height: 701px) { .div { margin: 10px; } } img { width: 50%; } </style> <body> <div class="div"> <img class="rounded-md mx-auto p-4 md:p-0" src="${newfile}"> <h1 class="text-xl md:text-2xl font-bold text-center p-1"> Uploader: ${user} </h1> </div> </body> </html>`;
    } else if (userConfig.description == " ") {
        const metaTags = `<meta name="twitter:card" content="summary_large_image"> <meta name="twitter:image" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta name="twitter:image:src" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta property="og:image" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta property="og:title" content="${userConfig.title}"> <meta name="twitter:title" content="${userConfig.title}">`;

        content = `<html> <head> ${metaTags} <link type="application/json+oembed" href="https://${domain}/users/${user}/author.json"> <script src="https://cdn.tailwindcss.com"></script> </head> <style> body { height: 75vh; background: #1f2329; color: #ffffff; } @media screen and (min-height: 700px) { .div { margin-top: 12.5%;} } @media screen and (max-height: 701px) { .div { margin: 10px; } } img { width: 50%; } </style> <body> <div class="div"> <rounded-md img class="mx-auto p-4 md:p-0" src="${newfile}"> <h1 class="text-xl md:text-2xl font-bold text-center p-1"> Uploader: ${user} </h1> </div> </body> </html>`;
    } else if (userConfig.author == " ") {
        const metaTags = `<meta name="twitter:card" content="summary_large_image"> <meta name="twitter:image" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta name="twitter:image:src" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta property="og:image" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta property="og:title" content="${userConfig.title}"> <meta name="twitter:title" content="${userConfig.title}"> <meta name="twitter:description" content="${userConfig.description}"> <meta property="og:description" content="${userConfig.description}">`;

        content = `<html> <head> ${metaTags} <script src="https://cdn.tailwindcss.com"></script> </head> <style> body { height: 75vh; background: #1f2329; color: #ffffff; } @media screen and (min-height: 700px) { .div { margin-top: 12.5%;} } @media screen and (max-height: 701px) { .div { margin: 10px; } } img { width: 50%; } </style> <body> <div class="div"> <img class="rounded-md mx-auto p-4 md:p-0" src="${newfile}"> <h1 class="text-xl md:text-2xl font-bold text-center p-1"> Uploader: ${user} </h1> </div> </body> </html>`;
    } else {
        content = `<html> <head> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:image" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta name="twitter:image:src" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta property="og:image" content="https://${domain}/users/${user}/${end[1]}/${newfile}"> <meta property="og:title" content="${userConfig.title}"> <meta name="twitter:title" content="${userConfig.title}"> <meta name="twitter:description" content="${userConfig.description}"> <meta property="og:description" content="${userConfig.description}"> <link type="application/json+oembed" href="https://${domain}/users/${user}/author.json"> <script src="https://cdn.tailwindcss.com"></script> </head> <style> body { height: 75vh; background: #1f2329; color: #ffffff; } @media screen and (min-height: 700px) { .div { margin-top: 12.5%;} } @media screen and (max-height: 701px) { .div { margin: 10px; } } img { width: 50%; } </style> <body> <div class="div"> <img class="rounded-md mx-auto p-4 md:p-0" src="${newfile}"> <h1 class="text-xl md:text-2xl font-bold text-center p-1"> Uploader: ${user} </h1> </div> </body> </html>`;
    }

    fs.writeFile(`/var/www/${domain}/users/` + user + '/' + end[1] + '/' + end[1] + '.html', content, err => {
        if (err) {
	        console.error(err);
        }
    });

    console.log("user=" + user + "; file =" + newfile + "; end=" + end + "postproc =" + postproc);
}
