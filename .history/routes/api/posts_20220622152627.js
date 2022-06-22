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
    '/:id',
    auth,
    async(req,res) =>{
        try {
            const post = await Post.findById(req.params.id)
            console.log(post)
            if(!post){
                return res.status(404).json({msg: "Post not found"})
            }
            await post.remove();

            res.json({msg: 'Post removed'})
        } catch (error) {
            console.error(res)
            res.status(500).send("server Error")
        }
    }
)

// @route    PUT api/posts/like:id
// @desc     Like post 
// @access   Private

router.put(
    '/like/:id',
    auth,
    async(req,res) =>{
        try {
           const post = await Post.findById(req.params.id)
            console.log(post)
            // check post has already been like 
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                return res.status(400).json({msg:'Post already likes'})
            }

            post.likes.unshift({user:req.user.id})
            await post.save();
            res.json(post.likes)
        } catch (error) {
            console.error(res)
            res.status(500).send("server Error")
        }
        
    }
)

// @route    PUT api/posts/unlike:id
// @desc     unLike post 
// @access   Private

router.put(
    '/unlike/:id',
    auth,
    async(req,res) =>{
        try {
           const post = await Post.findById(req.params.id)
            // check post has already been like 
            if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                return res.status(400).json({msg:'Post has not yet been liked'})
            }

            //  get index 
            const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
            post.likes.splice(removeIndex,1)
            await post.save();
            res.json({msg: 'Post liked'})
        } catch (error) {
            console.error(res)
            res.status(400).send("server Error")
        }
        
    }
)
// @route    PUT api/posts/comment/:id
// @desc     comment post 
// @access   Private

router.post(
    '/comment/:id',
    auth,
    check('text', 'Text is required').notEmpty(),
    async(req,res) =>{
        const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()})
            }
        try {
            const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
        } catch (error) {
            console.error(res)
            res.status(400).send("server Error")
        }
        
    }
)
// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      // Pull out comment
      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );
      // Make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }
      // Check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      post.comments = post.comments.filter(
        ({ id }) => id !== req.params.comment_id
      );
  
      await post.save();
  
      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  });
module.exports = router;
