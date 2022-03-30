const express = require( 'express' );
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );

const router = express.Router();

/**
 * PROFILE IMAGE STORING STARTS
 */


// Initialize the Amazon Cognito credentials provider
aws.config.region = "us-east-1"; // Region
aws.config.credentials = new aws.CognitoIdentityCredentials({
	IdentityPoolId: "us-east-1:a593a65b-0778-41b9-8cf0-b84370dfcd8e"
});

const s3 = new aws.S3({
	Bucket: 'testbucket-1h'
});

/**
 * Single Upload
 */
const profileImgUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'testbucket-1h',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb(null, path.basename( "test.mp4", path.extname( file.originalname ) )  + path.extname( 'test.mp4' ) )
		}
	}),
	limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	// fileFilter: function( req, file, cb ){
	// 	checkFileType( file, cb );
	// }
}).single('profileImage');

var tmp = ""

/**
 * @route POST /api/profile/notify
 * @desc Notify about CNN results
 * @access public
 */
router.post( '/notify', ( req, res ) => {
	tmp = req.body.name
	console.log('filename is ',tmp);
	res.send(req.body);

})

router.get( '/result', ( req, res ) => {
	console.log('get req')
	res.json({ result: tmp });
})
/**
 * @route POST /api/profile/business-img-upload
 * @desc Upload post image
 * @access public
 */
router.post( '/profile-img-upload', ( req, res ) => {
	profileImgUpload( req, res, ( error ) => {
		console.log( 'requestOkokok', req.file );
		console.log( 'error', error );
		if( error ){
			console.log( 'errors', error );
			res.json( { error: error } );
		} else {
			// If File not found
			if( req.file === undefined ){
				console.log( 'Error: No File Selected!' );
				res.json( 'Error: No File Selected' );
			} else {
				// If Success
				const imageName = 'test.mp4';
				const imageLocation = req.file.location;
// Save the file name into database into profile model
				res.json( {
					image: imageName,
					location: imageLocation
				} );
			}
		}
	});
});

/**
 * BUSINESS GALLERY IMAGES
 * MULTIPLE FILE UPLOADS
 */
// Multiple File Uploads ( max 4 )
const uploadsBusinessGallery = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'testbucket-1h',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb( null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
		}
	}),
	limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	// fileFilter: function( req, file, cb ){
	// 	checkFileType( file, cb );
	// }
}).array( 'galleryImage', 4 );
/**
 * @route POST /api/profile/multiple-file-upload
 * @desc Upload business Gallery images
 * @access public
 */
router.post('/multiple-file-upload', ( req, res ) => {
	uploadsBusinessGallery( req, res, ( error ) => {
		console.log( 'files', req.files );
		if( error ){
			console.log( 'errors', error );
			res.json( { error: error } );
		} else {
			// If File not found
			if( req.files === undefined ){
				console.log( 'Error: No File Selected!' );
				res.json( 'Error: No File Selected' );
			} else {
				// If Success
				let fileArray = req.files,
					fileLocation;
				const galleryImgLocationArray = [];
				for ( let i = 0; i < fileArray.length; i++ ) {
					fileLocation = fileArray[ i ].location;
					console.log( 'filenm', fileLocation );
					galleryImgLocationArray.push( fileLocation )
				}
				// Save the file name into database
				res.json( {
					filesArray: fileArray,
					locationArray: galleryImgLocationArray
				} );
			}
		}
	});
});

module.exports = router;