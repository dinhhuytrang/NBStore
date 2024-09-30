const express = require('express');
const tagRouter = express.Router();
const {TagController} = require('../controllers');

// GET all tags
tagRouter.get('/get-all', TagController.getAllTags);

// GET a single tag by ID
tagRouter.get('/get-details/:id', TagController.getTagById);

// POST create a new tag
tagRouter.post('/create', TagController.createTag);

// PUT update a tag by ID
tagRouter.put('/update/:id', TagController.updateTag);

// DELETE delete a tag by ID
tagRouter.delete('/delete/:id', TagController.deleteTag);

module.exports = tagRouter;
