const Blog = require("../Model/Blog");
const express = require("express");
const multer = require("multer");
const path = require("path");
const { authentication } = require("../Middleware/middleware");


const router = express.Router();


//multer for storing BlogImages
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./BlogImages"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

//get all blog or blog by category
router.get("/", authentication, async (req, res) => {
  try {
    const  Category  = req.query.Category;
    console.log(Category)

    const filter = {};

    if (Category) {
      filter.Category = Category.trim();
    }
                                                                                                                       
    console.log("Filter being used:", filter);
    const allblog = await Blog.find(filter).populate("CreatedBy", "name");
    res.status(200).json({ success: true, User: req.user, blog: allblog });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Get for open specific blog
router.get("/:id", authentication, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "CreatedBy",
      "name"
    );
    if (!blog) {
      return res.status(400).json({ message: "Blog not Found" });
    }

    res.status(200).json({
      success: true,
      blog: blog,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//create blog
router.post(
  "/createBlog",
  authentication,
  upload.single("BlogImages"),
  async (req, res) => {
    const { Title, Description, Category } = req.body;

    const newblog = await Blog.create({
      Title,
      Description,
      Category,
      CreatedBy: req.user._id,
      BlogImageUrl: `BlogImages/${req.file.filename}`,
    })

    return res.status(201).json({
      success: true,
      blog: newblog,
      message:"Blog is updated"
    });
  }
);

//delete blog

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({
      success: true,
      blog: blog,
      message:"Blog is deleted"
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//update blog
router.put("/:id",authentication,
  upload.single("BlogImages"), async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id)

    const { Title, Description, Category } = req.body;
    const updateBlog = {};

    if (Title) {
      updateBlog.Title = Title;
    }
    if (Description) {
      updateBlog.Description = Description;
    }
    if (Category) {
      updateBlog.Category = Category;
    }
    if (req.file) {
      updateBlog.BlogImageUrl = `BlogImages/${req.file.filename}`;
    }
    console.log(updateBlog)
    

    const blog = await Blog.findByIdAndUpdate(id, updateBlog, { new: true }).populate(
      "CreatedBy",
      "name"
    );
    console.log(blog)
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({
      success: true,
      blog: blog,
      message:"Blog is created"
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
