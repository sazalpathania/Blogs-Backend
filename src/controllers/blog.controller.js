import Blog from "../models/blogs.model.js";

const addBlogController = async (req, res) => {
  try {
    console.log("Blog controller start");
    console.log("===== ADD BLOG START =====");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("User:", req.user);
    const { title, description } = req.body;

    if (!title || !description || !req.file) {
      return res.status(404).json({
        message: "All fields are required",
      });
    }

    const blog = new Blog({
      title: title,
      content: description,
      image: `/public/${req.file.filename}`,
      author: req.user.id,
    });
    await blog.save();

    return res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const geBlogsController = async (req, res) => {
  try {
    const blog = await Blog.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    return res.status(201).json({ blog });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getMyblogsController = async (req, res) => {
  try {
    console.log("my blogs");
    const userId = req.user.id;
    const blogs = (await Blog.find({ author: userId }))
      .populate("author", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Blog fetched successfully",
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

const editBlogController = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const { title, description } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    if (blog.author.toString() !== user.id) {
      return res.status(403).json({
        message: "You are not allowed to edit this blog",
      });
    }

    if (title) blog.title = title;
    if (description) blog.content = description;

    await blog.save();

    return res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const deleteBlogController = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== user.id) {
      return res.status(401).json({
        message: "You are not allowed to delete this blog",
      });
    }

    await Blog.findByIdAndDelete(blogId);

    return res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};
export {
  addBlogController,
  geBlogsController,
  getMyblogsController,
  editBlogController,
  deleteBlogController,
};
