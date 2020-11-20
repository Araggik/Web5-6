var http = require('http');
var path = require('path');
var fs = require('fs');
http.createServer(function (req, res) {

    var filePath = req.url;
    if (filePath == '/')
        filePath = '/test.html';

    filePath = __dirname + filePath;
    var extname = path.extname(filePath);
    var contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }


    fs.exists(filePath, function (exists) {

        if (exists) {
            fs.readFile(filePath, function (error, content) {
                if (error) {
                    res.writeHead(500);
                    res.end();
                }
                else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        }

    })

}).listen(8080);
const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('tasks.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATEcm, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
})