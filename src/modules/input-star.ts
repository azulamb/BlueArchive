/* */

interface InputStarElement extends HTMLElement {
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  readonly: boolean;
}

((script, init) => {
  if (document.readyState !== 'loading') {
    return init(script);
  }
  document.addEventListener('DOMContentLoaded', () => {
    init(script);
  });
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
  const STAR_SVG =
    '<svg version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="m49.287 3.8464a10.001 10.001 0 0 0-2.7832 0.60547 10.001 10.001 0 0 0-5.2832 4.5801l-10.188 18.68-20.916 3.918a10.001 10.001 0 0 0-5.4258 16.699l14.619 15.463-2.7383 21.102a10.001 10.001 0 0 0 14.205 10.32l19.223-9.125 19.223 9.125a10.001 10.001 0 0 0 14.205-10.32l-2.7383-21.102 14.619-15.463a10.001 10.001 0 0 0-5.4258-16.699l-20.916-3.918-10.188-18.68a10.001 10.001 0 0 0-9.4922-5.1855z" fill="#333"/><path d="m50 13.819 12.461 22.849 25.581 4.7905-17.88 18.912 3.349 25.81-23.511-11.161-23.511 11.161 3.349-25.81-17.88-18.912 25.581-4.7905z" fill="var(--star)"/></svg>';
  ((component, tagname = 'input-star') => {
    if (customElements.get(tagname)) {
      return;
    }
    customElements.define(tagname, component);
  })(
    class extends HTMLElement implements SectionPageElement {
      protected stars: HTMLElement;

      constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.innerHTML = [
          ':host { display: block; width: 100%; height: 100%; --enable: #e1a400; --disable: gray; --space: 0; }',
          ':host > div { display: flex; }',
          ':host > div > svg { cursor: default; --star: var(--disable); }',
          ':host([disabled]) > div, :host([readonly]) > div { pointer-events: none; }',
          ':host(:not([disabled])) > div > svg { cursor: pointer; --star: var(--disable); }',
          ':host > div > svg.has { --star: var(--enable); }',
          'svg { display: block; border: none; padding: 0; width: 1rem; height: 1rem; margin-left: var(--space); }',
        ].join('');

        this.stars = document.createElement('div');

        shadow.appendChild(style);
        shadow.appendChild(this.stars);

        this.update();
      }

      get value() {
        return parseInt(this.getAttribute('value') || '0') || 0;
      }

      set value(value) {
        this.setAttribute('value', value.toString());
      }

      get min() {
        return parseInt(this.getAttribute('min') || '0') || 0;
      }

      set min(value) {
        this.setAttribute('min', value.toString());
      }

      get max() {
        return parseInt(this.getAttribute('max') || '0') || 0;
      }

      set max(value) {
        this.setAttribute('max', value.toString());
      }

      get disabled() {
        return this.hasAttribute('disabled');
      }

      set disabled(value) {
        if (!value) {
          this.removeAttribute('disabled');
        } else {
          this.setAttribute('disabled', '');
        }
      }

      get readonly() {
        return this.hasAttribute('readonly');
      }

      set readonly(value) {
        if (!value) {
          this.removeAttribute('readonly');
        } else {
          this.setAttribute('readonly', '');
        }
      }

      protected update(dispatch = false) {
        const min = Math.max(0, this.min);
        const max = Math.max(min, this.max);

        const parent = document.createElement('div');
        while (this.stars.children.length < max) {
          parent.innerHTML = STAR_SVG;
          const star = parent.children[0];
          star.addEventListener('click', () => {
            console.log(value);
            this.value = this.value === value ? 0 : value;
          });
          this.stars.appendChild(star);
          const value = this.stars.children.length;
        }
        while (max < this.stars.children.length) {
          this.stars.removeChild(<SVGSVGElement> this.stars.lastChild);
        }

        const value = this.value;
        for (let i = 0; i < max; ++i) {
          const button = <SVGSVGElement> this.stars.children[i];
          if (i < value) {
            button.classList.add('has');
          } else {
            button.classList.remove('has');
          }
        }

        if (dispatch) {
          this.dispatchEvent(new CustomEvent('change', { detail: { value } }));
        }
      }

      static get observedAttributes() {
        return ['value', 'min', 'max'];
      }

      attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        if (oldValue === newValue) {
          return;
        }
        switch (name) {
          case 'value':
            this.title = newValue;
          case 'min':
          case 'max':
            return this.update(true);
        }
      }
    },
    script.dataset.tagname,
  );
});
