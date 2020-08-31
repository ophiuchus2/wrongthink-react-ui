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

const VerticalSidebar = ({ animation, direction, visible }) => (
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
    <Menu.Item as='a'>
      # Channel 1
    </Menu.Item>
    <Menu.Item as='a'>
      # Channel 2
    </Menu.Item>
    <Menu.Item as='a'>
      # Channel 3
    </Menu.Item>
    <Menu.Item as='a'>
      # Channel N
    </Menu.Item>
  </Sidebar>
)

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
      visible: true
    }

    // This binding is necessary to make `this` work in the callback
    this.onToggle = this.onToggle.bind(this);
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'hello anon',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Anonymous',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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
            <VerticalSidebar
              animation={animation}
              direction={direction}
              visible={visible}
            />
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
