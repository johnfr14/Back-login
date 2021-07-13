const express = require('express')
const ethers = require('ethers')
const {exec} = require('child_process')
const fsPromises = require('fs/promises')

const LOG_FILE = 'access-log.txt'

const logger = async (req) => {
  try {
    const date = new Date()
    const log = `${date.toUTCString()} ${req.method} "${
      req.originalUrl
    }" from ${req.ip} ${req.headers['user-agent']}\n`
    await fsPromises.appendFile(LOG_FILE, log, 'utf-8')
  } catch (e) {
    console.error(`Error: can't write in ${LOG_FILE}`)
  }
}

const readLastLog = async () => {
  try {
    const info = await fsPromises.readFile(`./${LOG_FILE}`, 'utf-8').then((result) => result.split('\n').slice(-2, -1).join())
    console.log(info.split('\n').slice(-2, -1).join())
    return info
  } catch (e) {
    console.error(e.message)
  }
}


const app = express()
const PORT = 3333
//const IP_LOCAL = "128.0.0.1"

// exercice 1 
app.get('/', (req, res, next) => {
  logger(req);
  next()
}, (req, res) => {
  res.send(`Hello ${req.ip}`)
})

app.get('/john/:cmd', (req, res, next) => {
  console.log(`${req.ip} connected`)
  next()
}, (req, res) => {
  exec(`${req.params.cmd}`, (error, stdout, stderr) => {
    if (error) {
      res.send(`error: ${error.message}`);
    } else if (stderr) {
      res.send(`error: ${stderr.message}`);
    } else {
      res.send(`stdout: ${stdout}`);
    }
  })
})

// exercice 3 
app.get('/info', (req, res, next) => {
  logger(req);
  next()
}, async (req, res) => {
  const info = await readLastLog()
  res.send(`Hello ${req.ip}, here's all the informations about you : \n\n ${info}`)
})

// exercice 4 
app.get('/:address', async (req, res) => {
  const account = new ethers.providers.InfuraProvider("rinkeby", "d63ccb145caa4670b4db18d68fffdf22")
  const address = req.params.address
  if (ethers.utils.isAddress(address)) {
    const amount = ethers.utils.formatEther(await account.getBalance(address))
    res.send(`l'address dite "${address.slice(0, 6) + "..." + address.slice(-4)}" est en possession de ${amount} ETH`)
  } else {
    res.send(`Sorry ${address} is not an ethereum address`)
  }
})

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
