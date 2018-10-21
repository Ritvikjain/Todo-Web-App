const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParse = require('body-parser');
let db;

const app = express();
const url = "mongodb://localhost:27017";
MongoClient.connect(url , function (err ,client) {
    db = client.db('todo');
})

app.use(cors());
app.use(bodyParse.json());
app.listen(8080, function () {
    console.log("http server started");
})

app.post("/read", function ( req, res) {
    db.collection("taskslist").find({}).toArray(function ( err, data) {
        res.json(data);
    })    
})

app.post("/add", function ( req, res) {
    let task=req.body;
    db.collection("taskslist").insertOne(task,function (err,r) {
        res.json(r);
    })
})

app.post("/delete", function ( req, res) {
    let task=req.body;
    db.collection('taskslist').deleteOne({task:task.task,status:task.status,priority:task.priority,date:task.date},function (err,obj) {
        res.json(obj);
        console.log(obj);
    })
})

app.post("/updateStatus", function (req,res) {
    let task = req.body;
    if(task.status=="pending")
    {
        var newvalue={$set:{status:"done"}};
        db.collection('taskslist').updateOne({task:task.task,status:task.status,priority:task.priority},newvalue,function (err,r) {
            res.json(r);
        })
    }
    else{
        var newvalue={$set:{status:"pending"}};
        db.collection('taskslist').updateOne({task:task.task,status:task.status,priority:task.priority},newvalue,function (err,r) {
            res.json(r);
        })
    }
})

app.post("/edit", function (req,res) {
    let task=req.body;
    console.log(task);
    var newvalue = {$set:{task:task.new}};
    db.collection('taskslist').updateOne({task:task.task,status:task.status,priority:task.priority,date:task.date},newvalue,function (err,r) {
        res.json(r);
    })
})