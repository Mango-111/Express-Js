const express=require('express');
const multer=require('multer');
const path=require('path');
const helpers=require('./helpers/helpers');
const PORT = 9999;
const app=express();
app.use(express.static("Uploads"));
app.set("view engine","ejs");
//for uploading 
const storage=multer.diskStorage({
    destination:(req,files,cb)=>{
        cb(null,'Uploads/')
    },
    filename:(req,files,cb)=>{
      cb(null,files.fieldname+"-"+Date.now()+path.extname(files.originalname))
    }
})
//end 
app.get("/",(req,res)=>{
    res.render("upload");
})
app.post("/fileupload",(req,res)=>{
    let upload=multer({storage:storage,fileFilter:helpers.imageFilter}).array('multiple_images',10);
    upload(req,res,(err)=>{
       if(req.fileValidationError){
            res.send(req.fileValidationError);
        }
        else if(!req.files){
           res.send("Please select a file");
        }
       else if(err){
           res.send("Some uploading error");
       }
       else {
        const files=req.files;
        let length = files.length;
        
        let result="";
        for(let i=0; i<length;++i){
            result+=`<img src="${files[i].filename}" width=300 height=300/>`;
        }
        res.send(result);
       }
    })
})
app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Work on ${PORT}`);
})