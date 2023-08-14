/* */

interface SectionPageElement extends HTMLElement {
}

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	((component, tagname = 'section-pages') => {
		if (customElements.get(tagname)) {
			return;
		}
		customElements.define(tagname, component);
	})(
		class extends HTMLElement implements SectionPageElement {
			protected home: HTMLAnchorElement;

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { --header: 2rem; --front-color: black; --back-color: white; --tab-back: lightgray; --tab-active: white; --tab-inactive: gray; --home-size: 2rem; --home-icon: ""; display: block; width: 100%; height: 100%; }',
					':host > div { display: grid; grid-template-rows: var(--header) calc(100% - var(--header)); width: 100%; height: 100%; background: var(--back-color); color: var(--front-color); }',
					':host > div > header { display: flex; background: var(--tab-back); }',
					':host > div > header > a#home { display: block; width: var(--home-size); height: 100%; background-image: var(--home-icon); background-size: cover; }',
					':host > div > header > a:not(#home) { text-decoration: none; color: var(--front-color); }',
					':host > div > header > button, :host > div > header > a:not(#home) { display: block; cursor: pointer; border: 0; border-radius: 0.5em 0.5em 0 0; padding: 0 1em; background:var(--tab-inactive); font-size: 1em; line-height: var(--header); }',
					':host > div > header > button.show, :host > div > header > a:not(#home).show { background: var(--tab-active); }',
					':host > div > div { overflow: auto; }',
					'::slotted(*) { display: none; }',
					'::slotted(section.show) { display: block; }',
				].join('');

				this.home = document.createElement('a');
				this.home.id = 'home';
				this.home.href = this.getAttribute('home') || '/';
				const header = document.createElement('header');
				header.appendChild(this.home);

				if (location.hash) {
					this.setAttribute('main', location.hash.substring(1));
					history.replaceState('', document.title, location.pathname + location.search);
				}

				const slot = document.createElement('slot');
				slot.addEventListener('slotchange', () => {
					header.querySelectorAll('button').forEach((button) => {
						header.removeChild(button);
					});
					header.querySelectorAll('a:not(#home)').forEach((button) => {
						header.removeChild(button);
					});
					const main = this.getAttribute('main') || '';
					for (const page of this.children) {
						if (page.tagName === 'A') {
							// Link
							const link = document.createElement('a');
							link.href = (<HTMLAnchorElement> page).href;
							link.innerHTML = page.innerHTML;
							header.appendChild(link);
							if (page.id && page.id === main) {
								link.classList.add('show');
							}
							continue;
						} else if (page.tagName !== 'SECTION') {
							// Not page.
						}

						const tab = document.createElement('button');
						tab.textContent = (<HTMLElement> page).dataset.name || '';
						if (!tab.textContent) {
							continue;
						}
						tab.addEventListener('click', (event) => {
							event.stopPropagation();
							for (const page of this.children) {
								page.classList.remove('show');
							}
							page.classList.add('show');
							for (const tab of header.children) {
								tab.classList.remove('show');
							}
							tab.classList.add('show');
						});
						header.appendChild(tab);
						if (page.id && page.id === main) {
							page.classList.add('show');
							tab.classList.add('show');
						}
					}
				});

				const pages = document.createElement('div');
				pages.appendChild(slot);

				const contents = document.createElement('div');
				contents.appendChild(header);
				contents.appendChild(pages);

				shadow.appendChild(style);
				shadow.appendChild(contents);
			}

			static get observedAttributes() {
				return ['home'];
			}

			attributeChangedCallback(name: string, oldValue: any, newValue: any) {
				if (oldValue === newValue) {
					return;
				}
				this.home.href = newValue || '/';
			}
		},
		script.dataset.tagname,
	);
});
