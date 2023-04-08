const mongoose = require("mongoose");

const ApiResponse = new mongoose.Schema(
    {   
        audioId: {
            type: String,
            required: true
        },
        
        storyId: {
            type: String,
            required: true,
        },
        
        apiCallId: {
            type: String,
            default: '-'
        },
        
        apiCallStatus: {
            type: String,
            default: "In Queue"
        },
        
        apiCallTime: {
            type: String,
            default: '-'
        },
        
        apiResponseTime: {
            type: String,
            default: '-'
        },
        
        apiResponse: {
            type: Object
        },

        jsonFile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JsonFile",
        }
    }, 
    { timestamps: true } 
);

module.exports = new mongoose.model("ApiResponse", ApiResponse);