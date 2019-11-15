let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
var cors = require('cors');
let jsonParser = bodyParser.json();
let app = express();
let moment = require('moment');
const uuidv4 = require('uuid/v4');
let { PostList } = require('./blog-post-model');
let { DATABASE_URL, PORT } = require('./config');


app.use(cors());    
app.use(express.static('public'));
app.use( morgan( 'dev' ) );

let postss = [
	{
        id: uuidv4(),
        title: "Yes",
        content: "I used to know",
        author: "Hector Leon",
        publishDate: moment(Date.now()).format('MM/DD/YYYY')
	},
	{
        id: uuidv4(),
        title: "No",
        content: "I know",
        author: "Hector Leon",
        publishDate: moment(Date.now()).format('MM/DD/YYYY')
	},
	{
        id: uuidv4(),
        title: "Maybe",
        content: "I used",
        author: "Hector Leon",
        publishDate: moment(Date.now()).format('MM/DD/YYYY')
    },
	{
        id: uuidv4(),
        title: "Who knows",
        content: "used to",
        author: "Hector Leon",
        publishDate: moment(Date.now()).format('MM/DD/YYYY')
	}
];

app.get('/blog-posts',(req, res, next) => {
    PostList.get().then(posts => {
        return res.status(200).json(posts);
    }).catch( error => {
        res.statusMessage = "Something went wrong with the DB. Try again later.";
        return res.status( 500 ).json({
            status : 500,
            message : "Something went wrong with the DB. Try again later."
        })
    });
});

app.get('/blog-post',(req, res, next) => {
    if(req.query.author == undefined)
        return res.status(406).json("Missing author");
    PostList.getbyA(req.query.author).then(posts => {
        return res.status(200).json(posts);
    }).catch( error => {
        res.statusMessage = "Something went wrong with the DB. Try again later.";
        return res.status( 500 ).json({
            status : 500,
            message : "Something went wrong with the DB. Try again later."
        })
    });
});

app.post('/blog-posts', jsonParser, (req, res, next)=>{
    if(req.body.title && req.body.content && req.body.author && req.body.publishDate){
        let nPost = req.body;
        nPost.id = uuidv4();
        posts.push(nPost);
        PostList.post(nPost).then(post => {
            
            return res.status(200).json({
				message : "Post added!",
				status : 200,
				post : post
			});
        }).catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
    }
    else{
        return res.status(406).json("Missing variables in body");
    }
});

app.delete('/blog-posts/:id', (req, res, next)=>{
    PostList.del(req.params.id).then(mess => {
        return res.status(200).json("Success!");
    }).catch( error => {
        res.statusMessage = "Something went wrong with the DB. Try again later.";
        return res.status( 500 ).json({
            status : 500,
            message : "Something went wrong with the DB. Try again later."
        })
    });
    return res.status(404).send("That id doesn't exist");
});

app.put('/blog-posts/:id', jsonParser, (req, res, next)=>{
    if(req.body.id){
        let post = req.body;
        if(post.id != req.params.id)
            return res.status(409).json("Ids don't match");

        PostList.update(post).then(posts => {
            return res.status(202).json(posts);
        }).catch( error => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status( 500 ).json({
                status : 500,
                message : "Something went wrong with the DB. Try again later."
            })
        });
    }
    else{
        return res.status(406).json("Missing id in body");
    }
});

let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };