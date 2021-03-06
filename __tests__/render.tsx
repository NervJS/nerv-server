// tslint:disable:max-classes-per-file
import { Component, createElement } from 'nervjs'
import { renderToString } from '../src'
const render = renderToString
describe('render', () => {

  describe('Basic JSX', () => {
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

    it('should self-close void elements', () => {
      const rendered = render(<div><input type='text' /><wbr /></div>)
      const expected = `<div><input type="text"/><wbr/></div>`

      expect(rendered).toEqual(expected)
    })

    it('does not close void elements with closing tags', () => {
      const rendered = render(<input><p>Hello World</p></input>),
        expected = `<input/>`

      expect(rendered).toEqual(expected)
    })

    it('should serialize object styles', () => {
      const rendered = render(<div style={{ color: 'red', border: 'none' }} />),
        expected = `<div style="color:red;border:none;"></div>`

      expect(rendered).toEqual(expected)
    })

    it('should ignore empty object styles', () => {
      const rendered = render(<div style={{}} />),
        expected = `<div></div>`

      expect(rendered).toEqual(expected)
    })

    // FIX: SVG problem
    // it('should render SVG elements', () => {
    //   const rendered = render((
    //     <svg>
    //       <image xlinkHref='#' />
    //       <foreignObject>
    //         <div xlinkHref='#' />
    //       </foreignObject>
    //       <g>
    //         <image xlinkHref='#' />
    //       </g>
    //     </svg>
    //   ))

    // tslint:disable-next-line:max-line-length
    //   expect(rendered).toEqual(`<svg><image xlink:href="#"></image><foreignObject><div xlinkHref="#"></div></foreignObject><g><image xlink:href="#"></image></g></svg>`)
    // })
  })

  describe('Functional component', () => {

    it('should render functional components', () => {
      const Test = jest.fn(({ foo, children }) => <div foo={foo}>{children}</div>)
      const rendered = render(<Test foo='test'>content</Test>)
      expect(rendered).toEqual(`<div foo="test">content</div>`)
      expect(Test).toBeCalled()
      expect(Test).toBeCalledWith({ 'children': ['content'], 'foo': 'test' }, {})
    })

    it('should render functional components within JSX', () => {
      const Test = jest.fn(({ foo, children }) => <div foo={foo}>{children}</div>)
      const rendered = render(
        <section>
          <Test foo={1}><span>asdf</span></Test>
        </section>
      )
      expect(rendered).toEqual(`<section><div foo="1"><span>asdf</span></div></section>`)
      expect(Test).toHaveBeenCalled()
      expect(Test).toHaveBeenCalledWith({
        foo: 1,
        children: [<span>asdf</span>]
      }, {})
    })

  })

  describe('Classical Component', () => {

    it('should render classical components', () => {
      class Test extends Component {
        render () {
          const { foo, children } = this.props
          return <div foo={foo}>{children}</div>
        }
      }

      const spy = jest.spyOn(Test.prototype, 'render')
      const widget = <Test foo='test'>content</Test>
      const rendered = render(widget)
      expect(rendered).toEqual(`<div foo="test">content</div>`)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should render classical components within JSX', () => {
      class Test extends Component {
        render () {
          const { foo, children } = this.props
          return <div foo={foo}>{children}</div>
        }
      }
      const spy = jest.spyOn(Test.prototype, 'render')
      const rendered = render(
        <section>
          <Test foo={1}><span>asdf</span></Test>
        </section>
      )
      expect(rendered).toEqual(`<section><div foo="1"><span>asdf</span></div></section>`)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should apply defaultProps', () => {
      class Test extends Component {
        render () {
          return <div {...this.props} />
        }
      }
      Test.defaultProps = {
        foo: 'default foo',
        bar: 'default bar'
      }

      expect(render(<Test />)).toEqual('<div foo="default foo" bar="default bar"></div>')
      expect(render(<Test bar='b' />)).toEqual('<div bar="b" foo="default foo"></div>')
      expect(render(<Test foo='a' bar='b' />)).toEqual('<div foo="a" bar="b"></div>')
    })

    it('should invoke componentWillMount', () => {
      class Test extends Component {
        // tslint:disable-next-line:no-empty
        componentWillMount () { }
        render () {
          return <div {...this.props} />
        }
      }
      const spy = jest.spyOn(Test.prototype, 'componentWillMount')
      render(<Test />)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should pass context to direct child', () => {
      const CONTEXT = { a: 'a' }
      class Outer extends Component {
        getChildContext () {
          return CONTEXT
        }
        render () {
          return <div><Inner {...this.props} /></div>
        }
      }
      const outerContextSpy = jest.spyOn(Outer.prototype, 'getChildContext')

      class Inner extends Component {
        render () {
          return <div>{this.context && this.context.a}</div>
        }
      }

      const rendered = render(<Outer />)

      expect(rendered).toEqual(`<div><div>a</div></div>`)
      expect(outerContextSpy).toHaveBeenCalledTimes(1)
    })

    it('should pass context to grandchildren', () => {
      const CONTEXT = { a: 'a' }
      class Outer extends Component {
        getChildContext () {
          return CONTEXT
        }
        render () {
          return <div><Inner {...this.props} /></div>
        }
      }
      const outerContextSpy = jest.spyOn(Outer.prototype, 'getChildContext')

      class Inner extends Component {
        render () {
          return <div><Child /></div>
        }
      }

      class Child extends Component {
        render () {
          return <div>{this.context && this.context.a}</div>
        }
      }

      const rendered = render(<Outer />)

      expect(rendered).toEqual(`<div><div><div>a</div></div></div>`)
      expect(outerContextSpy).toHaveBeenCalledTimes(1)
    })
  })
})
