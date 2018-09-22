import React, { Component } from 'react'
import qs from 'qs'
import axios from 'axios';
import { Header, Icon, Form, Segment, Divider } from 'semantic-ui-react'
import { VendorFormGroup } from './VendorFormGroup'
import { ProductFormGroup } from './ProductFormGroup'
import { CategoryDropbox } from './CategoryDropbox'
import { AddRemoveFormGroupBtns } from './AddRemoveFormGroupBtns'
import LocationFormGroup from './LocationFormGroup'
import update from 'immutability-helper'

export default class AddProductForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      category_id: '',
      product_name: '',
      model_number: '',
      vendors: [
        {
          vendor: "",
          item_number: "",
          link_to_item: ""
        }
      ],
      locations: [
        {
          location: "",
          cur_qty: "",
          min_qty: ""
        }
      ],
      description: '',
      locationCount: 1,
      vendorCount: 1
    }
  }

  componentDidMount() {
    axios.get("http://localhost:8080/my-app/src/server/php/get_categories.php")
      .then(res => {
        this.setState({
          categories : res.data,
        });
      })
  }

  handleChange = (e, { name, value, groupname, index }) => {
    if(groupname) {
      var newArray = update(
        this.state[groupname],
        {
          [index]: { [name]:  {$set : value} }
        }
      )
      this.setState({ [groupname]: newArray })
    } else {
      this.setState({ [name]: value })
    }
  }

  handleResultSelect = (e, { result, index }) => {
    this.setState(prevState => {
      const updatedVendors = update(
        prevState.vendors,
        {
          [index]: { vendor: {$set: result.title} }
        }
      )
      return { vendors : updatedVendors }
    })
  }

  handleSubmit = () => {
    let {
      category_id,
      product_name,
      model_number,
      locations,
      vendors,
      description
    } = this.state

    var filteredLocations = locations.filter(el=>(el.location))
    var filteredVendors= vendors.filter(el=>(el.vendor))

    const new_product = {
      category_id,
      product_name,
      model_number,
      locations: filteredLocations,
      vendors: filteredVendors,
      description
    }

    axios.post("http://localhost:8080/my-app/src/server/php/add_product.php",
    qs.stringify(new_product))
      .then(res => {
        console.log(res.data)
      })
  }

  renderLocationFormGroup = numberOfElements => {
    let locationFormGroup = []
    for(var i=0; i < numberOfElements;i++) {
      locationFormGroup.push(
        <LocationFormGroup
          groupname="locations"
          location={this.state.locations[i].location}
          cur_qty={this.state.locations[i].cur_qty}
          min_qty={this.state.locations[i].min_qty}
          index={i}
          key={i}
          onChange={this.handleChange}
          isMultLocations = {numberOfElements > 1}
        />
      )
    }
    return locationFormGroup
  }

  renderVendorFormGroup = numberOfElements => {
    let vendorFormGroup = []
    for(var i=0; i < numberOfElements; i++) {
      vendorFormGroup.push(
        <VendorFormGroup
          groupname="vendors"
          vendor={this.state.vendors[i].vendor}
          item_number={this.state.vendors[i].item_number}
          link_to_item={this.state.vendors[i].link_to_item}
          onSearchChange={this.handleChange}
          onResultSelect={this.handleResultSelect}
          isMultLocations = {numberOfElements > 1}
          key={i}
          index={i}
        />)
    }
    return vendorFormGroup
  }

  removeElement = group => {
    const copiedArray = [...group]
    copiedArray.splice(-1,1)
    return copiedArray
  }

  addGroup = ( counter, groupname, groupnameValues ) => () => {
    this.setState(prevState => (
      { [counter] : (prevState[counter] + 1), [groupname]: [...prevState[groupname], groupnameValues]}
  ))}

  removeGroup = ( counter, groupname ) => () => {
    this.setState(prevState => (
    {
      [counter]: (prevState[counter] > 1) ? (prevState[counter] - 1) : prevState[counter],
      [groupname]: (prevState[counter] > 1) ? this.removeElement(prevState[groupname]) : prevState[groupname]
    }
  ))}

  render() {
    const {
      categories,
      product_name,
      model_number,
      category_id,
      description,
      locationCount,
      vendorCount
    } = this.state
    return (
      <div style={{margin: "10px 100px"}}>
        <Segment inverted>

          <AddItemHeader />

          <Form inverted style={{padding: "30px"}} onSubmit={this.handleSubmit}>
            <CategoryDropbox
              categories={categories}
              category_id={category_id}
              onChange={this.handleChange}
            />

            <Divider horizontal inverted>Product</Divider>

            <ProductFormGroup
              product_name={product_name}
              model_number={model_number}
              onChange={this.handleChange}
            />

            <Divider horizontal inverted>Supplier</Divider>

            <AddRemoveFormGroupBtns
              onPlusClick={this.addGroup("vendorCount", "vendors", {vendor:"", item_number:"", link_to_item:""})}
              onMinusClick={this.removeGroup("vendorCount", "vendors")}
            />

            {this.renderVendorFormGroup(vendorCount)}

            <Divider horizontal inverted>Tulsa Metal Finishing</Divider>

            <AddRemoveFormGroupBtns
              onPlusClick={this.addGroup("locationCount", "locations", {location:"", cur_qty:"", min_qty:""})}
              onMinusClick={this.removeGroup("locationCount", "locations")}
            />

            {this.renderLocationFormGroup(locationCount)}

            <Form.Field style ={{
              margin: "50px 0 20px"
            }}>
              <label>Description</label>
              <Form.TextArea
                name="description"
                value={description}
                placeholder='Enter Tags (e.g. 1700 pump 1.5" valve hoist motor 20 amps... )'
                onChange={this.handleChange}
              />
            </Form.Field>

            <Form.Button primary icon="plus" content="Add Product" />
          </Form>
        </Segment>
      </div>
    )
  }
}

const AddItemHeader = () => (
  <Header as='h1' icon style={{margin: "50px auto 30px", width: "100%"}}>
    <Icon name="wpforms" />
    Add Item
  </Header>
)
