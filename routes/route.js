import { Router } from "express";
import Url from "../modal/urlSchema.js";
import shortId from "shortid";
import dotenv from 'dotenv';

const router=Router();
dotenv.config();
const shUrl=process.env.SHORT_URL || "http://localhost:8000";

function isValidUrl(url) {
    const urlRegex = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return urlRegex.test(url);
}

router.post('/api/v8/urlShortner',async(req,res)=>{
    const {longURL}=req.body;
    if(!isValidUrl(longURL)){
        return res.status(400).json({message:"Invalid URL"})
    }
    try{
       let url=await Url.findOne({longURL:longURL})
       if(url){
        return res.status(200).json({
            url:url
        })
       }

       const shortid = shortId.generate()

       let shorturl=await Url.findOne({shortURL:`${shUrl}/${shortid}`})
       if(shorturl){
          return res.status(400).json({message:"Technical Error Try again"})
       }

       const shortUrl=new Url({
        longURL:longURL,
        shortURL:`${shUrl}/${shortid}`
       })
       await shortUrl.save();
       return res.status(200).json({url:shortUrl})
    }catch(error){
return res.status(400).json({message:error.message})
    }
})

router.get('/:shortURL', async(req,res)=>{
    const shortURL=req.params.shortURL;
    try{
       const url=await Url.findOne({shortURL:`${shUrl}/${shortURL}`});
       if(!url){
        return res.status(404).json({message:"Not Found"});
       }
       return res.redirect(url.longURL);
    }catch(error){
      return res.status(500).json({message:"Internal Error"});
    }
});

export default router;