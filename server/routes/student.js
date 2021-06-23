const express=require("express");
const router=express.Router();
const { applyonjob }=require("../controllers/student")


router.post("/applyonjob",applyonjob);


module.exports=router;