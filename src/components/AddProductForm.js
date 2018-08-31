import React, { Component } from 'react'
import qs from 'qs'
import axios from 'axios';
import { Header, Icon, Form, Segment, Dropdown, Divider } from 'semantic-ui-react'
import VendorSearchBar from './VendorSearchBar'

export default class AddProductForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      vendors: [],
      category_id: '',
      product_name: '',
      model_number: '',
      current_qty: [],
      min_qty: [],
      vendor: '',
      item_number: '',
      link_to_item: '',
      location: [],
      description: '',
      locationCount: 1
    }
  }

  componentDidMount() {
    axios.get("http://localhost:80/my-app/src/server/php/get_categories.php")
      .then(res => {
        this.setState({
          categories : res.data,
        });
      })
  }

  handleChange = (e, { name, value }) => {this.setState({ [name]: value })}

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

  handleResultSelect = (e, { result }) => this.setState({ vendor: result.title })

  handleSubmit = () => {
    const {category_id, product_name, model_number, current_qty, min_qty, vendor, item_number, link_to_item, location, description} = this.state
    const new_product = {
      category_id, product_name, model_number, current_qty, min_qty, vendor, item_number, link_to_item, location, description
    }

    axios.post("http://localhost:80/my-app/src/server/php/add_product.php", qs.stringify(new_product))
      .then(res => {
        console.log(res.data)
      })
  }

  renderLocationFormGroup = numberOfElements => {
    let locationFormGroup = []
    for(var i=0; i < numberOfElements;i++) {
      locationFormGroup.push(
        <LocationFormGroup
          locationVal={this.state.location[i]}
          curQtyVal={this.state.current_qty[i]}
          min_qty={this.state.min_qty}
          index={i}
          key={i}
          onChange={this.handleArrayChange}
        />
      )
    }
    return locationFormGroup
  }

  render() {
    const {
      categories,
      product_name,
      model_number,
      category_id,
      vendor,
      item_number,
      link_to_item,
      description,
      locationCount
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

            <VendorFormGroup
              vendor={vendor}
              item_number={item_number}
              link_to_item={link_to_item}
              onSearchChange={this.handleChange}
              onResultSelect={this.handleResultSelect}
            />

            <Divider horizontal inverted>TMF</Divider>

            <div style={{cursor: "pointer", padding: "5px 0", border: "1px solid white", display: "inline"}}>
              <Icon
                name="plus"
                onClick={() => (this.setState(prevState => ({ locationCount : (prevState.locationCount + 1) })))}>
              </Icon>
              <Icon
                name="minus"
                onClick={() => (this.setState(prevState => ({ locationCount : (prevState.locationCount - 1) })))}>
              </Icon>
            </div>

            {this.renderLocationFormGroup(locationCount)}

            <Form.Field>
              <label style={{margin: "30px 0 0"}}>Description</label>
              <Form.TextArea
                name="description"
                value={description}
                placeholder='Enter Tags (e.g. 1700 pump 1.5" valve hoist motor 20 amps... )'
                onChange={this.handleAChange}
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

    return (
      <div>
      <Form.Group>
        <Form.Field width={5}>
          <Form.Input
            name="location"
            value={this.props.locationVal || ""}
            mykey = {this.props.index}
            label="Location"
            fluid
            placeholder="e.g. Storage Room - Bin 156..."
            onChange={this.props.onChange}
          />
        </Form.Field>
        <Form.Field width={2}>
          <Form.Input
            name="current_qty"
            value={this.props.curQtyVal}
            onChange={this.props.onChange}
            mykey={this.props.index}
            fluid label="Current Stock"
            type="number"
            min="0"
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
          value={this.props.min_qty}
          type="number"
          width={2}
          min={0}
          onChange={this.props.onChange}
          mykey={this.props.index}
        />
      }
      </div>
    )
  }
}

const VendorFormGroup = ({ vendor, item_number, link_to_item, onSearchChange, onResultSelect  }) => (
  <Form.Group>
    <Form.Field width={5}>
      <label>Vendor</label>
      <VendorSearchBar
        name="vendor"
        selectFirstResult
        value={vendor}
        onSearchChange={onSearchChange}
        onResultSelect={onResultSelect}
      />
    </Form.Field>
    <Form.Field width={3}>
      <Form.Input
        name="item_number"
        value={item_number}
        fluid
        label="Item #"
        onChange={onSearchChange}
      />
    </Form.Field>
    <Form.Field width={7}>
      <Form.Input
        name="link_to_item"
        value={link_to_item}
        fluid
        label="Link to Item"
        placeholder="http://supplierwebsite.com/item..."
        onChange={onSearchChange}
      />
    </Form.Field>
  </Form.Group>
)

const CategoryDropbox = ({ category_id, categories, onChange }) => (
  <Form.Group inline>
    <Form.Field required>
      <label>Category </label>
      <Dropdown
        name="category_id"
        value={category_id}
        onChange={onChange}
        required
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
  <Form.Group>
    <Form.Input
      name="product_name"
      value={product_name}
      onChange={onChange}
      fluid label='Product Name'
      placeholder='e.g. Fuse, LPJ20A (10 pack)...'
      width={6}
      required
    />
    <Form.Input
      name="model_number"
      value={model_number}
      onChange={onChange}
      fluid label='Model Number'
      placeholder='e.g. 1A2B3C...'
      width={4}
    />
  </Form.Group>
)
