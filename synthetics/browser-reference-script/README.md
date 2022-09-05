# Q: How to check if a selector is valid?
A: Could use e.g.
```javascript
document.querySelectorAll("input")

document.querySelectorAll("button")
``` 

# Q: When to use JS Path?
A: When dealing with shadow dom. Below is an example of copying a JS Path with browser inspection.
```javascript
document.querySelector("body > chat-root > chat-vue-login > vue-login").shadowRoot.querySelector("form > div > native-web-component-text-field").shadowRoot.querySelector("input[type=text]")
```