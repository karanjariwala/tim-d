
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

// Load client secrets from a local file.
// fs.readFile('client_secret.json', function processClientSecrets(err, content) {
//   if (err) {
//     console.log('Error loading client secret file: ' + err);
//     return;
//   }
//   // Authorize a client with the loaded credentials, then call the
//   // Google Calendar API.
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(cb, redirectToGetCode) {
  var clientSecret = '6qFXfAf0o7PS2_xtiPWeL2ah';
  var clientId = '513938856090-pq06rjl3a7otfgrj4t1jrls7e1jji3c3.apps.googleusercontent.com';
  var redirectUrl = 'http://localhost:8089/code';
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, listEventsWrapper(cb), redirectToGetCode);
    } else {
      console.log(token, 'inelse');
      oauth2Client.credentials = JSON.parse(token);
      listEventsWrapper(cb)(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback, redirectToGetCode) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  // var rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });
  redirectToGetCode(authUrl);
  // .then(function(code){
  //   oauth2Client.getToken(code, function(err, token) {
  //     if (err) {
  //       console.log('Error while trying to retrieve access token', err);
  //       return;
  //     }
  //     oauth2Client.credentials = token;
  //     storeToken(token);
  //     callback(oauth2Client);
  //   });
  // })
  // rl.question('Enter the code from that page here: ', function(code) {
    
  // });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(code) {
  var clientSecret = '6qFXfAf0o7PS2_xtiPWeL2ah';
  var clientId = '513938856090-pq06rjl3a7otfgrj4t1jrls7e1jji3c3.apps.googleusercontent.com';
  var redirectUrl = 'http://localhost:8089/code';
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, function(err, token) {
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return reject();
        console.log('success')
        resolve();
      });
    })
  });
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEventsWrapper(cb){
return function listEvents(auth) {
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var events = response.items;
    if (events.length == 0) {
      console.log('No upcoming events found.');
    } else {
      cb(events);
    }
  });
}
}

export {authorize as default, storeToken};
