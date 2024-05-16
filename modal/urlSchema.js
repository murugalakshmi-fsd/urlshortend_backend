import mongoose from "mongoose";
import { type } from "os";

const Schema=mongoose.Schema;

const UrlSchema=new Schema({
    longURL:{type:String,required:true},
    shortURL:{type:String,required:true}
},{timestamps:true})

const Url=mongoose.model("Urls",UrlSchema);

export default Url;