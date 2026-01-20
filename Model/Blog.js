const mongoose=require("mongoose");


const blogSchema=new mongoose.Schema({

    Title:{

        type:String,
        require:true,
    },
    BlogImageUrl:{
        type:String,
        require:false,

    },
    Description:{

        type:String,
        require:true,
    },
    Category:{

        type:String,
        enum: ["Cars", "Movies", "Sports", "fashion","News","Pets"], 
        default: "Other"

    },
    CreatedBy:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"BUser",
        
    },
    

   

}, { timestamps: true })

const Blog=mongoose.model("Blog",blogSchema);

module.exports=Blog;


