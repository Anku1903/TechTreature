const express=require("express");
const router=express.Router();

const {register, login, forgotpassword, resetpassword,registerDB}=require("../controllers/auth")
router.route("/register").post(register);

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotpassword);

router.route("/resetpassword/:resetToken").put(resetpassword);

router.route("/verifyuser/:regToken").put(registerDB);

module.exports=router;