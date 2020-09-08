import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { GiftedChat } from 'react-native-gifted-chat';
import emojiUtils from 'emoji-utils';
import logo from './logo.svg';
import './App.css';
import {
  Button,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  Message,
} from 'semantic-ui-react';
import SlackMessage from './SlackMessage';
const ReactMarkdown = require('react-markdown');
/*const { CreateUserRequest,
        CreateWrongThinkChannelRequest,
        CreateWrongthinkCommunityRequest,
        GetWrongthinkChannelsRequest,
        GetWrongthinkCommunitiesRequest,
        GetWrongthinkMessagesRequest,
        ListenWrongthinkMessagesRequest,
        WrongthinkChannel,
        WrongthinkCommunity,
        WrongthinkMessage,
        WrongthinkMeta,
        WrongthinkUser } = require('./wrongthink_pb.js');
const { WrongthinkClient } = require('./wrongthink_grpc_web_pb.js');*/
//var grpc = require('grpc');
var messages = require('./wrongthink_pb');
var services = require('./wrongthink_grpc_web_pb');

var client = new services.wrongthinkClient('http://10.0.0.24:8080');

/*
function getWrongthinkChannels(communityid) {
  var req = new messages.GetWrongthinkChannelsRequest([+communityid]);
  console.log("making getWrongthinkChannels request:");
  console.log(req.toObject());
  var call = client.getWrongthinkChannels(req);
  call.on('data', function(channel) {
    console.log(channel.toObject());
  });
  call.on('error', function(e) {
    // An error has occurred and the stream has been closed.
    console.log(e);
  });
}
*/

/*const VerticalSidebar = ({ animation, direction, visible, channels }) => (
  <Sidebar
    as={Menu}
    animation={animation}
    direction={direction}
    icon='labeled'
    inverted
    vertical
    visible={visible}
    width='thin'
  >

    {channels.map((channel, i) => <Menu.Item as='a'> {channel} </Menu.Item> )}

  </Sidebar>
)*/

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_ANIMATION':
      return { ...state, animation: action.animation, visible: !state.visible }
    case 'CHANGE_DIMMED':
      return { ...state, dimmed: action.dimmed }
    case 'CHANGE_DIRECTION':
      return { ...state, direction: action.direction, visible: false }
    default:
      throw new Error()
  }
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      channels: [],
      visible: true
    }

    // This binding is necessary to make `this` work in the callback
    this.onToggle = this.onToggle.bind(this);
  }

  componentDidMount() {
    var channels = [];

    var me = this;
    var chatmessages = [];
    function getWrongthinkMessages() {
      var req = new messages.GetWrongthinkMessagesRequest(
        [/* channelid */  1,
         /* limit */      0,
         /* afterid */    0,
         /* afterdate*/   0] );
      console.log("making getWrongthinkMessages request:");
      console.log(req.toObject());
      var call = client.getWrongthinkMessages(req);

      call.on('data', function(message) {
        var mobj = message.toObject();
        chatmessages.push({
          _id: 1, /*need to include message id in the response from the server*/
          text: mobj.text,
          createdAt: new Date(), /*need to convert date int*/
          user: {
            _id: 1,
            name: 'Anonymous'
          }
        });
        console.log(chatmessages.toObject());
      });

      call.on('error', function(e) {
        // An error has occurred and the stream has been closed.
        console.log(e);
      });

      call.on('end', function(end) {
        me.setState({
          messages: chatmessages
        });
        var req = new messages.ListenWrongthinkMessagesRequest(
          [/* uname */  'user1', /* hard code for now */
           /* channelid */      1,
           /* channelname */    'pol'] );
        var call = client.listenWrongthinkMessages(req);
        call.on('error', function(e) {
          // An error has occurred and the stream has been closed.
          console.log(e);
        });
        call.on('data', function(message) {
          var chatmessages = [];
          var mobj = message.toObject();
          chatmessages.push({
            _id: 1, /*need to include message id in the response from the server*/
            text: mobj.text,
            createdAt: new Date(), /*need to convert date int*/
            user: {
              _id: 1,
              name: 'Anonymous'
            }
          });
          me.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, chatmessages),
          }))
          console.log(message.toObject());
        });

      });
    }
    // this takes as a parameter the envoy proxy url
    function getWrongthinkChannels(communityid) {
      var req = new messages.GetWrongthinkChannelsRequest([+communityid]);
      console.log("making getWrongthinkChannels request:");
      console.log(req.toObject());
      var call = client.getWrongthinkChannels(req);
      call.on('data', function(channel) {
        channels.push(channel.getName());
        console.log(channel.toObject());
      });
      call.on('error', function(e) {
        // An error has occurred and the stream has been closed.
        console.log(e);
      });
      call.on('end', function(end) {
        me.setState({
          channels: channels
        });
        getWrongthinkMessages();
      });
    }

    getWrongthinkChannels(1);

  }

/*
function createUser(un, pw, ad) {
  var req = new messages.CreateUserRequest([un, pw, (ad == "true")]);
  console.log("making request:");
  console.log(req.toObject());
  client.createUser(req, function(error, user) {
    if (error) {
      console.log(error);
      return;
    } else {
      console.log('created user:');
      console.log(user.toObject());
    }
  });
}
*/

  onSend(chatmessages = []) {
    console.log(chatmessages);
    var text = chatmessages[0].text;
    var req = new messages.WrongthinkMessage();
    req.setUname('user1');
    req.setChannelname('pol');
    req.setChannelid(1);
    req.setUserid(1);
    req.setText(text);
    console.log(this);
    var me = this;
    client.sendWrongthinkMessageWeb(req, null, function(error, meta) {
      if(error) {
        console.log(error);
        return;
      } else {
        console.log('sent message');
        /*me.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, chatmessages),
        }));*/
      }
    });
  }

  onToggle() {
    this.setState(previousState => ({
      visible: !previousState.visible,
    }))
  }

  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props

    let messageTextStyle

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      }
    }

    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
  }

  render() {

    const visible = this.state.visible;
    const direction = 'left';
    const animation = 'slide along';
    const dimmed = false;
    const vertical = direction === 'bottom' || direction === 'top';
    var { width, height } = Dimensions.get('window');
    height -= 20;
    width -= 150;
    console.log(this.state.messages);
    return (
      <div className="App">


        {/*<Header as='h5'>Vertical-Only Animations</Header>
        <Button
          disabled={vertical}
          onClick={this.onToggle}
        >
          Toggle
        </Button>*/}

        <Sidebar.Pushable as={Segment} style={{ overflow: 'hidden' }}>

          {!vertical && (

            <Sidebar
              as={Menu}
              animation={animation}
              direction={direction}
              icon='labeled'
              inverted
              vertical
              visible={visible}
              width='thin'
            >

              {this.state.channels.map((channel, i) => <Menu.Item as='a'> {channel} </Menu.Item> )}

            </Sidebar>
          )}

          <Sidebar.Pusher dimmed={dimmed && visible}>
          <View style={[{ width, height }, {backgroundColor: "#FFFFEE"}]}>
            <GiftedChat
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              user={{
                _id: 1,
                name: 'Anonymous',
              }}
              renderMessage={this.renderMessage}
            />
          </View>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )

  }
}
