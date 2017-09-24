import { Component, createElement } from 'nervjs'
import { renderToString } from '../src'
describe('render', () => {
  it('should render JSX', () => {
    const rendered = renderToString(<div class='foo'>bar</div>)
    const expected = `<div class="foo">bar</div>`

    expect(rendered).toEqual(expected)
  })
})
