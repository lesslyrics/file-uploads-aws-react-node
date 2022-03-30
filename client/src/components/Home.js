import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';

class Home extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			selectedFile: null,
			selectedFiles: null
		}
	}

	singleFileChangedHandler = ( event ) => {
		this.setState({
			selectedFile: event.target.files[0]
		});
	};

	multipleFileChangedHandler = (event) => {
		this.setState({
			selectedFiles: event.target.files
		});
		console.log( event.target.files );
	};

	singleFileUploadHandler = ( event ) => {
		const data = new FormData();
// If file selected
		if ( this.state.selectedFile ) {
			data.append( 'profileImage', this.state.selectedFile, this.state.selectedFile.name );
			axios.post( '/api/profile/profile-img-upload', data, {
				headers: {
					'accept': 'application/json',
					'Accept-Language': 'en-US,en;q=0.8',
					'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
				}
			})
				.then( ( response ) => {
					if ( 200 === response.status ) {
						// If file size is larger than expected.
						if( response.data.error ) {
							if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
								this.ocShowAlert( 'Max size: 2MB', 'red' );
							} else {
								console.log( response.data );
// If not the given file type
								this.ocShowAlert( response.data.error, 'red' );
							}
						} else {
							// Success

							let fileName = response.data;
							console.log( 'filedata', fileName );
							this.ocShowAlert( 'File Uploaded', '#3089cf' );

							axios.get( '/api/profile/execfeatures')
							// axios.get('api/profile/execnet')
						}
					}
				}).catch( ( error ) => {
				// If another error
				this.ocShowAlert( error, 'red' );
			});
		} else {
			// if file not selected throw error
			this.ocShowAlert( 'Please upload file', 'red' );
		}
	};

	multipleFileUploadHandler = () => {
		const data = new FormData();
		let selectedFiles = this.state.selectedFiles;
// If file selected
		if ( selectedFiles ) {
			for ( let i = 0; i < selectedFiles.length; i++ ) {
				data.append( 'galleryImage', selectedFiles[ i ], selectedFiles[ i ].name );
			}
			axios.post( '/api/profile/multiple-file-upload', data, {
				headers: {
					'accept': 'application/json',
					'Accept-Language': 'en-US,en;q=0.8',
					'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
				}
			})
				.then( ( response ) => {
					console.log( 'res', response );
					if ( 200 === response.status ) {
						// If file size is larger than expected.
						if( response.data.error ) {
							if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
								this.ocShowAlert( 'Max size: 2MB', 'red' );
							} else if ( 'LIMIT_UNEXPECTED_FILE' === response.data.error.code ){
								this.ocShowAlert( 'Max 4 images allowed', 'red' );
							} else {
								// If not the given ile type
								this.ocShowAlert( response.data.error, 'red' );
							}
						} else {
							// Success
							let fileName = response.data;
							console.log( 'fileName', fileName );
							this.ocShowAlert( 'File Uploaded', '#3089cf' );
						}
					}
				}).catch( ( error ) => {
				// If another error
				this.ocShowAlert( error, 'red' );
			});
		} else {
			// if file not selected throw error
			this.ocShowAlert( 'Please upload file', 'red' );
		}
	};

	resultObtainedHandler = ( event ) => {
		const data = new FormData();
// If file selected
			axios.get( '/api/profile/result', data, {
				headers: {
					'accept': 'application/json',
					'Accept-Language': 'en-US,en;q=0.8',
				}
			})
				.then( ( response ) => {
					if ( 200 === response.status ) {
						// If file size is larger than expected.
						if( response.data.error ) {
							console.log('error')
						} else {
							// Success
							let res = response.data;
							console.log( ' result data', res );
							// this.setState(res.result)
							this.ocShowResult( res.result, 'rgba(48,137,207,0.01)' );
						}
					} else {
						console.log("Error here: " + response.data + response.status)
					}
				}).catch( ( error ) => {
				// If another error
				this.ocShowAlert( error, 'red' );
			});

	};

	// ShowAlert Function
	ocShowAlert = ( message, background = '#3089cf' ) => {
		let alertContainer = document.querySelector( '#oc-alert-container' ),
			alertEl = document.createElement( 'div' ),
			textNode = document.createTextNode( message );
		alertEl.setAttribute( 'class', 'oc-alert-pop-up' );
		$( alertEl ).css( 'background', background );
		alertEl.appendChild( textNode );
		alertContainer.appendChild( alertEl );
		setTimeout( function () {
			$( alertEl ).fadeOut( 'slow' );
			$( alertEl ).remove();
		}, 3000 );
	};

	// ShowAlert Function
	ocShowResult = ( message, background = 'rgba(0,145,255,0.02)' ) => {
		let alertContainer = document.querySelector( '#test' ),
			alertEl = document.createElement( 'div' ),
			textNode = document.createTextNode( message );
		alertEl.setAttribute( 'class', 'test' );
		// $( alertEl ).css( 'background', background );
		alertContainer.append( textNode );
		// alertContainer.appendChild( alertEl );
		setTimeout( function () {
			$( alertEl ).fadeOut( 'slow' );
			$( alertEl ).remove();
		}, 12000 );
	};

	render() {
		console.log( this.state );
		return(
			<div className="container">
				{/* For Alert box*/}
				<div id="oc-alert-container"></div>
				{/* Single File Upload*/}
				<div className="card border-light mb-3 mt-5" style={{ boxShadow: '0 5px 10px 2px rgba(195,192,192,.5)' }}>
					<div className="card-header">
						<h3 style={{ color: '#555', marginLeft: '12px' }}>Upload a movie to search</h3>
						<p className="text-muted" style={{ marginLeft: '12px' }}>Send a short clip to search in the large movies database</p>
					</div>
					<div className="card-body">
						{/*<p className="card-text">Upload a movie to search</p>*/}
						<input type="file" onChange={this.singleFileChangedHandler}/>
						<div className="mt-5">
							<button className="btn btn-info" onClick={this.singleFileUploadHandler}>Upload!</button>
						</div>
						<div className="mt-5">
							<button className="btn btn-info" onClick={this.resultObtainedHandler}>Get Result</button>
						</div>
						{/*<div><p>pppp</p></div>*/}
						<div  style={{ color: '#555', background: '#ffffff' }} ><h3 id="test"></h3></div>

					</div>
				</div>
			</div>
		);
	}
}

export default Home;