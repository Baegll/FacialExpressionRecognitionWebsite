// Parameters
let input_size_image = 608
let input_size_video = 512
let scoreThreshold = 0.5
let minConfidence = 0.05

// Set Parameters
function setParameters_image() {
    return new faceapi.TinyFaceDetectorOptions({ input_size_image, scoreThreshold })
}
function setParameters_video() {
    return new faceapi.TinyFaceDetectorOptions({ input_size_video, scoreThreshold })
}
// Load the Tinydetector
async function loadDetector() {
    // Show the loader
    $('#loader').show()
    // Load weights from CDN
    await faceapi.nets.tinyFaceDetector.load('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/')
    $(`#${'tiny_face_detector'}_controls`).show()
    // Close the loader
    $('#loader').hide()
}

//Image Detection
// Input the image from local file
async function AnaImage() {
    const imgFile = $('#queryImgUploadInput').get(0).files[0]
    const img = await faceapi.bufferToImage(imgFile)
    $('#inputImg').get(0).src = img.src
    await updateResults()
}
// Update the detection result
async function updateResults() {
    // Input
    const inputImgEl = $('#inputImg').get(0)
    // Set up the detector
    const results = await faceapi.detectAllFaces(inputImgEl, setParameters_image())
        .withFaceLandmarks()
        .withFaceExpressions()
    // Fit the model
    const canvas = $('#overlay').get(0)
    faceapi.matchDimensions(canvas, inputImgEl)
    // Convert and display the result
    const resizedResults = faceapi.resizeResults(results, inputImgEl)
    faceapi.draw.drawDetections(canvas, resizedResults)
    faceapi.draw.drawFaceExpressions(canvas, resizedResults, minConfidence)
}

// Real-time Recognition

// Calculate the statistics data
let current_time = []
function refresh_status(t) {
    current_time = [t].concat(current_time).slice(0, 30)
    const avg_t = current_time.reduce((total, t) => total + t) / current_time.length
    $('#delay').val(`${Math.round(avg_t)} ms`)
    $('#fr').val(`${faceapi.utils.round(1000 / avg_t)} fps`)
}
// Stream Processing
async function real_time_d() {
    // Set the stream
    const stream = $('#inputVideo').get(0)
    //Record the time
    const t_now = Date.now()
    const output = await faceapi.detectAllFaces(stream, setParameters_video()).withFaceExpressions()
    refresh_status(Date.now() - t_now)
    //Resize the output
    const canvas = $('#overlay').get(0)
    const dims = faceapi.matchDimensions(canvas, stream, true)
    const resized_output = faceapi.resizeResults(output, dims)
    //Draw the resized result
    faceapi.draw.drawDetections(canvas, resized_output)
    faceapi.draw.drawFaceExpressions(canvas, resized_output, minConfidence)
    setTimeout(() => real_time_d())
}
