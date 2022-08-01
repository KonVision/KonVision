const fs = require('fs');


function saveUploadSecret(name, uploadsecret) {
  const dbEntry = {
    id: name,
    uploadsecret: uploadsecret
  };

  // Read the JSON file
  const JSONString = fs.readFileSync("./db/db.json", "utf8");

  // Parse the JSON file
  let JSData = JSON.parse(JSONString);

  // Add object to the array
  JSData.push(dbEntry);

  // Stringify the data
  const newJSONString = JSON.stringify(JSData, null, 2);

  // Write the file
  fs.writeFileSync("./db/db.json", newJSONString);
}

function getUploadSecret(name) {
  // Read the JSON file
  const JSONString = fs.readFileSync("./db/db.json", "utf8");

  // Parse the JSON file
  const JSData = JSON.parse(JSONString);

  // Loop through the array
  for (let i = 0; i < JSData.length; i++) {
    // Check if the ID matches
    if (JSData[i].id === name) {
      // Return the upload secret
      return JSData[i].uploadsecret;
    }
  }
}

function deleteUploadSecret(name) {
  // Read the JSON file
  const JSONString = fs.readFileSync("./db/db.json", "utf8");

  // Parse the JSON file
  const JSData = JSON.parse(JSONString);

  // Loop through the array
  for (let i = 0; i < JSData.length; i++) {
    // Check if the ID matches
    if (JSData[i].id === name) {
      // Remove the object from the array
      JSData.splice(i, 1);
    }
  }

  // Stringify the data
  const newJSONString = JSON.stringify(JSData, null, 2);

  // Write the file
  fs.writeFileSync("./db/db.json", newJSONString);
}


module.exports = { saveUploadSecret, getUploadSecret, deleteUploadSecret };