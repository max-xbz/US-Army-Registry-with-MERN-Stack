import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './Home';
import CreateOne from './CreateOne';
import EditOne from './EditOne';
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" exact={true} component={Home}/>
          <Route path="/create" component={CreateOne}/>
          <Route path="/edit/:id" component={EditOne}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
export default App;
