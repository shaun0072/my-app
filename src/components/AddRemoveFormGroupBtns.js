import React from 'react'
import { Icon, Button } from 'semantic-ui-react'

export const AddRemoveFormGroupBtns = ({ onMinusClick, onPlusClick }) => (
  <div style={{cursor: "pointer", padding: "5px 0", display: "inline"}}>
    <Button.Group icon>
       <Button>
         <Icon
           name='plus'
           onClick={onPlusClick}
         />
       </Button>
       <Button>
         <Icon name='minus'
           name="minus"
           onClick={onMinusClick}
         />
       </Button>
     </Button.Group>
  </div>
)
