const express = require('express')
const PORT = process.env.PORT || 5000
const session = require('express-session');
const { Pool } = require('pg');
const cors = require("cors")
const db = require('./mydb')
require('dotenv').config()

const app = express()

// A middle for checking if an api key is provided by the user
// If an api key is provided in the authorization header field then
// the api key is attached to the req object
const getApiKey = async (req, res, next) => {
  const apiKey = req.headers.authorization
  if (!apiKey) {
    res.status(403).json({
      status: 'fail',
      data: { apiKey: 'No api key in Authorization header' },
    })
  } else {
    req.apiKey = apiKey.replace('Bearer ', '').trim()
    next()
  }
}

// A middleware for checking if an api key is valid
// and is still active.
// if Ok the id of the user performing the request is attached to the req object.

const validateApiKey = async (req, res, next) => {
  try {
    const result = await db.getUserByApiKey(req.apiKey)
    // Check if user is active
    // check if null result then not found
    if (!result || !result.active) {
      res.status(403).json({ status: 'fail', data: { key: 'Invalid api key' } })
    } else {
      req.userId = result.id
      next()
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ code: 'error', message: 'Internal server error' })
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


app.use(cors())
app.use(express.urlencoded({ extended: false })) // to support URL-encoded bodies
app.use(express.json()) // to support JSON-encoded bodies

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.post('/register', async (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  try {
    const result = await db.register(username, email, password)
    res.json({
      status: 'success',
      data: { id: result.id, key: result.apiKey.key },
    })
  } catch (e) {
    if (e.status === 'fail') {
      res.status(400).json({ status: e.status, data: e.dataError })
    } else {
      // e.status === 50X
      res.status(500).json({ status: e.status, message: e.message })
    }
  }
})

app.use(getApiKey)
app.use(validateApiKey)

app.get('/user_by_id/:userId', async (req, res) => {
  let userId = req.params.userId
  if (isNaN(userId)) {
    res.json({ status: 'fail', data: { userId: `${userId} is not a number` } })
    return
  }
  userId = Number(userId)
  try {
    const result = await db.getUserById(userId)
    res.json({ status: 'success', data: { user: result } })
  } catch (e) {
    if (e.status === 'fail') {
      res.status(400).json({ status: e.status, data: e.dataError })
    } else {
      // e.status === 50X
      res.status(500).json({ status: e.status, message: e.message })
    }
  }
})

app.get('/myinfo', async (req, res) => {
  const userId = req.userId
  try {
    const result = await db.getUserById(userId)
    res.json({ status: 'success', data: { user: result } })
  } catch (e) {
    if (e.status === 'fail') {
      res.status(400).json({ status: e.status, data: e.dataError })
    } else {
      // e.status === 50X
      res.status(500).json({ status: e.status, message: e.message })
    }
  }
})

app.get('/user_by_username/:username', async (req, res) => {
  // A implementer
  try {
    const result = await db.getUserByUsername(req.params.username)
    res.json({ status: 'success', data: { user: result } })
  } catch (e) {
    if (e.status === 'fail') {
      res.status(400).json({ status: e.status, data: e.dataError })
    } else {
      // e.status === 50X
      res.status(500).json({ status: e.status, message: e.message })
    }
  }
})

app.post('/send_message/:username', async (req, res) => {
  // A implementer
  const content = req.body.content
  try {
    const dstId = (await db.getUserByUsername(req.params.username)).id
    const srcId = (await db.getUserByApiKey(req.userId))
    const result = await db.sendMessage(srcId, dstId, content)
    res.json({status: 200, data: result})
  } catch (e) {
    if (e.status === 'fail') {
      res.status(400).json({ status: e.status, data: e.dataError })
    } else {
      // e.status === 50X
      res.status(500).json({ status: e.status, message: e.message })
    }
  }
})

app.get('/read_message/', async (req, res) => {
  // A implementer
  const dstId = (await db.getUserByApiKey(req.userId))
  try {
    const result = await db.readMessage(dstId)
    res.json({ status: 200, data: result })
  } catch (e) {
    if (e.status === 'fail') {
      res.status(400).json({ status: e.status, data: e.dataError })
    } else {
      // e.status === 50X
      res.status(500).json({ status: e.status, message: e.message })
    }
  }
})

app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`)
})
