const express = require('express');
const router = express.Router();
const { addFile, getRightData, getFiles, getAllStoryIds, filter } = require("../controllers/controller");

router.route("/file")
      .post(addFile)
      .get(getFiles)
    
router.route("/rightData/:requestId")
      .get(getRightData)

router.route("/storyId")
      .post(getAllStoryIds)

router.route("/filter")
      .post(filter)
      
module.exports = router;