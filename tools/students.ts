/// <reference path="../src/types.d.ts" />

const OUTPUT = './docs/students.json';

const clubs: { [key in CLUB_TYPE]: number } = {
  yin_yang_club: 0,
  festival_management_committee: 0,
  inner_discipline_club: 0,
  ninjutsu_research_club: 0,
  hyakkayouran: 0,
  red_winter_secretariat: 0,
  security_committee: 0,
  knowledge_liberation_front: 0,
  engineering_department: 0,
  class_no_227: 0,
  tea_party: 0,
  after_school_sweets_club: 0,
  justice_actualization_committee: 0,
  remedial_knights: 0,
  library_committee: 0,
  trinity_vigilante_crew: 0,
  sisterhood: 0,
  supplemental_lessons_club: 0,
  disciplinary_committee: 0,
  pandemonium_society: 0,
  emergency_medicine_department: 0,
  gourmet_research_society: 0,
  problem_solver_68: 0,
  hot_springs_development_department: 0,
  school_lunch_club: 0,
  countermeasure_council: 0,
  seminar: 0,
  engineering_dept: 0,
  paranormal_affairs_department: 0,
  training_club: 0,
  veritas: 0,
  cleaning_and_clearing: 0,
  game_development_club: 0,
  life_safety_bureau: 0,
  plum_blossom_garden: 0,
  black_tortoise: 0,
  black_tortoise_promenade: 0,
  chinese_alchemy_study_group: 0,
  arius_squad: 0,
  public_safety_bureau: 0,
  community_safety_bureau: 0,
  rabbit_platoon: 0,
  none: 0,
};

const data = <Students> JSON.parse(await Deno.readTextFile(OUTPUT));

const types = <ANOTHER_TYPE[]> Object.keys(data).filter((key) => {
  return key !== 'profile';
});

function mapStudents<T>(list: { [keys: string]: T }, callback: (key: string, student: T) => T) {
  Object.keys(list).forEach((key) => {
    list[key] = callback(key, list[key]);
  });
}

function createEmptyStudent(): Student {
  const student: Student = {
    // Game data.
    playable: true,
    rarity: 0,
    useCover: <any> null,
    damage: <any> '',
    armor: <any> '',
    role: <any> '',
    position: <any> '',
    combat: <any> '',
    affinity: {
      urban: <any> '',
      outdoors: <any> '',
      indoors: <any> '',
    },
    affinityMax: {
      urban: <any> '',
      outdoors: <any> '',
      indoors: <any> '',
    },
    eligma: {},
  };

  return student;
}

function createEmptyProfile(): Profile {
  const student: Profile = {
    // Game data.
    name: '',
    last: '',
    school: <any> '',
    gun: <any> '',
    uniqueWeapon: '',
    club: <any> '',
    age: 0,
    birthday: '',
    height: 0,
    hobby: [],
    profile: '',
  };

  return student;
}

function checkProfile(student: Profile) {
  return [];
}
function check(student: Student) {
  const warnings: string[] = [];

  if (
    student.affinity.urban === student.affinityMax.urban && student.affinity.outdoors === student.affinityMax.outdoors &&
    student.affinity.indoors === student.affinityMax.indoors
  ) {
    warnings.push('Invalid affinity');
  }
  if (
    !student.affinity.urban || !student.affinityMax.urban || !student.affinity.outdoors || !student.affinityMax.outdoors || !student.affinity.indoors ||
    !student.affinityMax.indoors
  ) {
    warnings.push('Empty affinity');
  }

  return warnings;
}

mapStudents<Profile>(data.profile, (key, student) => {
  const newStudent = <Profile> Object.assign(createEmptyProfile(), student);

  const list = newStudent.another || [];
  if (!list.includes('normal')) {
    list.unshift('normal');
  }
  list.forEach((another) => {
    if (!data[another]) {
      data[another] = {};
    }
    data[another][key] = Object.assign(createEmptyStudent(), data[another][key] || {});
  });

  const warnings: string[] = checkProfile(newStudent);
  if (!newStudent.club || typeof clubs[newStudent.club] !== 'number') {
    warnings.push('No club');
  }

  if (0 < warnings.length) {
    console.warn(`${key} has warnings: ${warnings.join(', ')}`);
  }

  return newStudent;
});

for (const anotherType of types) {
  mapStudents<Student>(data[anotherType], (key, student) => {
    if (!data.profile[key]) {
      data.profile[key] = createEmptyProfile();
    }
    if (!data.profile[key].another) {
      data.profile[key].another = [];
    }
    if (!data.profile[key].another?.includes(anotherType)) {
      data.profile[key].another?.push(anotherType);
    }
    console.log(key, anotherType);
    const warnings: string[] = check(student);

    if (0 < warnings.length) {
      console.warn(`${key}(${anotherType}) has warnings: ${warnings.join(', ')}`);
    }
    return student;
  });
}

Deno.writeTextFile(OUTPUT, JSON.stringify(data, null, 2));
