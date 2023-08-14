/* */

interface InputCheckElement extends HTMLElement {
	checked: boolean;
	value: string;
}

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const CHECK_SVG =
		'<svg version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="m10 0h80c5.54 0 10 4.46 10 10v80c0 5.54-4.46 10-10 10h-80c-5.54 0-10-4.46-10-10v-80c0-5.54 4.46-10 10-10z" fill="#666"/><path d="m10 4c-3.3932 0-6 2.6068-6 6v80c0 3.3932 2.6068 6 6 6h80c3.3932 0 6-2.6068 6-6v-80c0-3.3932-2.6068-6-6-6h-80z" fill="#fff"/><path d="m78.439 10.123a10 10 0 0 0-6.5273 3.9961l-30.904 42.492-12.326-21.572a10 10 0 0 0-13.643-3.7207 10 10 0 0 0-3.7207 13.643l20 35a10.001 10.001 0 0 0 16.77 0.91992l40-55a10 10 0 0 0-2.207-13.969 10 10 0 0 0-7.4414-1.7891z" fill="var(--line)"/><path d="m80.324 12.006c-0.52226-0.02118-1.0482 0.008967-1.5723 0.091797-2.0964 0.33114-3.9744 1.4807-5.2227 3.1973l-30.904 42.492a2.0002 2.0002 0 0 1-3.3535-0.18359l-12.326-21.572c-2.2039-3.856-7.0577-5.1798-10.914-2.9766-3.856 2.2039-5.1798 7.0577-2.9766 10.914l20 35c2.9186 5.1051 9.9566 5.4915 13.416 0.73633l40-55c2.6122-3.5926 1.827-8.5635-1.7656-11.176-1.2875-0.93605-2.8141-1.4599-4.3809-1.5234z" fill="var(--color)"/></svg>';
	((component, tagname = 'input-check') => {
		if (customElements.get(tagname)) {
			return;
		}
		customElements.define(tagname, component);
	})(
		class extends HTMLElement implements SectionPageElement {
			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					':host > label { display: flex; align-items: center; gap: 0.5rem; }',
					'svg { cursor: pointer; width: 1.2rem; height: 1.2rem; }',
					':host{ --color: transparent; --line: transparent; }',
					//':host{ --color: #cce9e9; --line: #666; }',
					':host([checked]){ --color: #0ff; --line: #666; }',
					'div { pointer-events: none; user-select: none; }',
				].join('');

				const button = ((parent) => {
					parent.innerHTML = CHECK_SVG;
					return parent.children[0];
				})(document.createElement('div'));

				const content = document.createElement('div');
				content.appendChild(document.createElement('slot'));

				const contents = document.createElement('label');
				contents.appendChild(button);
				contents.appendChild(content);
				contents.addEventListener('click', () => {
					this.checked = !this.checked;
				});

				shadow.appendChild(style);
				shadow.appendChild(contents);
			}

			get checked() {
				return this.hasAttribute('checked');
			}

			set checked(value) {
				if (!value) {
					this.removeAttribute('checked');
				} else {
					this.setAttribute('checked', '');
				}
			}

			get value() {
				return this.getAttribute('value') || '';
			}

			set value(value) {
				this.setAttribute('value', value);
			}
		},
		script.dataset.tagname,
	);
});
