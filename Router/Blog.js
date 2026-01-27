const express = require("express");
const { authentication } = require("../Middleware/middleware");
const {upload}=require("../Utils/Multer");

const {handleGetBlog, handleGetBlogById,
    handleCreateBlog,handleDeleteBlog,handleUpdateBlog} =require("../Controller/Blog")

const router = express.Router();

///////////////////  Get Blog  ////////////////////////

router.get("/", authentication,handleGetBlog);

///////////////////  Get Blog By ID  ////////////////////////

router.get("/:id", authentication,handleGetBlogById);


///////////////////  Create Blog  ////////////////////////

router.post(
  "/createBlog",
  authentication,
  upload.single("BlogImageUrl"),handleCreateBlog)

///////////////////  Update Blog  ////////////////////////

router.put(
  "/:id",
  authentication,
  upload.single("BlogImageUrl"),handleUpdateBlog)



///////////////////  Delete Blog  ////////////////////////

router.delete("/:id", authentication, handleDeleteBlog)




module.exports=router

