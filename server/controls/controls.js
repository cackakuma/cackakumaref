const cloudinary = require('cloudinary').v2;
const Post = require('../Models/Posts');
const Org = require('../Models/Organization');
const Member = require('../Models/Members');
const Program = require('../Models/Programs');
const Partner = require('../Models/CacPartners');
const Testimony = require('../Models/Testimonies');
const StudentFeedback = require('../Models/StudentFeedback');
const path = require('path');



const getPartners = async (req,res) =>{
   const partner = await Partner.find();
   res.json(partner);
};


const getOnePartner = async (req,res) => {
  const found = await Partner.findOne();
  res.json(found)
}

const addPartner = async (req,res) =>{
   try {
     // Handle file uploads for logo (array format)
     let logo = [];
     if (req.files && req.files.length > 0) {
       logo = req.files.map(file => ({
         link: file.path, // The Cloudinary URL
         originalName: file.originalname,
         public_id: file.filename // The public_id for deletion
       }));
     }
     
     const orgData = {
       ...req.body,
       logo: logo
     };
     
     const org = new Partner(orgData);
     await org.save();
     res.json(org);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};

const updatePartner = async (req,res) =>{
   try {
     // Get the current org to compare logo
     const currentOrg = await Partner.findById(req.params.id);
     const oldLogo = currentOrg ? currentOrg.logo : [];
     
     let newLogo = [];
     if (req.files && req.files.length > 0) {
      newLogo = req.files.map(file => ({
        link: file.path,
        originalName: file.originalname,
        public_id: file.filename
      }));
     }

    let currentLogo = [];
    if(req.body.logo) {
      try {
        currentLogo = JSON.parse(req.body.logo);
      } catch (e) {
        currentLogo = req.body.logo;
      }
    }

    const allLogo = [...currentLogo, ...newLogo];

    // Find deleted logos and clean them up
    const deletedLogos = oldLogo.filter(oldLogoItem =>
      !allLogo.some(newLogoItem => newLogoItem.link === oldLogoItem.link)
    );
    
    for (const deletedLogo of deletedLogos) {
      if (deletedLogo.public_id) {
        await cloudinary.uploader.destroy(deletedLogo.public_id);
      }
    }

     const updateData = {
       ...req.body,
       logo: allLogo.length > 0 ? allLogo : []
     };
     
     // Remove undefined values
     Object.keys(updateData).forEach(key => {
       if (updateData[key] === undefined) {
         delete updateData[key];
       }
     });
     
     const org = await Partner.findByIdAndUpdate(req.params.id, updateData, {new : true});
     res.json(org);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};
const deletePartner = async (req,res) =>{
   try {
     // Get the org first to clean up logos
     const org = await Partner.findById(req.params.id);
     
     if (org && org.logo && org.logo.length > 0) {
       // Delete all logos from Cloudinary
       for (const logo of org.logo) {
         if (logo.public_id) {
           await cloudinary.uploader.destroy(logo.public_id);
         }
       }
     }
     
     // Delete the org from database
     await Partner.findByIdAndDelete(req.params.id);
     res.json({message: "Organization deleted successfully"});
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};




const getFeedbacks = async (req,res) =>{
   const feed = await StudentFeedback.find();
   res.json(feed);
};


const getOneFeedback = async (req,res) => {
  const found = await StudentFeedback.findOne();
  res.json(found)
}

const addFeedback = async (req,res) =>{
   const feedback = new StudentFeedback(req.body);
   await feedback.save();
   res.json(feedback);
};


const updateFeedback = async (req,res) =>{
   const feedback = await StudentFeedback.findByIdAndUpdate(req.params.id, req.body, {new : true});
   res.json(feedback);
};

const deleteFeedback = async (req,res) =>{
   await StudentFeedback.findByIdAndDelete(req.params.id);
   res.json({message: "Posts already Deleted"});
};




const getTestimonies = async (req,res) =>{
   const testify = await Testimony.find();
   res.json(testify);
};

const getOneTestimony = async (req,res) => {
  const found = await Testimony.findOne();
  res.json(found)
}

const addTestimony = async (req,res) =>{
   const testify = new Testimony(req.body);
   await testify.save();
   res.json(testify);
};


const updateTestimony = async (req,res) =>{
   const testify = await Testimony.findByIdAndUpdate(req.params.id, req.body, {new : true});
   res.json(testify);
};

const deleteTestimony = async (req,res) =>{
   await Testimony.findByIdAndDelete(req.params.id);
   res.json({message: "Posts already Deleted"});
};


const getPosts = async (req,res) =>{
   const post = await Post.find();
   res.json(post);
};

const getOnePost = async (req,res) => {
  const found = await Post.findOne();
  res.json(found)
}

const addPost = async (req,res) =>{
   try {
     // Handle file uploads
     let pics = [];
     if (req.files && req.files.length > 0) {
       pics = req.files.map(file => ({
         link: file.path, // The Cloudinary URL
         originalName: file.originalname,
         public_id: file.filename // The public_id for deletion
       }));
     }
     
     const postData = {
       ...req.body,
       pics: pics
     };
     
     const post = new Post(postData);
     await post.save();
     res.json(post);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};


const updatePost = async (req,res) =>{
   try {
     // Get the current post to compare images
     const currentPost = await Post.findById(req.params.id);
     const oldPics = currentPost ? currentPost.pics : [];
     
     let newPics = [];
     if (req.files && req.files.length > 0) {
      newPics = req.files.map(file => ({
        link: file.path,
        originalName: file.originalname,
        public_id: file.filename
      }));
     }

    let currentPics = [];
    if(req.body.pics) {
      try {
        currentPics = JSON.parse(req.body.pics);
      } catch (e) {
        currentPics = req.body.pics;
      }
    }

    const allPics = [...currentPics, ...newPics];

    // Find deleted images and clean them up
    const deletedImages = oldPics.filter(oldPic => 
      !allPics.some(newPic => newPic.link === oldPic.link)
    );
    
    for (const deletedImage of deletedImages) {
      if (deletedImage.public_id) {
        await cloudinary.uploader.destroy(deletedImage.public_id);
      }
    }

     const updateData = {
       ...req.body,
       pics: allPics.length > 0 ? allPics : []
     };
     
     // Remove undefined values
     Object.keys(updateData).forEach(key => {
       if (updateData[key] === undefined) {
         delete updateData[key];
       }
     });
     
     const post = await Post.findByIdAndUpdate(req.params.id, updateData, {new : true});
     res.json(post);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};

const deletePost= async (req,res) =>{
   try {
     // Get the post first to clean up images
     const post = await Post.findById(req.params.id);
     
     if (post && post.pics) {
       // Delete all images from Cloudinary
       for (const pic of post.pics) {
         if (pic.public_id) {
           await cloudinary.uploader.destroy(pic.public_id);
         }
       }
     }
     
     // Delete the post from database
     await Post.findByIdAndDelete(req.params.id);
     res.json({message: "Post deleted successfully"});
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};


const getMembers = async (req,res) =>{
   const org = await Member.find();
   res.json(org);
};
const getOneMember = async (req, res) =>{
  const found = await Member.findOne();
  res.json(found);
};
const addMember = async (req,res) =>{
   try {
     // Handle file uploads for logo (array format)
     let logo = [];
     if (req.files && req.files.length > 0) {
       logo = req.files.map(file => ({
         link: file.path, // The Cloudinary URL
         originalName: file.originalname,
         public_id: file.filename // The public_id for deletion
       }));
     }
     
     const memberData = {
       ...req.body,
       logo: logo
     };
     
     const member = new Member(memberData);
     await member.save();
     res.json(member);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};
const updateMember = async (req,res) =>{
   try {
     // Get the current org to compare logo
     const currentOrg = await Member.findById(req.params.id);
     const oldLogo = currentOrg ? currentOrg.logo : [];
     
     let newLogo = [];
     if (req.files && req.files.length > 0) {
      newLogo = req.files.map(file => ({
        link: file.path,
        originalName: file.originalname,
        public_id: file.filename
      }));
     }

    let currentLogo = [];
    if(req.body.logo) {
      try {
        currentLogo = JSON.parse(req.body.logo);
      } catch (e) {
        currentLogo = req.body.logo;
      }
    }

    const allLogo = [...currentLogo, ...newLogo];

    // Find deleted logos and clean them up
    const deletedLogos = oldLogo.filter(oldLogoItem =>
      !allLogo.some(newLogoItem => newLogoItem.link === oldLogoItem.link)
    );
    
    for (const deletedLogo of deletedLogos) {
      if (deletedLogo.public_id) {
        await cloudinary.uploader.destroy(deletedLogo.public_id);
      }
    }

     const updateData = {
       ...req.body,
       logo: allLogo.length > 0 ? allLogo : []
     };
     
     // Remove undefined values
     Object.keys(updateData).forEach(key => {
       if (updateData[key] === undefined) {
         delete updateData[key];
       }
     });
     
     const org = await Member.findByIdAndUpdate(req.params.id, updateData, {new : true});
     res.json(org);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};
const deleteMember = async (req,res) =>{
   try {
     // Get the org first to clean up logos
     const org = await Member.findById(req.params.id);
     
     if (org && org.logo && org.logo.length > 0) {
       // Delete all logos from Cloudinary
       for (const logo of org.logo) {
         if (logo.public_id) {
           await cloudinary.uploader.destroy(logo.public_id);
         }
       }
     }
     
     // Delete the org from database
     await Member.findByIdAndDelete(req.params.id);
     res.json({message: "Organization deleted successfully"});
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};


const getOrg = async (req,res) =>{
   const org = await Org.find();
   res.json(org);
};
const addOrg = async (req,res) =>{
   try {
     // Handle file uploads for logo (array format)
     let logo = [];
     if (req.files && req.files.length > 0) {
       logo = req.files.map(file => ({
         link: file.path, // The Cloudinary URL
         originalName: file.originalname,
         public_id: file.filename // The public_id for deletion
       }));
     }
     
    let integrity = [];
    if (req.body && req.body.integrity) {
      if (typeof req.body.integrity === 'string') {
        try { integrity = JSON.parse(req.body.integrity); } catch { integrity = []; }
      } else if (Array.isArray(req.body.integrity)) {
        integrity = req.body.integrity;
      }
    }

    
    const orgData = {
      ...req.body,
      logo: logo,
      integrity
    };
     
     const org = new Org(orgData);
     await org.save();
     res.json(org);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};
const updateOrg = async (req,res) =>{
   try {
     // Get the current org to compare logo
     const currentOrg = await Org.findById(req.params.id);
     const oldLogo = currentOrg ? currentOrg.logo : [];
     
     let newLogo = [];
     if (req.files && req.files.length > 0) {
      newLogo = req.files.map(file => ({
        link: file.path,
        originalName: file.originalname,
        public_id: file.filename
      }));
     }

    let currentLogo = [];
    if(req.body.logo) {
      try {
        currentLogo = JSON.parse(req.body.logo);
      } catch (e) {
        currentLogo = req.body.logo;
      }
    }

    const allLogo = [...currentLogo, ...newLogo];

    // Find deleted logos and clean them up
    const deletedLogos = oldLogo.filter(oldLogoItem =>
      !allLogo.some(newLogoItem => newLogoItem.link === oldLogoItem.link)
    );
    
    for (const deletedLogo of deletedLogos) {
      if (deletedLogo.public_id) {
        await cloudinary.uploader.destroy(deletedLogo.public_id);
      }
    }
    
    let integrity = undefined;
    if (req.body && req.body.integrity !== undefined) {
      if (typeof req.body.integrity === 'string') {
        try { integrity = JSON.parse(req.body.integrity); } catch { integrity = []; }
      } else if (Array.isArray(req.body.integrity)) {
        integrity = req.body.integrity;
      }
    }

    const updateData = {
      ...req.body,
      logo: allLogo.length > 0 ? allLogo : [],
      integrity
    };
     
     // Remove undefined values
     Object.keys(updateData).forEach(key => {
       if (updateData[key] === undefined) {
         delete updateData[key];
       }
     });
     
     const org = await Org.findByIdAndUpdate(req.params.id, updateData, {new : true});
     res.json(org);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};
const deleteOrg = async (req,res) =>{
   try {
     // Get the org first to clean up logos
     const org = await Org.findById(req.params.id);
     
     if (org && org.logo && org.logo.length > 0) {
       // Delete all logos from Cloudinary
       for (const logo of org.logo) {
         if (logo.public_id) {
           await cloudinary.uploader.destroy(logo.public_id);
         }
       }
     }
     
     // Delete the org from database
     await Org.findByIdAndDelete(req.params.id);
     res.json({message: "Organization deleted successfully"});
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};


const getPrograms = async (req,res) =>{
   const program = await Program.find();
   res.json(program);
};

const getOneProgram = async (req,res) => {
  const found = await Program.findOne();
  res.json(found)
};


const addProgram = async (req,res) =>{
   try {
     // Handle file uploads
     let pics = [];
     if (req.files && req.files.length > 0) {
       pics = req.files.map(file => ({
         link: file.path, // The Cloudinary URL
         originalName: file.originalname,
         public_id: file.filename // The public_id for deletion
       }));
     }
     
     let programBenefits = [];
     let communityImpact = [];
     if (req.body && req.body.programBenefits) {
       if (typeof req.body.programBenefits === 'string') {
         try { programBenefits = JSON.parse(req.body.programBenefits); } catch { programBenefits = []; }
       } else if (Array.isArray(req.body.programBenefits)) {
         programBenefits = req.body.programBenefits;
       }
     }
     if (req.body && req.body.communityImpact) {
       if (typeof req.body.communityImpact === 'string') {
         try { communityImpact = JSON.parse(req.body.communityImpact); } catch { communityImpact = []; }
       } else if (Array.isArray(req.body.communityImpact)) {
         communityImpact = req.body.communityImpact;
       }
     }

     const postData = {
       ...req.body,
       pics: pics,
       programBenefits,
       communityImpact
     };
     
     const post = new Program(postData);
     await post.save();
     res.json(post);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};


const updateProgram = async (req,res) =>{
   try {
     // Get the current post to compare images
     const currentPost = await Program.findById(req.params.id);
     const oldPics = currentPost ? currentPost.pics : [];
     
     let newPics = [];
     if (req.files && req.files.length > 0) {
      newPics = req.files.map(file => ({
        link: file.path,
        originalName: file.originalname,
        public_id: file.filename
      }));
     }

    let currentPics = [];
    if(req.body.pics) {
      try {
        currentPics = JSON.parse(req.body.pics);
      } catch (e) {
        currentPics = req.body.pics;
      }
    }

    const allPics = [...currentPics, ...newPics];

    // Find deleted images and clean them up
    const deletedImages = oldPics.filter(oldPic => 
      !allPics.some(newPic => newPic.link === oldPic.link)
    );
    
    for (const deletedImage of deletedImages) {
      if (deletedImage.public_id) {
        await cloudinary.uploader.destroy(deletedImage.public_id);
      }
    }
     
    let programBenefits = undefined;
    let communityImpact = undefined;
    if (req.body && req.body.programBenefits !== undefined) {
      if (typeof req.body.programBenefits === 'string') {
        try { programBenefits = JSON.parse(req.body.programBenefits); } catch { programBenefits = []; }
      } else if (Array.isArray(req.body.programBenefits)) {
        programBenefits = req.body.programBenefits;
      }
    }
    if (req.body && req.body.communityImpact !== undefined) {
      if (typeof req.body.communityImpact === 'string') {
        try { communityImpact = JSON.parse(req.body.communityImpact); } catch { communityImpact = []; }
      } else if (Array.isArray(req.body.communityImpact)) {
        communityImpact = req.body.communityImpact;
      }
    }

    const updateData = {
      ...req.body,
      pics: allPics.length > 0 ? allPics : [],
      programBenefits,
      communityImpact
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
     
     const post = await Program.findByIdAndUpdate(req.params.id, updateData, {new : true});
     res.json(post);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};

const deleteProgram = async (req,res) =>{
   try {
     // Get the post first to clean up images
     const post = await Program.findById(req.params.id);
     
     if (post && post.pics) {
       // Delete all images from Cloudinary
       for (const pic of post.pics) {
         if (pic.public_id) {
           await cloudinary.uploader.destroy(pic.public_id);
         }
       }
     }
     
     // Delete the post from database
     await Program.findByIdAndDelete(req.params.id);
     res.json({message: "Post deleted successfully"});
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
};




module.exports = {getPosts, getOnePost, getOneMember, getOneProgram,addPost, updatePost, deletePost, getMembers, addMember, updateMember, deleteMember, getOrg, addOrg, updateOrg, deleteOrg, getPrograms, addProgram, updateProgram, deleteProgram, getPartners, getOnePartner, addPartner, updatePartner, deletePartner, getFeedbacks, getOneFeedback, updateFeedback, deleteFeedback, addFeedback, getTestimonies,getOneTestimony, updateTestimony, addTestimony, deleteTestimony};