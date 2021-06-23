const express=require("express");
const router=express.Router();

const {createjob, updatejob, deletejob}=require("../controllers/job")
router.route("/createpost").post(createjob);

 router.route("/updatepost").post(updatejob);

 router.route("/deletepost/:postId").post(deletejob);

// router.route("/resetpassword/:resetToken").put(resetpassword);

// router.route("/verifyuser/:regToken").put(registerDB);

module.exports=router;