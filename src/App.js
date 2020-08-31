import React from 'react';
import { Platform } from 'react-native';
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
      <Icon name='home' />
      Home
    </Menu.Item>
    <Menu.Item as='a'>
      <Icon name='gamepad' />
      Games
    </Menu.Item>
    <Menu.Item as='a'>
      <Icon name='camera' />
      Channels
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
  state = {
    messages: [],
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer!!!',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
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
    const [state, dispatch] = React.useReducer(exampleReducer, {
      animation: 'overlay',
      direction: 'left',
      dimmed: false,
      visible: false,
    });

    const visible = state.visible;
    const direction = 'left';
    const animation = 'slide along';
    const dimmed = false;
    const vertical = direction === 'bottom' || direction === 'top';
    return (
      <div className="App">
        {/*<header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>*/}

        <Header as='h5'>Vertical-Only Animations</Header>
        <Button
          disabled={vertical}
          onClick={() =>
            dispatch({ type: 'CHANGE_ANIMATION', animation: 'uncover' })
          }
        >
          Uncover
        </Button>
        <Button
          disabled={vertical}
          onClick={() =>
            dispatch({ type: 'CHANGE_ANIMATION', animation: 'slide along' })
          }
        >
          Slide Along
        </Button>
        <Button
          disabled={vertical}
          onClick={() =>
            dispatch({ type: 'CHANGE_ANIMATION', animation: 'slide out' })
          }
        >
          Slide Out
        </Button>

        <Sidebar.Pushable as={Segment} style={{ overflow: 'hidden' }}>

          {!vertical && (
            <VerticalSidebar
              animation={animation}
              direction={direction}
              visible={visible}
            />
          )}

          <Sidebar.Pusher dimmed={dimmed && visible}>
            <Segment basic padded="very">
              <Header as='h3'>Application Content</Header>
              {/*<Image src='/images/wireframe/paragraph.png' />*/}
              <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                  _id: 1,
                }}
                renderMessage={this.renderMessage}
              />

            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>

    )
  }
}

/*function App() {
  const [state, dispatch] = React.useReducer(exampleReducer, {
    animation: 'overlay',
    direction: 'left',
    dimmed: false,
    visible: false,
  });

  const visible = state.visible;
  const direction = 'left';
  const animation = 'slide along';
  const dimmed = false;
  const vertical = direction === 'bottom' || direction === 'top';
  return (
    <div className="App">
      {/*<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <Header as='h5'>Vertical-Only Animations</Header>
      <Button
        disabled={vertical}
        onClick={() =>
          dispatch({ type: 'CHANGE_ANIMATION', animation: 'uncover' })
        }
      >
        Uncover
      </Button>
      <Button
        disabled={vertical}
        onClick={() =>
          dispatch({ type: 'CHANGE_ANIMATION', animation: 'slide along' })
        }
      >
        Slide Along
      </Button>
      <Button
        disabled={vertical}
        onClick={() =>
          dispatch({ type: 'CHANGE_ANIMATION', animation: 'slide out' })
        }
      >
        Slide Out
      </Button>

      <Sidebar.Pushable as={Segment} style={{ overflow: 'hidden' }}>

        {!vertical && (
          <VerticalSidebar
            animation={animation}
            direction={direction}
            visible={visible}
          />
        )}

        <Sidebar.Pusher dimmed={dimmed && visible}>
          <Segment basic padded="very">
            <Header as='h3'>Application Content</Header>
            {/*<Image src='/images/wireframe/paragraph.png' />
            <Message>
              <Message.Header>New Site Features</Message.Header>
              <Message.List>
                <Message.Item>You can now have cover images on blog pages</Message.Item>
                <Message.Item>Drafts will now auto-save while writing</Message.Item>
                  <Message.Item>You can now have cover images on blog pages</Message.Item>
                  <Message.Item>Drafts will now auto-save while writing</Message.Item>
                    <Message.Item>You can now have cover images on blog pages</Message.Item>
                    <Message.Item>Drafts will now auto-save while writing</Message.Item>
              </Message.List>
            </Message>

          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
}*/

//export default App;
