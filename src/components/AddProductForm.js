import React, { Component } from 'react'
import qs from 'qs'
import axios from 'axios';
import { Header, Icon, Form, Segment, Divider } from 'semantic-ui-react'
import { VendorFormGroup } from './VendorFormGroup'
import { ProductFormGroup } from './ProductFormGroup'
import { CategoryDropbox } from './CategoryDropbox'
import LocationFormGroup from './LocationFormGroup'
import update from 'immutability-helper'

export default class AddProductForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      vendors: [
        {
          vendor: "",
          item_number: "",
          link_to_item: ""
        }
      ],
      category_id: '',
      product_name: '',
      model_number: '',
      current_qty: [],
      min_qty: [],
      location: [],
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
      this.setState({ vendors: newArray })
    } else {
      this.setState({ [name]: value })
    }
  }

  handleResultSelect = (e, { result, mykey }) => {
    this.setState(prevState => {
      var newArray = [
        ...prevState["vendor"].slice(0,mykey),
        result.title,
        ...prevState["vendor"].slice(mykey + 1)
      ];
      return { "vendor" : newArray }
    })
  }

  handleSubmit = () => {
    const {
      category_id,
      product_name,
      model_number,
      current_qty,
      min_qty,
      location,
      description
    } = this.state
    const new_product = {
      category_id,
      product_name,
      model_number,
      current_qty,
      min_qty,
      location,
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
          location={this.state.location[i]}
          curQtyVal={this.state.current_qty[i] || 0}
          min_qty={this.state.min_qty}
          index={i}
          key={i}
          onChange={this.handleArrayChange}
          isMultLocations = {numberOfElements > 1}
        />
      )
    }
    return locationFormGroup
  }

  renderVendorFormGroup = numberOfElements => {
    let vendorFormGroup = []
    for(var i =0; i < numberOfElements; i++) {
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

            <div style={{cursor: "pointer", padding: "5px 0", display: "inline"}}>
              <Icon
                name="plus"
                onClick={() => (
                  this.setState(prevState => (
                    { vendorCount : (prevState.vendorCount + 1), vendors: [...prevState.vendors, {vendors:"", item_number:"", link_to_item:""}]}
                  )))}>
              </Icon>
              <Icon
                name="minus"
                onClick={() => (this.setState(prevState => (
                  {
                    vendorCount : (prevState.vendorCount > 1) ? (prevState.vendorCount - 1) : prevState.vendorCount })))}>
              </Icon>
            </div>

            {this.renderVendorFormGroup(vendorCount)}

            <Divider horizontal inverted>Tulsa Metal Finishing</Divider>

            <div style={{cursor: "pointer", padding: "5px 0", display: "inline"}}>
              <Icon
                name="plus"
                onClick={() => (this.setState(prevState => ({ locationCount : (prevState.locationCount + 1) })))}>
              </Icon>
              <Icon
                name="minus"
                onClick={() => (this.setState(prevState => ({ locationCount : (prevState.locationCount > 1) ? (prevState.locationCount - 1) : prevState.locationCount })))}>
              </Icon>
            </div>

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
