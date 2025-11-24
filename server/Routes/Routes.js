const express = require('express');
const {getPosts, getOnePost, getOneMember, getOneProgram,addPost, updatePost, deletePost, getMembers, addMember, updateMember, deleteMember, getOrg, addOrg, updateOrg, deleteOrg, getPrograms, addProgram, updateProgram, deleteProgram, getPartners, getOnePartner, addPartner, updatePartner, deletePartner, getFeedbacks, getOneFeedback, updateFeedback, deleteFeedback, addFeedback, getTestimonies,getOneTestimony, updateTestimony, addTestimony, deleteTestimony} = require("../controls/controls");
const {uploadMultiple, uploadLogo} = require("../middleware/upload");
const router = express.Router();


router.get("/cac/", getOrg);
router.post("/cac/", uploadLogo, addOrg);
router.put("/cac/:id", uploadLogo, updateOrg);
router.delete("/cac/:id", deleteOrg);

router.get("/cac/posts", getPosts);
router.get("/cac/posts/:id", getOnePost);
router.post("/cac/posts", uploadMultiple, addPost);
router.put("/cac/posts/:id", uploadMultiple, updatePost);
router.delete("/cac/posts/:id", deletePost);

router.get("/cac/members", getMembers);
router.get("/cac/members/:id", getOneMember);
router.post("/cac/members", uploadLogo, addMember);
router.put("/cac/members/:id", uploadLogo, updateMember);
router.delete("/cac/members/:id", deleteMember);

router.get("/cac/testimonies", getTestimonies);
router.get("/cac/testimonies/:id", getOneTestimony);
router.post("/cac/testimonies", addTestimony);
router.put("/cac/testimonies/:id", updateTestimony);
router.delete("/cac/testimonies/:id", deleteTestimony);


router.get("/cac/feedbacks", getFeedbacks);
router.get("/cac/feedbacks/:id", getOneFeedback);
router.post("/cac/feedbacks", addFeedback);
router.put("/cac/feedbacks/:id", updateFeedback);
router.delete("/cac/feedbacks/:id", deleteFeedback);



router.get("/cac/programs", getPrograms);
router.get("/cac/programs/:id", getOneProgram);
router.post("/cac/programs", uploadMultiple, addProgram);
router.put("/cac/programs/:id", uploadMultiple, updateProgram);
router.delete("/cac/programs/:id", deleteProgram);


router.get("/cac/partners", getPartners);
router.get("/cac/partners/:id", getOnePartner);
router.post("/cac/partners", uploadLogo, addPartner);
router.put("/cac/partners/:id", uploadLogo, updatePartner);
router.delete("/cac/partners/:id", deletePartner);


module.exports = router;