import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'

export default class LocationFormGroup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMinQtyChecked: false
    }
  }

  handleClick = () => this.setState

  render() {
    const { isMinQtyChecked } = this.state
    const { location, index, onChange, cur_qty, min_qty, isMultLocations, groupname } = this.props

    return (
      <div style={{
        marginTop: "10px",
        marginBottom: "40px"
      }}>
      <Form.Group>
        <Form.Field width={5}>
          <Form.Input
            name="location"
            value={location}
            mykey = {index}
            index={index}
            label={(isMultLocations) ? `Location #${(index + 1)}` : "Location"}
            fluid
            placeholder="e.g. Storage Room - Bin 156..."
            onChange={onChange}
            size="small"
            groupname={groupname}
          />
        </Form.Field>
        <Form.Field width={2}>
          <Form.Input
            name="cur_qty"
            value={cur_qty}
            onChange={onChange}
            mykey={index}
            index={index}
            fluid label="Current Stock"
            type="number"
            min="0"
            size="small"
            groupname={groupname}
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
          index={index}
          groupname={groupname}
        />
      }
      </div>
    )
  }
}
