import { Component, createElement } from 'nervjs'
import { renderToString } from '../src'
const render = renderToString
describe('render', () => {
  it('should render JSX', () => {
    const rendered = render(<div class='foo'>bar</div>)
    const expected = `<div class="foo">bar</div>`

    expect(rendered).toEqual(expected)
  })

  it('should omit falsey attributes', () => {
    const rendered = render(<div a={null} b={undefined} c={false} />)
    const expected = `<div></div>`

    expect(rendered).toEqual(expected)

    expect(render(<div foo={0} />)).toEqual(`<div foo="0"></div>`)
  })

  it('should collapse collapsible attributes', () => {
    const rendered = render(<div class='' style='' foo={true} bar />)
    const expected = `<div class="" style="" foo bar></div>`

    expect(rendered).toEqual(expected)
  })

  it('should encode entities', () => {
    const rendered = render(<div a={'"<>&'}>{'"<>&'}</div>)
    const expected = `<div a="&quot;&lt;&gt;&amp;">&quot;&lt;&gt;&amp;</div>`

    expect(rendered).toEqual(expected)
  })
})
