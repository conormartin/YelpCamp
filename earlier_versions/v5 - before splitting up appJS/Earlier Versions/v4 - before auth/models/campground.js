var mongoose = require("mongoose");

//Schema Setup describes database structure
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
//compile schema into a model called Campground & export
module.exports = mongoose.model("Campground", campgroundSchema);