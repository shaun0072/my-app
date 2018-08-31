import React, { Component } from 'react'
import AddProductForm from './components/AddProductForm'
import { Header, Grid } from 'semantic-ui-react'
class App extends Component {

  render() {
    return(
      //<AddProductForm />
      //<SearchProduct />
      <G />
    )
  }
}


const G = () => (
  <Grid>
    <Grid.Column>
      <Header as="h3">Hello World</Header>
    </Grid.Column>
  </Grid>
)

export default App
