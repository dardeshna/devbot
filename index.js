var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
 
var VERIFY_TOKEN = process.env.SLACK_VERIFY_TOKEN
if (!VERIFY_TOKEN) {
  console.error('SLACK_VERIFY_TOKEN is required')
  process.exit(1)
}
var PORT = process.env.PORT
if (!PORT) {
  console.error('PORT is required')
  process.exit(1)
}

var app = express()
app.use(morgan('dev'))

var defaultMsg = "Don't worry, there are a lot of channels.  Here's the basics about some of the more frequented ones:\n*#announcements*:  For teamwide announcements regarding events, lab hours, forms to fill out, etc.\n*#communication*:  For general communication such as asking about lab hours or if someone has found your missing jacket.\n*#subteam*:  For subteam specific discussion.\n*#reflections*:  For general comments and reflection about team related things such as how a project went or how a decision was made.\n*#ideas*:  For new ideas that you want to bounce off of other people,  such as painting the lab.\n*#meta*:  For discussion about slack and slack usage.\n*#random*:  For random discussion that is somewhat related to robotics, school or current events.\n*#youdidntseethiscoming*:  For more random random discussion and memes."

app.route('/slack/command')
  .get(function (req, res) {
    res.sendStatus(200)
  })
  .post(bodyParser.urlencoded({ extended: true }), function (req, res) {
    if (req.body.token !== VERIFY_TOKEN) {
      return res.sendStatus(401)
    }
    
    var message
    
    if (req.body.text == "") {
      message = defaultMsg
    }
    else {
      var channel = req.body.text
    
      // Handle any help requests
      if (req.body.text == 'this') {
          channel = req.body.channel_name
      }
    
      switch (channel) {
        case "meta":  message = "*#meta*:  For discussion about slack and slack usage."
        break;
        case "communication":  message = "*#communication*:  For general communication such as asking about lab hours or if someone has found your missing jacket."
        break;
        default:  message = "Sorry, I don't know about that channel. :("
      }
    }

    res.json({
      response_type: 'ephemeral',
      text: message
    })
  })

app.listen(PORT, function (err) {
  if (err) {
    return console.error('Error starting server: ', err)
  }

  console.log('Server successfully started on port %s', PORT)
})
