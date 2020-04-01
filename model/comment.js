// 引入mongoose模块
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    aid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    time: {
        type: Date
    },
    content: {
        type: String
    }
});

// 创建评论集合
const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
    Comment
}