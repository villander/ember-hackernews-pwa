import Component from '@ember/component'
import { run } from '@ember/runloop'

export default Component.extend({
  tagName: 'header',

  originalTopOffset: 0,

  floated: false,

  isOnline: true,

  classNameBindings: ['floated:is-floated:not-floated', 'isOnline'],

  didInsertElement() {
    if (typeof FastBoot === 'undefined') {
      let originalTopOffset = this.element ? this.element.offsetTop : 0
      let clientHeight = this.element ? this.element.clientHeight : 0

      this.originalTopOffset = originalTopOffset
      this.originalHeight = clientHeight

      document.addEventListener('touchmove', this._handleScroll.bind(this), {
        passive: true,
      })
      window.addEventListener('scroll', this._handleScroll.bind(this), {
        passive: true,
      })

      window.addEventListener('offline', event => this._handleOffline(event))
      window.addEventListener('online', event => this._handleOnline(event))
      run(() => this.set('isOnline', navigator.onLine))

      this._handleScroll()
    }
  },

  willDestroyElement() {
    if (typeof FastBoot === 'undefined') {
      document.removeEventListener('touchmove', this._handleScroll)
      window.removeEventListener('scroll', this._handleScroll)
    }
  },

  _handleOffline(event) {
    run(() => this.set('isOnline', false))
  },

  _handleOnline(event) {
    run(() => this.set('isOnline', true))
  },

  _handleScroll() {
    run.join(this, () => {
      let { originalTopOffset } = this
      this.set('floated', window.pageYOffset > originalTopOffset)
    })
  },
})
