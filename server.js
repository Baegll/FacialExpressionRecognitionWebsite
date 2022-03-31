const express = require('express')
const path = require('path')
const app = express()

// Include the Path
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './public')))
const viewsDir = path.join(__dirname, './public/html')
app.use(express.static(viewsDir))

// Redirect the Pages
app.get('/', (req, res) => res.sendFile(path.join(viewsDir, 'index.html')))
app.get('/realtime_face_expression_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'realtime_face_expression_recognition.html')))
app.get('/about', (req, res) => res.sendFile(path.join(viewsDir, 'about.html')))
app.get('/privacy', (req, res) => res.sendFile(path.join(viewsDir, 'privacy.html')))
app.get('/manual', (req, res) => res.sendFile(path.join(viewsDir, 'manual.html')))

// Lauch the Webapp on Port 3001
app.listen(3001, () => console.log('http://localhost:3001/ or https://deepemo.tech/'))

