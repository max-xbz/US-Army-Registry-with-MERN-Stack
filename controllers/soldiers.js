const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const router = express.Router();
const Soldier = require('../models/Soldier');
const deleteOne = require('../Queries/deleteOne');
const saveOne = require('../Queries/saveOne');
const getOne = require('../Queries/getOne');
const updateOne = require('../Queries/updateOne');
//define middle to upload file
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/../uploads');
    },
    filename: function (req, file, cb) {
        let id = mongoose.Types.ObjectId();
        if(req.params.id){
            // console.log(req.params.id);
            id = req.params.id;
        }
        req.body.id = id;
        let fileName = `${id}-${Date.now()}.jpg`;
        req.body.fileName = fileName;
        cb(null, fileName)
    }
});
let upload = multer({ storage: storage });

/**
 * GET /
 * skip
 * limit
 * term
 * sort_by  e.g. sort by name
 * order
 */
router.get('/', (req, res) => {
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    
    //search info
    let searchInfo = {};
    if(req.query.term) {
        let term = req.query.term;
        let searchItems = [
            {name: {$regex : `.*${term}.*`, $options: 'i'}}
        ];
        searchInfo = {$or: searchItems};
    }
    //sort info
    let sortInfo = { createdAt: -1 };
    if(req.query.sort_by) {
        sortInfo = { [req.query.sort_by]: parseInt(req.query.order)};
    }
    Soldier.find(searchInfo)
        .populate('superior')
        .sort(sortInfo)
        .skip(skip)
        .limit(limit)
        .then((docs)=>{
            if(docs.length === 0) {
                res.json("Sorry no results");
            } else {
                res.status(200).json(docs);
            }
        })
        .catch((err)=>{
            res.json(err);
        });
});

router.get('/subordinates/:id', (req, res) => {
    let id = req.params.id;
    Soldier.find({superior: id})
        .populate('superior')
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {
            console.log(err);
        });
});
//get all superiors of current target
async function getAvailableSuperiors(target) {
    let result = [];
    let children = [];
    let q = [];
    children.push(target._id);
    q.push(target._id);
    try {
        while(q.length > 0) {
            ele = q.pop();
            const nextChildren = await Soldier.find({superior: ele});
            nextChildren.map((item)=>{
                q.push(item._id);
                children.push(item._id);
            });
        }
        const res = await Soldier.find({ _id: { $nin: children }});
        result = res;
    } catch(e) {
        console.log(e);
    }
    return result;
}
router.get('/superiors/:id', (req, res) => {
    let id = req.params.id;
    Soldier.findById(id)
        .then((doc) => {
            return getAvailableSuperiors(doc);
        })
        .then((items) => {
            res.json(items);
        })
        .catch((err) => {
            console.log(err);
        });
});
router.get('/superiors', (req, res) => {
    Soldier.find()
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            console.log(err);
        });
});
router.get('/:id', (req, res) => {
    let id = req.params.id;
    getOne(id)
        .then((doc) => {
            res.json(doc);
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post('/', upload.single('image'), (req, res) => {
    //after save the new soldier, we need to update its superior's children info
    let soldier = req.body;
    let superior = null;
    if(soldier.superior !== 'null') {
        superior = soldier.superior;
    }
    let createSoldier = new Soldier({
        _id : soldier.id,
        name: soldier.name,
        rank: soldier.rank,
        sex: soldier.sex,
        startDate: soldier.startDate,
        phone: soldier.phone,
        email: soldier.email,
        superior: superior,
        children: [],
        image: soldier.fileName ? soldier.fileName : '',
        createdAt: new Date()
    });
    saveOne(createSoldier)
        .then((doc) => {
            res.json(doc);
        })
        .catch((err)=> {
            console.log(err);
        });
});
router.put('/:id', upload.single('image'), (req, res) => {
    let id = req.params.id;
    let updateInfo = req.body;
    updateOne(id, updateInfo)
        .then((doc) => {
            console.log("===========");
            console.log(doc);
            return Soldier.findById(doc._id).populate('superior'); 
        })
        .then(doc=>{
            res.json(doc);
        })
        .catch((err) => {
            console.log(err);
        });
});

//delete one 
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    deleteOne(id)
        .then((doc) => {
            res.json(doc);
        })
        .catch((err)=> {
            console.log(err);
        });
});
module.exports = router;