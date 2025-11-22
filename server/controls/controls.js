const Post = require('../Models/Posts');
const Org = require('../Models/Organization');
const Member = require('../Models/Members');
const Program = require('../Models/Programs');
const Partner = require('../Models/CacPartners');
const Testimony = require('../Models/Testimonies');
const StudentFeedback = require('../Models/StudentFeedback');
const fs = require('fs-extra');
const path = require('path');

// Helper function to copy uploaded images to client public/images folder
const copyImageToClient = async (filename) => {
  try {
    const sourcePath = path.join(__dirname, '../uploads', filename);
    const clientImagesPath = path.join(__dirname, '../../client/public/images');
    const destPath = path.join(clientImagesPath, filename);
    
    // Ensure client images directory exists
    await fs.ensureDir(clientImagesPath);
    
    // Copy file from server uploads to client public/images
    await fs.copy(sourcePath, destPath);
    
    return `/images/${filename}`;
  } catch (error) {
    console.error('Error copying image to client:', error);
    return `/uploads/${filename}`; // Fallback to original path
  }
};

// Helper function to delete image from client public/images folder
const deleteImageFromClient = async (imagePath) => {
  try {
    if (imagePath && imagePath.startsWith('/images/')) {
      const filename = imagePath.replace('/images/', '');
      const clientImagePath = path.join(__dirname, '../../client/public/images', filename);
      
      // Check if file exists and delete it
      if (await fs.pathExists(clientImagePath)) {
        await fs.remove(clientImagePath);
        console.log(`Deleted image from client: ${filename}`);
      }
    }
  } catch (error) {
    console.error('Error deleting image from client:', error);
  }
};



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
       for (const file of req.files) {
         const imagePath = await copyImageToClient(file.filename);
         logo.push({
           link: imagePath,
           originalName: file.originalname
         });
       }
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
     
     // Handle file uploads for logo (array format)
     let logo = [];
     if (req.files && req.files.length > 0) {
       // Delete old logos if they exist
       if (oldLogo && oldLogo.length > 0) {
         for (const oldLogoItem of oldLogo) {
           await deleteImageFromClient(oldLogoItem.link);
         }
       }
       
       for (const file of req.files) {
         const imagePath = await copyImageToClient(file.filename);
         logo.push({
           link: imagePath,
           originalName: file.originalname
         });
       }
     } else if (req.body.logo) {
       // If no new files but logo data is provided
       try {
         logo = JSON.parse(req.body.logo);
         
         // Find deleted logos and clean them up
         const deletedLogos = oldLogo.filter(oldLogoItem => 
           !logo.some(newLogoItem => newLogoItem.link === oldLogoItem.link)
         );
         
         // Delete removed logos from client folder
         for (const deletedLogo of deletedLogos) {
           await deleteImageFromClient(deletedLogo.link);
         }
       } catch (e) {
         logo = req.body.logo;
       }
     } else if (req.body.logo && Array.isArray(req.body.logo)) {
       // Handle direct JSON logo array (for logo deletion)
       logo = req.body.logo;
       
       // Find deleted logos and clean them up
       const deletedLogos = oldLogo.filter(oldLogoItem => 
         !logo.some(newLogoItem => newLogoItem.link === oldLogoItem.link)
       );
       
       // Delete removed logos from client folder
       for (const deletedLogo of deletedLogos) {
         await deleteImageFromClient(deletedLogo.link);
       }
     } else {
       logo = oldLogo; // Keep existing logo
     }
     
     const updateData = {
       ...req.body,
       logo: logo.length > 0 ? logo : undefined // Only update logo if new files are uploaded or logo data is provided
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
       // Delete all logos from client folder
       for (const logo of org.logo) {
         await deleteImageFromClient(logo.link);
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
       for (const file of req.files) {
         const imagePath = await copyImageToClient(file.filename);
         pics.push({
           link: imagePath,
           originalName: file.originalname
         });
       }
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
     
     // Handle file uploads
     let pics = [];
     if (req.files && req.files.length > 0) {
       for (const file of req.files) {
         const imagePath = await copyImageToClient(file.filename);
         pics.push({
           link: imagePath,
           originalName: file.originalname
         });
       }
     } else if (req.body.pics) {
       // If no new files but pics data is provided (for image deletion)
       try {
         pics = JSON.parse(req.body.pics);
         
         // Find deleted images and clean them up
         const deletedImages = oldPics.filter(oldPic => 
           !pics.some(newPic => newPic.link === oldPic.link)
         );
         
         // Delete removed images from client folder
         for (const deletedImage of deletedImages) {
           await deleteImageFromClient(deletedImage.link);
         }
       } catch (e) {
         pics = req.body.pics;
       }
     } else if (req.body.pics && Array.isArray(req.body.pics)) {
       // Handle direct JSON pics array (for image deletion)
       pics = req.body.pics;
       
       // Find deleted images and clean them up
       const deletedImages = oldPics.filter(oldPic => 
         !pics.some(newPic => newPic.link === oldPic.link)
       );
       
       // Delete removed images from client folder
       for (const deletedImage of deletedImages) {
         await deleteImageFromClient(deletedImage.link);
       }
     }
     
     const updateData = {
       ...req.body,
       pics: pics.length > 0 ? pics : undefined // Only update pics if new files are uploaded or pics data is provided
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
       // Delete all images from client folder
       for (const pic of post.pics) {
         await deleteImageFromClient(pic.link);
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
       for (const file of req.files) {
         const imagePath = await copyImageToClient(file.filename);
         logo.push({
           link: imagePath,
           originalName: file.originalname
         });
       }
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
     
     // Handle file uploads for logo (array format)
     let logo = [];
     if (req.files && req.files.length > 0) {
       // Delete old logos if they exist
       if (oldLogo && oldLogo.length > 0) {
         for (const oldLogoItem of oldLogo) {
           await deleteImageFromClient(oldLogoItem.link);
         }
       }
       
       for (const file of req.files) {
         const imagePath = await copyImageToClient(file.filename);
         logo.push({
           link: imagePath,
           originalName: file.originalname
         });
       }
     } else if (req.body.logo) {
       // If no new files but logo data is provided
       try {
         logo = JSON.parse(req.body.logo);
         
         // Find deleted logos and clean them up
         const deletedLogos = oldLogo.filter(oldLogoItem => 
           !logo.some(newLogoItem => newLogoItem.link === oldLogoItem.link)
         );
         
         // Delete removed logos from client folder
         for (const deletedLogo of deletedLogos) {
           await deleteImageFromClient(deletedLogo.link);
         }
       } catch (e) {
         logo = req.body.logo;
       }
     } else if (req.body.logo && Array.isArray(req.body.logo)) {
       // Handle direct JSON logo array (for logo deletion)
       logo = req.body.logo;
       
       // Find deleted logos and clean them up
       const deletedLogos = oldLogo.filter(oldLogoItem => 
         !logo.some(newLogoItem => newLogoItem.link === oldLogoItem.link)
       );
       
       // Delete removed logos from client folder
       for (const deletedLogo of deletedLogos) {
         await deleteImageFromClient(deletedLogo.link);
       }
     } else {
       logo = oldLogo; // Keep existing logo
     }
     
     const updateData = {
       ...req.body,
       logo: logo.length > 0 ? logo : undefined // Only update logo if new files are uploaded or logo data is provided
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
       // Delete all logos from client folder
       for (const logo of org.logo) {
         await deleteImageFromClient(logo.link);
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
       for (const file of req.files) {
         const imagePath = await copyImageToClient(file.filename);
         logo.push({
           link: imagePath,
           originalName: file.originalname
         });
       }
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
     
     // Handle file uploads for logo (array format)
     let logo = [];
     if (req.files && req.files.length > 0) {
       // Delete old logos if they exist
       if (oldLogo && oldLogo.length > 0) {
         for (const oldLogoItem of oldLogo) {
           await deleteImageFromClient(oldLogoItem.link);
         }
       }
       
       for (const file of req.files) {
         const imagePath = await copyImageToClient(file.filename);
         logo.push({
           link: imagePath,
           originalName: file.originalname
         });
       }
     } else if (req.body.logo) {
       // If no new files but logo data is provided
       try {
         logo = JSON.parse(req.body.logo);
         
         // Find deleted logos and clean them up
         const deletedLogos = oldLogo.filter(oldLogoItem => 
           !logo.some(newLogoItem => newLogoItem.link === oldLogoItem.link)
         );
         
         // Delete removed logos from client folder
         for (const deletedLogo of deletedLogos) {
           await deleteImageFromClient(deletedLogo.link);
         }
       } catch (e) {
         logo = req.body.logo;
       }
     } else if (req.body.logo && Array.isArray(req.body.logo)) {
       // Handle direct JSON logo array (for logo deletion)
       logo = req.body.logo;
       
       // Find deleted logos and clean them up
       const deletedLogos = oldLogo.filter(oldLogoItem => 
         !logo.some(newLogoItem => newLogoItem.link === oldLogoItem.link)
       );
       
       // Delete removed logos from client folder
       for (const deletedLogo of deletedLogos) {
         await deleteImageFromClient(deletedLogo.link);
       }
     } else {
       logo = oldLogo; // Keep existing logo
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
      logo: logo.length > 0 ? logo : undefined,
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
       // Delete all logos from client folder
       for (const logo of org.logo) {
         await deleteImageFromClient(logo.link);
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
       for (const file of req.files) {
         const imagePath = await copyImageToClient(file.filename);
         pics.push({
           link: imagePath,
           originalName: file.originalname
         });
       }
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
     
     // Handle file uploads
     let pics = [];
     if (req.files && req.files.length > 0) {
       for (const file of req.files) {
         const imagePath = await copyImageToClient(file.filename);
         pics.push({
           link: imagePath,
           originalName: file.originalname
         });
       }
     } else if (req.body.pics) {
       // If no new files but pics data is provided (for image deletion)
       try {
         pics = JSON.parse(req.body.pics);
         
         // Find deleted images and clean them up
         const deletedImages = oldPics.filter(oldPic => 
           !pics.some(newPic => newPic.link === oldPic.link)
         );
         
         // Delete removed images from client folder
         for (const deletedImage of deletedImages) {
           await deleteImageFromClient(deletedImage.link);
         }
       } catch (e) {
         pics = req.body.pics;
       }
     } else if (req.body.pics && Array.isArray(req.body.pics)) {
       // Handle direct JSON pics array (for image deletion)
       pics = req.body.pics;
       
       // Find deleted images and clean them up
       const deletedImages = oldPics.filter(oldPic => 
         !pics.some(newPic => newPic.link === oldPic.link)
       );
       
       // Delete removed images from client folder
       for (const deletedImage of deletedImages) {
         await deleteImageFromClient(deletedImage.link);
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
      pics: pics.length > 0 ? pics : undefined,
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
       // Delete all images from client folder
       for (const pic of post.pics) {
         await deleteImageFromClient(pic.link);
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