// Публикации по Национална научна програма „Сигурност и отбрана“ (ННП-СО), Договор Д01-74/19.05.2022 —
// само референции (част от заглавието + задача по програмата). Пълните записи се сглобяват в nspsd.ts.
// Отделен файл без импорти, за да го ползва и allPubs.ts (маркировка „Финансиране“ в списъка „Публикации“).
//
// Източници:
//   • Отчет на работните екипи в ИР-БАН по ННП-СО за периода май 2022 – май 2025 г., редактиран 17.04.2026 г.
//     (раздели II „Статии (индексирани)“, III „Статии (неиндексирани)“, IV „Статии (в печат)“);
//   • Технически доклад (междинен съдържателен отчет) за периода 19.05.2022 – 31.12.2025 г. — задачите (раздел IV);
//   • статиите под печат на сайта, финансирани по програмата.
// Нова публикация по програмата: добавете ред тук (ако вече е на сайта) или пълен запис в nspsdExtra (nspsd.ts).

/** Текстът за финансиране, както е в благодарностите на статиите */
export const NSPDS_FUND = 'NSP DS, MES grant D01-74/19.05.2022';

export interface NspsdRef {
  /** част от заглавието, както е на сайта (без значение главни/малки букви и пунктуация) */
  t: string;
  /** задача(и) по ННП-СО от техническия доклад, ако е посочена */
  task?: string;
  /** 'conf' — връзката с програмата е чрез участието в конференцията, финансирано изцяло по ННП-СО
   *  (в самата статия няма благодарност към програмата); 'report' — отчетено по програмата пред ЦИНСО-БАН */
  via?: 'conf' | 'report';
}

export const nspsdRefs: NspsdRef[] = [
  // Статии (индексирани)
  { t: 'A Parametric Comparison of JARUS SORA 2.0 and 2.5', task: '1.1.2, 1.2.1', via: 'conf' },
  { t: 'Energy-efficient routing in UAVs supported perimeter security networks', task: '1.2.6, 1.2.7, 1.2.8', via: 'conf' },
  { t: 'Reducing the WSN', task: '1.2.6, 1.2.7, 1.2.8', via: 'conf' },
  { t: 'LSTM-RNN method for Anomaly-Based Intrusion Detection Systems', via: 'conf' },
  { t: 'Development of Blockchain-Based Framework for Securing Communication', via: 'conf' },
  { t: 'Design and architecture of perimeter defence intrusion detection systems based on UGV', via: 'conf' },
  { t: 'Applicability of JARUS SORA to State UAS Operations in Disaster Relief', task: '1.1.2, 1.2.1' },
  { t: 'Skills and attitudes towards using AI based chatbots', task: '2.1.1, 1.2.7' },
  { t: 'Implying cybersecurity skills for public administration employees', task: '2.1.1, 1.2.7' },
  { t: 'Management approaches and application areas of information security in organizations', task: '2.1.1, 1.2.7' },
  { t: 'Applying a New Approach to Consider the Human Factor', task: '2.1.1, 1.2.7' },
  { t: 'The Applicability Of Quantum Gyroscopes For Navigation' },
  // Статии (неиндексирани)
  { t: 'Design of marine underwater perimeter security system', task: '1.2.6, 1.2.7, 1.2.8' },
  { t: 'Trajectory optimization in large scale UAV-assisted WSNs', task: '1.2.6, 1.2.7, 1.2.8' },
  { t: 'Mathematical Model and Kinematic Analysis of Rocker-Bogie Suspension' },
  { t: 'Blockchain enhancing IoD network functionality', task: '1.2.6, 1.2.7, 1.2.8' },
  { t: 'Design of a testing model for evaluation the levels of automation', task: '1.1.2, 1.2.1', via: 'conf' },
  { t: 'Design of an Unmanned Helicopter System for Collecting and Processing' },
  { t: 'Алгоритми за моделиране на движенията на роботи', task: '1.2.3' },
  { t: 'Мобилен колаборативен робот с висока проходимост', task: '1.2.3' },
  { t: 'Sensory System for Controlling Robot', task: '1.2.3' },
  { t: 'Modern Aspects in Information Security in the Field of Robotics' },
  { t: 'Some aspects of cybersecurity in Industry 4.0', task: '2.1.1, 1.2.7' },
  { t: 'Some aspects of Information Security and Cybersecurity problem area' },
  { t: 'Съвременни подходи за опазване на чувствителна информация' },
  { t: 'Using disruptive technologies as Blockchains and AI in IoT cybersecurity' },
  { t: 'Improvement in U-Space Development by Civil-Military Cooperation' },
  { t: 'Assessment of teachers’ preparedness in cybersecurity' },
  { t: 'Assessment of Parents’ Awareness in the Field of Cybersecurity' },
  { t: 'Recognition and prevention of cyberbullying by students in secondary education' }, // добавена от Н. Чехларова, 06.10.2026
  // Статии (в печат) по отчета — част от тях вече са излезли и са в годишните страници
  { t: 'Design of Information Security Systems for internal threat protection' },
  { t: 'Method for design of information security system for sensitive data leak prevention' },
  { t: "A model of gravity on the surface of the Earth's ellipsoid" },
  { t: 'A highly accurate calculation of the difference between geocentric and geodetic latitude' },
  { t: 'Compensations for Horizontal Inertial Components of INS/GNSS with Flight Altitude' },
  { t: 'Constructive Approach to the Design of Data Protection Systems' },
  { t: 'Small Voice Bulgarian Language Model Generation' },
  { t: 'Neural Network Approaches for Speech Recognition and Synthesis based on Whisper' },
  { t: 'Data-Driven Fuzzy Systems for Urban Microclimate Prediction' },
  // Софтуер (Zenodo) — сайтът на лабораторията е изграден по програмата
  { t: 'URSlab Website and Information System for Reporting the Publication Activity' },
  { t: 'URSlab Website and Interactive Coordinated-Turn Model' },
  // Отчетени по програмата пред ЦИНСО-БАН — по справката на гл. ас. д-р инж. Иван Гайдарски (06.10.2026)
  { t: 'Insider Threats in Critical Infrastructure Organizations', task: '2.1.1, 1.2.7', via: 'report' },
  { t: 'Aspects of Dependability and Security in Integrated Intelligent Educational Environments', task: '2.1.1, 1.2.7', via: 'report' },
  { t: 'Information security and dependability in integrated intelligent educational environments', task: '2.1.1, 1.2.7', via: 'report' },
  { t: 'Designing an information security system to prevent leakage of sensitive information', task: '2.1.1, 1.2.7', via: 'report' },
  { t: 'Multilayered conceptual modelling for the design, implementation and optimization', task: '2.1.1, 1.2.7', via: 'report' },
  // Подадени статии на сайта, финансирани по програмата
  { t: "Application of Kummer's Equation for Flight Between Two Geodesic Orthodromes" },
  { t: 'Precise Calculations of Gravity Anomalies from the Geometric Height' },
];

export const normTitle = (s: string) => s.toLowerCase().replace(/[^a-zа-я0-9]/gi, '');
/** Референцията по ННП-СО за дадено заглавие (или undefined) */
export const nspsdRefFor = (title: string) => {
  const n = normTitle(title);
  return nspsdRefs.find((r) => n.includes(normTitle(r.t)));
};
