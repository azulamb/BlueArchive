/// <reference path="../modules/section-pages.ts" />
/// <reference path="../modules/input-star.ts" />
/// <reference path="../modules/input-check.ts" />

interface StudentData extends Profile, Student {
	key: string;
	gun: GUN_TYPE;
	uniqueWeapon: string;
}

type SaveStudent = {
	has: boolean;
	rarity: number;
	unique_weapon: number;
	unique_gear: number;
	eligma: number;
};
interface SaveStudents {
	[keys: string]: SaveStudent;
}

declare const ANOTHER_NAME: { [key in ANOTHER_TYPE]: string };
declare const LABEL: { [key in OBTAIN_TYPE]: string };
declare const SCHOOL: { [key in SCHOOL_TYPE]: string };

class StudentsManager {
	private students: SaveStudents = {};

	constructor() {
		try {
			this.students = JSON.parse(localStorage.getItem('students') || '');
		} catch (_e) {
			this.students = {};
		}
	}

	public save() {
		localStorage.setItem('students', JSON.stringify(this.students));
	}

	public update(key: string, data: SaveStudent) {
		this.students[key] = data;
	}

	public get(key: string, defaultRarity: number): SaveStudent {
		if (this.students[key]) {
			return this.students[key];
		}

		return {
			has: false,
			rarity: defaultRarity,
			unique_weapon: 0,
			unique_gear: 0,
			eligma: 0,
		};
	}

	public exportCSV() {
		const header: ('student' | keyof SaveStudent)[] = [
			'student',
			'has',
			'rarity',
			'unique_weapon',
			'unique_gear',
			'eligma',
		];
		const data = [
			header.join(','),
		];
		Object.keys(this.students).map((key) => {
			return Object.assign({
				student: key,
			}, this.students[key]);
		}).forEach((student) => {
			data.push(
				header.map((key) => {
					const data = student[key];
					if (typeof data === 'boolean') {
						return data ? 1 : 0;
					}
					return student[key] || '';
				}).join(','),
			);
		});
		return data;
	}

	public importCSV(lines: string[]) {
		const keys = lines.shift()?.split(',') || [];
		if (keys.length <= 0) {
			throw new Error('ファイル形式が間違っています。');
		}

		const students: SaveStudents = {};
		const errors = [];

		for (const line of lines) {
			const values = line.split(',');
			const data: { [keys: string]: string } = {};
			for (let i = 0; i < keys.length; i++) {
				data[keys[i]] = values[i];
			}

			try {
				const student: SaveStudent = {
					has: data.has === '1',
					rarity: parseInt(data.rarity) || 0,
					unique_weapon: parseInt(data.unique_weapon) || 0,
					unique_gear: parseInt(data.unique_gear) || 0,
					eligma: parseInt(data.eligma) || 0,
				};
				students[data.student] = student;
			} catch (error) {
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
	const studentsBody = <HTMLTableSectionElement> document.getElementById('students');
	const template = <HTMLTemplateElement> studentsBody.querySelector('template');
	const DAMAGE_TYPES: DAMAGE_TYPE[] = [
		'normal',
		'explosive',
		'penetration',
		'mystic',
		'sonic',
	];
	const ARMOR_TYPES: ARMOR_TYPE[] = [
		'normal',
		'light',
		'heavy',
		'special',
		'elastic',
	];
	const COMBAT_TYPES: COMBAT_CLASS[] = [
		'striker',
		'special',
	];
	const ROLE_TYPES: ROLE_TYPE[] = [
		'tank',
		'attacker',
		'healer',
		'support',
		'tactical_support',
	];
	const POSITION_TYPES: ROLE_POSITION[] = [
		'front',
		'middle',
		'back',
	];
	const GUN_TYPES: GUN_TYPE[] = [
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
	const AFFINITY_GRADES: AFFINITY_GRADE[] = [
		'SS',
		'S',
		'A',
		'B',
		'C',
		'D',
	];
	const SCHOOLS: SCHOOL_TYPE[] = [
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

	const studentsManager = new StudentsManager();

	fetch('./students.json').then((response) => {
		return response.json();
	}).then((data: Students) => {
		const students: StudentData[] = [];
		Object.keys(data.profile).forEach((key) => {
			const student: StudentData = <any> Object.assign({
				key: key,
			}, data.profile[key]);
			if (!student.another) {
				student.another = [];
			}
			if (!student.another.includes('normal')) {
				student.another.push('normal');
			}
			for (const type of student.another) {
				const anotherStudent: StudentData = Object.assign({}, student, data[type][key]);
				if (type !== 'normal') {
					anotherStudent.key += '_' + type;
					anotherStudent.name += `(${anotherStudent.suffix || ANOTHER_NAME[type]})`;
				}
				students.push(anotherStudent);
			}
		});
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
			if (student.useCover) {
				tr.dataset.use_cover = 'true';
			}
			if (student.obtain) {
				tr.dataset.obtain = student.obtain;
			}
			tr.innerHTML = template.innerHTML;
			const has = <HTMLInputElement> tr.querySelector('input[type="checkbox"]');
			has.value = student.key;
			(<HTMLTableCellElement> tr.querySelector('.name')).textContent = student.name;
			const baseRarity = <InputStarElement> tr.querySelector('.base_rarity input-star');
			baseRarity.value = student.rarity;
			baseRarity.max = student.rarity;
			if (student.obtain) {
				baseRarity.classList.add(student.obtain);
				baseRarity.title = LABEL[student.obtain];
			}
			const combat = <HTMLTableCellElement> tr.querySelector('.combat');
			const role = <HTMLTableCellElement> tr.querySelector('.role');
			const position = <HTMLTableCellElement> tr.querySelector('.position');
			const gun = <HTMLTableCellElement> tr.querySelector('.gun');
			const rarity = <InputStarElement> tr.querySelector('.rarity input-star');
			const uniqueWeapon = <InputStarElement> tr.querySelector('.unique_weapon input-star');
			const uniqueGear = <InputStarElement> tr.querySelector('.unique_gear input-star');
			const eligma = <HTMLInputElement> tr.querySelector('.eligma input');
			const useCover = <HTMLTableCellElement> tr.querySelector('.use_cover');
			const urban = <HTMLTableCellElement> tr.querySelector('.urban');
			const outdoors = <HTMLTableCellElement> tr.querySelector('.outdoors');
			const indoors = <HTMLTableCellElement> tr.querySelector('.indoors');
			(<HTMLTableCellElement> tr.querySelector('.school')).textContent = SCHOOL[student.school];

			combat.title = student.combat;
			role.title = student.role;
			position.title = student.position;
			if (student.useCover) {
				useCover.title = 'Use';
			}
			gun.textContent = student.gun;
			urban.textContent = student.affinity.urban === student.affinityMax.urban
				? student.affinity.urban
				: `${student.affinity.urban}→${student.affinityMax.urban}`;
			outdoors.textContent = student.affinity.outdoors === student.affinityMax.outdoors
				? student.affinity.outdoors
				: `${student.affinity.outdoors}→${student.affinityMax.outdoors}`;
			indoors.textContent = student.affinity.indoors === student.affinityMax.indoors
				? student.affinity.indoors
				: `${student.affinity.indoors}→${student.affinityMax.indoors}`;

			studentsBody.appendChild(tr);

			function save() {
				const data: SaveStudent = {
					has: has.checked,
					rarity: rarity.value,
					unique_weapon: uniqueWeapon.value,
					unique_gear: uniqueGear.value,
					eligma: parseInt(eligma.value),
				};
				studentsManager.update(student.key, data);
				studentsManager.save();
			}

			function changeRarity() {
				if (rarity.value === 5) {
					uniqueWeapon.disabled = false;
					if (student.uniqueGear) {
						uniqueGear.disabled = false;
					}
				} else {
					uniqueWeapon.disabled = true;
					uniqueGear.disabled = true;
				}
				tr.dataset.rarity = rarity.value.toString();
				tr.dataset.urban = student.affinity.urban;
				tr.dataset.outdoors = student.affinity.outdoors;
				tr.dataset.indoors = student.affinity.indoors;
				if (uniqueWeapon.disabled) {
					tr.dataset.unique_weapon = '0';
				} else {
					tr.dataset.unique_weapon = uniqueWeapon.value.toString();
					if (3 <= uniqueWeapon.value) {
						tr.dataset.urban = student.affinityMax.urban;
						tr.dataset.outdoors = student.affinityMax.outdoors;
						tr.dataset.indoors = student.affinityMax.indoors;
					}
				}
				if (uniqueGear.disabled) {
					tr.dataset.unique_gear = uniqueGear.min <= 0 ? '' : '0';
				} else {
					tr.dataset.unique_gear = uniqueGear.value.toString();
				}
			}

			function openUnique(open: boolean) {
				if (open) {
					rarity.disabled = false;
					tr.dataset.has = 'true';
					tr.dataset.eligma = eligma.value;
					changeRarity();
				} else {
					rarity.disabled = true;
					uniqueWeapon.disabled = true;
					uniqueGear.disabled = true;
					delete tr.dataset.has;
					tr.dataset.eligma = '0';
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
				openUnique(has.checked);
			})(studentsManager.get(student.key, student.rarity));

			has.addEventListener('change', () => {
				openUnique(has.checked);
				save();
			});
			rarity.addEventListener('change', () => {
				changeRarity();
				save();
			});
			uniqueWeapon.addEventListener('change', () => {
				changeRarity();
				save();
			});
			if (!student.uniqueGear) {
				uniqueGear.max = 0;
			}
			uniqueGear.addEventListener('change', () => {
				changeRarity();
				save();
			});
			eligma.addEventListener('change', () => {
				save();
			});
		}
		return <HTMLTableRowElement[]> [...studentsBody.children].filter((tr) => {
			return tr instanceof HTMLTableRowElement;
		});
	}).then((students) => {
		function getGroups(dialog: HTMLDialogElement) {
			const result: { [keys: string]: InputCheckElement[] } = {};
			const list = dialog.querySelectorAll('[group]');
			for (const item of list) {
				const group = item.getAttribute('group') || '_';
				if (!result[group]) {
					result[group] = [];
				}
				result[group].push(<InputCheckElement> item);
			}
			return result;
		}
		function parseValues(data: { [keys: string]: InputCheckElement[] }): { [keys: string]: string[] } {
			const result: { [keys: string]: string[] } = {};
			for (const group in data) {
				const items = data[group];
				const trues: string[] = [];
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
			(<HTMLButtonElement> document.getElementById('filter')).addEventListener('click', () => {
				dialog.showModal();
			});
			function check(student: HTMLTableRowElement, data: { [keys: string]: string[] }) {
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
			(<HTMLElement> dialog.querySelector('div')).addEventListener('click', (event) => {
				event.stopPropagation();
			});
			(<HTMLButtonElement> dialog.querySelector('.ok')).addEventListener('click', () => {
				filter();
				dialog.close();
			});
			(<HTMLButtonElement> dialog.querySelector('.reset')).addEventListener('click', () => {
				dialog.querySelectorAll('input-check').forEach((item: InputCheckElement) => {
					item.checked = false;
				});
			});
		})(<HTMLDialogElement> document.getElementById('filter_dialog'));
		(<HTMLButtonElement> document.getElementById('download_students')).addEventListener('click', () => {
			const data = studentsManager.exportCSV();
			const link = document.createElement('a');
			link.setAttribute('download', 'bluearchive_students.csv');
			link.setAttribute('href', `data:text/csv;charset=UTF-8,${encodeURIComponent(data.join(',\n'))}`);
			link.click();
		});
		(<HTMLButtonElement> document.getElementById('import_students')).addEventListener('change', (event) => {
			const file = (<HTMLInputElement> event.target).files?.[0];
			if (!file) {
				return;
			}

			const reader = new FileReader();
			reader.onload = (event) => {
				const data = <string> event.target?.result;
				if (!data) {
					return alert('ファイル読み込みに失敗しました。');
				}
				try {
					const result = studentsManager.importCSV(data.split('\n'));
					console.log(result);
					if (
						confirm(`取り込み数: ${Object.keys(result.students).length}
エラー数: ${result.errors.length}
取り込みますか？`)
					) {
						Object.keys(result.students).forEach((key) => {
							studentsManager.update(key, result.students[key]);
						});
						studentsManager.save();
						location.reload();
					}
				} catch (error) {
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
		((labels: HTMLLabelElement[]) => {
			const nameLabel = <HTMLLabelElement> labels.find((label) => {
				return label.dataset.key === 'name';
			});
			const compare = {
				boolean: (a: HTMLTableRowElement, b: HTMLTableRowElement, key: string) => {
					const valueA = a.dataset[key] !== undefined;
					const valueB = b.dataset[key] !== undefined;
					return valueA === valueB ? 0 : (valueA ? -1 : 1);
				},
				string: (a: HTMLTableRowElement, b: HTMLTableRowElement, key: string) => {
					const valueA = a.dataset[key] || '';
					const valueB = b.dataset[key] || '';
					return valueA.localeCompare(valueB);
				},
				number: (a: HTMLTableRowElement, b: HTMLTableRowElement, key: string) => {
					const valueA = parseFloat(a.dataset[key] || '0');
					const valueB = parseFloat(b.dataset[key] || '0');
					return valueA - valueB;
				},
				damage: (a: HTMLTableRowElement, b: HTMLTableRowElement, key: string) => {
					const valueA = DAMAGE_TYPES.indexOf(<DAMAGE_TYPE> a.dataset[key] || '');
					const valueB = DAMAGE_TYPES.indexOf(<DAMAGE_TYPE> b.dataset[key] || '');
					return valueA - valueB;
				},
				armor: (a: HTMLTableRowElement, b: HTMLTableRowElement, key: string) => {
					const valueA = ARMOR_TYPES.indexOf(<ARMOR_TYPE> a.dataset[key] || '');
					const valueB = ARMOR_TYPES.indexOf(<ARMOR_TYPE> b.dataset[key] || '');
					return valueA - valueB;
				},
				combat: (a: HTMLTableRowElement, b: HTMLTableRowElement, key: string) => {
					const valueA = COMBAT_TYPES.indexOf(<COMBAT_CLASS> a.dataset[key] || '');
					const valueB = COMBAT_TYPES.indexOf(<COMBAT_CLASS> b.dataset[key] || '');
					return valueA - valueB;
				},
				role: (a: HTMLTableRowElement, b: HTMLTableRowElement, key: string) => {
					const valueA = ROLE_TYPES.indexOf(<ROLE_TYPE> a.dataset[key] || '');
					const valueB = ROLE_TYPES.indexOf(<ROLE_TYPE> b.dataset[key] || '');
					return valueA - valueB;
				},
				position: (a: HTMLTableRowElement, b: HTMLTableRowElement, key: string) => {
					const valueA = POSITION_TYPES.indexOf(<ROLE_POSITION> a.dataset[key] || '');
					const valueB = POSITION_TYPES.indexOf(<ROLE_POSITION> b.dataset[key] || '');
					return valueA - valueB;
				},
				gun: (a: HTMLTableRowElement, b: HTMLTableRowElement, key: string) => {
					const valueA = GUN_TYPES.indexOf(<GUN_TYPE> a.dataset[key] || '');
					const valueB = GUN_TYPES.indexOf(<GUN_TYPE> b.dataset[key] || '');
					return valueA - valueB;
				},
				affinity: (a: HTMLTableRowElement, b: HTMLTableRowElement, key: string) => {
					const valueA = AFFINITY_GRADES.indexOf(<AFFINITY_GRADE> a.dataset[key] || '');
					const valueB = AFFINITY_GRADES.indexOf(<AFFINITY_GRADE> b.dataset[key] || '');
					return valueA - valueB;
				},
				school: (a: HTMLTableRowElement, b: HTMLTableRowElement, key: string) => {
					const valueA = SCHOOLS.indexOf(<SCHOOL_TYPE> a.dataset[key] || 'etc');
					const valueB = SCHOOLS.indexOf(<SCHOOL_TYPE> b.dataset[key] || 'etc');
					return valueA - valueB;
				},
			};
			function getSorts() {
				const sortTypes = [...labels].filter((label) => {
					return label.dataset.order && label.dataset.key !== 'name';
				}).map((label) => {
					return {
						compare: compare[<'string'> label.dataset.type],
						order: <string> label.dataset.order,
						key: <string> label.dataset.key,
					};
				});
				// Default sort.
				sortTypes.push({
					compare: compare.string,
					order: nameLabel.dataset.order || 'asc',
					key: 'name',
				});

				return sortTypes;
			}
			function sort() {
				const sorts = getSorts();

				return (a: HTMLTableRowElement, b: HTMLTableRowElement) => {
					for (const sort of sorts) {
						const result = sort.compare(a, b, sort.key);
						if (result !== 0) {
							return sort.order === 'asc' ? result : -result;
						}
					}
					return 0;
				};
			}
			labels.forEach((label: HTMLLabelElement) => {
				const button = <HTMLButtonElement> label.querySelector('button');
				button.addEventListener('click', () => {
					// reset
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
		})([...<NodeListOf<HTMLLabelElement>> (<HTMLElement> document.getElementById('students_header')).querySelectorAll('td > label')]);
	});
});
