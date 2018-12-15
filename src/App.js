import React, { Component } from 'react';
import './App.css';

import { GridView } from './components/GridView';

class App extends Component {
  render() {
    return (
		<div className="App">
			<GridView />
		</div>
    );
  }
}

export default App;
