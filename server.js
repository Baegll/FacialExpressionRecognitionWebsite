const express = require('express')
const path = require('path')
const app = express()

// Include the Path
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './public')))
const viewsDir = path.join(__dirname, './public/')
app.use(express.static(viewsDir))

// Redirect the Pages
app.get('/', (req, res) => res.sendFile(path.join(viewsDir, './html/index.html')))
app.get('/about', (req, res) => res.sendFile(path.join(viewsDir, './html/about.html')))
app.get('/privacy', (req, res) => res.sendFile(path.join(viewsDir, './html/privacy.html')))
app.get('/manual', (req, res) => res.sendFile(path.join(viewsDir, './html/manual.html')))
app.get('/realtime_face_expression_recognition-hpc', (req, res) => res.sendFile(path.join(viewsDir, './html/realtime_face_expression_recognition-hpc.html')))
app.get('/realtime_face_expression_recognition-mobile', (req, res) => res.sendFile(path.join(viewsDir, './html/realtime_face_expression_recognition-mobile.html')))
app.get('/realtime_face_expression_recognition-pc', (req, res) => res.sendFile(path.join(viewsDir, './html/realtime_face_expression_recognition-pc.html')))
app.get('/sitemap.xml', (req, res) => res.sendFile(path.join(viewsDir, './sitemap.xml')))
app.get('/age_and_gender_recognition', (req, res) => res.sendFile(path.join(viewsDir, './html/age_and_gender_recognition.html')))


// Lauch the Webapp on Port 3001
app.listen(3001, () => console.log('http://localhost:3001/ or https://deepemo.tech/'))