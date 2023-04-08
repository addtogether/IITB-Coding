const mongoose = require("mongoose");

const JsonFile = new mongoose.Schema(
    {
        requestTime: {
            type: Date,
            default: Date.now
        },
        
        requestStatus: {
            type: String,
            default: "Processing"
        },
        
        requestDuration: {
            type: String,
            default: "-"
        },
        
        count: {
            type: Number
        },
        
        pending: {
            type: Number
        },
        
        success: {
            type: Number,
            default: 0
        },
        
        failed: {
            type: Number,
            default: 0
        },
    }, 
    { timestamps: true }
);

module.exports = new mongoose.model("JsonFile", JsonFile);