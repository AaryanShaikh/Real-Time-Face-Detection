const video = document.getElementById('video')

//loading the models -> done ascynchronusly
Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('/models'),/*small package*/
	faceapi.nets.faceLandmark68Net.loadFromUri('/models'),/*differnt parts of the face*/
	faceapi.nets.faceRecognitionNet.loadFromUri('/models'),/*where your face is*/
	faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startvideo)

function startvideo() {/*to start the camera*/
	navigator.getUserMedia(
		{ video: {} },
		stream => video.srcObject = stream,/*stream outputs anything that comes out the camera*/
		err => console.error(err)
	)
}

video.addEventListener('play', ()=>{/*what 2 do when video loads*/
	const canvas = faceapi.createCanvasFromMedia(video)/*creating canvas on top of the video*/
	document.body.append(canvas)/*this is just going 2 put it at the end of the page*/
	const displaySize = {width:video.width, height:video.height}/*this is so the canvas can fit in the video properly*/
	faceapi.matchDimensions(canvas, displaySize)/*we want it 2 match the canvas 2 the display size*/
	setInterval(async () =>{/*setInterval so we can run the code many times, async because its asynchronus library*/
	const detections = await faceapi.detectAllFaces(video,/*detect all the faces inside the webcam and what library we r using(tiny)*/ 
	new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()/* and detect it with what?(landmark) and has what expressions*/
	const resizeDetections = faceapi.resizeResults(detections, displaySize)/*the boxes that appear are correct size*/
	canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)/*clear the entire canvas*/
	faceapi.draw.drawDetections(canvas, resizeDetections)/*draw the detctions*/
	faceapi.draw.drawFaceLandmarks(canvas, resizeDetections)/*where my eyes,nose etc are*/
	faceapi.draw.drawFaceExpressions(canvas, resizeDetections)/*expressions*/
	}, 100)/*every 100ms*/
})