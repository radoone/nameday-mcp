export interface NameDay {
  month: number;
  day: number;
  names: string[];
}

export interface NameDayLookup {
  [key: string]: { month: number; day: number };
}

// Slovak name days data for each day of the year
export const MENINY_DATA: NameDay[] = [
  // January
  { month: 1, day: 1, names: ["Nový rok"] },
  { month: 1, day: 2, names: ["Alexandra", "Karina"] },
  { month: 1, day: 3, names: ["Daniela"] },
  { month: 1, day: 4, names: ["Drahoslav"] },
  { month: 1, day: 5, names: ["Andrea"] },
  { month: 1, day: 6, names: ["Antónia"] },
  { month: 1, day: 7, names: ["Bohuslava"] },
  { month: 1, day: 8, names: ["Severín"] },
  { month: 1, day: 9, names: ["Alexej"] },
  { month: 1, day: 10, names: ["Dáša"] },
  { month: 1, day: 11, names: ["Malvína"] },
  { month: 1, day: 12, names: ["Ernest"] },
  { month: 1, day: 13, names: ["Rastislav"] },
  { month: 1, day: 14, names: ["Radovan"] },
  { month: 1, day: 15, names: ["Alice"] },
  { month: 1, day: 16, names: ["Ctirad"] },
  { month: 1, day: 17, names: ["Nataša"] },
  { month: 1, day: 18, names: ["Bohdana"] },
  { month: 1, day: 19, names: ["Drahomíra"] },
  { month: 1, day: 20, names: ["Sebastián"] },
  { month: 1, day: 21, names: ["Brigita"] },
  { month: 1, day: 22, names: ["Zora"] },
  { month: 1, day: 23, names: ["Miloš"] },
  { month: 1, day: 24, names: ["Timotej"] },
  { month: 1, day: 25, names: ["Igor"] },
  { month: 1, day: 26, names: ["Tamara"] },
  { month: 1, day: 27, names: ["Agnesa"] },
  { month: 1, day: 28, names: ["Alfonz"] },
  { month: 1, day: 29, names: ["Gejza"] },
  { month: 1, day: 30, names: ["Martina"] },
  { month: 1, day: 31, names: ["Marcela"] },

  // February
  { month: 2, day: 1, names: ["Tatiana"] },
  { month: 2, day: 2, names: ["Erik", "Erika"] },
  { month: 2, day: 3, names: ["Blažej"] },
  { month: 2, day: 4, names: ["Veronika"] },
  { month: 2, day: 5, names: ["Agáta"] },
  { month: 2, day: 6, names: ["Dorota"] },
  { month: 2, day: 7, names: ["Vanda"] },
  { month: 2, day: 8, names: ["Zuzana"] },
  { month: 2, day: 9, names: ["Zdenko"] },
  { month: 2, day: 10, names: ["Gabriela"] },
  { month: 2, day: 11, names: ["Dezider"] },
  { month: 2, day: 12, names: ["Perla"] },
  { month: 2, day: 13, names: ["Arpád"] },
  { month: 2, day: 14, names: ["Valentín"] },
  { month: 2, day: 15, names: ["Pravoslav"] },
  { month: 2, day: 16, names: ["Ida", "Liana"] },
  { month: 2, day: 17, names: ["Miloslava"] },
  { month: 2, day: 18, names: ["Jaromír"] },
  { month: 2, day: 19, names: ["Vlasta"] },
  { month: 2, day: 20, names: ["Lívia"] },
  { month: 2, day: 21, names: ["Eleonóra"] },
  { month: 2, day: 22, names: ["Etela"] },
  { month: 2, day: 23, names: ["Roman"] },
  { month: 2, day: 24, names: ["Matej"] },
  { month: 2, day: 25, names: ["Frederik"] },
  { month: 2, day: 26, names: ["Viktor"] },
  { month: 2, day: 27, names: ["Alexander"] },
  { month: 2, day: 28, names: ["Zlatica"] },
  { month: 2, day: 29, names: ["Radomír"] },

  // March
  { month: 3, day: 1, names: ["Albín"] },
  { month: 3, day: 2, names: ["Anežka"] },
  { month: 3, day: 3, names: ["Bohumír"] },
  { month: 3, day: 4, names: ["Kazimír"] },
  { month: 3, day: 5, names: ["Fridrich"] },
  { month: 3, day: 6, names: ["Radoslav"] },
  { month: 3, day: 7, names: ["Tomáš"] },
  { month: 3, day: 8, names: ["Alan", "Alana"] },
  { month: 3, day: 9, names: ["Františka"] },
  { month: 3, day: 10, names: ["Branislav"] },
  { month: 3, day: 11, names: ["Angela"] },
  { month: 3, day: 12, names: ["Gregor"] },
  { month: 3, day: 13, names: ["Vlastimil"] },
  { month: 3, day: 14, names: ["Matilda"] },
  { month: 3, day: 15, names: ["Svetlana"] },
  { month: 3, day: 16, names: ["Boleslav"] },
  { month: 3, day: 17, names: ["Ľubica"] },
  { month: 3, day: 18, names: ["Eduard"] },
  { month: 3, day: 19, names: ["Jozef"] },
  { month: 3, day: 20, names: ["Víťazoslav"] },
  { month: 3, day: 21, names: ["Blahoslav"] },
  { month: 3, day: 22, names: ["Beňadik"] },
  { month: 3, day: 23, names: ["Adrián"] },
  { month: 3, day: 24, names: ["Gabriel"] },
  { month: 3, day: 25, names: ["Marián"] },
  { month: 3, day: 26, names: ["Emanuel"] },
  { month: 3, day: 27, names: ["Alena"] },
  { month: 3, day: 28, names: ["Soňa"] },
  { month: 3, day: 29, names: ["Miroslav"] },
  { month: 3, day: 30, names: ["Vieroslav"] },
  { month: 3, day: 31, names: ["Benjamín"] },

  // April
  { month: 4, day: 1, names: ["Hugo"] },
  { month: 4, day: 2, names: ["Zita"] },
  { month: 4, day: 3, names: ["Richard"] },
  { month: 4, day: 4, names: ["Izidor"] },
  { month: 4, day: 5, names: ["Miriam"] },
  { month: 4, day: 6, names: ["Irena"] },
  { month: 4, day: 7, names: ["Zbislav"] },
  { month: 4, day: 8, names: ["Havron"] },
  { month: 4, day: 9, names: ["Milena"] },
  { month: 4, day: 10, names: ["Igor"] },
  { month: 4, day: 11, names: ["Július"] },
  { month: 4, day: 12, names: ["Estera"] },
  { month: 4, day: 13, names: ["Aleš"] },
  { month: 4, day: 14, names: ["Justína"] },
  { month: 4, day: 15, names: ["Fedor"] },
  { month: 4, day: 16, names: ["Dana"] },
  { month: 4, day: 17, names: ["Rudolf"] },
  { month: 4, day: 18, names: ["Valér"] },
  { month: 4, day: 19, names: ["Jaroslav"] },
  { month: 4, day: 20, names: ["Jela"] },
  { month: 4, day: 21, names: ["Ervín"] },
  { month: 4, day: 22, names: ["Slavomír"] },
  { month: 4, day: 23, names: ["Vojtech"] },
  { month: 4, day: 24, names: ["Juraj"] },
  { month: 4, day: 25, names: ["Marek"] },
  { month: 4, day: 26, names: ["Jaroslava"] },
  { month: 4, day: 27, names: ["Jaroslav"] },
  { month: 4, day: 28, names: ["Jarmila"] },
  { month: 4, day: 29, names: ["Lea"] },
  { month: 4, day: 30, names: ["Anastázia"] },

  // May
  { month: 5, day: 1, names: ["Sviatok práce"] },
  { month: 5, day: 2, names: ["Žigmund"] },
  { month: 5, day: 3, names: ["Galina"] },
  { month: 5, day: 4, names: ["Florián"] },
  { month: 5, day: 5, names: ["Lesana"] },
  { month: 5, day: 6, names: ["Hermína"] },
  { month: 5, day: 7, names: ["Monika"] },
  { month: 5, day: 8, names: ["Ingrida"] },
  { month: 5, day: 9, names: ["Roland"] },
  { month: 5, day: 10, names: ["Viktória"] },
  { month: 5, day: 11, names: ["Blažena"] },
  { month: 5, day: 12, names: ["Pankrác"] },
  { month: 5, day: 13, names: ["Servác"] },
  { month: 5, day: 14, names: ["Bonifác"] },
  { month: 5, day: 15, names: ["Žofia"] },
  { month: 5, day: 16, names: ["Svetozár"] },
  { month: 5, day: 17, names: ["Gizela"] },
  { month: 5, day: 18, names: ["Viola"] },
  { month: 5, day: 19, names: ["Gertrúda"] },
  { month: 5, day: 20, names: ["Zlatoslav"] },
  { month: 5, day: 21, names: ["Monika"] },
  { month: 5, day: 22, names: ["Emil"] },
  { month: 5, day: 23, names: ["Želmíra"] },
  { month: 5, day: 24, names: ["Ela"] },
  { month: 5, day: 25, names: ["Urban"] },
  { month: 5, day: 26, names: ["Dušan"] },
  { month: 5, day: 27, names: ["Ivana"] },
  { month: 5, day: 28, names: ["Viliam"] },
  { month: 5, day: 29, names: ["Maximilian"] },
  { month: 5, day: 30, names: ["Ferdinand"] },
  { month: 5, day: 31, names: ["Petronela"] },

  // June
  { month: 6, day: 1, names: ["Žaneta"] },
  { month: 6, day: 2, names: ["Xénia"] },
  { month: 6, day: 3, names: ["Karolína"] },
  { month: 6, day: 4, names: ["Lenka"] },
  { month: 6, day: 5, names: ["Laura"] },
  { month: 6, day: 6, names: ["Norbert"] },
  { month: 6, day: 7, names: ["Róbert"] },
  { month: 6, day: 8, names: ["Medard"] },
  { month: 6, day: 9, names: ["Stanislava"] },
  { month: 6, day: 10, names: ["Margaréta"] },
  { month: 6, day: 11, names: ["Dobroslav"] },
  { month: 6, day: 12, names: ["Antónia"] },
  { month: 6, day: 13, names: ["Anton"] },
  { month: 6, day: 14, names: ["Vasil"] },
  { month: 6, day: 15, names: ["Vít"] },
  { month: 6, day: 16, names: ["Blanka"] },
  { month: 6, day: 17, names: ["Adolf"] },
  { month: 6, day: 18, names: ["Vratislav"] },
  { month: 6, day: 19, names: ["Alfréd"] },
  { month: 6, day: 20, names: ["Valéria"] },
  { month: 6, day: 21, names: ["Alojz"] },
  { month: 6, day: 22, names: ["Paulína"] },
  { month: 6, day: 23, names: ["Sidónia"] },
  { month: 6, day: 24, names: ["Ján"] },
  { month: 6, day: 25, names: ["Tadeáš"] },
  { month: 6, day: 26, names: ["Adriána"] },
  { month: 6, day: 27, names: ["Ladislav"] },
  { month: 6, day: 28, names: ["Beáta"] },
  { month: 6, day: 29, names: ["Peter", "Pavol"] },
  { month: 6, day: 30, names: ["Melánia"] },

  // July
  { month: 7, day: 1, names: ["Diana"] },
  { month: 7, day: 2, names: ["Berta"] },
  { month: 7, day: 3, names: ["Miloslav"] },
  { month: 7, day: 4, names: ["Prokop"] },
  { month: 7, day: 5, names: ["Cyril", "Metod"] },
  { month: 7, day: 6, names: ["Patrik"] },
  { month: 7, day: 7, names: ["Oliver"] },
  { month: 7, day: 8, names: ["Ivan"] },
  { month: 7, day: 9, names: ["Lujza"] },
  { month: 7, day: 10, names: ["Amália"] },
  { month: 7, day: 11, names: ["Milota"] },
  { month: 7, day: 12, names: ["Nina"] },
  { month: 7, day: 13, names: ["Margita"] },
  { month: 7, day: 14, names: ["Kamil"] },
  { month: 7, day: 15, names: ["Henrich"] },
  { month: 7, day: 16, names: ["Drahoslav"] },
  { month: 7, day: 17, names: ["Bohuslav"] },
  { month: 7, day: 18, names: ["Kamila"] },
  { month: 7, day: 19, names: ["Dušana"] },
  { month: 7, day: 20, names: ["Iľja"] },
  { month: 7, day: 21, names: ["Daniel"] },
  { month: 7, day: 22, names: ["Magdaléna"] },
  { month: 7, day: 23, names: ["Oľga"] },
  { month: 7, day: 24, names: ["Vladimír"] },
  { month: 7, day: 25, names: ["Jakub"] },
  { month: 7, day: 26, names: ["Anna"] },
  { month: 7, day: 27, names: ["Božena"] },
  { month: 7, day: 28, names: ["Krištof"] },
  { month: 7, day: 29, names: ["Marta"] },
  { month: 7, day: 30, names: ["Libuša"] },
  { month: 7, day: 31, names: ["Ignác"] },

  // August
  { month: 8, day: 1, names: ["Božidara"] },
  { month: 8, day: 2, names: ["Gustáv"] },
  { month: 8, day: 3, names: ["Jerguš"] },
  { month: 8, day: 4, names: ["Dominik"] },
  { month: 8, day: 5, names: ["Hortenzia"] },
  { month: 8, day: 6, names: ["Jozefína"] },
  { month: 8, day: 7, names: ["Štefánia"] },
  { month: 8, day: 8, names: ["Oskar"] },
  { month: 8, day: 9, names: ["Ľubomíra"] },
  { month: 8, day: 10, names: ["Vavrinec"] },
  { month: 8, day: 11, names: ["Zuzana"] },
  { month: 8, day: 12, names: ["Darina"] },
  { month: 8, day: 13, names: ["Ľubomír"] },
  { month: 8, day: 14, names: ["Mojmír"] },
  { month: 8, day: 15, names: ["Marcela"] },
  { month: 8, day: 16, names: ["Leonard"] },
  { month: 8, day: 17, names: ["Milica"] },
  { month: 8, day: 18, names: ["Elena"] },
  { month: 8, day: 19, names: ["Lýdia"] },
  { month: 8, day: 20, names: ["Anabela"] },
  { month: 8, day: 21, names: ["Jana"] },
  { month: 8, day: 22, names: ["Tichomír"] },
  { month: 8, day: 23, names: ["Filip"] },
  { month: 8, day: 24, names: ["Bartolomej"] },
  { month: 8, day: 25, names: ["Ľudovít"] },
  { month: 8, day: 26, names: ["Samuel"] },
  { month: 8, day: 27, names: ["Silvia"] },
  { month: 8, day: 28, names: ["Augustín"] },
  { month: 8, day: 29, names: ["Nikola"] },
  { month: 8, day: 30, names: ["Ružena"] },
  { month: 8, day: 31, names: ["Nora"] },

  // September
  { month: 9, day: 1, names: ["Danka"] },
  { month: 9, day: 2, names: ["Linda"] },
  { month: 9, day: 3, names: ["Belo"] },
  { month: 9, day: 4, names: ["Rozália"] },
  { month: 9, day: 5, names: ["Regina"] },
  { month: 9, day: 6, names: ["Alica"] },
  { month: 9, day: 7, names: ["Marianna"] },
  { month: 9, day: 8, names: ["Miriama"] },
  { month: 9, day: 9, names: ["Martina"] },
  { month: 9, day: 10, names: ["Oleg"] },
  { month: 9, day: 11, names: ["Bystrík"] },
  { month: 9, day: 12, names: ["Mária"] },
  { month: 9, day: 13, names: ["Ctibor"] },
  { month: 9, day: 14, names: ["Ľudmila"] },
  { month: 9, day: 15, names: ["Jolana"] },
  { month: 9, day: 16, names: ["Ľudomil"] },
  { month: 9, day: 17, names: ["Olympia"] },
  { month: 9, day: 18, names: ["Eugénia"] },
  { month: 9, day: 19, names: ["Konštantín"] },
  { month: 9, day: 20, names: ["Ľuboslav"] },
  { month: 9, day: 21, names: ["Matúš"] },
  { month: 9, day: 22, names: ["Móric"] },
  { month: 9, day: 23, names: ["Zdenka"] },
  { month: 9, day: 24, names: ["Ľubor"] },
  { month: 9, day: 25, names: ["Vladislav"] },
  { month: 9, day: 26, names: ["Edita"] },
  { month: 9, day: 27, names: ["Cyprián"] },
  { month: 9, day: 28, names: ["Václav"] },
  { month: 9, day: 29, names: ["Michal"] },
  { month: 9, day: 30, names: ["Jarolím"] },

  // October
  { month: 10, day: 1, names: ["Arnold"] },
  { month: 10, day: 2, names: ["Levoslav"] },
  { month: 10, day: 3, names: ["Stela"] },
  { month: 10, day: 4, names: ["František"] },
  { month: 10, day: 5, names: ["Viera"] },
  { month: 10, day: 6, names: ["Natália"] },
  { month: 10, day: 7, names: ["Eleonóra"] },
  { month: 10, day: 8, names: ["Vladislava"] },
  { month: 10, day: 9, names: ["Dionýz"] },
  { month: 10, day: 10, names: ["Slavomíra"] },
  { month: 10, day: 11, names: ["Valentína"] },
  { month: 10, day: 12, names: ["Maximilián"] },
  { month: 10, day: 13, names: ["Koloman"] },
  { month: 10, day: 14, names: ["Boris"] },
  { month: 10, day: 15, names: ["Terézia"] },
  { month: 10, day: 16, names: ["Vladimíra"] },
  { month: 10, day: 17, names: ["Hedviga"] },
  { month: 10, day: 18, names: ["Lukáš"] },
  { month: 10, day: 19, names: ["Kristián"] },
  { month: 10, day: 20, names: ["Vendelín"] },
  { month: 10, day: 21, names: ["Uršuľa"] },
  { month: 10, day: 22, names: ["Sergej"] },
  { month: 10, day: 23, names: ["Alojzia"] },
  { month: 10, day: 24, names: ["Kvetoslava"] },
  { month: 10, day: 25, names: ["Aurel"] },
  { month: 10, day: 26, names: ["Demeter"] },
  { month: 10, day: 27, names: ["Sabína"] },
  { month: 10, day: 28, names: ["Dobromila"] },
  { month: 10, day: 29, names: ["Klára"] },
  { month: 10, day: 30, names: ["Simona"] },
  { month: 10, day: 31, names: ["Aurélia"] },

  // November
  { month: 11, day: 1, names: ["Denis"] },
  { month: 11, day: 2, names: ["Hubert"] },
  { month: 11, day: 3, names: ["Karola"] },
  { month: 11, day: 4, names: ["Karol"] },
  { month: 11, day: 5, names: ["Imrich"] },
  { month: 11, day: 6, names: ["Renáta"] },
  { month: 11, day: 7, names: ["René"] },
  { month: 11, day: 8, names: ["Bohumír"] },
  { month: 11, day: 9, names: ["Teodor"] },
  { month: 11, day: 10, names: ["Tibor"] },
  { month: 11, day: 11, names: ["Martin"] },
  { month: 11, day: 12, names: ["Svätopluk"] },
  { month: 11, day: 13, names: ["Stanislav"] },
  { month: 11, day: 14, names: ["Irma"] },
  { month: 11, day: 15, names: ["Leopold"] },
  { month: 11, day: 16, names: ["Agnesa"] },
  { month: 11, day: 17, names: ["Klaudia"] },
  { month: 11, day: 18, names: ["Eugen"] },
  { month: 11, day: 19, names: ["Alžbeta"] },
  { month: 11, day: 20, names: ["Félix"] },
  { month: 11, day: 21, names: ["Elvíra"] },
  { month: 11, day: 22, names: ["Cecília"] },
  { month: 11, day: 23, names: ["Klement"] },
  { month: 11, day: 24, names: ["Emília"] },
  { month: 11, day: 25, names: ["Katarína"] },
  { month: 11, day: 26, names: ["Kornel"] },
  { month: 11, day: 27, names: ["Milan"] },
  { month: 11, day: 28, names: ["Henrieta"] },
  { month: 11, day: 29, names: ["Vratko"] },
  { month: 11, day: 30, names: ["Ondrej"] },

  // December
  { month: 12, day: 1, names: ["Edmund"] },
  { month: 12, day: 2, names: ["Bibiána"] },
  { month: 12, day: 3, names: ["Oldrich"] },
  { month: 12, day: 4, names: ["Barbora"] },
  { month: 12, day: 5, names: ["Oto"] },
  { month: 12, day: 6, names: ["Mikuláš"] },
  { month: 12, day: 7, names: ["Ambróz"] },
  { month: 12, day: 8, names: ["Marína"] },
  { month: 12, day: 9, names: ["Izabela"] },
  { month: 12, day: 10, names: ["Radúz"] },
  { month: 12, day: 11, names: ["Hilda"] },
  { month: 12, day: 12, names: ["Otília"] },
  { month: 12, day: 13, names: ["Lucia"] },
  { month: 12, day: 14, names: ["Branislava"] },
  { month: 12, day: 15, names: ["Ivica"] },
  { month: 12, day: 16, names: ["Albína"] },
  { month: 12, day: 17, names: ["Kornélia"] },
  { month: 12, day: 18, names: ["Sláva"] },
  { month: 12, day: 19, names: ["Judita"] },
  { month: 12, day: 20, names: ["Dagmara"] },
  { month: 12, day: 21, names: ["Bohdan"] },
  { month: 12, day: 22, names: ["Adela"] },
  { month: 12, day: 23, names: ["Nadežda"] },
  { month: 12, day: 24, names: ["Štedrý večer"] },
  { month: 12, day: 25, names: ["Štefan"] },
  { month: 12, day: 26, names: ["Ivana"] },
  { month: 12, day: 27, names: ["Rastislav"] },
  { month: 12, day: 28, names: ["Kamila"] },
  { month: 12, day: 29, names: ["Tomáš"] },
  { month: 12, day: 30, names: ["Dávid"] },
  { month: 12, day: 31, names: ["Silvester"] },
];

// Create a lookup table for finding name day by name
export const createNameLookup = (): NameDayLookup => {
  const lookup: NameDayLookup = {};
  
  MENINY_DATA.forEach(({ month, day, names }) => {
    names.forEach(name => {
      // Store both original and normalized versions
      lookup[name] = { month, day };
      lookup[name.toLowerCase()] = { month, day };
      
      // Also store without diacritics for easier searching
      const normalized = name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      lookup[normalized] = { month, day };
    });
  });
  
  return lookup;
};

// Helper function to find names by date
export const findNamesByDate = (month: number, day: number): string[] => {
  const found = MENINY_DATA.find(item => item.month === month && item.day === day);
  return found ? found.names : [];
};

// Helper function to find date by name
export const findDateByName = (name: string): { month: number; day: number } | null => {
  const lookup = createNameLookup();
  const result = lookup[name] || lookup[name.toLowerCase()];
  return result || null;
};

// Helper function to format date
export const formatDate = (month: number, day: number): string => {
  const monthNames = [
    'január', 'február', 'marec', 'apríl', 'máj', 'jún',
    'júl', 'august', 'september', 'október', 'november', 'december'
  ];
  
  // Validate month
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Month must be between 1 and 12.`);
  }
  
  // Validate day
  if (day < 1 || day > 31) {
    throw new Error(`Invalid day: ${day}. Day must be between 1 and 31.`);
  }
  
  // Additional validation for specific months
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) {
    throw new Error(`Invalid day: ${day} for month ${month}. Maximum day for this month is ${daysInMonth[month - 1]}.`);
  }
  
  return `${day}. ${monthNames[month - 1]}`;
};

// Helper function to get today's name days
export const getTodayNameDays = (): { names: string[]; date: string } => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  
  const names = findNamesByDate(month, day);
  const date = formatDate(month, day);
  
  return { names, date };
}; 