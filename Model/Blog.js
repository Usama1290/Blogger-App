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
        enum: ['CARS', 'MOVIES', 'SPORTS', 'FASHION','NEWS','PETS'], 
        default: 'Other',
        require:true,


    },
    CreatedBy:{
        
       type:String,
       require:true,

       // type:mongoose.Schema.Types.ObjectId,
       // ref:"BUser",
        
    },
    

   

}, { timestamps: true })

const Blog=mongoose.model("Blog",blogSchema);

module.exports=Blog;


