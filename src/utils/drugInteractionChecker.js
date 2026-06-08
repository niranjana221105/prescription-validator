// placeholder removed
import { BRAND_TO_GENERIC } from './drugDatabase';

// SAFETY POLICY: if patientAge is provided and a drug has NO paediatric rules,
// we emit a WARNING instead of silently passing it as safe.

const DRUG_INTERACTIONS = {
  warfarin: {
    aspirin:       { severity: 'critical', effect: 'Increased bleeding risk - anticoagulant potentiation' },
    ibuprofen:     { severity: 'critical', effect: 'Increased bleeding risk - NSAIDs inhibit platelet function' },
    naproxen:      { severity: 'critical', effect: 'Increased bleeding risk - NSAID interaction' },
    diclofenac:    { severity: 'critical', effect: 'Increased bleeding risk - NSAID interaction' },
    amoxicillin:   { severity: 'warning',  effect: 'May alter INR levels - monitor closely' },
    metronidazole: { severity: 'critical', effect: 'Significantly increases anticoagulant effect' },
    fluconazole:   { severity: 'critical', effect: 'CYP2C9 inhibition increases warfarin levels' },
    simvastatin:   { severity: 'warning',  effect: 'May increase warfarin effect' },
    ciprofloxacin: { severity: 'critical', effect: 'Increased anticoagulant effect' },
    amiodarone:    { severity: 'critical', effect: 'Significantly increases bleeding risk' },
  },
  metformin: {
    alcohol:    { severity: 'critical', effect: 'Risk of lactic acidosis' },
    furosemide: { severity: 'warning',  effect: 'May increase metformin levels' },
    ibuprofen:  { severity: 'warning',  effect: 'NSAIDs may impair renal function, increasing metformin accumulation' },
  },
  lisinopril: {
    potassium:      { severity: 'warning',  effect: 'Risk of hyperkalemia' },
    spironolactone: { severity: 'critical', effect: 'Severe hyperkalemia risk' },
    ibuprofen:      { severity: 'warning',  effect: 'Reduced antihypertensive effect, kidney risk' },
    naproxen:       { severity: 'warning',  effect: 'Reduced antihypertensive effect, kidney risk' },
    diclofenac:     { severity: 'warning',  effect: 'Reduced antihypertensive effect, kidney risk' },
  },
  simvastatin: {
    amiodarone:     { severity: 'critical', effect: 'Risk of myopathy and rhabdomyolysis' },
    clarithromycin: { severity: 'critical', effect: 'CYP3A4 inhibition - increased statin levels' },
    erythromycin:   { severity: 'critical', effect: 'CYP3A4 inhibition - myopathy risk' },
    fluconazole:    { severity: 'critical', effect: 'CYP3A4 inhibition - increased statin toxicity' },
  },
  atorvastatin: {
    clarithromycin: { severity: 'critical', effect: 'CYP3A4 inhibition - increased atorvastatin levels' },
    erythromycin:   { severity: 'critical', effect: 'CYP3A4 inhibition - myopathy risk' },
    fluconazole:    { severity: 'warning',  effect: 'Increased atorvastatin exposure' },
  },
  ciprofloxacin: {
    theophylline:   { severity: 'critical', effect: 'Increased theophylline toxicity' },
    aluminium_hydroxide_magnesium_hydroxide: { severity: 'warning', effect: 'Antacid reduces ciprofloxacin absorption - take 2 hours apart' },
  },
  amiodarone: {
    digoxin:     { severity: 'critical', effect: 'Increased digoxin toxicity - arrhythmia risk' },
    simvastatin: { severity: 'critical', effect: 'Rhabdomyolysis risk' },
  },
  digoxin: {
    amiodarone:     { severity: 'critical', effect: 'Increased digoxin toxicity - arrhythmia risk' },
    verapamil:      { severity: 'critical', effect: 'Increased digoxin levels' },
    quinidine:      { severity: 'critical', effect: 'Doubles digoxin levels' },
    clarithromycin: { severity: 'critical', effect: 'Increased digoxin levels - toxicity risk' },
    erythromycin:   { severity: 'warning',  effect: 'May increase digoxin levels' },
  },
  fluoxetine: {
    maoi:     { severity: 'critical', effect: 'Serotonin syndrome - potentially fatal' },
    tramadol: { severity: 'critical', effect: 'Serotonin syndrome risk' },
    lithium:  { severity: 'warning',  effect: 'Increased serotonin syndrome risk' },
  },
  sertraline: {
    maoi:     { severity: 'critical', effect: 'Serotonin syndrome - potentially fatal' },
    tramadol: { severity: 'critical', effect: 'Serotonin syndrome risk' },
    lithium:  { severity: 'warning',  effect: 'Increased serotonin syndrome risk' },
  },
  metronidazole: {
    alcohol:  { severity: 'critical', effect: 'Disulfiram-like reaction - flushing, vomiting, tachycardia' },
    warfarin: { severity: 'critical', effect: 'Significantly increases anticoagulant effect' },
    lithium:  { severity: 'warning',  effect: 'May increase lithium levels' },
  },
  tramadol: {
    maoi:       { severity: 'critical', effect: 'Serotonin syndrome - potentially fatal' },
    fluoxetine: { severity: 'critical', effect: 'Serotonin syndrome risk' },
    sertraline: { severity: 'critical', effect: 'Serotonin syndrome risk' },
    diazepam:   { severity: 'warning',  effect: 'Increased CNS depression and respiratory risk' },
  },
  aluminium_hydroxide_magnesium_hydroxide: {
    ciprofloxacin: { severity: 'warning', effect: 'Antacid reduces ciprofloxacin absorption by up to 90% - take 2 hours apart' },
    tetracycline:  { severity: 'warning', effect: 'Antacid reduces tetracycline absorption - take 2 hours apart' },
    doxycycline:   { severity: 'warning', effect: 'Antacid reduces doxycycline absorption - take 2 hours apart' },
    iron:          { severity: 'warning', effect: 'Antacid reduces iron absorption - take 2 hours apart' },
    levothyroxine: { severity: 'warning', effect: 'Antacid reduces levothyroxine absorption - take 4 hours apart' },
  },
  codeine: {
    diazepam:   { severity: 'critical', effect: 'Increased CNS and respiratory depression' },
    lorazepam:  { severity: 'critical', effect: 'Increased CNS and respiratory depression' },
    tramadol:   { severity: 'warning',  effect: 'Additive opioid effects - increased sedation' },
  },
  domperidone: {
    clarithromycin: { severity: 'critical', effect: 'QT prolongation risk - cardiac arrhythmia' },
    erythromycin:   { severity: 'critical', effect: 'QT prolongation risk - cardiac arrhythmia' },
    fluconazole:    { severity: 'warning',  effect: 'Increased domperidone levels - QT risk' },
  },
};

const DOSAGE_LIMITS = {
  aspirin:       { max: 4000,  typical: { min: 75,    max: 325   } },
  ibuprofen:     { max: 3200,  typical: { min: 200,   max: 800   } },
  acetaminophen: { max: 4000,  typical: { min: 325,   max: 1000  } },
  paracetamol:   { max: 4000,  typical: { min: 325,   max: 1000  } },
  amoxicillin:   { max: 3000,  typical: { min: 250,   max: 500   } },
  metformin:     { max: 2550,  typical: { min: 500,   max: 1000  } },
  lisinopril:    { max: 80,    typical: { min: 5,     max: 40    } },
  simvastatin:   { max: 80,    typical: { min: 10,    max: 40    } },
  atorvastatin:  { max: 80,    typical: { min: 10,    max: 40    } },
  warfarin:      { max: 15,    typical: { min: 1,     max: 10    } },
  metoprolol:    { max: 400,   typical: { min: 25,    max: 200   } },
  omeprazole:    { max: 80,    typical: { min: 10,    max: 40    } },
  esomeprazole:  { max: 80,    typical: { min: 20,    max: 40    } },
  pantoprazole:  { max: 80,    typical: { min: 20,    max: 40    } },
  rabeprazole:   { max: 40,    typical: { min: 10,    max: 20    } },
  ranitidine:    { max: 600,   typical: { min: 150,   max: 300   } },
  famotidine:    { max: 80,    typical: { min: 20,    max: 40    } },
  ciprofloxacin: { max: 1500,  typical: { min: 250,   max: 500   } },
  levofloxacin:  { max: 750,   typical: { min: 250,   max: 500   } },
  azithromycin:  { max: 500,   typical: { min: 250,   max: 500   } },
  clarithromycin:{ max: 1000,  typical: { min: 250,   max: 500   } },
  metronidazole: { max: 2400,  typical: { min: 200,   max: 400   } },
  doxycycline:   { max: 200,   typical: { min: 100,   max: 200   } },
  digoxin:       { max: 0.5,   typical: { min: 0.125, max: 0.25  } },
  furosemide:    { max: 600,   typical: { min: 20,    max: 80    } },
  amlodipine:    { max: 10,    typical: { min: 5,     max: 10    } },
  losartan:      { max: 100,   typical: { min: 25,    max: 100   } },
  enalapril:     { max: 40,    typical: { min: 5,     max: 20    } },
  ramipril:      { max: 10,    typical: { min: 2.5,   max: 10    } },
  gabapentin:    { max: 3600,  typical: { min: 300,   max: 900   } },
  pregabalin:    { max: 600,   typical: { min: 75,    max: 300   } },
  sertraline:    { max: 200,   typical: { min: 50,    max: 100   } },
  fluoxetine:    { max: 80,    typical: { min: 20,    max: 40    } },
  amitriptyline: { max: 150,   typical: { min: 25,    max: 75    } },
  diazepam:      { max: 40,    typical: { min: 2,     max: 10    } },
  lorazepam:     { max: 10,    typical: { min: 1,     max: 4     } },
  tramadol:      { max: 400,   typical: { min: 50,    max: 100   } },
  codeine:       { max: 240,   typical: { min: 15,    max: 60    } },
  cetirizine:    { max: 20,    typical: { min: 5,     max: 10    } },
  loratadine:    { max: 10,    typical: { min: 10,    max: 10    } },
  fexofenadine:  { max: 360,   typical: { min: 120,   max: 180   } },
  montelukast:   { max: 10,    typical: { min: 10,    max: 10    } },
  salbutamol:    { max: 32,    typical: { min: 2,     max: 8     } },
  prednisolone:  { max: 60,    typical: { min: 5,     max: 40    } },
  dexamethasone: { max: 24,    typical: { min: 0.5,   max: 10    } },
  levothyroxine: { max: 0.3,   typical: { min: 0.05,  max: 0.2   } },
  aluminium_hydroxide_magnesium_hydroxide: { max: 8000, typical: { min: 400, max: 1600 } },
  sodium_alginate: { max: 4000, typical: { min: 500,  max: 1000  } },
  domperidone:   { max: 30,    typical: { min: 10,    max: 20    } },
  ondansetron:   { max: 32,    typical: { min: 4,     max: 8     } },
  metoclopramide:{ max: 30,    typical: { min: 5,     max: 10    } },
};

// AGE RULES SECTION

const AGE_DOSAGE_RULES = {
  paracetamol: [
    { minAge:0, maxAge:0.25, maxSingleDose:30, maxDailyDose:60, typicalDose:{min:20,max:30}, description:"Neonates under 3 months: max 20-30mg per dose. Immature liver metabolism - overdose causes severe hepatotoxicity. Use 10-15mg/kg weight-based dosing only." },
    { minAge:0.25, maxAge:1, maxSingleDose:120, maxDailyDose:480, typicalDose:{min:60,max:120}, description:"Infants 3-12 months: 60-120mg per dose (10-15mg/kg). Max 4 doses/24h. High doses risk acute liver failure." },
    { minAge:1, maxAge:5, maxSingleDose:250, maxDailyDose:1000, typicalDose:{min:120,max:250}, description:"Children 1-5 years: max single dose 250mg. Dolo 650mg for a 2-year-old is 2.6x the safe limit and risks serious liver damage. Use 120-250mg per dose only." },
    { minAge:6, maxAge:11, maxSingleDose:500, maxDailyDose:2000, typicalDose:{min:250,max:500}, description:"Children 6-11 years: 250-500mg per dose, max 4 doses/day. Do not exceed 2g/day." },
    { minAge:12, maxAge:17, maxSingleDose:1000, maxDailyDose:4000, typicalDose:{min:500,max:1000}, description:"Adolescents 12-17: adult dosing 500-1000mg per dose, max 4g/day." },
  ],
  ibuprofen: [
    { minAge:0, maxAge:0.5, notRecommended:true, description:"Ibuprofen is NOT recommended under 6 months. Causes renal impairment and GI bleeding in neonates. Use paracetamol instead." },
    { minAge:0.5, maxAge:1, maxSingleDose:50, maxDailyDose:150, typicalDose:{min:25,max:50}, description:"Infants 6-12 months: 5-10mg/kg per dose (max 50mg), up to 3 doses/day. Monitor kidney function." },
    { minAge:1, maxAge:5, maxSingleDose:100, maxDailyDose:300, typicalDose:{min:50,max:100}, description:"Children 1-5 years: 5-10mg/kg per dose (max 100mg), every 6-8 hours. Max 30mg/kg/day." },
    { minAge:6, maxAge:11, maxSingleDose:200, maxDailyDose:800, typicalDose:{min:100,max:200}, description:"Children 6-11 years: 200mg per dose, up to 3 times daily. Take with food." },
    { minAge:12, maxAge:17, maxSingleDose:400, maxDailyDose:1200, typicalDose:{min:200,max:400}, description:"Adolescents 12-17: 200-400mg per dose, max 1200mg/day OTC." },
  ],
  aspirin: [
    { minAge:0, maxAge:15, notRecommended:true, description:"Aspirin is CONTRAINDICATED under 16 years. Causes Reye syndrome - rare but fatal liver and brain damage, especially during viral illness. Use paracetamol or ibuprofen instead." },
  ],
  amoxicillin: [
    { minAge:0, maxAge:0.083, notRecommended:true, description:"Amoxicillin not recommended for neonates under 1 month without specialist guidance. Immature renal clearance causes drug accumulation." },
    { minAge:0.083, maxAge:2, maxSingleDose:125, maxDailyDose:375, typicalDose:{min:62.5,max:125}, description:"Infants under 2 years: 20-30mg/kg/day in 3 divided doses. Max 125mg per dose. Higher doses cause GI disturbance." },
    { minAge:2, maxAge:11, maxSingleDose:250, maxDailyDose:750, typicalDose:{min:125,max:250}, description:"Children 2-11 years: 250mg per dose, 3 times daily for standard infections." },
  ],
  metformin: [
    { minAge:0, maxAge:9, notRecommended:true, description:"Metformin NOT approved under 10 years. Risk of lactic acidosis in young children with immature renal function." },
    { minAge:10, maxAge:17, maxSingleDose:500, maxDailyDose:2000, typicalDose:{min:500,max:1000}, description:"Children 10-17: start 500mg once or twice daily with meals. Max 2000mg/day. Monitor renal function." },
  ],
  simvastatin: [
    { minAge:0, maxAge:9, notRecommended:true, description:"Statins NOT recommended under 10 years. Cholesterol is essential for childhood brain development." },
    { minAge:10, maxAge:17, maxSingleDose:20, maxDailyDose:40, typicalDose:{min:10,max:20}, description:"Adolescents 10-17 (familial hypercholesterolaemia only): 10-20mg/day. Requires specialist supervision." },
  ],
  atorvastatin: [
    { minAge:0, maxAge:9, notRecommended:true, description:"Atorvastatin NOT recommended under 10 years. Cholesterol essential for childhood development." },
    { minAge:10, maxAge:17, maxSingleDose:20, maxDailyDose:20, typicalDose:{min:10,max:20}, description:"Adolescents 10-17: 10-20mg/day for familial hypercholesterolaemia only. Specialist supervision required." },
  ],
  warfarin: [
    { minAge:0, maxAge:17, maxSingleDose:5, maxDailyDose:5, typicalDose:{min:0.05,max:0.2}, description:"Warfarin in children requires strict weight-based dosing (0.05-0.2mg/kg/day) and close INR monitoring. Must be managed by a specialist. Serious bleeding risk without monitoring." },
  ],
  ciprofloxacin: [
    { minAge:0, maxAge:17, notRecommended:true, description:"Ciprofloxacin generally AVOIDED under 18 years due to risk of arthropathy (joint damage) and tendon rupture. Use only when no safer alternative exists, under specialist supervision." },
  ],
  levofloxacin: [
    { minAge:0, maxAge:17, notRecommended:true, description:"Levofloxacin generally AVOIDED under 18 years due to risk of arthropathy and tendon damage. Use only under specialist supervision when no alternative exists." },
  ],
  doxycycline: [
    { minAge:0, maxAge:7, notRecommended:true, description:"Doxycycline CONTRAINDICATED under 8 years. Causes permanent tooth discolouration and bone growth inhibition in young children." },
    { minAge:8, maxAge:17, maxSingleDose:100, maxDailyDose:200, typicalDose:{min:100,max:200}, description:"Children 8-17 years: 100mg twice daily or 200mg once daily. Use with caution - avoid prolonged courses." },
  ],
  tetracycline: [
    { minAge:0, maxAge:7, notRecommended:true, description:"Tetracycline CONTRAINDICATED under 8 years. Causes permanent tooth discolouration and inhibits bone growth." },
  ],
  codeine: [
    { minAge:0, maxAge:11, notRecommended:true, description:"Codeine is CONTRAINDICATED under 12 years. Risk of fatal respiratory depression, especially in ultra-rapid metabolisers. FDA and EMA have banned codeine in children under 12." },
    { minAge:12, maxAge:17, maxSingleDose:30, maxDailyDose:120, typicalDose:{min:15,max:30}, description:"Adolescents 12-17: use with extreme caution. Max 30mg per dose, max 4 doses/day. Avoid in post-tonsillectomy pain. Monitor for respiratory depression." },
  ],
  tramadol: [
    { minAge:0, maxAge:11, notRecommended:true, description:"Tramadol NOT recommended under 12 years. Risk of respiratory depression and seizures. Not approved for paediatric use in most countries." },
    { minAge:12, maxAge:17, maxSingleDose:50, maxDailyDose:200, typicalDose:{min:50,max:100}, description:"Adolescents 12-17: 50mg per dose, max 4 doses/day. Use lowest effective dose. Monitor for seizures and respiratory depression." },
  ],
  diazepam: [
    { minAge:0, maxAge:0.5, notRecommended:true, description:"Diazepam NOT recommended under 6 months. Risk of respiratory depression and paradoxical reactions in neonates." },
    { minAge:0.5, maxAge:5, maxSingleDose:2.5, maxDailyDose:5, typicalDose:{min:1,max:2.5}, description:"Children 6 months-5 years: 1-2.5mg per dose under strict medical supervision only. Risk of respiratory depression." },
    { minAge:6, maxAge:11, maxSingleDose:5, maxDailyDose:10, typicalDose:{min:2,max:5}, description:"Children 6-11 years: 2-5mg per dose under medical supervision. Short-term use only." },
    { minAge:12, maxAge:17, maxSingleDose:10, maxDailyDose:20, typicalDose:{min:2,max:10}, description:"Adolescents 12-17: 2-10mg per dose. Short-term use only. Risk of dependence." },
  ],
  lorazepam: [
    { minAge:0, maxAge:1, notRecommended:true, description:"Lorazepam NOT recommended under 1 year without specialist guidance. Risk of respiratory depression." },
    { minAge:1, maxAge:11, maxSingleDose:0.05, maxDailyDose:0.1, typicalDose:{min:0.025,max:0.05}, description:"Children 1-11 years: 0.025-0.05mg/kg per dose (max 2mg) for seizures only, under specialist supervision." },
    { minAge:12, maxAge:17, maxSingleDose:2, maxDailyDose:4, typicalDose:{min:1,max:2}, description:"Adolescents 12-17: 1-2mg per dose under medical supervision. Short-term use only." },
  ],
  domperidone: [
    { minAge:0, maxAge:0.083, notRecommended:true, description:"Domperidone NOT recommended for neonates under 1 month. Risk of cardiac arrhythmia (QT prolongation)." },
    { minAge:0.083, maxAge:1, maxSingleDose:0.25, maxDailyDose:0.75, typicalDose:{min:0.1,max:0.25}, description:"Infants 1-12 months: 0.1-0.25mg/kg per dose (max 3 doses/day). Use lowest effective dose. Risk of QT prolongation - avoid with other QT-prolonging drugs." },
    { minAge:1, maxAge:5, maxSingleDose:2.5, maxDailyDose:7.5, typicalDose:{min:1.25,max:2.5}, description:"Children 1-5 years: 0.25mg/kg per dose (max 2.5mg), 3 times daily. Short-term use only. Monitor for cardiac effects." },
    { minAge:6, maxAge:11, maxSingleDose:5, maxDailyDose:15, typicalDose:{min:2.5,max:5}, description:"Children 6-11 years: 5mg per dose, 3 times daily. Use for shortest duration possible. Avoid in cardiac conditions." },
    { minAge:12, maxAge:17, maxSingleDose:10, maxDailyDose:30, typicalDose:{min:10,max:10}, description:"Adolescents 12-17: 10mg per dose, 3 times daily. Short-term use only. Avoid with QT-prolonging drugs." },
  ],
  ondansetron: [
    { minAge:0, maxAge:0.5, notRecommended:true, description:"Ondansetron NOT recommended under 6 months. Insufficient safety data in neonates." },
    { minAge:0.5, maxAge:3, maxSingleDose:2, maxDailyDose:4, typicalDose:{min:1,max:2}, description:"Infants 6 months-3 years: 0.1mg/kg per dose (max 2mg), up to 3 doses/day. Use only for chemotherapy-induced nausea under specialist guidance." },
    { minAge:4, maxAge:11, maxSingleDose:4, maxDailyDose:12, typicalDose:{min:4,max:4}, description:"Children 4-11 years: 4mg per dose, up to 3 times daily. Approved for chemotherapy-induced and post-operative nausea." },
    { minAge:12, maxAge:17, maxSingleDose:8, maxDailyDose:24, typicalDose:{min:4,max:8}, description:"Adolescents 12-17: 4-8mg per dose, up to 3 times daily." },
  ],
  metoclopramide: [
    { minAge:0, maxAge:0.083, notRecommended:true, description:"Metoclopramide NOT recommended for neonates. Risk of extrapyramidal reactions (involuntary movements) is very high in young infants." },
    { minAge:0.083, maxAge:4, notRecommended:true, description:"Metoclopramide NOT recommended under 5 years. High risk of extrapyramidal side effects (dystonia, tardive dyskinesia) in young children." },
    { minAge:5, maxAge:11, maxSingleDose:2.5, maxDailyDose:7.5, typicalDose:{min:1,max:2.5}, description:"Children 5-11 years: 0.1mg/kg per dose (max 2.5mg), 3 times daily. Use only when other antiemetics have failed. Short-term use only." },
    { minAge:12, maxAge:17, maxSingleDose:5, maxDailyDose:15, typicalDose:{min:5,max:5}, description:"Adolescents 12-17: 5mg per dose, 3 times daily. Max 5 days. Risk of extrapyramidal reactions." },
  ],
  omeprazole: [
    { minAge:0, maxAge:0.083, notRecommended:true, description:"Omeprazole NOT recommended for neonates under 1 month. Gastric acid suppression increases infection risk." },
    { minAge:0.083, maxAge:1, maxSingleDose:5, maxDailyDose:10, typicalDose:{min:2.5,max:5}, description:"Infants 1-12 months: 0.5-1mg/kg/day. Use only for confirmed GERD under paediatric gastroenterology guidance." },
    { minAge:1, maxAge:11, maxSingleDose:20, maxDailyDose:20, typicalDose:{min:10,max:20}, description:"Children 1-11 years (weight over 10kg): 10-20mg once daily. Use lowest effective dose for shortest duration." },
  ],
  pantoprazole: [
    { minAge:0, maxAge:4, notRecommended:true, description:"Pantoprazole NOT recommended under 5 years. Insufficient safety data in young children." },
    { minAge:5, maxAge:11, maxSingleDose:20, maxDailyDose:20, typicalDose:{min:20,max:20}, description:"Children 5-11 years (weight 15-40kg): 20mg once daily. Use only for confirmed erosive oesophagitis." },
    { minAge:12, maxAge:17, maxSingleDose:40, maxDailyDose:40, typicalDose:{min:40,max:40}, description:"Adolescents 12-17: 40mg once daily. Standard adult dosing applies." },
  ],
  ranitidine: [
    { minAge:0, maxAge:0.083, notRecommended:true, description:"Ranitidine NOT recommended for neonates under 1 month without specialist guidance." },
    { minAge:0.083, maxAge:1, maxSingleDose:3, maxDailyDose:6, typicalDose:{min:2,max:3}, description:"Infants 1-12 months: 2-3mg/kg per dose, twice daily. Use only under paediatric supervision." },
    { minAge:1, maxAge:11, maxSingleDose:75, maxDailyDose:300, typicalDose:{min:75,max:150}, description:"Children 1-11 years: 2-4mg/kg per dose (max 150mg), twice daily." },
  ],
  cetirizine: [
    { minAge:0, maxAge:0.5, notRecommended:true, description:"Cetirizine NOT recommended under 6 months. Insufficient safety data in neonates." },
    { minAge:0.5, maxAge:1, maxSingleDose:2.5, maxDailyDose:2.5, typicalDose:{min:2.5,max:2.5}, description:"Infants 6-12 months: 2.5mg once daily only. Use only under medical supervision." },
    { minAge:1, maxAge:5, maxSingleDose:2.5, maxDailyDose:5, typicalDose:{min:2.5,max:5}, description:"Children 1-5 years: 2.5mg twice daily (max 5mg/day). Do not exceed 5mg/day in this age group." },
    { minAge:6, maxAge:11, maxSingleDose:5, maxDailyDose:10, typicalDose:{min:5,max:10}, description:"Children 6-11 years: 5-10mg once daily or 5mg twice daily." },
  ],
  loratadine: [
    { minAge:0, maxAge:1, notRecommended:true, description:"Loratadine NOT recommended under 2 years. Insufficient safety data in infants." },
    { minAge:1, maxAge:5, maxSingleDose:5, maxDailyDose:5, typicalDose:{min:5,max:5}, description:"Children 2-5 years (weight under 30kg): 5mg once daily only. Do not exceed 5mg/day." },
    { minAge:6, maxAge:17, maxSingleDose:10, maxDailyDose:10, typicalDose:{min:10,max:10}, description:"Children 6+ years: 10mg once daily. Standard dosing." },
  ],
  montelukast: [
    { minAge:0, maxAge:0.5, notRecommended:true, description:"Montelukast NOT recommended under 6 months. Insufficient safety data." },
    { minAge:0.5, maxAge:1, maxSingleDose:4, maxDailyDose:4, typicalDose:{min:4,max:4}, description:"Infants 6-12 months: 4mg granules once daily for allergic rhinitis only." },
    { minAge:1, maxAge:5, maxSingleDose:4, maxDailyDose:4, typicalDose:{min:4,max:4}, description:"Children 1-5 years: 4mg chewable tablet or granules once daily in the evening." },
    { minAge:6, maxAge:14, maxSingleDose:5, maxDailyDose:5, typicalDose:{min:5,max:5}, description:"Children 6-14 years: 5mg chewable tablet once daily in the evening." },
  ],
  prednisolone: [
    { minAge:0, maxAge:0.083, notRecommended:true, description:"Prednisolone NOT recommended for neonates without specialist guidance. Risk of adrenal suppression and growth retardation." },
    { minAge:0.083, maxAge:5, maxSingleDose:10, maxDailyDose:40, typicalDose:{min:1,max:2}, description:"Infants and young children: 1-2mg/kg/day (max 40mg/day) for acute conditions. Use shortest course possible. Risk of growth suppression with prolonged use." },
    { minAge:6, maxAge:11, maxSingleDose:20, maxDailyDose:60, typicalDose:{min:5,max:20}, description:"Children 6-11 years: dose depends on condition. Typical 1-2mg/kg/day. Monitor growth with prolonged use." },
    { minAge:12, maxAge:17, maxSingleDose:40, maxDailyDose:60, typicalDose:{min:10,max:40}, description:"Adolescents 12-17: adult dosing applies. Taper gradually after prolonged use." },
  ],
  salbutamol: [
    { minAge:0, maxAge:0.33, notRecommended:true, description:"Salbutamol inhaler NOT recommended under 4 months. Use nebulised form only under specialist supervision for bronchiolitis." },
    { minAge:0.33, maxAge:5, maxSingleDose:2.5, maxDailyDose:10, typicalDose:{min:2.5,max:2.5}, description:"Children 4 months-5 years: 2.5mg via nebuliser, up to 4 times daily. Inhaler: 100-200mcg (1-2 puffs) via spacer." },
    { minAge:6, maxAge:11, maxSingleDose:5, maxDailyDose:20, typicalDose:{min:2.5,max:5}, description:"Children 6-11 years: 2.5-5mg via nebuliser or 100-200mcg inhaler as needed. Max 4 times daily for maintenance." },
  ],
  digoxin: [
    { minAge:0, maxAge:1, maxSingleDose:0.01, maxDailyDose:0.02, typicalDose:{min:0.005,max:0.01}, description:"Infants under 1 year: very narrow therapeutic index. Weight-based dosing essential. Toxic and therapeutic levels are very close. Requires specialist cardiac monitoring and regular serum levels." },
    { minAge:1, maxAge:11, maxSingleDose:0.125, maxDailyDose:0.25, typicalDose:{min:0.06,max:0.125}, description:"Children 1-11 years: 8-12mcg/kg/day. Narrow therapeutic index - toxicity causes arrhythmias. Requires ECG monitoring and regular serum digoxin levels." },
  ],
  furosemide: [
    { minAge:0, maxAge:0.083, maxSingleDose:1, maxDailyDose:2, typicalDose:{min:0.5,max:1}, description:"Neonates: 0.5-1mg/kg per dose, max twice daily. Risk of ototoxicity (hearing loss) with high doses. Monitor electrolytes closely." },
    { minAge:0.083, maxAge:5, maxSingleDose:2, maxDailyDose:6, typicalDose:{min:1,max:2}, description:"Infants and young children: 1-2mg/kg per dose (max 6mg/kg/day). Monitor electrolytes - risk of hypokalemia." },
    { minAge:6, maxAge:17, maxSingleDose:40, maxDailyDose:80, typicalDose:{min:20,max:40}, description:"Children 6-17 years: 20-40mg per dose. Monitor electrolytes and renal function." },
  ],
  aluminium_hydroxide_magnesium_hydroxide: [
    { minAge:0, maxAge:5, notRecommended:true, description:"Gelusil and similar antacids (aluminium/magnesium hydroxide) are NOT recommended for children under 6 years. Aluminium accumulation can cause neurotoxicity and bone disease in young children. Magnesium can cause hypermagnesaemia in infants. Use only under strict medical supervision if absolutely necessary." },
    { minAge:6, maxAge:11, maxSingleDose:400, maxDailyDose:1600, typicalDose:{min:200,max:400}, description:"Children 6-11 years: antacids should only be used under medical supervision. Max 400mg per dose, 4 times daily. Avoid prolonged use - aluminium accumulation risk. Do not use within 2 hours of other medications." },
    { minAge:12, maxAge:17, maxSingleDose:800, maxDailyDose:3200, typicalDose:{min:400,max:800}, description:"Adolescents 12-17: 400-800mg per dose, up to 4 times daily. Avoid prolonged use. Take 1-2 hours after other medications to avoid absorption interactions." },
  ],
  azithromycin: [
    { minAge:0, maxAge:0.5, notRecommended:true, description:"Azithromycin NOT recommended under 6 months without specialist guidance. Risk of infantile hypertrophic pyloric stenosis in neonates." },
    { minAge:0.5, maxAge:5, maxSingleDose:10, maxDailyDose:10, typicalDose:{min:10,max:10}, description:"Children 6 months-5 years: 10mg/kg once daily for 3 days (community pneumonia) or single 20mg/kg dose (trachoma). Weight-based dosing essential." },
    { minAge:6, maxAge:11, maxSingleDose:250, maxDailyDose:500, typicalDose:{min:250,max:500}, description:"Children 6-11 years: 10mg/kg/day (max 500mg) once daily for 3 days." },
  ],
  clarithromycin: [
    { minAge:0, maxAge:0.5, notRecommended:true, description:"Clarithromycin NOT recommended under 6 months. Insufficient safety data in young infants." },
    { minAge:0.5, maxAge:11, maxSingleDose:125, maxDailyDose:500, typicalDose:{min:62.5,max:125}, description:"Children 6 months-11 years: 7.5mg/kg twice daily (max 500mg/day). Monitor liver function with prolonged use." },
  ],
  metronidazole: [
    { minAge:0, maxAge:0.083, notRecommended:true, description:"Metronidazole NOT recommended for neonates under 1 month without specialist guidance." },
    { minAge:0.083, maxAge:5, maxSingleDose:100, maxDailyDose:400, typicalDose:{min:50,max:100}, description:"Infants and young children: 7.5mg/kg per dose, 3 times daily. Max 400mg/day. Avoid alcohol-containing preparations." },
    { minAge:6, maxAge:11, maxSingleDose:200, maxDailyDose:600, typicalDose:{min:100,max:200}, description:"Children 6-11 years: 7.5mg/kg per dose (max 200mg), 3 times daily." },
  ],
  levothyroxine: [
    { minAge:0, maxAge:0.5, maxSingleDose:0.05, maxDailyDose:0.05, typicalDose:{min:0.025,max:0.05}, description:"Neonates and infants under 6 months: 10-15mcg/kg/day. Congenital hypothyroidism requires prompt treatment to prevent intellectual disability. Dose adjusted by TSH levels." },
    { minAge:0.5, maxAge:5, maxSingleDose:0.075, maxDailyDose:0.075, typicalDose:{min:0.05,max:0.075}, description:"Children 6 months-5 years: 5-6mcg/kg/day. Regular TSH monitoring essential. Dose adjusted every 4-6 weeks." },
    { minAge:6, maxAge:11, maxSingleDose:0.1, maxDailyDose:0.1, typicalDose:{min:0.075,max:0.1}, description:"Children 6-11 years: 4-5mcg/kg/day. Monitor TSH and growth regularly." },
    { minAge:12, maxAge:17, maxSingleDose:0.15, maxDailyDose:0.15, typicalDose:{min:0.1,max:0.15}, description:"Adolescents 12-17: 2-3mcg/kg/day. Approaching adult dosing. Monitor TSH every 6 months." },
  ],
};

AGE_DOSAGE_RULES.acetaminophen = AGE_DOSAGE_RULES.paracetamol;

export const getAgeGroup = (age) => {
  if (age < 0.083) return "Neonate (< 1 month)";
  if (age < 1)     return "Infant (1-12 months)";
  if (age < 2)     return "Toddler (1-2 years)";
  if (age < 6)     return "Young child (2-5 years)";
  if (age < 12)    return "Child (6-11 years)";
  if (age < 18)    return "Adolescent (12-17 years)";
  return "Adult (18+)";
};

const normalizeDrugName = (name) => {
  const brandKey = name.toLowerCase().trim();
  if (BRAND_TO_GENERIC[brandKey]) {
    return BRAND_TO_GENERIC[brandKey].toLowerCase().replace(/\s+/g, "_");
  }
  return brandKey.replace(/\s+/g, "_");
};

export const validateAgeBasedDosage = (drugName, dosage, unit = "mg", frequency = 1, patientAge) => {
  if (patientAge === null || patientAge === undefined || patientAge === "") return [];
  const age = parseFloat(patientAge);
  if (isNaN(age) || age < 0) return [];

  const normalized = normalizeDrugName(drugName);
  const normalizedSpaced = normalized.replace(/_/g, " ");
  const rules = AGE_DOSAGE_RULES[normalized] || AGE_DOSAGE_RULES[normalizedSpaced] || null;

  if (!rules) {
    if (age < 18) {
      return [{
        type: "age_unverified",
        severity: "warning",
        ageGroup: getAgeGroup(age),
        message: drugName + " has no verified paediatric dosage data for " + getAgeGroup(age).toLowerCase() + ". Do NOT assume it is safe.",
        description: "This drug is not in the paediatric safety database. For patients under 18, always verify dosage with a paediatrician or clinical pharmacist before prescribing. Using adult doses in children can cause serious harm."
      }];
    }
    return [];
  }

  const bracket = rules.find(r => age >= (r.minAge || 0) && age <= r.maxAge);
  if (!bracket) return [];

  const issues = [];
  const dailyDose = dosage * frequency;

  if (bracket.notRecommended) {
    issues.push({
      type: "age_contraindicated",
      severity: "critical",
      ageGroup: getAgeGroup(age),
      message: drugName + " is NOT recommended for " + getAgeGroup(age).toLowerCase() + ".",
      description: bracket.description
    });
    return issues;
  }

  if (bracket.maxSingleDose && dosage > bracket.maxSingleDose) {
    issues.push({
      type: "age_high_dose",
      severity: "critical",
      ageGroup: getAgeGroup(age),
      message: "Dose of " + dosage + unit + " is too high for " + getAgeGroup(age).toLowerCase() + ". Maximum safe single dose is " + bracket.maxSingleDose + unit + ".",
      description: bracket.description
    });
  } else if (bracket.typicalDose && dosage > bracket.typicalDose.max) {
    issues.push({
      type: "age_above_typical",
      severity: "warning",
      ageGroup: getAgeGroup(age),
      message: "Dose of " + dosage + unit + " exceeds typical range (" + bracket.typicalDose.min + "-" + bracket.typicalDose.max + unit + ") for " + getAgeGroup(age).toLowerCase() + ".",
      description: bracket.description
    });
  }

  if (bracket.maxDailyDose && dailyDose > bracket.maxDailyDose) {
    issues.push({
      type: "age_daily_overdose",
      severity: "critical",
      ageGroup: getAgeGroup(age),
      message: "Daily dose of " + dailyDose + unit + " exceeds safe daily limit (" + bracket.maxDailyDose + unit + ") for " + getAgeGroup(age).toLowerCase() + ".",
      description: bracket.description
    });
  }

  return issues;
};

export const checkDrugInteractions = (drugs) => {
  const interactions = [];
  const drugNames = drugs.map(d => normalizeDrugName(d.name));
  for (let i = 0; i < drugNames.length; i++) {
    for (let j = i + 1; j < drugNames.length; j++) {
      const d1 = drugNames[i], d2 = drugNames[j];
      const ix = (DRUG_INTERACTIONS[d1] && DRUG_INTERACTIONS[d1][d2]) ||
                 (DRUG_INTERACTIONS[d2] && DRUG_INTERACTIONS[d2][d1]);
      if (ix) interactions.push({ drug1: drugs[i].name, drug2: drugs[j].name, severity: ix.severity, effect: ix.effect });
    }
  }
  return interactions;
};

export const validateDosage = (drugName, dosage, unit = "mg", frequency = 1) => {
  const key = normalizeDrugName(drugName);
  const limits = DOSAGE_LIMITS[key] || DOSAGE_LIMITS[key.replace(/_/g," ")];
  if (!limits) return { valid: true, issues: [], unknown: true };
  const dailyDose = dosage * frequency;
  const issues = [];
  if (dailyDose > limits.max) issues.push({ type:"overdose", severity:"critical", message:"Daily dose (" + dailyDose + unit + ") exceeds maximum safe limit (" + limits.max + unit + ")" });
  if (dosage > limits.typical.max) issues.push({ type:"high_dose", severity:"warning", message:"Single dose (" + dosage + unit + ") is above typical range (" + limits.typical.min + "-" + limits.typical.max + unit + ")" });
  if (dosage < limits.typical.min) issues.push({ type:"low_dose", severity:"info", message:"Dose (" + dosage + unit + ") is below typical therapeutic range (" + limits.typical.min + "-" + limits.typical.max + unit + ")" });
  return { valid: issues.filter(i => i.severity === "critical").length === 0, issues, limits };
};

export const analyzePrescription = (drugs, patientAge = null) => {
  const results = { drugs:[], interactions:[], ageWarnings:[], riskLevel:"safe", alerts:[], summary:"", patientAge };

  drugs.forEach(drug => {
    const dosage = parseFloat(drug.dosage);
    const frequency = parseInt(drug.frequency) || 1;
    const unit = drug.unit || "mg";
    const dosageResult = validateDosage(drug.name, dosage, unit, frequency);
    const ageIssues = validateAgeBasedDosage(drug.name, dosage, unit, frequency, patientAge);
    results.drugs.push({ ...drug, dosageValidation: dosageResult, ageIssues });

    (dosageResult.issues || []).forEach(issue => {
      results.alerts.push(drug.name + ": " + issue.message);
      if (issue.severity === "critical") results.riskLevel = "critical";
      else if (issue.severity === "warning" && results.riskLevel !== "critical") results.riskLevel = "warning";
    });

    ageIssues.forEach(issue => {
      results.ageWarnings.push({ drug: drug.name, ...issue });
      results.alerts.push("AGE WARNING - " + drug.name + ": " + issue.message);
      if (issue.severity === "critical") results.riskLevel = "critical";
      else if (issue.severity === "warning" && results.riskLevel !== "critical") results.riskLevel = "warning";
    });
  });

  const interactions = checkDrugInteractions(drugs);
  results.interactions = interactions;
  interactions.forEach(ix => {
    results.alerts.push("INTERACTION: " + ix.drug1 + " + " + ix.drug2 + " - " + ix.effect);
    if (ix.severity === "critical") results.riskLevel = "critical";
    else if (ix.severity === "warning" && results.riskLevel !== "critical") results.riskLevel = "warning";
  });

  const ageCount = results.ageWarnings.length;
  const critCount = results.ageWarnings.filter(w => w.severity === "critical").length + interactions.filter(i => i.severity === "critical").length;
  const warnCount = results.ageWarnings.filter(w => w.severity === "warning").length + interactions.filter(i => i.severity === "warning").length;

  if (results.riskLevel === "critical") {
    results.summary = "CRITICAL: " + critCount + " critical issue(s) detected" + (ageCount > 0 ? " including " + ageCount + " age-related concern(s)" : "") + ". Immediate clinical review required.";
  } else if (results.riskLevel === "warning") {
    results.summary = "WARNING: " + warnCount + " potential issue(s) detected" + (ageCount > 0 ? " including " + ageCount + " age-related concern(s)" : "") + ". Clinical review recommended.";
  } else {
    results.summary = "No significant drug interactions or dosage issues detected. Prescription appears safe.";
  }
  return results;
};
