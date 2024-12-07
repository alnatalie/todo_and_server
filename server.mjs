import {DatabaseSync} from 'node:sqlite';
import {createServer, request} from 'node:http';
import { parse as parsePath } from 'node:path';

const database = new DatabaseSync('./todo.sqlite');
const __ = database.exec(`
        CREATE TABLE if not exists todo(
        id INTEGER PRIMARY KEY,
        checked INTEGER DEFAULT 0,
        text TEXT
        )`);
const getAlltodo = ()=> database.prepare(`
    SELECT *  FROM todo`);
const addTodo = database.prepare(`
    INSERT INTO todo(tex) values(?)`);
const deleteTodo = database.prepare(`
    DELETE from todo where id=?`);
const update = database.prepare(`
    UPDATE todo set checked =? where id=?`);

const 
    port = 3333;
createServer(async(request, response)=>{
    log(request.method, request.url, 'HTTP/'+request.httpVersion);
    const 
        urlOjects = new URL(request.url, `http://${request.headers.host}`),
        path = parsePath(urlOjects.pathname),
        id = path.name;
    // console.log('parsing', {path, id});


response.setHeader('Access-Control-Allow-Origin', '*');
response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
// response.setHeader('Access-Control-Allow-Headers', 'Content-Type');



    switch(true){
        case '/todo' === path.dir  || 'todo' === path.base:
            switch(request.method){
                case 'GET':
                    response.setHeader('content-type', 'application/json; charset=utf-8')
                    response.write(JSON.stringify(getAlltodo().all()));
                    response.statusCode =200;
                    break;
                case 'POST':
                    const {text} = await JSON.parse(postData(request));
                    addTodo.run(text);
                    response.statusCode =201;
                    break;
                case 'DELETE':
                    response.statusCode =200;
                    break;
                case 'PATCH':
                    const {checked} = await JSON.parse(postData(request));
                    // console.log('PATCH', {checked:+checked});
                    update.run(+checked,id);
                    response.statusCode =200;
                    break;

            }
            break;
        default:
            response.statusCode = 404;
    }
    // OK: {
    //     if(!request.url.startsWith('/todo')) break OK; //если это условие не выполнилось, то переходим в response.end()
    // }

    response.end();
}).listen(port, ()=>{
    log('Server start at http://localhost:'+port);
});

function log(...params) {
    console.log((new Date()).toLocaleDateString(),...params);
}


async function postData(request) { // функция аналогична getAndParsePostBody из  mlserv.js
    const buffers = [];
    for await (const chunk of request)  // новая конструкция для перебора асинхронного итератора
      buffers.push(chunk);
    return Buffer.concat(buffers).toString();
  }