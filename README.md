# mocha-ws-reporter

Want to run Mocha in the browser and collect test report data over a WebSocket connection? You've come to the right place!

This reporter utilises the standard Mocha HTML reporter so that everything will work as per usual in the browser whilst also emitting the report over a WebSocket for you to collect elsewhere.

## Install

### NPM

```sh
> npm i mocha-ws-reporter
```

### Unpkg CDN

```html
<script type="module">
  import { wsReporter } from "https://www.unpkg.com/mocha-ws-reporter@0.1.3"
</script>
```

## Use

```html
<script type="module">
  import { wsReporter } from "https://www.unpkg.com/mocha-ws-reporter@0.1.3"

  mocha.setup({
    ui: "bdd",
    reporter: wsReporter({
      port: 7777, // this is the default port value
    }),
  })
</script>
```

Note that the reporter will automatically call `mocha.run` as soon as the socket connection is open so there's no need to do that yourself.
