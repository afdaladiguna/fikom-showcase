const express = require('express');
const router = express.Router();
const { isLoggedIn, validateProject, isAuthor } = require('../middleware');
const projects = require('../controllers/projects');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Project = require('../models/project');

router
  .route('/')
  .get(catchAsync(projects.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateProject,
    catchAsync(projects.createProject)
  );

router.get('/new', isLoggedIn, projects.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(projects.showProject))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateProject,
    catchAsync(projects.updateProject)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(projects.deleteProject));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(projects.renderEditForm)
);

module.exports = router;
