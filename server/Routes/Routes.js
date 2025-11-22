const express = require('express');
const router = express.Router();

const { 
  getPosts, getOnePost, getOneMember, getOneProgram, addPost, updatePost, deletePost, 
  getMembers, addMember, updateMember, deleteMember, getOrg, addOrg, updateOrg, deleteOrg, 
  getPrograms, addProgram, updateProgram, deleteProgram, 
  getPartners, getOnePartner, addPartner, updatePartner, deletePartner, 
  getFeedbacks, getOneFeedback, updateFeedback, deleteFeedback, addFeedback, 
  getTestimonies, getOneTestimony, updateTestimony, addTestimony, deleteTestimony 
} = require("../controls/controls");

const { uploadMultiple, uploadLogo, uploadMixed } = require("../middleware/upload");
const { pushUploadedImagesToGitHub } = require("../middleware/gitAutomation");

// Wrapper for multer middleware + controller + git automation
function withUploadAndGit(multerMiddleware, controller) {
  return async (req, res, next) => {
    multerMiddleware(req, res, async (err) => {
      if (err) return next(err);
      try {
        await controller(req, res, next);
        // Call git automation only if multer and controller succeed
        await pushUploadedImagesToGitHub();
      } catch (error) {
        next(error);
      }
    });
  };
}

// Routes without file uploads remain unchanged:
router.get("/cac/", getOrg);
router.delete("/cac/:id", deleteOrg);
router.get("/cac/posts", getPosts);
router.get("/cac/posts/:id", getOnePost);
router.delete("/cac/posts/:id", deletePost);
router.get("/cac/members", getMembers);
router.get("/cac/members/:id", getOneMember);
router.delete("/cac/members/:id", deleteMember);
router.get("/cac/testimonies", getTestimonies);
router.get("/cac/testimonies/:id", getOneTestimony);
router.delete("/cac/testimonies/:id", deleteTestimony);
router.get("/cac/feedbacks", getFeedbacks);
router.get("/cac/feedbacks/:id", getOneFeedback);
router.delete("/cac/feedbacks/:id", deleteFeedback);
router.get("/cac/programs", getPrograms);
router.get("/cac/programs/:id", getOneProgram);
router.delete("/cac/programs/:id", deleteProgram);
router.get("/cac/partners", getPartners);
router.get("/cac/partners/:id", getOnePartner);
router.delete("/cac/partners/:id", deletePartner);

// Routes using multer uploads: wrap controller with multer + git automation
router.post("/cac/", withUploadAndGit(uploadLogo, addOrg));
router.put("/cac/:id", withUploadAndGit(uploadLogo, updateOrg));

router.post("/cac/posts", withUploadAndGit(uploadMultiple, addPost));
router.put("/cac/posts/:id", withUploadAndGit(uploadMultiple, updatePost));

router.post("/cac/members", withUploadAndGit(uploadLogo, addMember));
router.put("/cac/members/:id", withUploadAndGit(uploadLogo, updateMember));

router.post("/cac/programs", withUploadAndGit(uploadMultiple, addProgram));
router.put("/cac/programs/:id", withUploadAndGit(uploadMultiple, updateProgram));

router.post("/cac/partners", withUploadAndGit(uploadLogo, addPartner));
router.put("/cac/partners/:id", withUploadAndGit(uploadLogo, updatePartner));

// Routes without uploads unchanged
router.post("/cac/testimonies", addTestimony);
router.put("/cac/testimonies/:id", updateTestimony);
router.post("/cac/feedbacks", addFeedback);
router.put("/cac/feedbacks/:id", updateFeedback);

module.exports = router;
