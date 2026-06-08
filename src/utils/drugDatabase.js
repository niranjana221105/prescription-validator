/**
 * Comprehensive drug name dataset — generic + common brand names.
 * Used for:
 *   1. OCR output validation (reject garbage like "Tbuprofen", "abe acetal")
 *   2. Fuzzy correction (suggest "Ibuprofen" when OCR returns "Tbuprofen")
 *   3. Manual entry autocomplete
 */

// ─── Canonical generic names (lowercase) ────────────────────────────────────
export const GENERIC_DRUGS = [
  // Analgesics / Antipyretics
  'paracetamol','acetaminophen','aspirin','ibuprofen','naproxen','diclofenac',
  'celecoxib','indomethacin','ketorolac','meloxicam','piroxicam','tramadol',
  'codeine','morphine','oxycodone','hydrocodone','fentanyl','buprenorphine',
  'naloxone','naltrexone','tapentadol','mefenamic acid','etoricoxib',

  // Antibiotics
  'amoxicillin','amoxicillin clavulanate','ampicillin','penicillin',
  'cloxacillin','flucloxacillin','piperacillin','tazobactam',
  'cefalexin','cefuroxime','cefixime','ceftriaxone','cefpodoxime','cefadroxil',
  'azithromycin','clarithromycin','erythromycin','roxithromycin',
  'ciprofloxacin','levofloxacin','ofloxacin','norfloxacin','moxifloxacin',
  'doxycycline','tetracycline','minocycline',
  'metronidazole','tinidazole','ornidazole',
  'trimethoprim','sulfamethoxazole','co-trimoxazole',
  'nitrofurantoin','fosfomycin',
  'clindamycin','linezolid','vancomycin','teicoplanin',
  'gentamicin','amikacin','tobramycin',
  'rifampicin','isoniazid','pyrazinamide','ethambutol',

  // Antifungals
  'fluconazole','itraconazole','voriconazole','ketoconazole','clotrimazole',
  'miconazole','nystatin','amphotericin','terbinafine','griseofulvin',

  // Antivirals
  'acyclovir','valacyclovir','famciclovir','oseltamivir','zanamivir',
  'tenofovir','emtricitabine','lamivudine','zidovudine','efavirenz',
  'lopinavir','ritonavir','atazanavir','darunavir','raltegravir',
  'sofosbuvir','ledipasvir','ribavirin','interferon',

  // Cardiovascular
  'atenolol','metoprolol','bisoprolol','carvedilol','propranolol','nebivolol',
  'amlodipine','nifedipine','diltiazem','verapamil','felodipine','lercanidipine',
  'lisinopril','enalapril','ramipril','perindopril','captopril','trandolapril',
  'losartan','valsartan','irbesartan','candesartan','olmesartan','telmisartan',
  'furosemide','hydrochlorothiazide','indapamide','spironolactone','eplerenone',
  'digoxin','amiodarone','flecainide','sotalol','adenosine',
  'warfarin','heparin','enoxaparin','rivaroxaban','apixaban','dabigatran',
  'clopidogrel','ticagrelor','prasugrel','aspirin',
  'simvastatin','atorvastatin','rosuvastatin','pravastatin','fluvastatin',
  'ezetimibe','fenofibrate','gemfibrozil',
  'nitroglycerin','isosorbide mononitrate','isosorbide dinitrate',
  'hydralazine','minoxidil','clonidine','methyldopa','doxazosin',

  // Diabetes
  'metformin','glibenclamide','glipizide','gliclazide','glimepiride',
  'pioglitazone','rosiglitazone','sitagliptin','saxagliptin','vildagliptin',
  'empagliflozin','dapagliflozin','canagliflozin',
  'insulin','insulin glargine','insulin detemir','insulin aspart',
  'insulin lispro','insulin regular','glucagon','exenatide','liraglutide',

  // Respiratory
  'salbutamol','albuterol','terbutaline','salmeterol','formoterol',
  'ipratropium','tiotropium','umeclidinium',
  'beclomethasone','budesonide','fluticasone','mometasone','ciclesonide',
  'montelukast','zafirlukast','theophylline','aminophylline',
  'cetirizine','loratadine','fexofenadine','desloratadine','levocetirizine',
  'chlorphenamine','diphenhydramine','promethazine',
  'dextromethorphan','guaifenesin','bromhexine','ambroxol','acetylcysteine',

  // Gastrointestinal
  'omeprazole','esomeprazole','lansoprazole','pantoprazole','rabeprazole',
  'ranitidine','famotidine','cimetidine',
  'domperidone','metoclopramide','ondansetron','granisetron','prochlorperazine',
  'loperamide','bismuth subsalicylate','oral rehydration salts',
  'lactulose','bisacodyl','senna','docusate','psyllium','polyethylene glycol',
  'mesalazine','sulfasalazine','prednisolone','budesonide',
  'pancreatin','ursodeoxycholic acid','cholestyramine',

  // Neurological / Psychiatric
  'phenytoin','carbamazepine','valproate','valproic acid','lamotrigine',
  'levetiracetam','topiramate','gabapentin','pregabalin','phenobarbital',
  'diazepam','lorazepam','clonazepam','alprazolam','midazolam','nitrazepam',
  'zolpidem','zopiclone','eszopiclone','melatonin',
  'fluoxetine','sertraline','paroxetine','escitalopram','citalopram',
  'venlafaxine','duloxetine','mirtazapine','bupropion','trazodone',
  'amitriptyline','nortriptyline','imipramine','clomipramine',
  'haloperidol','risperidone','olanzapine','quetiapine','aripiprazole',
  'clozapine','ziprasidone','amisulpride','paliperidone',
  'lithium','sodium valproate','lamotrigine',
  'donepezil','rivastigmine','galantamine','memantine',
  'levodopa','carbidopa','pramipexole','ropinirole','selegiline',
  'sumatriptan','rizatriptan','zolmitriptan','ergotamine',
  'methylphenidate','atomoxetine','lisdexamfetamine',

  // Hormones / Endocrine
  'levothyroxine','liothyronine','carbimazole','propylthiouracil',
  'prednisolone','prednisone','dexamethasone','hydrocortisone','fludrocortisone',
  'testosterone','estradiol','progesterone','norethisterone',
  'combined oral contraceptive','levonorgestrel','ulipristal',
  'tamoxifen','letrozole','anastrozole','exemestane',
  'alendronate','risedronate','zoledronic acid','denosumab',
  'calcitonin','teriparatide','raloxifene',
  'growth hormone','somatropin','octreotide',

  // Immunosuppressants / Biologics
  'methotrexate','azathioprine','mycophenolate','ciclosporin','tacrolimus',
  'hydroxychloroquine','chloroquine','sulfasalazine','leflunomide',
  'infliximab','adalimumab','etanercept','rituximab','tocilizumab',

  // Oncology (common)
  'cyclophosphamide','doxorubicin','vincristine','paclitaxel','docetaxel',
  'cisplatin','carboplatin','oxaliplatin','fluorouracil','capecitabine',
  'imatinib','erlotinib','gefitinib','sorafenib','sunitinib',
  'tamoxifen','letrozole','anastrozole',

  // Vitamins / Supplements
  'vitamin a','vitamin b1','thiamine','vitamin b2','riboflavin',
  'vitamin b3','niacin','vitamin b6','pyridoxine','vitamin b9','folic acid',
  'vitamin b12','cyanocobalamin','vitamin c','ascorbic acid',
  'vitamin d','cholecalciferol','vitamin e','tocopherol','vitamin k',
  'calcium','calcium carbonate','calcium citrate',
  'iron','ferrous sulfate','ferrous gluconate','ferric carboxymaltose',
  'zinc','magnesium','potassium','sodium bicarbonate',
  'omega-3','fish oil','glucosamine','chondroitin',

  // Ophthalmology
  'timolol','latanoprost','bimatoprost','brimonidine','dorzolamide',
  'prednisolone eye drops','dexamethasone eye drops','ciprofloxacin eye drops',
  'artificial tears','hypromellose','sodium hyaluronate',

  // Dermatology
  'betamethasone','clobetasol','hydrocortisone cream','triamcinolone',
  'tretinoin','adapalene','benzoyl peroxide','clindamycin gel',
  'mupirocin','fusidic acid','silver sulfadiazine',
  'permethrin','ivermectin','lindane',

  // Urology / Renal
  'tamsulosin','alfuzosin','finasteride','dutasteride','sildenafil',
  'tadalafil','vardenafil','oxybutynin','tolterodine','solifenacin',
  'allopurinol','febuxostat','colchicine','probenecid',

  // Miscellaneous
  'dexamethasone','methylprednisolone','betamethasone',
  'adrenaline','epinephrine','atropine','neostigmine',
  'magnesium sulfate','calcium gluconate','potassium chloride',
  'normal saline','ringer lactate','dextrose',
  'activated charcoal','n-acetylcysteine',
  'phytomenadione','vitamin k1','protamine',
  'oxytocin','ergometrine','misoprostol',
  'chlorhexidine','povidone iodine','hydrogen peroxide',
];

// ─── Common brand names → generic mapping ───────────────────────────────────
export const BRAND_TO_GENERIC = {
  // Antacids / GI brands
  'gelusil':      'aluminium hydroxide magnesium hydroxide',
  'digene':       'aluminium hydroxide magnesium hydroxide',
  'mucaine':      'aluminium hydroxide magnesium hydroxide',
  'maalox':       'aluminium hydroxide magnesium hydroxide',
  'mylanta':      'aluminium hydroxide magnesium hydroxide',
  'gaviscon':     'sodium alginate',
  'eno':          'sodium bicarbonate',
  'pudin hara':   'mint antacid',
  'pan d':        'pantoprazole domperidone',
  'nexpro':       'esomeprazole',
  'razo':         'rabeprazole',
  'aciloc':       'ranitidine',
  'zinetac':      'ranitidine',
  'rantac':       'ranitidine',
  'omez':         'omeprazole',
  'pantop':       'pantoprazole',

  // Analgesics
  'tylenol':      'acetaminophen',
  'panadol':      'paracetamol',
  'calpol':       'paracetamol',
  'dolo':         'paracetamol',
  'dolo 650':     'paracetamol',
  'crocin':       'paracetamol',
  'metacin':      'paracetamol',
  'pyrigesic':    'paracetamol',
  'combiflam':    'ibuprofen paracetamol',
  'brufen':       'ibuprofen',
  'nurofen':      'ibuprofen',
  'advil':        'ibuprofen',
  'nurofen':      'ibuprofen',
  'brufen':       'ibuprofen',
  'voltaren':     'diclofenac',
  'cataflam':     'diclofenac',
  'celebrex':     'celecoxib',
  'ultram':       'tramadol',
  'tramal':       'tramadol',
  'oxycontin':    'oxycodone',
  'vicodin':      'hydrocodone',
  'duragesic':    'fentanyl',

  // Antibiotics
  'augmentin':    'amoxicillin clavulanate',
  'zithromax':    'azithromycin',
  'azee':         'azithromycin',
  'biaxin':       'clarithromycin',
  'cipro':        'ciprofloxacin',
  'ciplox':       'ciprofloxacin',
  'levaquin':     'levofloxacin',
  'flagyl':       'metronidazole',
  'bactrim':      'co-trimoxazole',
  'septra':       'co-trimoxazole',
  'vibramycin':   'doxycycline',
  'cleocin':      'clindamycin',
  'zyvox':        'linezolid',
  'vancocin':     'vancomycin',

  // Cardiovascular
  'lopressor':    'metoprolol',
  'toprol':       'metoprolol',
  'tenormin':     'atenolol',
  'coreg':        'carvedilol',
  'inderal':      'propranolol',
  'norvasc':      'amlodipine',
  'procardia':    'nifedipine',
  'cardizem':     'diltiazem',
  'calan':        'verapamil',
  'zestril':      'lisinopril',
  'prinivil':     'lisinopril',
  'vasotec':      'enalapril',
  'altace':       'ramipril',
  'cozaar':       'losartan',
  'diovan':       'valsartan',
  'avapro':       'irbesartan',
  'atacand':      'candesartan',
  'micardis':     'telmisartan',
  'lasix':        'furosemide',
  'aldactone':    'spironolactone',
  'lanoxin':      'digoxin',
  'cordarone':    'amiodarone',
  'coumadin':     'warfarin',
  'plavix':       'clopidogrel',
  'brilinta':     'ticagrelor',
  'zocor':        'simvastatin',
  'lipitor':      'atorvastatin',
  'crestor':      'rosuvastatin',
  'pravachol':    'pravastatin',
  'zetia':        'ezetimibe',
  'nitrostat':    'nitroglycerin',
  'imdur':        'isosorbide mononitrate',

  // Diabetes
  'glucophage':   'metformin',
  'januvia':      'sitagliptin',
  'jardiance':    'empagliflozin',
  'farxiga':      'dapagliflozin',
  'invokana':     'canagliflozin',
  'victoza':      'liraglutide',
  'ozempic':      'semaglutide',
  'lantus':       'insulin glargine',
  'levemir':      'insulin detemir',
  'novolog':      'insulin aspart',
  'humalog':      'insulin lispro',

  // Respiratory
  'ventolin':     'salbutamol',
  'proventil':    'albuterol',
  'serevent':     'salmeterol',
  'spiriva':      'tiotropium',
  'pulmicort':    'budesonide',
  'flovent':      'fluticasone',
  'singulair':    'montelukast',
  'zyrtec':       'cetirizine',
  'claritin':     'loratadine',
  'allegra':      'fexofenadine',
  'benadryl':     'diphenhydramine',
  'phenergan':    'promethazine',
  'mucinex':      'guaifenesin',

  // GI
  'prilosec':     'omeprazole',
  'nexium':       'esomeprazole',
  'prevacid':     'lansoprazole',
  'protonix':     'pantoprazole',
  'aciphex':      'rabeprazole',
  'zantac':       'ranitidine',
  'pepcid':       'famotidine',
  'reglan':       'metoclopramide',
  'zofran':       'ondansetron',
  'imodium':      'loperamide',
  'miralax':      'polyethylene glycol',
  'dulcolax':     'bisacodyl',

  // Neuro / Psych
  'neurontin':    'gabapentin',
  'lyrica':       'pregabalin',
  'keppra':       'levetiracetam',
  'lamictal':     'lamotrigine',
  'depakote':     'valproate',
  'tegretol':     'carbamazepine',
  'dilantin':     'phenytoin',
  'valium':       'diazepam',
  'ativan':       'lorazepam',
  'klonopin':     'clonazepam',
  'xanax':        'alprazolam',
  'ambien':       'zolpidem',
  'prozac':       'fluoxetine',
  'zoloft':       'sertraline',
  'paxil':        'paroxetine',
  'lexapro':      'escitalopram',
  'celexa':       'citalopram',
  'effexor':      'venlafaxine',
  'cymbalta':     'duloxetine',
  'remeron':      'mirtazapine',
  'wellbutrin':   'bupropion',
  'elavil':       'amitriptyline',
  'haldol':       'haloperidol',
  'risperdal':    'risperidone',
  'zyprexa':      'olanzapine',
  'seroquel':     'quetiapine',
  'abilify':      'aripiprazole',
  'clozaril':     'clozapine',
  'aricept':      'donepezil',
  'exelon':       'rivastigmine',
  'namenda':      'memantine',
  'sinemet':      'levodopa carbidopa',
  'imitrex':      'sumatriptan',
  'ritalin':      'methylphenidate',
  'concerta':     'methylphenidate',
  'strattera':    'atomoxetine',

  // Hormones
  'synthroid':    'levothyroxine',
  'eltroxin':     'levothyroxine',
  'tapazole':     'methimazole',
  'medrol':       'methylprednisolone',
  'deltasone':    'prednisone',
  'nolvadex':     'tamoxifen',
  'femara':       'letrozole',
  'arimidex':     'anastrozole',
  'fosamax':      'alendronate',
  'actonel':      'risedronate',
  'zometa':       'zoledronic acid',
  'prolia':       'denosumab',
  'evista':       'raloxifene',

  // Urology
  'flomax':       'tamsulosin',
  'proscar':      'finasteride',
  'avodart':      'dutasteride',
  'viagra':       'sildenafil',
  'cialis':       'tadalafil',
  'levitra':      'vardenafil',
  'ditropan':     'oxybutynin',
  'detrol':       'tolterodine',
  'zyloprim':     'allopurinol',
  'uloric':       'febuxostat',
  'colcrys':      'colchicine',
};

// Build a flat set of all valid names for O(1) lookup
const ALL_VALID_NAMES = new Set([
  ...GENERIC_DRUGS,
  ...Object.keys(BRAND_TO_GENERIC),
  ...Object.values(BRAND_TO_GENERIC),
]);

/**
 * Levenshtein distance between two strings (case-insensitive).
 * Used for fuzzy matching OCR output to known drug names.
 */
const levenshtein = (a, b) => {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
};

/**
 * Validate a drug name and return a result object:
 *
 *   { valid: true,  canonical: 'ibuprofen', isGeneric: true }
 *   { valid: true,  canonical: 'ibuprofen', isGeneric: false, brand: 'advil' }
 *   { valid: false, suggestions: ['ibuprofen', 'naproxen'], distance: 1 }
 *   { valid: false, suggestions: [], distance: 99 }  ← complete garbage
 */
export const validateDrugName = (name) => {
  if (!name || name.trim().length < 2) {
    return { valid: false, suggestions: [], reason: 'too_short' };
  }

  const lower = name.toLowerCase().trim();

  // 1. Exact match in generic list
  if (GENERIC_DRUGS.includes(lower)) {
    return { valid: true, canonical: lower, isGeneric: true };
  }

  // 2. Exact match as brand name
  if (BRAND_TO_GENERIC[lower]) {
    return {
      valid: true,
      canonical: BRAND_TO_GENERIC[lower],
      isGeneric: false,
      brand: lower,
    };
  }

  // 3. Fuzzy match — find closest known names
  const candidates = [...ALL_VALID_NAMES];
  const scored = candidates
    .map(candidate => ({ candidate, dist: levenshtein(lower, candidate) }))
    .filter(({ dist, candidate }) => {
      // Allow up to 2 edits for short names, 3 for longer ones, but
      // also require the first character to be close (catches "Tbuprofen" → "Ibuprofen")
      const maxDist = lower.length <= 6 ? 2 : 3;
      return dist <= maxDist;
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  if (scored.length > 0) {
    // Resolve brand names to generics in suggestions
    const suggestions = scored.map(({ candidate }) =>
      BRAND_TO_GENERIC[candidate]
        ? BRAND_TO_GENERIC[candidate]
        : candidate
    );
    return {
      valid: false,
      suggestions: [...new Set(suggestions)],
      distance: scored[0].dist,
      reason: 'fuzzy_mismatch',
    };
  }

  // 4. No match at all — likely OCR garbage
  return {
    valid: false,
    suggestions: [],
    distance: 99,
    reason: 'unknown',
  };
};

/**
 * Validate and auto-correct a list of parsed drugs.
 * Returns each drug with a `nameValidation` field attached.
 * If a drug has exactly one close suggestion (distance === 1),
 * it is auto-corrected and flagged as `autoCorrected`.
 */
export const validateAndCorrectDrugs = (drugs) => {
  return drugs.map(drug => {
    const result = validateDrugName(drug.name);

    if (result.valid) {
      // Normalise to canonical name (e.g. "Advil" → "ibuprofen")
      const canonical = result.canonical;
      const correctedName = canonical.charAt(0).toUpperCase() + canonical.slice(1);
      return {
        ...drug,
        name: correctedName,
        nameValidation: { ...result, status: 'valid' },
      };
    }

    // Auto-correct only when there is exactly one suggestion at distance 1
    if (result.suggestions.length === 1 && result.distance === 1) {
      const corrected = result.suggestions[0];
      const correctedName = corrected.charAt(0).toUpperCase() + corrected.slice(1);
      return {
        ...drug,
        name: correctedName,
        originalName: drug.name,
        autoCorrected: true,
        nameValidation: { ...result, status: 'auto_corrected' },
      };
    }

    // Flag as invalid — keep original name so user can see what OCR produced
    return {
      ...drug,
      nameValidation: { ...result, status: 'invalid' },
    };
  });
};

/**
 * Filter out drugs that are clearly invalid (no suggestions, pure OCR garbage).
 * Drugs with suggestions are kept but flagged so the user can confirm/correct.
 */
export const filterValidDrugs = (validatedDrugs) => {
  return validatedDrugs.filter(drug => {
    const v = drug.nameValidation;
    if (!v) return true;                          // no validation info → keep
    if (v.status === 'valid') return true;        // confirmed valid
    if (v.status === 'auto_corrected') return true; // auto-fixed
    if (v.status === 'invalid' && v.suggestions.length > 0) return true; // keep with warning
    return false;                                 // pure garbage → drop
  });
};
