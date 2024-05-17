<a name="CallManager"></a>

## CallManager ⇐ <code>APIClient</code>
Use Fonoster CallManager, a capability of Fonoster CallManager,
to initiate and monitor automated calls. Fonoster CallManager requires of a
running Fonoster deployment.

**Kind**: global class  
**Extends**: <code>APIClient</code>  
**See**: module:core:APIClient  

* [CallManager](#CallManager) ⇐ <code>APIClient</code>
    * [new CallManager()](#new_CallManager_new)
    * [.call(request)](#CallManager+call) ⇒ <code>Promise.&lt;CallResponse&gt;</code>

<a name="new_CallManager_new"></a>

### new CallManager()
Constructs a new CallManager Object.

**Example**  
```js
const Fonoster = require("@fonoster/sdk")
const callManager = new Fonoster.CallManager()

callManager.call({
  from: "9102104343",
  to: "17853178070",
  webhook: "https://https://071e-47-132-137-75.ngrok.io/voiceapp",
})
.then(console.log)        // successful response
.catch(console.error)   // an error occurred
```
<a name="CallManager+call"></a>

### callManager.call(request) ⇒ <code>Promise.&lt;CallResponse&gt;</code>
Call method.

**Kind**: instance method of [<code>CallManager</code>](#CallManager)  
**Returns**: <code>Promise.&lt;CallResponse&gt;</code> - - call results  
**Throws**:

- if the from number doesn't exist
- if could not connect to the underline services


| Param | Type | Description |
| --- | --- | --- |
| request | <code>CallRequest</code> | Call request options |
| request.from | <code>string</code> | Number you are calling from. You must have this Number configured in your account |
| request.to | <code>string</code> | The callee |
| request.webhook | <code>string</code> | Url of the application that will handle the call If none is provided it will use the webook setup in the Number |
| request.metadata | <code>object</code> | Arbitrary payload to send to the Voice Application |

**Example**  
```js
callManager.call({
  from: "+19102104343",
  to: "+17853178070",
  webhook: "https://voiceapps.acme.com/myvoiceapp",
  metadata?: {}
})
.then(console.log)         // successful response
.catch(console.error);     // an error occurred
```
