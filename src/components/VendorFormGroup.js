import React from 'react'
import { Form } from 'semantic-ui-react'
import VendorSearchBar from './VendorSearchBar'


export const VendorFormGroup = ({
  vendor,
  item_number,
  link_to_item,
  onSearchChange,
  onResultSelect,
  isMultLocations,
  index,
  groupname
}) => (
  <Form.Group style={{
    marginTop: "10px",
    marginBottom: "40px"
  }}>
    <Form.Field width={5}>
      <label>{(isMultLocations) ? `Vendor #${(index + 1)}` : "Vendor"}</label>
      <VendorSearchBar
        name="vendor"
        selectFirstResult={false}
        value={vendor}
        size="small"
        onSearchChange={onSearchChange}
        onResultSelect={onResultSelect}
        mykey={index}
        index={index}
        groupname={groupname}
      />
    </Form.Field>
    <Form.Field width={3}>
      <Form.Input
        name="item_number"
        value={item_number || ""}
        fluid
        size="small"
        label="Item #"
        onChange={onSearchChange}
        mykey={index}
        index={index}
        groupname={groupname}
      />
    </Form.Field>
    <Form.Field width={7}>
      <Form.Input
        name="link_to_item"
        value={link_to_item}
        fluid
        size="small"
        label="Link to Item"
        placeholder="http://supplierwebsite.com/item..."
        onChange={onSearchChange}
        mykey={index}
        index={index}
        groupname={groupname}
      />
    </Form.Field>
  </Form.Group>
)
