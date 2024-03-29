const router = require("express").Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const { verifyToken, verfiyTokenAndAuthorization, verfiyTokenAndAdmin } = require("./verfiyToken");


router.put("/:id", verfiyTokenAndAuthorization, async (req, res) => {
  if(req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password.toString(), 10)
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, {new: true})
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.delete("/:id", verfiyTokenAndAuthorization, async(req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json("User has been deleted>>>")
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get("/find/:id", verfiyTokenAndAdmin, async(req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (error) {
    res.status(500).json(error)
  }
})

// Get all users
router.get("/", verfiyTokenAndAdmin, async(req, res) => {
  const query = req.query.new
  try {
    const users = query ? await User.find().sort({_id: -1}).limit(5) 
    : await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
})

// Get User stats
router.get("/stats", verfiyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() -1))

  try {
    const data = await User.aggregate([{ $match: {createdAt: {$gte: lastYear}}},
    {
      $project:{
        month: {$month: "$createdAt"}
      }
    },
    {
      $group: {
        _id: "$month",
        total:{$sum: 1},
      }
    }
  ])
  res.status(200).json(data)
  } catch (error) {
    res.status(500).json(err)
  }
})

module.exports = router
