const express = require('express')
const PORT = process.env.PORT || 5000
const session = require('express-session');
const { Pool } = require('pg');
const cors = require("cors")
const db = require('./mydb')
require('dotenv').config()

const app = express()

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
