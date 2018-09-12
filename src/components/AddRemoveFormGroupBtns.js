import React from 'react'
import { Icon } from 'semantic-ui-react'

export const AddRemoveFormGroupBtns = ({ onMinusClick, onPlusClick }) => (
  <div style={{cursor: "pointer", padding: "5px 0", display: "inline"}}>
    <Icon
      name="plus"
      onClick={onPlusClick} >
    </Icon>

    <Icon
      name="minus"
      onClick={onMinusClick} >
    </Icon>
  </div>
)
