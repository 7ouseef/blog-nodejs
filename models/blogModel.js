const mongoose=require('mongoose');

const blogSchema=new mongoose.Schema({
   heading: {
    type: String,
    required: true,
    minLength: 1
   },
   content: {
    type: String,
    required: true,
    minLength: [10,'Sentence with atleast 10 letters is required']
   },
   author:{
      type:String,
      required:true
   },
   owner:{
      type: mongoose.Schema.ObjectId,
      required:true
   },
   date: {
    type: Date,
    default: new Date()
   }
});

const Blog=mongoose.model('Blog',blogSchema);

module.exports=Blog;