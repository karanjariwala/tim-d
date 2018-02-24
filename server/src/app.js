import express from 'express';
import path from 'path';
import authorize, { storeToken } from './quickstart';

const app=express();

app.use(express.static(path.join(__dirname,'../public')));
var token = null;

app.get('/code',(req, res)=>{
    console.log( req.query.code);
    storeToken(req.query.code)
    .then(() => res.redirect('/abc'));
        // authorize((events) => {success(res)(events)}, (authUrl) => getToken(res)(authUrl));
        // res.send(res);
    })

app.get('/abc',(req, res)=>{
    console.log('i am here');
    authorize((events) => {success(res)(events)}, (authUrl) => getToken(res)(authUrl));
    // res.send(res);
})



const success = (res)=> (events) => {
//  console.log(events);
 let cache = [];
 res.send(JSON.stringify(events
//     function(key, value) {
//     if (typeof value === 'object' && value !== null) {
//         if (cache.indexOf(value) !== -1) {
//             // Circular reference found, discard key
//             console.log(value);
//             return;
//         }
//         // Store value in our collection
//         cache.push(value);
//     }
//     return value;
// }
));
cache = null;
}

const getToken = (res)=> (authUrl) => {
    //  console.log(events);
    console.log('i am here too');
     res.redirect(authUrl);     
    }


app.listen(8089);
