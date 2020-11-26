var http = require('http');
var path = require('path');
var fs = require('fs');
var qs = require('querystring');

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

    Work(req, res);
    
}).listen(8080);
const sqlite3 = require('sqlite3').verbose();

function Work(request, response) {
    if (request.method == 'POST') {

        if (request.url =='/reg') {
            request.on('data', function (data) {
                var row = JSON.parse(data);
                console.log(row);
                console.log(row['login']);
                let db = new sqlite3.Database('tasks.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATEcm, (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('Connected to the database.');
                });

                db.run('INSERT INTO user(login,password) VALUES(?,?)', row['login'], row['password']);

                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('Close the database connection.');
                })
            });
        }
    }
}




