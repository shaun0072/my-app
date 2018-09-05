import React, { Component } from 'react'
import qs from 'qs'
import axios from 'axios';
import { Header, Icon, Form, Segment, Dropdown, Divider } from 'semantic-ui-react'
import { VendorFormGroup } from './VendorFormGroup'
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

  handleArrayChange = (e, { name, value, mykey }) => {
    console.log("called")
    this.setState( prevState => {
      var newArray = [
        ...prevState[name].slice(0, mykey),
        value,
        ...prevState[name].slice(mykey + 1)
      ];
      return { [name] : newArray }
    })
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

    axios.post("http://localhost:8080/my-app/src/server/php/add_product.php", qs.stringify(new_product))
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
                    {
                      vendorCount : (prevState.vendorCount + 1)
                    }
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

class LocationFormGroup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMinQtyChecked: false
    }
  }

  handleClick = () => this.setState

  render() {
    const { isMinQtyChecked } = this.state
    const { location, index, onChange, curQtyVal, min_qty, isMultLocations } = this.props

    return (
      <div style={{
        marginTop: "10px",
        marginBottom: "40px"
      }}>
      <Form.Group>
        <Form.Field width={5}>
          <Form.Input
            name="location"
            value={location || ""}
            mykey = {index}
            label={(isMultLocations) ? `Location #${(index + 1)}` : "Location"}
            fluid
            placeholder="e.g. Storage Room - Bin 156..."
            onChange={onChange}
            size="small"
          />
        </Form.Field>
        <Form.Field width={2}>
          <Form.Input
            name="current_qty"
            value={curQtyVal}
            onChange={onChange}
            mykey={index}
            fluid label="Current Stock"
            type="number"
            min="0"
            size="small"
          />
        </Form.Field>
      </Form.Group>
      <Form.Checkbox
        label="Minimum Inventory Requirement"
        onClick={() => (this.setState(prevState => ({isMinQtyChecked : !prevState.isMinQtyChecked})))}
      />
      {isMinQtyChecked &&
        <Form.Input
          name="min_qty"
          fluid label='Min Qty'
          value={min_qty}
          type="number"
          width={2}
          min={0}
          size="small"
          onChange={onChange}
          mykey={index}
        />
      }
      </div>
    )
  }
}

const CategoryDropbox = ({ category_id, categories, onChange }) => (
  <Form.Group inline>
    <Form.Field required>
      <label>Category </label>
      <Dropdown
        name="category_id"
        value={category_id}
        onChange={onChange}
        required
        size="small"
        placeholder='Choose Category'
        options={
          categories && categories.map((category, i) => ({
            key:i,
            text:category.category_name,
            value:category.category_id
          }))
        }
      />
    </Form.Field>
  </Form.Group>
)

const AddItemHeader = () => (
  <Header as='h1' icon style={{margin: "50px auto 30px", width: "100%"}}>
    <Icon name="wpforms" />
    Add Item
  </Header>
)

const ProductFormGroup = ({ product_name, model_number, onChange }) => (
  <Form.Group style={{
    marginTop: "40px",
    marginBottom: "40px"
  }}>
    <Form.Input
      name="product_name"
      value={product_name}
      onChange={onChange}
      fluid label='Product Name'
      placeholder='e.g. Fuse, LPJ20A (10 pack)...'
      width={6}
      required
      size="small"
    />
    <Form.Input
      name="model_number"
      value={model_number}
      onChange={onChange}
      fluid label='Model Number'
      placeholder='e.g. 1A2B3C...'
      width={4}
      size="small"
    />
  </Form.Group>
)
