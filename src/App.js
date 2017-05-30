import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import axios from 'axios';
import TextField from 'material-ui/TextField'
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { cyan400 } from 'material-ui/styles/colors';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchValue: '',
      gifs: []
    };
  }
  //handle search text input changes
  handleChange(event) {
    this.setState({ searchValue: event.target.value });
  }

  //search for gifs using giphy api
  submit(){
    this.setState({ gifs: [] })
    axios.get('http://api.giphy.com/v1/gifs/search?q=' + this.state.searchValue + '&limit=30&api_key=dc6zaTOxFJmzC')
      .then(
        (data) => {
          this.setState({
            gifs: data.data.data
          })
        }
      )
  }
  // remove gifs
  clear(){
    this.setState({ gifs: [], searchValue: '' })
  }

  //map over gifs in state and render
  gifRender(){
    return this.state.gifs.map(
      (gif) => <img key={gif.id} src={gif.images.fixed_height.url} alt='a gif' />
    )
  }

  //handle submission via Enter key
  enterKeyDownHandler(e) {
    if(e.key === 'Enter'){
      this.submit();
    }
  }

  //return different styling based off of whether or not there are gifs being viewed
  inputFieldStyle() {
    if (this.state.gifs.length > 0) {
      return styles.inputStyleGifs;
    } else return styles.inputStyleEmpty;
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div style={this.inputFieldStyle()}>
            <TextField
              inputStyle={{ color: cyan400 }}
              underlineFocusStyle={{ borderColor: cyan400 }}
              hintStyle={{ color: '#FFF'}}
              hintText='Search for a gif!'
              onKeyDown={this.enterKeyDownHandler.bind(this)}
              value={this.state.searchValue}
              onChange={this.handleChange.bind(this)}
              type='text'
            />
            <div style={styles.buttonContainer}>
              <FlatButton onClick={this.submit.bind(this)}>
                <FontIcon 
                className="material-icons" 
                color={cyan400} 
                style={styles.iconStyle}>
                  search
                </FontIcon>
              </FlatButton>
              <FlatButton onClick={this.clear.bind(this)}>
                <FontIcon 
                className="material-icons" 
                color={cyan400} 
                style={styles.iconStyle}>
                  restore
                </FontIcon>
              </FlatButton>
            </div>
          </div>

          <div className='images'>
            <CSSTransitionGroup
              transitionName='fade'
              component='div'
              transitionEnterTimeout='1000'
              transitionLeaveTimeout='500'
            >
              {this.gifRender()}
            </CSSTransitionGroup>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  iconStyle: {
    marginTop: 6
  },
  buttonContainer: {
    display: 'inline-block'
  },
  inputStyleEmpty: {
    position: 'absolute',
    left: '50%',
    top: '50%', 
    marginLeft: '-150px',
    marginTop: '-150px'
  },
  inputStyleGifs: {
    margin: '50px'
  }
}

export default App;