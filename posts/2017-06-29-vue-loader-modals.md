---
published: true
layout: post
comments: true
---

Vue's [example modal component](https://vuejs.org/v2/examples/modal.html) is pretty good, but what if we're using [vue-loader](https://github.com/vuejs/vue-loader) and want the same functionality? This is my solution.

Create a new component, `Modal.vue`. The `template` section is slightly different than the example template in that it has to contain the button trigger. So create a container `div` with the button in it:

```html
<div>
    <button @click="showModal = true">Show</button>
</div>
```

Then after the button insert the example's template:

```html
<div>
    <button @click="showModal = true">Show</button>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class="modal-header">
                        <slot name="header">
                            default header
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            default body
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            default footer
                            <button class="modal-default-button" @click="$emit('close')">
                                OK
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</div>
```

Since we don't want the modal to show right away, modify the opening `modal-mask` `div`:

```html
<div class="modal-mask" v-if="showModal">
```

We then need to change the close `button`'s `@click` behaviour:

```html
<button class="modal-default-button" @click="showModal = false">
```

In the `script` section we need to define the `showModal` property:

```javascript
export default {
    data: function() {
        return {
            showModal: false
        }
    },
}
```

Finally, in the `style` section paste the styles from the example `css` tab. See the final code [here](https://github.com/unlikenesses/vue-modal).