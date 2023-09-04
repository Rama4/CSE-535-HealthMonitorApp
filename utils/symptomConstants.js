export const SymptomList = [
  'Nausea',
  'Headache',
  'Diarrhea',
  'Sore Throat',
  'Fever',
  'Muscle Ache',
  'Loss of Smell or Taste',
  'Cough',
  'Shortness of Breath',
  'Feeling tired',
];

export const CreateTableQuery2 = `create table if not EXISTS healthdata ( 
  heartrate real not null, 
  resprate real not null,
  Nausea integer not null,
  Headache integer not null,
  Diarrhea integer not null,
  SoreThroat integer not null,
  Fever integer not null,
  MuscleAche integer not null,
  LossofSmellorTaste integer not null,
  Cough integer not null,
  ShortnessofBreath integer not null,
  Feelingtired integer not null);`;

export const stringWithoutSpaces = str => {
  return str.replace(/\s/g, '');
};
