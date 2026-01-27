const { isErrored } = require("stream");
const Blog = require("../Model/Blog");
const path = require("path");
const fs = require("fs/promises");

////////////////////      get all blog or blog by category  /////////////////////
async function handleGetBlog(req, res) {
  try {
    console.log("get blog hit");
    const Category = req.query.Category;
    console.log(Category);

    const filter = {};

    if (Category) {
      filter.Category = Category.trim();
    }

    console.log("Filter being used:", filter);
    const allblog = await Blog.find(filter);

    if (allblog.length === 0) {
      return res.status(200).json({
        success: true,
        blog: [],
        message: "No blogs found",
      });
    }

    const blogsWithUrl = allblog.map((blog) => ({
      ...blog._doc,
      BlogImageUrl: `http://localhost:8000/BlogImages/${path.basename(
        blog.BlogImageUrl,
      )}`,
    }));

    res.status(200).json({ success: true, blog: blogsWithUrl });
  } catch (error) {
    console.log("GET BLOG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
}

//////////////////////  Get for open specific blog  /////////////////////
async function handleGetBlogById(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(400).json({ message: "Blog not Found" });
    }

    const blogWithUrl = {
      ...blog._doc,
      BlogImageUrl: blog.BlogImageUrl
        ? `http://localhost:8000/BlogImages/${path.basename(blog.BlogImageUrl)}`
        : null,
    };

    res.status(200).json({
      success: true,
      blog: blogWithUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "get by id Server Error" });
  }
}

////////////////////   create blog    //////////////////////////

async function handleCreateBlog(req, res) {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const { Title, Description, Category } = req.body;

    const newblog = await Blog.create({
      Title,
      Description,
      Category,
      CreatedBy: req.user.name,
      BlogImageUrl: `http://localhost:8000/BlogImages/${req.file.filename}`,
    });
    return res.status(201).json({
      success: true,
      blog: newblog,
      message: "Blog is made successfully",
    });
  } catch (error) {
    {
      console.log("error is", error);

      res.status(500).json({ message: "blod create Server Error" });
    }
  }
}

//////////////////////     delete blog   /////////////////////////

async function handleDeleteBlog(req, res) {
  try {
    const id = req.params.id;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    console.log(path.basename(blog.BlogImageUrl));
    const imagePath = path.join(
      __dirname,
      "..",
      "BlogImages",
      path.basename(blog.BlogImageUrl),
    );
    console.log(imagePath);
    try {
      await fs.unlink(imagePath);
      console.log("Image deleted:", path.basename(blog.BlogImageUrl));
    } catch (error) {
      console.log("Image delete error:", error.message);
    }
    return res.status(200).json({
      success: true,
      blog: blog,
      message: "Blog is deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Delete Server Error" });
  }
}

/////////////////////   update blog   ////////////////////////

async function handleUpdateBlog(req, res) {
  try {
    const id = req.params.id;
    console.log(id);

    const { Title, Description, Category } = req.body;
    const updateBlog = {};

    const oldBlog = await Blog.findById(id);

    if (!oldBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

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
      const imagePath = path.join(
        __dirname,
        "..",
        "BlogImages",
        path.basename(oldBlog.BlogImageUrl),
      );
      console.log(imagePath);
      try {
        await fs.unlink(imagePath);
        console.log("Image deleted:", path.basename(oldBlog.BlogImageUrl));
      } catch (error) {
        console.log("Image delete error:", error.message);
      }

      updateBlog.BlogImageUrl = `http://localhost:8000/BlogImages/${req.file.filename}`;
    }
    console.log(updateBlog);

    const blog = await Blog.findByIdAndUpdate(id, updateBlog, {
      new: true,
    });
    console.log(blog);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({
      success: true,
      blog: blog,
      message: "Blog is UPDATED",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  handleGetBlog,
  handleGetBlogById,
  handleCreateBlog,
  handleDeleteBlog,
  handleUpdateBlog,
};
