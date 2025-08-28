import mongoose, {Schema} from "mongoose";


const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Owner"
    },

},
{
    timestamps: true
})



export const Tweet = mongoose.model("Tweet", tweetSchema)