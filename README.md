# Nerv-server

> Server-side rendering for Nerv.js

## Install

```bash
npm install --save nerv-server
```

## Usege

```js
import { renderToString } from 'nerv-server';
import { createElement, Component } from 'preact';
/** @jsx createElement */


const Foo = ({ visbility, children }) => (
	<div class={{ visbility }}>{ children }</div>
);

const html = renderToString(
	<Foo visbility={true}>
		<span>bar</span>
	</Foo>
);

console.log(html);
// <div class="visbility"><span>bar</span></div>

```

