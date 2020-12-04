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
        else {
            if (req.method == 'GET') {

                res.writeHead(404);
                res.end();

            } 
        }

    })

    

    Work(req, res);
    
}).listen(8080);
const sqlite3 = require('sqlite3').verbose();

function Work(request, response) {
    if (request.method == 'POST') {

        if (request.url == '/delete') {
            console.log('/delete');
            request.on('data', function (data) {

                var task = JSON.parse(data);

                let db = new sqlite3.Database('tasks.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);


                db.get('SELECT * FROM Tasks WHERE id=?', task['id'], (err, row) => {
                    if (err) {
                        response.end('false');
                        return console.error(err.message);
                    }
                    if (row) {
                        db.run('DELETE FROM Tasks WHERE id=?', task['id']);
                        response.end('delete');
                        console.log('delete');
                    }
                });

                db.close();
            });
        }
        else if (request.url == '/reg') {
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
                        console.log('insert user');
                    }
                });

                db.close();
            });
        }
        else if (request.url == '/check_pass') {
            request.on('data', function (data) {
                var person = JSON.parse(data);

                let db = new sqlite3.Database('tasks.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);


                db.get('SELECT * FROM User WHERE login =?', person['login'], (err, row) => {
                    if (err) {
                        return console.error(err.message);
                    }

                    if (person['password'] == row.password) {

                        var user_id = JSON.stringify(row.id);
                        response.end(user_id);
                    }
                    else {
                        response.end('false');
                    }
                });

                db.close();
            });
        }
        else if (request.url == '/update') {
            console.log('/update');
            request.on('data', function (data) {

                var task = JSON.parse(data);

                let db = new sqlite3.Database('tasks.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);


                db.get('SELECT * FROM Tasks WHERE id=?', task['id'], (err, row) => {
                    if (err) {
                        response.end('false');
                        return console.error(err.message);
                    }
                    if (row) {

                        db.run('UPDATE Tasks SET title=?, body=?, completed=? WHERE id=?', task['title'], task['body'], task['completed'], task['id']);
                        response.end('update');
                        console.log('update task');
                    }
                    else {
                        db.run('INSERT INTO Tasks VALUES(?,?,?,?,?)', task['id'], task['title'], task['body'], task['user_id'], task['completed']);
                        response.end('insert');
                        console.log('insert task');
                    }
                });

                db.close();
            });
        }
        else if (request.url == '/get_posts') {
            request.on('data', function (data) {
                var person = JSON.parse(data);

                let db = new sqlite3.Database('tasks.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

                db.all('SELECT * FROM Tasks WHERE user_id =?', person, (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    var tasks = JSON.stringify(rows);
                    response.end(tasks);

                });

                db.close();
            });
        }
        else {
            res.writeHead(404);
            res.end();
        }

    }
}




