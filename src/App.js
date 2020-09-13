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
  Input,
  Label,
  Menu,
  Segment,
  Sidebar,
  Message,
  Dropdown,
  Divider,
} from 'semantic-ui-react';
import SlackMessage from './SlackMessage';

const ReactMarkdown = require('react-markdown');

var messages = require('./wrongthink_pb');
var services = require('./wrongthink_grpc_web_pb');

var client = new services.wrongthinkClient('http://10.0.0.24:8080');

/*export default */class MenuExampleIcons extends React.Component {
  state = { activeItem: 'gamepad' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu icon>
        <Menu.Item
          name='gamepad'
          active={activeItem === 'gamepad'}
          onClick={this.handleItemClick}
        >
          <Icon name='gamepad' />
        </Menu.Item>

        <Menu.Item
          name='video camera'
          active={activeItem === 'video camera'}
          onClick={this.handleItemClick}
        >
          <Icon name='video camera' />
        </Menu.Item>

        <Menu.Item
          name='video play'
          active={activeItem === 'video play'}
          onClick={this.handleItemClick}
        >
          <Icon name='video play' />
        </Menu.Item>
      </Menu>
    )
  }
}

/*export default */class MenuExampleVertical extends React.Component {
  state = { activeItem: 'inbox' }

  constructor(props) {
    super(props);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu vertical style={{flex: 1, width: "100%", backgroundColor: "#F2F3F5"}}>
         {this.props.channels.map((channel, i) => {
           return (<Menu.Item name={channel}
                      active={activeItem === channel}
                      onClick={this.handleItemClick}
                      style={{fontSize: 17}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" ><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>

                       {channel}
                  </Menu.Item> );
         })}

      </Menu>
    )
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
          _id: +mobj.messageid, /*need to include message id in the response from the server*/
          text: mobj.text,
          createdAt: new Date(mobj.date), /*need to convert date int*/
          user: {
            _id: 1,
            name: 'Anonymous',
            avatar: 'https://placeimg.com/140/140/any'
          }
        });
        //console.log(mobj);
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
              name: 'Anonymous',
              avatar: 'https://placeimg.com/140/140/any',
            }
          });
          me.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, chatmessages),
          }))
          //console.log(message.toObject());
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
        //console.log(channel.toObject());
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
    //console.log(chatmessages);
    var text = chatmessages[0].text;
    var req = new messages.WrongthinkMessage();
    req.setUname('user1');
    req.setChannelname('pol');
    req.setChannelid(1);
    req.setUserid(1);
    req.setText(text);
    //console.log(this);
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

  renderMessageText(props) {
    return (<ReactMarkdown source={props.currentMessage.text} />);
  }

  render() {

    const visible = this.state.visible;
    const direction = 'left';
    const animation = 'slide along';
    const dimmed = false;
    const vertical = direction === 'bottom' || direction === 'top';
    var { width, height } = Dimensions.get('window');
    console.log(width);
    console.log(height);
    height -= 20;
    width -= 150;
    ///console.log(this.state.messages);
//{/*renderMessageText={this.renderMessageText}*/}persistentScrollbar
//listViewProps={{initialNumToRender: 50}}
    return (
      <div className="App">
        <Grid stretched={true} className="mgrid" divided={false}>
          <Grid.Column className="mcolumn" width={0.5} style={{backgroundColor: "#E3E5E8"}}>
          communities
          </Grid.Column>
           <Grid.Column className="mcolumn" width={2}>
             <Segment.Group style={{display: "flex", flex:1, padding: 0, margin: "0rem"}}>
               <Segment style={{backgroundColor: "#F2F3F5", height: "3rem"}}>
             <Dropdown text='Community name' style={{flexGrow: 0}}>
              <Dropdown.Menu>
                <Dropdown.Item text='New' />
                <Dropdown.Item text='Open...' description='ctrl + o' />
                <Dropdown.Item text='Save as...' description='ctrl + s' />
                <Dropdown.Item text='Rename' description='ctrl + r' />
                <Dropdown.Item text='Make a copy' />
                <Dropdown.Item icon='folder' text='Move to folder' />
                <Dropdown.Item icon='trash' text='Move to trash' />
                <Dropdown.Divider />
                <Dropdown.Item text='Download As...' />
                <Dropdown.Item text='Publish To Web' />
                <Dropdown.Item text='E-mail Collaborators' />
              </Dropdown.Menu>
            </Dropdown>
            </Segment>
            <Segment style={{display: "flex", flex:1, padding:0}}>
            <MenuExampleVertical fluid={true} channels={this.state.channels} />
            </Segment>
            </Segment.Group>
           </Grid.Column>
           <Grid.Column className="mcolumn" width={11}>
             <Segment.Group style={{display: "flex", flex:1, padding: 0, margin: "0rem"}}>
               <Segment style={{display: "flex", flexGrow: 0, padding:0, height: "3rem", align: "right"}}>
                 <MenuExampleIcons />
               </Segment>
               <Segment style={{display: "flex", flex:1, padding:0}}>
                 <View style={{ flex: 1}} >
                   <GiftedChat
                     messages={this.state.messages}
                     onSend={messages => this.onSend(messages)}
                     user={{
                       _id: 1,
                       name: 'Anonymous',
                       avatar: 'https://placeimg.com/140/140/any'
                     }}
                     renderMessage={this.renderMessage}
                     showUserAvatar={false}
                     alwaysShowSend={true}
                     renderMessageText={this.renderMessageText}
                     listViewProps={{persistentScrollbar: true, windowSize: 51}}
                     inverted={false}
                   />
                 </View>
               </Segment>
             </Segment.Group>
           </Grid.Column>
           <Grid.Column className="mcolumn" width={2} style={{backgroundColor: "#F2F3F5"}}>users</Grid.Column>
        </Grid>
      </div>
    )

  }
}
