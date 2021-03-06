import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Register from './components/Register/Register';
import Signin from './components/SignIn/Signin';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '9e5212f06fc84330a52c27bc89a98ea8'
})

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 850
      }
    }

    }
  }

class App extends Component{
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }

}

displayFaceBox = (box) => {
  console.log(box);
  this.setState({box: box});

}

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

// ImageTest = https://images.unsplash.com/photo-1568967729548-e3dbad3d37e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80
// Clarifai only detects png or jpg pictures
onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  app.models
  .predict(
    Clarifai.FACE_DETECT_MODEL,
    this.state.input)
    .then(response =>   this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console(err));

}

onRouteChange = (route) => {
  if (route === 'signout')  {
    this.setState({isSignedIn: false})
  } else if (route === 'home')  {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

  render() {
    const { isSignedIn, imageUrl, route, box  } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}

        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={box}
              imageUrl={imageUrl}
            />
          </div>
          : (
            this.state.route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
  }


export default App;
