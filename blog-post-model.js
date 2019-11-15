let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let postSchema = mongoose.Schema({
	id : { 
		type : String,
		required : true },
	title: { type: String},
	content: { type: String},
    author: { type: String},
	publishDate: {type : Date}
});

let Post = mongoose.model( 'Post', postSchema );


let PostList = {
	get : function(){
		return Post.find()
				.then( posts => {
					return posts;
				})
				.catch( error => {
					throw Error( error );
				});
	},
	getbyA: function(authorS){
		return Post.find({author: authorS})
				.then( posts => {
					return posts;
				})
				.catch( error => {
					throw Error( error );
				});
	},
	post : function( newPost ){
		return Post.create( newPost )
				.then( post => {
					return post;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	del : function( iD ){
		return Post.deleteOne( {id: iD} )
				.then( mess => {
					return mess;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	update: function( nPost ){
		return Post.updateOne( {id: nPost.id}, nPost)
				.then( posts => {
					return posts;
				})
				.catch( error => {
					throw Error(error);
				});
	}
};

module.exports = { PostList };