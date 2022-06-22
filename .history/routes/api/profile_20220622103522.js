const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');
const User = require("../../models/User");
// @route               POST api/profile/me
// @desc                Get current users profile
// @access              Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({
        msg: "There is no profile for user",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route               POST api/profile
// @desc                Create or Update Profile
// @access              Private

router.post(
  "/",
  auth,
  check("status", "Status is required").notEmpty(),
  check("skills", "Skills is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // get fields req
    const {
      company,
      website,
      location,
      bio,status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest 
      ...rest
    } = req.body;

    // // create profile

    const profileFields = {};

    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map((skill) => ' ' + skill.trim())
    }

    //  build social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube
    if(twitter) profileFields.social.twitter = twitter
    if(facebook) profileFields.social.facebook = facebook
    if(linkedin) profileFields.social.linkedin = linkedin
    if(instagram) profileFields.social.instagram = instagram
     
    try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOne(
          { user: req.user.id },
        //   { $set: profileFields },
        //   { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if(profile){
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
              );
            return res.json(profile);
        }
        profile = new Profile(profileFields)
        await profile.save();
        return res.json(profile);

      } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
      }
  }
);

// @route               GET api/profile
// @desc                Get all profile
// @access              public

router.get('/', async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'avatar']);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// @route               GET api/profile/user/userID
// @desc                Get profile by id
// @access              public

router.get(
    '/user/:user_id',
    async (req,res) => {
        try {
            console.log(req.params.user_id);
            const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
            if(!profile) return res.status(400).json({msg:'there is no profile for this user'})
            res.json(profile)
        } catch (error) {
            
            console.error(err.message);
            if(error.kind == 'ObjectId'){
                return res.status(400).json({msg:'there is no profile for this user'})
            }
            return res.status(500).send("Server error");
        }
    }
    
  );

// @route               DELETE api/profile/user/userID
// @desc                delete profile,user,posts
// @access              private


router.delete('/',auth,async(req,res) =>{
    try {
        // remote profile
        await Profile.findOneAndDelete({user: req.user.id})
        // Remove user
        await User.findOneAndDelete({_id:req.user.id})

        res.json({msg:'User deleted'})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private

router.put(
    '/experience',
    auth,
    check('title','Title is require').notEmpty(),
    check('company','Company is require').notEmpty(),
    check('From','From date is require and needs to be from the past').notEmpty(),
    async (req,res) =>{
        const errors = validationResult(req)
        if(!errors.isEmpty){
            return res.status(400).json({errors:errors.array()})
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
            
        } = req.body

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({user:req.user.id})
            profile.experience.unshift(newExp)
            await profile.save()
            res.json(profile)
        } catch (error) {
            console.error(error)
            res.status(500).send('server error')
        }
    }
    ),

module.exports = router;
