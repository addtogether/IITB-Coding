const ApiResponse = require("../models/ApiResponse");
const JsonFile = require("../models/JsonFile");
const axios = require("axios");

const getFiles = async (req, res) => {
    try {
        const data = await JsonFile.find().sort({ requestTime: -1 });
        if (data.length > 0) {
            res.json({
                status: "success",
                data: data
            });
        }
        else {
            res.json({
                status: "failure",
                msg: "No data found"
            });
        }
    }
    catch (error) {
        res.json({
            status: "failure",
            msg: error
        });
    }
}

const addFile = async (req, res) => {
    try {
        let fileContents = req.body;

        // Left Initial State
        let leftData = {
            "count": fileContents.length,
            "pending": fileContents.length,
        };

        // Insert left data initial State
        const leftDataCreated = await JsonFile.create(leftData);

        // Right Initial State
        let rightDataCreated = [];
        for (let i = 0; i < fileContents.length; i++) {
            let obj = {
                "jsonFile": leftDataCreated._id,
                "audioId": fileContents[i].audio_id,
                "storyId": fileContents[i].reference_text_id
            };
            const rightData = await ApiResponse.create(obj);
            rightDataCreated.push(rightData);
        }

        // Insert right data initial State
        if (leftDataCreated && rightDataCreated) {
            res.json({
                status: "success",
                msg: "File added successfully",
                leftData: leftDataCreated,
                rightData: rightDataCreated
            });
        }
        else {
            res.json({
                status: "failure",
                msg: "File not added"
            });
        }
        callSasAPI(fileContents, leftDataCreated._id, rightDataCreated);
    }
    catch (error) {
        res.json({
            status: "failure",
            msg: error
        });
    }
}

const getRightData = async (req, res) => {

    try {
        const rightData = await ApiResponse.find({ jsonFile: req.params.requestId }).sort({ createdAt: 1 });

        if (rightData.length > 0) {
            res.json({
                status: "success",
                rightData: rightData,
            });
        }
        else {
            res.json({
                status: "failure",
                msg: "No data found"
            });
        }
    }
    catch (error) {
        res.json({
            status: "failure",
            msg: error
        });
    }
}

const getAllStoryIds = async (req, res) => {

    const { from, to } = req.body;

    try {
        const query = {};
        if (from) {
            let fromDate = new Date(from)
            fromDate.setHours(0,0,0)
            query.createdAt = { $gte: fromDate };
        }
        if (to) {
            let toDate = new Date(to)
            toDate.setHours(23,59,59)
            query.createdAt = { $lte: toDate };
        } 
        const data = await ApiResponse.find(query).distinct('storyId');
        res.json({
            status: 'success',
            data: data
        })
    }   
    catch (error) {
        res.json({
            status: "failure",
            msg: error
        });
    }
}

const filter = async (req, res) => {
    try {
        const { from, to, storyId } = req.body;
       
        const filter = {};
        if (from) {
            let fromDate = new Date(from)
            fromDate.setHours(0, 0, 0)
            filter.createdAt = { $gte: fromDate };
        }
        if (to) {
            let toDate = new Date(to)
            toDate.setHours(23, 59, 59)
            if (!filter.createdAt) filter.createdAt = {};
            filter.createdAt = { $lte: toDate };
        }
        if (storyId) {
            let apiResponses = []
            if (storyId === 'all') {
                apiResponses = await ApiResponse.find();
            }
            else {
                apiResponses = await ApiResponse.find({ storyId });
            }
            const jsonFileIds = apiResponses.map((apiResponse) => apiResponse.jsonFile);
            filter._id = { $in: jsonFileIds };
        }

        const entries = await JsonFile.find(filter);
        res.json({
            status: 'success',
            data: entries
        });
    }
    catch (error) {
        console.log(error)
        res.json({
            status: "failure",
            msg: error
        })
    }
}

// Call SAS API

// Step-1: Loop fileContents 
// Step-2: Call SAS API
// Step-3: Get Response from SAS API
// Step-4: Update Status in DB and Send to Client

const callSasAPI = async (fileContents, leftDataId, rightData) => {
    try {
        let requestDuration = 0;
        
        // Step-1: Loop fileContents
        for (let i = 0; i < fileContents.length; i++) {
            
            // Processing Stage
            let updateApiProcessing = await ApiResponse.findOneAndUpdate(
                { _id: rightData[i]._id },
                {
                    apiCallStatus: "Processing",
                    apiCallTime: new Date().toISOString(),
                    apiCallId: rightData[i]._id,
                },
                { new: true }
            );

            // Emitting Proceesing Status to Client
            socket.emit('status-process', updateApiProcessing);

            // Call SAS API 
            // SAS API can return two reponses - Success or Failue => Check audio_type | audio_type === ok ? 'success' : 'failure
            let responseTimeStart = (new Date()).getTime();     // Time at which SAS API was called
            let response = await axios.post(process.env.SAS_URL, fileContents[i], {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.SAS_API_KEY
                }
            });
            let responseTimeEnd = (new Date()).getTime();       // Time at which SAS API return the response
            
            requestDuration = requestDuration + parseInt((responseTimeEnd - responseTimeStart));
            
            let obj = {}
            let is_success = 0, is_failed = 0;

            // SAS API Response - Success
            if (response.data.audio_type === "Ok") {
                obj.apiCallStatus = "Done",
                obj.apiResponseTime = parseInt((responseTimeEnd - responseTimeStart) / 1000),
                obj.apiResponse = {
                    decodedText: response.data.decoded_text,
                    insertion: response.data.no_ins,
                    deletion: response.data.no_del,
                    substitution: response.data.no_subs,
                    wcpm: response.data.wcpm,
                    speechRate: response.data.speech_rate,
                    pronunciation: response.data.pron_score
                }
                is_success = 1;
            }

            // SAS API Response - Failed
            else {
                obj.apiCallStatus = "Failed"
                is_failed = 1;
            }

            // Updating Right Data - Updating API Call Status
            let updateRight = await ApiResponse.findOneAndUpdate({ _id: rightData[i]._id }, obj , { new: true } );
            
            // Updating Left Data - Updating Pending, Success and Failed
            let updateLeft = await JsonFile.findOneAndUpdate(
                { _id: leftDataId },
                { $inc: { pending: -1, success: is_success, failed: is_failed } },
                { new: true }
            );
            
            // Emitting Done Status to Client
            socket.emit('status-done', updateRight);

            // Emitting Update Count Status to Client
            socket.emit('update-count', updateLeft);    
        }

        // Update Left Data - Updating Status and Duration
        const minutes = Math.floor(requestDuration / 60000);
        const seconds = ((requestDuration % 60000) / 1000).toFixed(0);
        const time = minutes + "m " + (seconds < 10 ? '0' : '') + seconds + 's';

        let updateFinalDone = await JsonFile.findOneAndUpdate(
            { _id: leftDataId },
            { 
                requestDuration: time,
                requestStatus: "Done" 
            },
            { new: true }
        );

        // Emitting Left Table Done Status and Request Duration to Client
        socket.emit('final-done', updateFinalDone);
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = { addFile, getRightData, getFiles, callSasAPI, getAllStoryIds, filter }