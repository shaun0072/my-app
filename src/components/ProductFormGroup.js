import React from 'react'
import { Form } from 'semantic-ui-react'

export const ProductFormGroup = ({ product_name, model_number, onChange }) => (
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
