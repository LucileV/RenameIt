/**
 * @Author: Rodrigo Soares <rodrigo>
 * @Date:   2017-11-15T23:06:38-08:00
 * @Project: Rename It
 * @Last modified by:   rodrigo
 * @Last modified time: 2017-11-16T11:15:26-08:00
 */
import React from 'react';

export default class KeywordButton extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <a href="#" id={this.props.id} data-char={this.props.char} data-tooltip={`Shortcut: ${this.props.char}`} onClick={this.props.click}>{this.props.text}</a>
    )
  }

}
