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
((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => {
        init(script);
    });
})(document.currentScript, (script) => {
    const STAR_SVG = '<svg version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="m49.287 3.8464a10.001 10.001 0 0 0-2.7832 0.60547 10.001 10.001 0 0 0-5.2832 4.5801l-10.188 18.68-20.916 3.918a10.001 10.001 0 0 0-5.4258 16.699l14.619 15.463-2.7383 21.102a10.001 10.001 0 0 0 14.205 10.32l19.223-9.125 19.223 9.125a10.001 10.001 0 0 0 14.205-10.32l-2.7383-21.102 14.619-15.463a10.001 10.001 0 0 0-5.4258-16.699l-20.916-3.918-10.188-18.68a10.001 10.001 0 0 0-9.4922-5.1855z" fill="#333"/><path d="m50 13.819 12.461 22.849 25.581 4.7905-17.88 18.912 3.349 25.81-23.511-11.161-23.511 11.161 3.349-25.81-17.88-18.912 25.581-4.7905z" fill="var(--star)"/></svg>';
    ((component, tagname = 'input-star') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        stars;
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
            }
            else {
                this.setAttribute('disabled', '');
            }
        }
        get readonly() {
            return this.hasAttribute('readonly');
        }
        set readonly(value) {
            if (!value) {
                this.removeAttribute('readonly');
            }
            else {
                this.setAttribute('readonly', '');
            }
        }
        update(dispatch = false) {
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
                this.stars.removeChild(this.stars.lastChild);
            }
            const value = this.value;
            for (let i = 0; i < max; ++i) {
                const button = this.stars.children[i];
                if (i < value) {
                    button.classList.add('has');
                }
                else {
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
        attributeChangedCallback(name, oldValue, newValue) {
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
    }, script.dataset.tagname);
});
((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => {
        init(script);
    });
})(document.currentScript, (script) => {
    const CHECK_SVG = '<svg version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="m10 0h80c5.54 0 10 4.46 10 10v80c0 5.54-4.46 10-10 10h-80c-5.54 0-10-4.46-10-10v-80c0-5.54 4.46-10 10-10z" fill="#666"/><path d="m10 4c-3.3932 0-6 2.6068-6 6v80c0 3.3932 2.6068 6 6 6h80c3.3932 0 6-2.6068 6-6v-80c0-3.3932-2.6068-6-6-6h-80z" fill="#fff"/><path d="m78.439 10.123a10 10 0 0 0-6.5273 3.9961l-30.904 42.492-12.326-21.572a10 10 0 0 0-13.643-3.7207 10 10 0 0 0-3.7207 13.643l20 35a10.001 10.001 0 0 0 16.77 0.91992l40-55a10 10 0 0 0-2.207-13.969 10 10 0 0 0-7.4414-1.7891z" fill="var(--line)"/><path d="m80.324 12.006c-0.52226-0.02118-1.0482 0.008967-1.5723 0.091797-2.0964 0.33114-3.9744 1.4807-5.2227 3.1973l-30.904 42.492a2.0002 2.0002 0 0 1-3.3535-0.18359l-12.326-21.572c-2.2039-3.856-7.0577-5.1798-10.914-2.9766-3.856 2.2039-5.1798 7.0577-2.9766 10.914l20 35c2.9186 5.1051 9.9566 5.4915 13.416 0.73633l40-55c2.6122-3.5926 1.827-8.5635-1.7656-11.176-1.2875-0.93605-2.8141-1.4599-4.3809-1.5234z" fill="var(--color)"/></svg>';
    ((component, tagname = 'input-check') => {
        if (customElements.get(tagname)) {
            return;
        }
        customElements.define(tagname, component);
    })(class extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML = [
                ':host { display: block; }',
                ':host > label { display: flex; align-items: center; gap: 0.5rem; }',
                'svg { cursor: pointer; width: 1.2rem; height: 1.2rem; }',
                ':host{ --color: transparent; --line: transparent; }',
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
            }
            else {
                this.setAttribute('checked', '');
            }
        }
        get value() {
            return this.getAttribute('value') || '';
        }
        set value(value) {
            this.setAttribute('value', value);
        }
    }, script.dataset.tagname);
});
class StudentsManager {
    students = {};
    constructor() {
        try {
            this.students = JSON.parse(localStorage.getItem('students') || '');
        }
        catch (_e) {
            this.students = {};
        }
    }
    save() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }
    update(key, data) {
        this.students[key] = data;
    }
    get(key, defaultRarity) {
        if (this.students[key]) {
            return this.students[key];
        }
        return {
            has: false,
            rarity: defaultRarity,
            unique_weapon: 0,
            unique_gear: 0,
            eligma: 0,
            affection: 0,
        };
    }
    exportCSV() {
        const header = [
            'student',
            'has',
            'rarity',
            'unique_weapon',
            'unique_gear',
            'eligma',
            'affection',
        ];
        const data = [
            header.join(','),
        ];
        Object.keys(this.students).map((key) => {
            return Object.assign({
                student: key,
            }, this.students[key]);
        }).forEach((student) => {
            data.push(header.map((key) => {
                const data = student[key];
                if (typeof data === 'boolean') {
                    return data ? 1 : 0;
                }
                return student[key] || '';
            }).join(','));
        });
        return data;
    }
    importCSV(lines) {
        const keys = lines.shift()?.split(',') || [];
        if (keys.length <= 0) {
            throw new Error('ファイル形式が間違っています。');
        }
        const students = {};
        const errors = [];
        for (const line of lines) {
            const values = line.split(',');
            const data = {};
            for (let i = 0; i < keys.length; i++) {
                data[keys[i]] = values[i];
            }
            try {
                const student = {
                    has: data.has === '1',
                    rarity: parseInt(data.rarity) || 0,
                    unique_weapon: parseInt(data.unique_weapon) || 0,
                    unique_gear: parseInt(data.unique_gear) || 0,
                    eligma: parseInt(data.eligma) || 0,
                    affection: parseInt(data.affection) || 0,
                };
                students[data.student] = student;
            }
            catch (error) {
                errors.push(data);
            }
        }
        return {
            students: students,
            errors: errors,
        };
    }
}
Promise.all([
    customElements.whenDefined('section-pages'),
    customElements.whenDefined('input-star'),
    customElements.whenDefined('input-check'),
]).then(() => {
    const studentsBody = document.getElementById('students');
    const template = studentsBody.querySelector('template');
    const DAMAGE_TYPES = [
        'normal',
        'explosive',
        'penetration',
        'mystic',
        'sonic',
    ];
    const ARMOR_TYPES = [
        'normal',
        'light',
        'heavy',
        'special',
        'elastic',
    ];
    const COMBAT_TYPES = [
        'striker',
        'special',
    ];
    const ROLE_TYPES = [
        'tank',
        'attacker',
        'healer',
        'supporter',
        'tactical_support',
    ];
    const POSITION_TYPES = [
        'front',
        'middle',
        'back',
    ];
    const GUN_TYPES = [
        'SG',
        'SMG',
        'AR',
        'GL',
        'HG',
        'RL',
        'SR',
        'RG',
        'MG',
        'MT',
        'FT',
    ];
    const AFFINITY_GRADES = [
        'ss',
        's',
        'a',
        'b',
        'c',
        'd',
    ];
    const AFFINITY_GRADE_NAMES = {
        d: 'D',
        c: 'C',
        b: 'B',
        a: 'A',
        s: 'S',
        ss: 'SS',
    };
    const SCHOOLS = [
        'hyakkiyako',
        'red_winter',
        'trinity',
        'gehenna',
        'abydos',
        'millennium',
        'arius',
        'shanhaijing',
        'valkyrie',
        'srt',
        'etc',
    ];
    const RARITY_ELIGMA = {
        rarity1: 0,
        rarity2: 30,
        rarity3: 80,
        rarity4: 100,
        rarity5: 120,
        gear1: 0,
        gear2: 120,
        gear3: 180,
    };
    const studentsManager = new StudentsManager();
    fetch('./students.json').then((response) => {
        return response.json();
    }).then((data) => {
        const students = [];
        Object.keys(data.profile).forEach((key) => {
            const student = Object.assign({
                key: key,
            }, data.profile[key]);
            if (!student.another) {
                student.another = [];
            }
            if (!student.another.includes('normal')) {
                student.another.push('normal');
            }
            for (const type of student.another) {
                const anotherStudent = Object.assign({}, student, data[type][key]);
                if (type !== 'normal') {
                    anotherStudent.key += '_' + type;
                    anotherStudent.name += `(${anotherStudent.suffix || ANOTHER_NAME[type]})`;
                }
                students.push(anotherStudent);
            }
        });
        console.log(1);
        console.log(students.map((v) => { return v.name; }).join(','));
        students.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        console.log(students.map((v) => { return v.name; }).join(','));
        return students;
    }).then((students) => {
        for (const student of students) {
            const tr = document.createElement('tr');
            if (student.playable) {
                tr.dataset.playable = 'true';
            }
            tr.dataset.student = student.key;
            tr.dataset.name = student.name;
            tr.dataset.base_rarity = student.rarity.toString();
            tr.dataset.school = student.school;
            tr.dataset.combat = student.combat;
            tr.dataset.role = student.role;
            tr.dataset.position = student.position;
            tr.dataset.gun = student.gun;
            tr.dataset.damage = student.damage;
            tr.dataset.armor = student.armor;
            tr.dataset.birthday = student.birthday;
            tr.dataset.height = (student.height || 0).toString();
            tr.dataset.age = (student.age || 0).toString();
            if (student.useCover) {
                tr.dataset.use_cover = 'true';
            }
            if (student.obtain) {
                tr.dataset.obtain = student.obtain;
            }
            tr.innerHTML = template.innerHTML;
            const has = tr.querySelector('input[type="checkbox"]');
            has.value = student.key;
            tr.querySelector('.name').textContent = student.name;
            const baseRarity = tr.querySelector('.base_rarity input-star');
            baseRarity.value = student.rarity;
            baseRarity.max = student.rarity;
            if (student.obtain) {
                baseRarity.classList.add(student.obtain);
                baseRarity.title = LABEL[student.obtain];
            }
            const combat = tr.querySelector('.combat');
            const role = tr.querySelector('.role');
            const position = tr.querySelector('.position');
            const gun = tr.querySelector('.gun');
            const rarity = tr.querySelector('.rarity input-star');
            const uniqueWeapon = tr.querySelector('.unique_weapon input-star');
            const uniqueGear = tr.querySelector('.unique_gear input-star');
            const eligma = tr.querySelector('.eligma input');
            const affection = tr.querySelector('.affection input');
            const useCover = tr.querySelector('.use_cover');
            const urban = tr.querySelector('.urban');
            const outdoors = tr.querySelector('.outdoors');
            const indoors = tr.querySelector('.indoors');
            tr.querySelector('.school').textContent = SCHOOL[student.school];
            const age = tr.querySelector('.age');
            const birthday = tr.querySelector('.birthday');
            const height = tr.querySelector('.height');
            combat.title = student.combat;
            role.title = student.role;
            position.title = student.position;
            if (student.useCover) {
                useCover.title = 'Use';
            }
            gun.textContent = student.gun;
            if (student.affinity.urban !== student.affinityMax.urban) {
                urban.classList.add('diff');
            }
            if (student.affinity.outdoors !== student.affinityMax.outdoors) {
                outdoors.classList.add('diff');
            }
            if (student.affinity.indoors !== student.affinityMax.indoors) {
                indoors.classList.add('diff');
            }
            changeAffinity(false);
            age.textContent = typeof student.age === 'number' ? student.age.toString() : '-';
            birthday.textContent = student.birthday ? student.birthday.replace(/([0-9]{2})([0-9]{2})/, '$1/$2') : '-';
            height.textContent = student.height ? student.height.toString() : '-';
            studentsBody.appendChild(tr);
            function save() {
                const data = {
                    has: has.checked,
                    rarity: rarity.value,
                    unique_weapon: uniqueWeapon.value,
                    unique_gear: uniqueGear.value,
                    eligma: parseInt(eligma.value),
                    affection: parseInt(affection.value),
                };
                studentsManager.update(student.key, data);
                studentsManager.save();
            }
            function changeAffinity(upgrade) {
                const key = upgrade ? 'affinityMax' : 'affinity';
                urban.dataset.affinity = student[key].urban;
                outdoors.dataset.affinity = student[key].outdoors;
                indoors.dataset.affinity = student[key].indoors;
                urban.title = AFFINITY_GRADE_NAMES[student[key].urban];
                outdoors.title = AFFINITY_GRADE_NAMES[student[key].outdoors];
                indoors.title = AFFINITY_GRADE_NAMES[student[key].indoors];
                urban.textContent = student.affinity.urban === student.affinityMax.urban
                    ? student.affinity.urban
                    : `${student.affinity.urban}→${student.affinityMax.urban}`;
                outdoors.textContent = student.affinity.outdoors === student.affinityMax.outdoors
                    ? student.affinity.outdoors
                    : `${student.affinity.outdoors}→${student.affinityMax.outdoors}`;
                indoors.textContent = student.affinity.indoors === student.affinityMax.indoors
                    ? student.affinity.indoors
                    : `${student.affinity.indoors}→${student.affinityMax.indoors}`;
                tr.dataset.urban = student[key].urban;
                tr.dataset.outdoors = student[key].outdoors;
                tr.dataset.indoors = student[key].indoors;
            }
            function changeValue() {
                const rarityValue = rarity.value;
                if (rarityValue === 5) {
                    uniqueWeapon.disabled = false;
                }
                else {
                    uniqueWeapon.disabled = true;
                }
                if (student.uniqueGear) {
                    uniqueGear.disabled = rarityValue < 4;
                }
                if (rarityValue < 3) {
                    affection.max = '10';
                }
                else if (rarityValue < 5) {
                    affection.max = '20';
                }
                else {
                    affection.max = '100';
                }
                affection.classList[parseInt(affection.max) <= parseInt(affection.value) ? 'add' : 'remove']('warning');
                tr.dataset.rarity = rarityValue.toString();
                if (uniqueWeapon.disabled) {
                    tr.dataset.unique_weapon = '0';
                    changeAffinity(false);
                }
                else {
                    tr.dataset.unique_weapon = uniqueWeapon.value.toString();
                    if (3 <= uniqueWeapon.value) {
                        changeAffinity(true);
                    }
                    else {
                        changeAffinity(false);
                    }
                }
                if (uniqueGear.disabled) {
                    tr.dataset.unique_gear = uniqueGear.min <= 0 ? '' : '0';
                }
                else {
                    tr.dataset.unique_gear = uniqueGear.value.toString();
                }
            }
            function openUnique(open) {
                if (open) {
                    rarity.disabled = false;
                    tr.dataset.has = 'true';
                    tr.dataset.eligma = eligma.value;
                    tr.dataset.affection = affection.value;
                    changeValue();
                }
                else {
                    rarity.disabled = true;
                    uniqueWeapon.disabled = true;
                    uniqueGear.disabled = true;
                    delete tr.dataset.has;
                    tr.dataset.eligma = '0';
                    tr.dataset.affection = '0';
                    tr.dataset.urban = student.affinity.urban;
                    tr.dataset.outdoors = student.affinity.outdoors;
                    tr.dataset.indoors = student.affinity.indoors;
                }
            }
            ((data) => {
                if (data.has) {
                    has.checked = true;
                    tr.dataset.has = 'true';
                }
                rarity.value = data.rarity;
                uniqueWeapon.value = data.unique_weapon;
                uniqueGear.value = data.unique_gear;
                eligma.value = `${data.eligma}`;
                affection.value = `${data.affection}`;
                openUnique(has.checked);
            })(studentsManager.get(student.key, student.rarity));
            has.addEventListener('change', () => {
                openUnique(has.checked);
                save();
            });
            rarity.addEventListener('change', () => {
                changeValue();
                save();
            });
            uniqueWeapon.addEventListener('change', () => {
                changeValue();
                save();
            });
            if (!student.uniqueGear) {
                uniqueGear.max = 0;
            }
            uniqueGear.addEventListener('change', () => {
                changeValue();
                save();
            });
            eligma.addEventListener('change', () => {
                save();
            });
            affection.addEventListener('change', () => {
                changeValue();
                save();
            });
        }
        return [...studentsBody.children].filter((tr) => {
            return tr instanceof HTMLTableRowElement;
        });
    }).then((students) => {
        function getGroups(dialog) {
            const result = {};
            const list = dialog.querySelectorAll('[group]');
            for (const item of list) {
                const group = item.getAttribute('group') || '_';
                if (!result[group]) {
                    result[group] = [];
                }
                result[group].push(item);
            }
            return result;
        }
        function parseValues(data) {
            const result = {};
            for (const group in data) {
                const items = data[group];
                const trues = [];
                for (const item of items) {
                    if (item.checked) {
                        trues.push(item.value);
                    }
                }
                result[group] = trues.length !== items.length ? trues : [];
            }
            return result;
        }
        ((dialog) => {
            const report = {
                hasStudents: document.getElementById('report_has_students'),
                allStudents: document.getElementById('report_all_students'),
                rarity1: document.getElementById('report_rarity_1'),
                rarity2: document.getElementById('report_rarity_2'),
                rarity3: document.getElementById('report_rarity_3'),
                rarity4: document.getElementById('report_rarity_4'),
                rarity5: document.getElementById('report_rarity_5'),
                uniqueWeapon0: document.getElementById('report_unique_weapon_0'),
                uniqueWeapon1: document.getElementById('report_unique_weapon_1'),
                uniqueWeapon2: document.getElementById('report_unique_weapon_2'),
                uniqueWeapon3: document.getElementById('report_unique_weapon_3'),
                uniqueGear0: document.getElementById('report_unique_gear_0'),
                uniqueGear1: document.getElementById('report_unique_gear_1'),
                uniqueGear2: document.getElementById('report_unique_gear_2'),
                needEligmaRarity: document.getElementById('report_need_eligma_rarity'),
            };
            document.getElementById('report').addEventListener('click', () => {
                const data = {
                    hasStudents: 0,
                    allStudents: 0,
                    rarity1: 0,
                    rarity2: 0,
                    rarity3: 0,
                    rarity4: 0,
                    rarity5: 0,
                    uniqueWeapon0: 0,
                    uniqueWeapon1: 0,
                    uniqueWeapon2: 0,
                    uniqueWeapon3: 0,
                    uniqueGear0: 0,
                    uniqueGear1: 0,
                    uniqueGear2: 0,
                    needEligmaRarity: 0,
                };
                students.forEach((tr) => {
                    ++data.allStudents;
                    if (tr.dataset.has) {
                        ++data.hasStudents;
                        let eligma = 0;
                        for (let i = parseInt(tr.dataset.rarity || '') + 1; i <= 5; ++i) {
                            eligma += RARITY_ELIGMA[`rarity${i}`];
                        }
                        data.needEligmaRarity += Math.max(0, eligma - parseInt(tr.dataset.eligma || '0'));
                    }
                    ++data[`rarity${tr.dataset.rarity}`];
                    ++data[`uniqueWeapon${tr.dataset.unique_weapon}`];
                    if (tr.dataset.unique_gear) {
                        ++data[`uniqueGear${tr.dataset.unique_gear}`];
                    }
                });
                data.needEligmaRarity *= 5;
                Object.keys(report).forEach((key) => {
                    report[key].textContent = `${data[key]}`;
                });
                dialog.showModal();
            });
            dialog.addEventListener('click', (e) => {
                dialog.close();
            });
            dialog.querySelector('div').addEventListener('click', (event) => {
                event.stopPropagation();
            });
        })(document.getElementById('report_dialog'));
        ((dialog) => {
            document.getElementById('filter').addEventListener('click', () => {
                dialog.showModal();
            });
            function check(student, data) {
                for (const key in data) {
                    const items = data[key];
                    if (items.length <= 0) {
                        continue;
                    }
                    if (!items.includes(student.dataset[key] || '')) {
                        return false;
                    }
                }
                return true;
            }
            function filter() {
                const data = parseValues(getGroups(dialog));
                for (const student of students) {
                    student.classList[check(student, data) ? 'remove' : 'add']('hide');
                }
            }
            dialog.addEventListener('click', (e) => {
                dialog.close();
            });
            dialog.querySelector('div').addEventListener('click', (event) => {
                event.stopPropagation();
            });
            dialog.querySelector('.ok').addEventListener('click', () => {
                filter();
                dialog.close();
            });
            dialog.querySelector('.reset').addEventListener('click', () => {
                dialog.querySelectorAll('input-check').forEach((item) => {
                    item.checked = false;
                });
            });
        })(document.getElementById('filter_dialog'));
        ((input) => {
            function check(student, word) {
                const expHiragana = new RegExp(`.*${word.replace(/[\u30A1-\u30FA]/g, (char) => {
                    return String.fromCharCode(char.charCodeAt(0) - 0x60);
                })}.*`, 'i');
                const expKatakana = new RegExp(`.*${word.replace(/[\u3041-\u3096]/g, (char) => {
                    return String.fromCharCode(char.charCodeAt(0) + 0x60);
                })}.*`, 'i');
                if (expHiragana.test(student.dataset.name || '') || expKatakana.test(student.dataset.name || '')) {
                    return true;
                }
                return false;
            }
            input.addEventListener('input', () => {
                const word = input.value.trim();
                if (!word) {
                    for (const student of students) {
                        student.classList.remove('hide');
                    }
                }
                else {
                    for (const student of students) {
                        student.classList[check(student, word) ? 'remove' : 'add']('hide');
                    }
                }
            });
        })(document.getElementById('search_students'));
        document.getElementById('download_students').addEventListener('click', () => {
            const data = studentsManager.exportCSV();
            const link = document.createElement('a');
            link.setAttribute('download', 'bluearchive_students.csv');
            link.setAttribute('href', `data:text/csv;charset=UTF-8,${encodeURIComponent(data.join(',\n'))}`);
            link.click();
        });
        document.getElementById('import_students').addEventListener('change', (event) => {
            const file = event.target.files?.[0];
            if (!file) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = event.target?.result;
                if (!data) {
                    return alert('ファイル読み込みに失敗しました。');
                }
                try {
                    const result = studentsManager.importCSV(data.split('\n'));
                    console.log(result);
                    if (confirm(`取り込み数: ${Object.keys(result.students).length}
エラー数: ${result.errors.length}
取り込みますか？`)) {
                        Object.keys(result.students).forEach((key) => {
                            studentsManager.update(key, result.students[key]);
                        });
                        studentsManager.save();
                        location.reload();
                    }
                }
                catch (error) {
                    alert('ファイル形式が間違っています。');
                }
            };
            reader.onabort = () => {
                alert('ファイル読み込みに失敗しました。');
            };
            reader.onerror = () => {
                alert('ファイル読み込みに失敗しました。');
            };
            reader.readAsText(file);
        });
        ((labels) => {
            const nameLabel = labels.find((label) => {
                return label.dataset.key === 'name';
            });
            const compare = {
                boolean: (a, b, key) => {
                    const valueA = a.dataset[key] !== undefined;
                    const valueB = b.dataset[key] !== undefined;
                    return valueA === valueB ? 0 : (valueA ? -1 : 1);
                },
                string: (a, b, key) => {
                    const valueA = a.dataset[key] || '';
                    const valueB = b.dataset[key] || '';
                    return valueA.localeCompare(valueB);
                },
                number: (a, b, key) => {
                    const valueA = parseInt(a.dataset[key] || '0');
                    const valueB = parseInt(b.dataset[key] || '0');
                    return valueA - valueB;
                },
                damage: (a, b, key) => {
                    const valueA = DAMAGE_TYPES.indexOf(a.dataset[key] || '');
                    const valueB = DAMAGE_TYPES.indexOf(b.dataset[key] || '');
                    return valueA - valueB;
                },
                armor: (a, b, key) => {
                    const valueA = ARMOR_TYPES.indexOf(a.dataset[key] || '');
                    const valueB = ARMOR_TYPES.indexOf(b.dataset[key] || '');
                    return valueA - valueB;
                },
                combat: (a, b, key) => {
                    const valueA = COMBAT_TYPES.indexOf(a.dataset[key] || '');
                    const valueB = COMBAT_TYPES.indexOf(b.dataset[key] || '');
                    return valueA - valueB;
                },
                role: (a, b, key) => {
                    const valueA = ROLE_TYPES.indexOf(a.dataset[key] || '');
                    const valueB = ROLE_TYPES.indexOf(b.dataset[key] || '');
                    return valueA - valueB;
                },
                position: (a, b, key) => {
                    const valueA = POSITION_TYPES.indexOf(a.dataset[key] || '');
                    const valueB = POSITION_TYPES.indexOf(b.dataset[key] || '');
                    return valueA - valueB;
                },
                gun: (a, b, key) => {
                    const valueA = GUN_TYPES.indexOf(a.dataset[key] || '');
                    const valueB = GUN_TYPES.indexOf(b.dataset[key] || '');
                    return valueA - valueB;
                },
                affinity: (a, b, key) => {
                    const valueA = AFFINITY_GRADES.indexOf(a.dataset[key] || '');
                    const valueB = AFFINITY_GRADES.indexOf(b.dataset[key] || '');
                    return valueA - valueB;
                },
                school: (a, b, key) => {
                    const valueA = SCHOOLS.indexOf(a.dataset[key] || 'etc');
                    const valueB = SCHOOLS.indexOf(b.dataset[key] || 'etc');
                    return valueA - valueB;
                },
                age: (a, b, key) => {
                    const valueA = parseInt(a.dataset[key] || '0');
                    const valueB = parseInt(b.dataset[key] || '0');
                    if (valueA === valueB) {
                        return compare.string(a, b, 'birthday');
                    }
                    return valueA - valueB;
                },
            };
            function getSorts() {
                const sortTypes = [...labels].filter((label) => {
                    return label.dataset.order && label.dataset.key !== 'name';
                }).map((label) => {
                    return {
                        compare: compare[label.dataset.type],
                        order: label.dataset.order,
                        key: label.dataset.key,
                    };
                });
                sortTypes.push({
                    compare: compare.string,
                    order: nameLabel.dataset.order || 'asc',
                    key: 'name',
                });
                return sortTypes;
            }
            function sort() {
                const sorts = getSorts();
                return (a, b) => {
                    for (const sort of sorts) {
                        const result = sort.compare(a, b, sort.key);
                        if (result !== 0) {
                            return sort.order === 'asc' ? result : -result;
                        }
                    }
                    return 0;
                };
            }
            labels.forEach((label) => {
                const button = label.querySelector('button');
                button.addEventListener('click', () => {
                    labels.forEach((target) => {
                        if (target === label) {
                            return;
                        }
                        delete target.dataset.order;
                    });
                    switch (label.dataset.order) {
                        case 'asc':
                            label.dataset.order = 'desc';
                            break;
                        case 'desc':
                            delete label.dataset.order;
                            break;
                        default:
                            label.dataset.order = 'asc';
                            break;
                    }
                    students.sort(sort());
                    for (const student of students) {
                        studentsBody.appendChild(student);
                    }
                });
            });
        })([...document.getElementById('students_header').querySelectorAll('td > label')]);
    });
});
