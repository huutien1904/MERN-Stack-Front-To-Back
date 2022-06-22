const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const User = require("../../models/User");
// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  "/",
  auth,
  check("text", "Text is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// @route    GET api/posts
// @desc     GET all posts
// @access   Private

router.get(
    '/',
    auth,
    async(req,res) =>{
        try {
            const posts = await Post.find();
            res.json(posts)
        } catch (error) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
)

// @route    Delete api/posts/:id
// @desc     Delete post by id
// @access   Private

router.delete(
    '/',
    auth,
    async(req,res) =>{
        try {
            const post = await Post.findById(req.params.id)
            if(!post){
                return res.status(404).json({msg: "Post not found"})
            }
            await post.remove();

            res.json({msg: 'psot removed'})
        } catch (error) {
            console.error(res)
            res.status(500).send("server Error")
        }
    }
)
module.exports = router;
