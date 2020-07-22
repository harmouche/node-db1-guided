const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

// /api/posts
router.get('/', (req, res) => {
// SELECT * FROM posts
db.select('*')
  .from('posts')
  .then( (postArray) => res.status(200).json({ data: postArray }))
  .catch( (error) => console.log(error))
});

router.get('/:id', (req, res) => {
const { id } = req.params;
// SELECT * FROM posts WHERE id = id;
db('posts')   // different way of typing db.select('*') Also below different ways to type .where
    // .where("id", "=", id)
    // .where({id : id})  best used whith multiple parameters (and, or)
    // .where("id", id)
    .where({id})
    .first() //if you expect only one result, it will pull the result in an object instead of an array of objects
    .then(post => res.status(200).json({ data: post }))
    .catch( (error) => console.log(error))

});

router.post('/', (req, res) => {
    const postData = req.body;
    //INSERT INTO posts (fields...) VALUES (values)
    db('posts')
    .insert(postData)
    .then(id => res.status(201).json({data: id}))
    .catch((error) => console.log(error))
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    // UPDATE posts SET field = new value WHERE id = id;
    db('posts')
     .where({ id })
     .update(changes)
     .then(count => {
         if (count > 0) {
             res.status(200).json({ data: count});
         } else {
             res.status(404).json({ message: "there was no record to udpate"})
         }
     })
     .catch((error) => console.log(error))
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    // DELETE posts WHERE id = id;
    db('posts')
     .where({ id })
     .del()
     .then(count => {
         if (count > 0) {
             res.status(200).json({ data: count});
         } else {
             res.status(404).json({ message: "there was no record to deleted"})
         }
     })
     .catch((error) => console.log(error))

});

module.exports = router;