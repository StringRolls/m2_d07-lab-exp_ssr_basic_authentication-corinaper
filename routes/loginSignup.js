const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 5;

const { isLoggedin } = require("../middleware/middleware");

const User = require("../models/User.model");

router.route("/signup")
.get((req,res)=>res.render("user-pages/signup"))

.post((req,res)=>{
    const {username, password} = req.body
    if(!User.findOne(username)){
    bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
        
      return User.create({
        username,
        passwordHash: hashedPassword
      })
      .then((createdUser) => {
          console.log("user", createdUser)
          res.redirect("/")}
  )})
  .catch(err => res.render("user-pages/signup", {error: err}))
      }
    else{
      res.render("user-pages/signup", {error: "Username already exists"})
    return}

})


router.route("/login")
.get((req, res)=>res.render("user-pages/login"))
.post((req, res)=>{
    const {username, password} = req.body
    User.findOne({username})
    .then((user)=>{
        console.log(user)
      if(!user){res.render("user-pages/login", {error:"Wrong user details"})
      return  } 
      else {
         if(bcrypt.compareSync(password,user.passwordHash))
        {req.session.currentUser = user 
        res.redirect("/") 
      return
    } 
      else{res.render("user-pages/login", { error: "Wrong credentials!"})}
  
    }
  }
  )
    .catch(err=>console.log(err))
  })

  router.get("/main", isLoggedin, (req, res)=>{
      res.render("user-pages/main")
  })

  router.get("/private", isLoggedin, (req, res)=>{
    res.render("user-pages/private")
})


module.exports = router;