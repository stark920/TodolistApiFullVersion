const {sendRes, sendErr} = require('./resHandler');
const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const uri =
  "mongodb+srv://???????:????????????????@cluster0.uklck.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const requestListener = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    })

    if (req.method === 'OPTIONS') {
        sendRes(res);
    } else if (req.url === '/todo') {
        switch(req.method) {
            case 'GET':
                run(res, 'getAll');
                break;
            case 'POST':
                req.on('end', () => {
                    let title = JSON.parse(body)?.title;
                    title ? run(res, 'insertOne', {title}) : sendErr(res, 400);
                })
                break;
            case 'DELETE':
                run(res, 'deleteAll');
                break;
            default:
                sendErr(res, 405);
                break;
        }
    } else if (req.url.startsWith('/todo/')) {
        let id = req.url.split('/').pop();
        let idIsValid = mongoose.Types.ObjectId.isValid(id);
        if (idIsValid) {
            if (req.method == 'DELETE') {
                run(res, 'deleteOne', {"_id": ObjectId(id)});
            } else if (req.method == 'PATCH') {
                req.on('end', () => {
                    try {
                        let title = JSON.parse(body)?.title;
                        title ? run(res, 'updateOne', [{"_id": ObjectId(id)}, {title}]) : sendErr(res, 400);
                    } catch (error) {
                        sendErr(res, 405);
                    }
                })
            } else {
                sendErr(res, 405);
            }
        } else {
            sendErr(res, 405);
        }
    } else {
        sendErr(res, 404);
    }
}

async function run(res, method, data) {
    try {
        await client.connect();
        const database = client.db('todolist');
        const todos = database.collection('todos');
        let result;
        switch(method) {
            case 'getAll':
                result = await todos.find().toArray();
                await sendRes(res, result);
                break;
            case 'insertOne':
                result = await todos.insertOne(data);
                await sendRes(res, result);
                break;
            case 'deleteAll':
                result = await todos.deleteMany();
                await sendRes(res, result);
                break;
            case 'deleteOne':
                result = await todos.deleteOne(data);
                await sendRes(res, result);
                break;
            case 'updateOne':
                result = await todos.updateOne(data[0], {$set: data[1]});
                await sendRes(res, result);
                break;
            default:
                sendErr(res, 405);
                break;
        }
    } finally {
      await client.close();
    }
  }


module.exports = {requestListener};