import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import axios from 'axios'

export default class VendorSearchBar extends Component {
  constructor(props) {
    super(props)

    this.state={
      vendors: [],
      value: props.value && ""
    }
  }
  componentWillMount() {
    this.resetComponent()
  }

  componentDidMount() {
    axios.get("http://localhost:8080/my-app/src/server/php/get_vendors.php")
      .then(res => {
        this.setState({
          vendors : res.data,
        });
      })
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextProps.value !== nextState.value) {
      this.handleSearchChange(nextProps.value)
    }
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })



  handleSearchChange = value => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {

      if (value < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(this.state.vendors, isMatch),
      })
    }, 100)
  }

  render() {
    const { isLoading, results, value } = this.state

    return (
      <Search
        selectFirstResult
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        results={results}
        value={value || ""}
        {...this.props}
      />
    )
  }
}
