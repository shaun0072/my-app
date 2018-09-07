import React from 'react'
import { Form, Dropdown } from 'semantic-ui-react'

export const CategoryDropbox = ({ category_id, categories, onChange }) => (
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
