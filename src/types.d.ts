type SCHOOL_TYPE = 'hyakkiyako' | 'red_winter' | 'trinity' | 'gehenna' | 'abydos' | 'millennium' | 'arius' | 'shanhaijing' | 'valkyrie' | 'srt' | 'etc';
type CLUB_TYPE =
	// Hyakkiyako
	| 'yin_yang_club'
	| 'festival_management_committee'
	| 'inner_discipline_club'
	| 'ninjutsu_research_club'
	| 'hyakkayouran'
	// RedWinter
	| 'red_winter_secretariat'
	| 'security_committee'
	| 'engineering_department'
	| 'class_no_227'
	| 'knowledge_liberation_front'
	// Trinity
	| 'tea_party'
	| 'after_school_sweets_club'
	| 'justice_actualization_committee'
	| 'remedial_knights'
	| 'library_committee'
	| 'trinity_vigilante_crew'
	| 'sisterhood'
	| 'supplemental_lessons_club'
	// Gehenna
	| 'disciplinary_committee'
	| 'pandemonium_society'
	| 'emergency_medicine_department'
	| 'gourmet_research_society'
	| 'problem_solver_68'
	| 'hot_springs_development_department'
	| 'school_lunch_club'
	// Abydos
	| 'countermeasure_council'
	// Millennium
	| 'seminar'
	| 'engineering_dept'
	| 'paranormal_affairs_department'
	| 'training_club'
	| 'veritas'
	| 'cleaning_and_clearing'
	| 'game_development_club'
	| 'life_safety_bureau'
	// Shanhaijing
	| 'plum_blossom_garden'
	| 'black_tortoise'
	| 'black_tortoise_promenade'
	| 'chinese_alchemy_study_group'
	// Arius
	| 'arius_squad'
	// Valkyrie
	| 'public_safety_bureau'
	| 'community_safety_bureau'
	// SRT
	| 'rabbit_platoon'
	// Other
	| 'none';
type GUN_TYPE = 'SG' | 'SMG' | 'AR' | 'GL' | 'HG' | 'RL' | 'SR' | 'RG' | 'MG' | 'MT' | 'FT';
type ANOTHER_TYPE = 'normal' | 'swimsuit' | 'bunny_girl' | 'maid' | 'new_year' | 'sportswear' | 'christmas' | 'hot_spring' | 'cheerleader' | 'kid' | 'casual';
type DAMAGE_TYPE = 'normal' | 'explosive' | 'penetration' | 'mystic' | 'sonic';
type ARMOR_TYPE = 'normal' | 'light' | 'heavy' | 'special' | 'elastic';
type ROLE_TYPE = 'tank' | 'attacker' | 'healer' | 'support' | 'tactical_support';
type ROLE_POSITION = 'front' | 'middle' | 'back';
type COMBAT_CLASS = 'striker' | 'special';
type AFFINITY_GRADE = 'd' | 'c' | 'b' | 'a' | 's' | 'ss';
type OBTAIN_TYPE = 'limited' | 'event';

interface Student {
	playable: boolean;
	obtain?: OBTAIN_TYPE;
	rarity: number;
	gun?: GUN_TYPE;
	useCover: boolean;
	damage: DAMAGE_TYPE;
	armor: ARMOR_TYPE;
	role: ROLE_TYPE;
	position: ROLE_POSITION;
	combat: COMBAT_CLASS;
	affinity: {
		urban: AFFINITY_GRADE;
		outdoors: AFFINITY_GRADE;
		indoors: AFFINITY_GRADE;
	};
	affinityMax: {
		urban: AFFINITY_GRADE;
		outdoors: AFFINITY_GRADE;
		indoors: AFFINITY_GRADE;
	};
	uniqueWeapon?: string;
	uniqueGear?: string;
	suffix?: string;
	eligma: {
		hard?: string[]; // 13-3
		raid?: number; // 総力戦
		raidRare?: number; // 総力戦レア
		elimination?: number; // 大決戦
		eliminationRare?: number; // 大決戦レア
		tactical?: number; // 戦術対抗戦
		firepower?: number; // 合同火力演習
		mastery?: number; // 熟練証書
	};
}

interface Profile {
	name: string;
	last: string;
	school: SCHOOL_TYPE;
	gun: GUN_TYPE;
	uniqueWeapon: string;
	club: CLUB_TYPE;
	age: number;
	birthday: string;
	height: number;
	hobby: string[];
	profile: string;
	another?: ANOTHER_TYPE[];
}

type DefaultStudents = {
	profile: {
		[keys: string]: Profile;
	};
};

type Students =
	& {
		[key in ANOTHER_TYPE]: {
			[keys: string]: Student;
		};
	}
	& DefaultStudents;
