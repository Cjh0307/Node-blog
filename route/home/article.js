const { Article } = require('../../model/article');
const { Comment } = require('../../model/comment');

module.exports = async (req, res) => {

    // 接收客户端传递过来的文章id值
    const id = req.query.id;
    // 根据id查询文章详细信息
    let article = await Article.findOne({_id: id}).populate('author');
    // 查询当前文章对应的评论信息
    let comments = await Comment.find({aid: id}).populate('uid');
    res.render('home/article.art',{
        article,
        comments
    });
}