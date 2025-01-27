/// <reference path="../modules/section-pages.ts" />

declare const STUDENTS: string[];

interface StudentData extends Profile {
	key: string;
}

Promise.all([
	customElements.whenDefined('section-pages'),
]).then(() => {
	fetch('../students.json').then((response) => {
		return response.json();
	}).then((data: Students) => {
		const template = document.getElementById('select_item') as HTMLTemplateElement;
		const parent = document.getElementById('select') as HTMLElement;
		const students: StudentData[] = [];
		data.profile.arona = {
			name: 'アロナ',
			last: '',
			school: <any> '',
			gun: <any> '',
			uniqueWeapon: '',
			club: <any> '',
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
			(<HTMLElement> item.querySelector('.name')).textContent = `${student.name} (${student.height}cm)`;
			(<HTMLElement> item.querySelector('button')).addEventListener('click', () => {
				add(student);
			});
			parent.appendChild(item);
		}
	});
	const add = ((list, template) => {
		return (student: StudentData) => {
			const item = document.createElement('div');
			item.classList.add('item');
			item.innerHTML = template.innerHTML;
			item.title = student.name;
			(<HTMLElement> item.querySelector('.name')).textContent = `${student.name} (${student.height}cm)`;
			(<HTMLElement> item.querySelector('button')).addEventListener('click', () => {
				list.removeChild(item);
				remove();
			});
			const remove = addStudent(student);
			list.appendChild(item);
		};
	})(document.getElementById('list') as HTMLElement, document.getElementById('list_item') as HTMLTemplateElement);

	const addStudent = ((students) => {
		return (student: StudentData) => {
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
	})(document.getElementById('students') as HTMLElement);
	((dialog) => {
		(<HTMLElement> document.getElementById('help')).addEventListener('click', () => {
			dialog.showModal();
		});
		dialog.addEventListener('click', (e) => {
			dialog.close();
		});
		(<HTMLElement> dialog.querySelector('div')).addEventListener('click', (event) => {
			event.stopPropagation();
		});
	})(document.getElementById('help_dialog') as HTMLDialogElement);
	(<HTMLInputElement> document.getElementById('stack')).addEventListener('change', (event) => {
		if ((<HTMLInputElement> event.target).checked) {
			document.body.dataset.stack = '';
		} else {
			delete document.body.dataset.stack;
		}
	});
	(<HTMLInputElement> document.getElementById('opacity')).addEventListener('change', (event) => {
		const input = <HTMLInputElement> event.target;
		document.body.style.setProperty('--student-opacity', `${parseInt(input.value) / 255}`);
	});
});
