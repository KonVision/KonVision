const { domain } = require('./../config.json');
const fs = require('fs');


function ShareXGenerator(user_id, uploadsecret) {
    const uploaddomain = `https://${domain}/users/${user_id}/upload.php`;

    const content = {
        "Version": "13.7.0",
        "Name": `${domain} Image Host`,
        "DestinationType": "ImageUploader",
        "RequestMethod": "POST",
        "RequestURL": uploaddomain,
        "Body": "MultipartFormData",
        "Arguments": {
            "k": uploadsecret,
            "n": user_id
        },
        "FileFormName": "d"
    };
    
    fs.writeFileSync(`./scripts/cache/${user_id}config.sxcu`, JSON.stringify(content));
}

function ShareNixGenerator(user_id, uploadsecret) {
    const uploaddomain = `https://${domain}/users/${user_id}/upload.php`;

    const content = {
        "Name": `${domain} Image Host`,
        "RequestType": "POST",
        "RequestURL": uploaddomain,
        "Body": "MultipartFormData",
        "Arguments": {
            "k": uploadsecret,
            "n": user_id
        },
        "FileFormName": "file",
        "URL": "$json:url$"
    }

    fs.writeFileSync(`./scripts/cache/${user_id}config.json`, JSON.stringify(content));
}


module.exports = { ShareXGenerator, ShareNixGenerator };
