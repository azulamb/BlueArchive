((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => {
        init(script);
    });
})(document.currentScript, (script) => {
    ((component, tagname = 'section-pages') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        home;
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML = [
                ':host { --header: 2rem; --front-color: black; --back-color: white; --tab-back: lightgray; --tab-active: white; --tab-inactive: gray; --home-size: 2rem; --home-icon: ""; display: block; width: 100%; height: 100%; }',
                ':host > div { display: grid; grid-template-rows: var(--header) calc(100% - var(--header)); width: 100%; height: 100%; background: var(--back-color); color: var(--front-color); overflow: hidden; }',
                ':host > div > header { display: flex; background: var(--tab-back); }',
                ':host > div > header > a#home { display: block; width: var(--home-size); height: 100%; background-image: var(--home-icon); background-size: cover; }',
                ':host > div > header > a:not(#home) { text-decoration: none; color: var(--front-color); }',
                ':host > div > header > button, :host > div > header > a:not(#home) { display: block; cursor: pointer; border: 0; border-radius: 0.5em 0.5em 0 0; padding: 0 1em; background:var(--tab-inactive); font-size: 1em; line-height: var(--header); }',
                ':host > div > header > button.show, :host > div > header > a:not(#home).show { background: var(--tab-active); }',
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
                        const link = document.createElement('a');
                        link.href = page.href;
                        link.innerHTML = page.innerHTML;
                        header.appendChild(link);
                        if (page.id && page.id === main) {
                            link.classList.add('show');
                        }
                        continue;
                    }
                    else if (page.tagName !== 'SECTION') {
                    }
                    const tab = document.createElement('button');
                    tab.textContent = page.dataset.name || '';
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
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) {
                return;
            }
            this.home.href = newValue || '/';
        }
    }, script.dataset.tagname);
});
Promise.all([
    customElements.whenDefined('section-pages'),
]).then(() => {
    fetch('../students.json').then((response) => {
        return response.json();
    }).then((data) => {
        const template = document.getElementById('select_item');
        const parent = document.getElementById('select');
        const students = [];
        data.profile.arona = {
            name: 'アロナ',
            last: '',
            school: '',
            gun: '',
            uniqueWeapon: '',
            club: '',
            age: 0,
            birthday: '',
            height: 138,
            hobby: [],
            profile: '',
        };
        for (const key of STUDENTS) {
            const student = data.profile[key];
            if (student) {
                students.push(Object.assign({ key }, student));
            }
        }
        students.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        for (const student of students) {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = template.innerHTML;
            item.title = student.name;
            item.querySelector('.name').textContent = `${student.name} (${student.height}cm)`;
            item.querySelector('button').addEventListener('click', () => {
                add(student);
            });
            parent.appendChild(item);
        }
    });
    const add = ((list, template) => {
        return (student) => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = template.innerHTML;
            item.title = student.name;
            item.querySelector('.name').textContent = `${student.name} (${student.height}cm)`;
            item.querySelector('button').addEventListener('click', () => {
                list.removeChild(item);
                remove();
            });
            const remove = addStudent(student);
            list.appendChild(item);
        };
    })(document.getElementById('list'), document.getElementById('list_item'));
    const addStudent = ((students) => {
        return (student) => {
            const img = document.createElement('img');
            img.src = `./students/${student.key}.svg`;
            const parent = document.createElement('div');
            parent.classList.add('student');
            parent.title = `${student.name} ${student.height}cm`;
            parent.appendChild(img);
            students.appendChild(parent);
            return () => {
                students.removeChild(parent);
            };
        };
    })(document.getElementById('students'));
    ((dialog) => {
        document.getElementById('help').addEventListener('click', () => {
            dialog.showModal();
        });
        dialog.addEventListener('click', (e) => {
            dialog.close();
        });
        dialog.querySelector('div').addEventListener('click', (event) => {
            event.stopPropagation();
        });
    })(document.getElementById('help_dialog'));
    document.getElementById('stack').addEventListener('change', (event) => {
        if (event.target.checked) {
            document.body.dataset.stack = '';
        }
        else {
            delete document.body.dataset.stack;
        }
    });
    document.getElementById('opacity').addEventListener('change', (event) => {
        const input = event.target;
        document.body.style.setProperty('--student-opacity', `${parseInt(input.value) / 255}`);
    });
});
