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
                var person = JSON.parse(data);    

                let db = new sqlite3.Database('tasks.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);


                db.get('SELECT * FROM User WHERE login =?', person['login'], (err, row) => {
                    if (err) {
                        return console.error(err.message);
                    }

                    if (row) {
                        response.end('Change login');
                    }
                    else {
                        db.run('INSERT INTO user(login,password) VALUES(?,?)', person['login'], person['password']);
                        response.end('ok');
                    }
                });

                db.close();
            });                  
        }  

        if (request.url == '/check_pass') {
            request.on('data', function (data) {
                var person = JSON.parse(data);

                let db = new sqlite3.Database('tasks.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);


                db.get('SELECT * FROM User WHERE login =?', person['login'], (err, row) => {
                    if (err) {
                        return console.error(err.message);
                    }

                    if (person['password'] == row.password) {

                        db.all('SELECT * FROM Tasks WHERE user_id =?', row.id, (err, rows) => {
                            if (err) {
                                throw err;
                            }
                            var tasks = JSON.stringify(rows);
                            response.end(tasks);

                            /*rows.forEach((row) => {
                                console.log(row.name);
                            });*/
                        });
                    }
                    else {
                        response.end('false');
                    }
                });

                db.close();
            });
        }       
    }
}




