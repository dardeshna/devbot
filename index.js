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

var defaultMessage = "Don't worry, there are a lot of channels.  Here's the basics about some of the more frequented ones:\n*#announcements*:  For teamwide announcements regarding events, lab hours, forms to fill out, etc.\n*#communication*:  For general communication such as asking about lab hours or if someone has found your missing jacket.\n*#subteam*:  For subteam specific discussion.\n*#reflections*:  For general comments and reflection about team related things such as how a project went or how a decision was made.\n*#ideas*:  For new ideas that you want to bounce off of other people, such as painting the lab.\n*#meta*:  For discussion about slack and slack usage.\n*#random*:  For random discussion that is somewhat related to robotics, school or current events.\n*#youdidntseethiscoming*:  For more random random discussion and memes."

var helpMessage = "Sure!  The basic idea is that I can tell you about what different channels are for.  Type '/guidelines' for an overview, '/guidelines this' for info about the channel you are in, and '/guidelines [#channel]' for info about a specific channel.  Lastly, if I'm not working properly, please kindly let @dardeshna know."

var channelMessages = {
  "meta": "For discussion about slack and slack usage.",
  "communication":  "For general communication such as asking about lab hours or if someone has found your missing jacket.",
  "announcements":  "For teamwide announcements regarding events, lab hours, forms to fill out, etc.",
  "reflections":  "For general comments and reflection about team related things such as how a project went or how a decision was made.",
  "ideas":  "For new ideas that you want to bounce off of other people, such as painting the lab.",
  "random":  "For random discussion that is somewhat related to robotics, school or current events.",
  "youdidntseethiscoming":  "For more random random discussion and memes.",
  "build":  "For discussion about build team happenings.",
  "art":  "For discussion about art team happenings.",
  "design":  "For discussion about design team happenings.",
  "web":  "For discussion about web team happenings.",
  "business":  "For discussion about business team happenings.",
  "sw-announcements":  "For software team specific announcements.",
  "sw-communication":  "For discussion about software team happenings.",
  "competitiontalk":  "For discussions about competitions in general and broad competition logistics.",
  "labmanagement":  "For discussion regarding something about the lab or lab management, such as a missing tool or plans for lab cleanup day.",
  "photos":  "For photos documenting team 8 life and other fun things.",
  "photography":   "For discussion amongst team photographers and file requests.",
  "captains-2017":  "The core of team bureaucracy.",
  "anime":  "For members to chat about anime stuff.",
  "buildseason-2017":  "For technical discussion and project logistics during build season."
}

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
      message = defaultMessage
    }
    else if (req.body.text == "help") {
      message = helpMessage
    }
    else {
      var channel = req.body.text
    
      // Handle any help requests
      if (req.body.text == 'this') {
          channel = req.body.channel_name
          console.log(channel);
      }
    
      if (channel.substring(0, 1) == '#') { 
        channel = channel.substring(1);
      }
      
      if (channel == "privategroup") {
        message = "Uh oh, this is a private channel so I can't help out here.  Sorry :disappointed:"
      }
      else if (channelMessages[channel] != undefined) {
        if (Math.random() < 0.333) {
          message = "Alright, see if this helps:\n*#"+channel+"*:  " +channelMessages[channel]
        }
        else if (Math.random() < 0.5) {
          message = "Here's what I've got:\n*#"+channel+"*:  " +channelMessages[channel]
        }
        else {
          message = "Okay, this is what I have:\n*#"+channel+"*:  " +channelMessages[channel]
        }
      }
      else {
        message = "I don't know anything about that channel, sorry friend.  _Sad days_ :disappointed:"
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
