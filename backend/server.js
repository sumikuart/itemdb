const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const myRoutes  = express.Router()
const PORT = 4864;



app.use(cors());
app.use(bodyParser.json());
app.use('',myRoutes);

app.listen(PORT, function(){
    console.log('Server Connected to port: ' + PORT)
})


mongoose.connect('mongodb://127.0.0.1:27017/itemdb', {useNewUrlParser: true});

const connection = mongoose.connection;

let itemList = require('./model/item.model.js');

// -------------------------------------------------------------

// Få alt indhold:

myRoutes.route('/').get(function(req, res){

    itemList.find(function(err, currentItem){
        
        if(err){
            console.log('An Error has been detected at - get all - route("/")');
        } else {
            res.json(currentItem);
        }

    })
})

// Få indhold baseret på ID

myRoutes.route('/:id').get(function(req,res){

    let id=req.params.id;
    itemList.findById(id, function(err, currentItem){

        if(err){
            console.log('An Error has been detected at - get by id - route("/:id")');
        } else {
            res.json(currentItem);
        }

    })
})


// Delete indhold baseret på ID: 

myRoutes.delete('/delete/:id', function(req, res){
    itemList.findByIdAndRemove(req.params.id, (err, item) => {

        if(err){
            console.log('An Error has been detected at - delete by id - route("/delete/:id")')
            return res.status(500).send('An Error has been detected at - delete by id status(500)- route("/delete/:id")')
        }
        const response ={
            massage: 'Item from itemdb has been deleted',
            id:item._id
        }

        return res.status(200).send(response)
    })
})


// Tilføre til itemdb

myRoutes.route('/additem').post(function(req, res){

    let itemUserData = new itemList(req.body);

    itemUserData.save().then(n => {
        res.status(200).json('item Added')
    }).catch(err => {
        res.status(400).send('an Error has accured in -add item- ')
    })
})

// Redigere item fra itemdb

myRoutes.route('/update/:id').put(function(req,res){
    
    itemList.findById(req.params.id, function(err, currentItem){

        if(!currentItem){
            res.status(400).send('an Error has accured in -update Item- ')
        } else {

            currentItem.item_name = req.body.item_name;
            currentItem.item_Description = req.body.item_Description;
            currentItem.item_price = req.body.item_price;
            currentItem.item_photo = req.body.item_photo;

            currentItem.save().then(currentItem => {
                res.json('item updated')
            }).catch(err => {
                res.status(400).send('an Error has accured in -update Item- set Value part ')
            })
        }
    })

})


// ------------------------------ BILLEDE UPLOAD:

var storagevar = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb){
        cb(null,file.originalname)
    }
});


// Sætter vi uploade single functionen op. den høre til singeluploade.component:
var upload = multer({ storage:storagevar}).single('file');

// forbinder med frontend:
app.post('/uploadeimg/:id', function(req, res){
    upload(req, res, function(err){
        if(err){
            console.log('An error has accurd in upload post function');
            return res.status(500).json(err)
        }

        return res.status(200).send(req.file)
    })
})
