/*
 * @Author: Rodrigo Soares 
 * @Date: 2017-12-25 19:52:04 
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2017-12-25 21:49:01
 */
import React from "react"
import { Dropdown, MenuItem } from "react-bootstrap"

class HistoryDropdown extends React.Component {
  constructor(props) {
    super(props)
    this.onTargetSelect = this.onTargetSelect.bind(this)
  }

  onTargetSelect(target) {
    this.props.handleHistory(target)
  }

  render() {
    const menuItems = this.props.menuData.map((d, idx) => (
      <MenuItem key={`menu-${idx}`} eventKey={`${d}`} onSelect={() => this.onTargetSelect(d)}>
        {d}
      </MenuItem>
    ))
    return (
      <Dropdown id={this.props.dropdownId} pullRight>
        <Dropdown.Toggle bsStyle="primary" bsSize="xsmall">
          <span className="icon_history" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropMenu">{menuItems}</Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default HistoryDropdown
