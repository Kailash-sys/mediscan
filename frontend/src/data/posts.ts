/**
 * Blog content types + mock posts.
 *
 * NOTE: The backend has no blog API yet, so this data lives in the frontend.
 * Written so a future CMS/backend swap only touches src/api/blogApi.ts.
 */

export interface BlogSection {
  heading?: string
  paragraphs: string[]
  list?: string[]
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  authorRole: string
  date: string // ISO yyyy-mm-dd
  readingTimeMinutes: number
  coverImage: string
  featured?: boolean
  sections: BlogSection[]
}

export const POSTS: BlogPost[] = [
  {
    slug: 'drug-interactions-explained',
    title: 'Drug Interactions Explained: Why Two "Safe" Medicines Can Be Risky Together',
    excerpt:
      'Each medicine on its own may be perfectly safe — but taken together, some combinations change how your body processes them. Here is how interactions happen and how to spot the warning signs.',
    category: 'Medication Safety',
    tags: ['interactions', 'pharmacology', 'safety'],
    author: 'Dr. Ananya Rao',
    authorRole: 'Clinical Pharmacology Reviewer',
    date: '2026-09-14',
    readingTimeMinutes: 7,
    coverImage:
      'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=1280',
    featured: true,
    sections: [
      {
        paragraphs: [
          'A drug interaction happens when one medicine affects how another works in your body. This can make a medicine stronger, weaker, or produce an effect that neither medicine would cause alone.',
          'Interactions are surprisingly common. Many people take two or more medicines daily — a painkiller, a blood-pressure tablet, a supplement — without ever having the combination reviewed.',
        ],
      },
      {
        heading: 'The three main types of interactions',
        paragraphs: [
          'Interactions are usually grouped by what is interacting with what. Knowing the type helps you understand why your doctor or pharmacist asks certain questions.',
        ],
        list: [
          'Drug–drug: one medicine changes the level or effect of another (the most studied type).',
          'Drug–food & drink: grapefruit juice, alcohol, and even some leafy greens can change how medicines are absorbed or broken down.',
          'Drug–condition: a medicine that is fine for one person can be risky for someone with kidney, liver, or heart problems.',
        ],
      },
      {
        heading: 'Why severity matters',
        paragraphs: [
          'Interaction databases often classify combinations as minor, moderate, or major. A minor interaction might slightly increase the chance of a side effect, while a major one can be dangerous — for example, raising the risk of abnormal bleeding or heart-rhythm problems.',
          'Severity is not destiny: doctors sometimes intentionally combine medicines and simply monitor you more closely. Never stop a prescribed medicine because of something you read — bring the concern to your prescriber.',
        ],
      },
      {
        heading: 'Practical steps you can take today',
        paragraphs: [
          'You do not need a pharmacology degree to reduce your risk. A few habits cover most situations.',
        ],
        list: [
          'Keep an up-to-date list of every medicine and supplement you take, including over-the-counter ones.',
          'Check new medicines against your current list — MediScan AI can help by reading medicine labels from photos.',
          'Use one pharmacy where possible so the pharmacist can see your full picture.',
          'Ask specifically: "Is this safe with the other medicines I take?"',
        ],
      },
      {
        paragraphs: [
          'The goal is not to fear medicines — it is to use them with full information. Modern healthcare depends on combinations of treatments; the safety comes from awareness, not avoidance.',
        ],
      },
    ],
  },
  {
    slug: 'reading-a-medicine-label',
    title: 'How to Read a Medicine Label (and What Those Small Print Sections Mean)',
    excerpt:
      'Brand name, generic name, strength, batch, expiry — a medicine strip is packed with information. Learning the layout makes it much easier to identify a medicine correctly.',
    category: 'Medication Safety',
    tags: ['labels', 'guides', 'medicine 101'],
    author: 'Dr. Ananya Rao',
    authorRole: 'Clinical Pharmacology Reviewer',
    date: '2026-09-05',
    readingTimeMinutes: 5,
    coverImage:
      'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1280',
    sections: [
      {
        paragraphs: [
          'Whether it is a blister strip, a bottle, or a box, most medicine packaging follows the same pattern. Once you know where to look, you can find the important details in seconds.',
        ],
      },
      {
        heading: 'The parts that matter most',
        paragraphs: ['Scan the packaging in this order:'],
        list: [
          'Brand name — the big, memorable name the manufacturer markets (e.g. "Crocin").',
          'Generic name — the actual drug inside, usually smaller (e.g. "Paracetamol"). This is what interaction checkers rely on.',
          'Strength — how much drug per tablet or dose, e.g. 500 mg.',
          'Dosage form — tablet, capsule, syrup, injection.',
          'Expiry and batch — quality and traceability information.',
        ],
      },
      {
        heading: 'Why the generic name is the key',
        paragraphs: [
          'The same generic drug is sold under dozens of brand names across countries. Two boxes with different names may contain the very same medicine — which is exactly how accidental double-dosing happens.',
          'When you scan a medicine with MediScan AI, the system looks for the generic ingredient name because interactions are defined between ingredients, not brands.',
        ],
      },
      {
        heading: 'Photographing labels for the best results',
        paragraphs: ['Good input makes any scanner more accurate:'],
        list: [
          'Fill the frame with the printed side of the strip or box.',
          'Use indirect light and avoid flash glare on foil.',
          'Hold steady and tap to focus before capturing.',
          'Capture the side of the box with the composition/generic-name panel if possible.',
        ],
      },
    ],
  },
  {
    slug: 'generic-vs-brand-medicines',
    title: 'Generic vs Brand-Name Medicines: Same Drug, Different Price Tag',
    excerpt:
      'Generics contain the same active ingredient as the brand original. We break down what "equivalent" really means, and what generic substitution means for interaction checking.',
    category: 'Health Education',
    tags: ['generic medicines', 'costs', 'pharmacy'],
    author: 'Marcus Lee',
    authorRole: 'Health Writer',
    date: '2026-08-22',
    readingTimeMinutes: 6,
    coverImage:
      'https://images.pexels.com/photos/139398/white-round-tablet-1404048.jpeg?auto=compress&cs=tinysrgb&w=1280',
    sections: [
      {
        paragraphs: [
          'When a pharmaceutical company develops a new drug, it sells it under a brand name while it holds patents. Once those expire, other manufacturers can produce the same molecule — the generic.',
          'Regulators require generics to demonstrate that they deliver the same active ingredient, at the same strength, in the same form, and that they behave equivalently in the body.',
        ],
      },
      {
        heading: 'What is allowed to differ',
        paragraphs: ['Generics are not photocopier copies. A few things legitimately vary:'],
        list: [
          'Inactive ingredients (binders, dyes, coatings) — usually harmless, occasionally relevant for allergies.',
          'Appearance — shape, color, and imprint differ by manufacturer.',
          'Price — often dramatically lower, since development costs are already recovered.',
        ],
      },
      {
        heading: 'What this means for interaction checking',
        paragraphs: [
          'Interactions live at the level of the active ingredient. A brand-name and a generic version of the same drug carry the same interaction profile — which is why a checker should always map a brand to its generic ingredient.',
          'One caution: taking a brand and a generic of the same ingredient together (e.g. two different painkillers containing the same molecule) is double-dosing, and it is one of the most common self-medication mistakes.',
        ],
      },
      {
        paragraphs: [
          'If cost is a concern for a long-term prescription, ask your prescriber whether a generic substitute is appropriate — for most medicines, the answer is yes.',
        ],
      },
    ],
  },
  {
    slug: 'smartphone-photo-medicine-ocr',
    title: 'From Photo to Insight: How Image-Based Medicine Identification Works',
    excerpt:
      'OCR, text cleanup, and language models turn a simple photo of a medicine strip into structured, searchable information. A plain-language tour of the pipeline.',
    category: 'Technology',
    tags: ['ocr', 'ai', 'how it works'],
    author: 'Priya Sharma',
    authorRole: 'ML Engineer',
    date: '2026-08-10',
    readingTimeMinutes: 8,
    coverImage:
      'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1280',
    sections: [
      {
        paragraphs: [
          'Taking a photo of a medicine feels trivial — the hard part is turning pixels into reliable information. MediScan AI runs a multi-stage pipeline, and each stage quietly does a specialized job.',
        ],
      },
      {
        heading: 'Stage 1 — Optical Character Recognition (OCR)',
        paragraphs: [
          'An OCR model scans the image and pulls out every piece of text it can find: brand names, strengths, warnings, batch numbers, even parts of the pharmacy sticker. Foil packaging, curved bottles, and glare make this genuinely difficult, so image quality matters more than most people expect.',
        ],
      },
      {
        heading: 'Stage 2 — Cleaning the noise',
        paragraphs: [
          'Raw OCR output is messy: random numbers, single letters, dosage fragments like "500mg". A cleaning pass strips symbols, drops obvious non-words, and removes packaging boilerplate ("Tablet IP", "Mfg", "Batch") that would otherwise confuse the next stage.',
        ],
      },
      {
        heading: 'Stage 3 — Recognizing actual medicines',
        paragraphs: [
          'A language model reviews the cleaned text and asks a focused question: which of these words are real medicine names? It corrects OCR spelling mistakes ("Amoxi5t0" → "Amoxicillin"), ignores patient and hospital names, and returns a structured list of medicines.',
        ],
      },
      {
        heading: 'Stage 4 — Interaction analysis',
        paragraphs: [
          'For every pair of detected medicines, the system looks up official regulatory label data (such as the US FDA drug label database) and asks a second language model to reason strictly over that sourced text — producing an interaction verdict, a severity level, and a plain-language explanation.',
          'That last detail matters: the explanation is grounded in the label data rather than invented, and if no label data can be found, the system says "Unknown" instead of guessing.',
        ],
      },
      {
        paragraphs: [
          'The result: you point a camera at your medicines, and seconds later you get a readable safety summary. Every stage stays auditable — the raw OCR text is always available to inspect in the results view.',
        ],
      },
    ],
  },
  {
    slug: 'questions-to-ask-your-pharmacist',
    title: '5 Questions to Ask Your Pharmacist About Every New Medicine',
    excerpt:
      'Your pharmacist is one of the most accessible healthcare professionals you will ever meet. These five questions take under two minutes and can prevent most medication problems.',
    category: 'Patient Tips',
    tags: ['pharmacist', 'questions', 'safety'],
    author: 'Marcus Lee',
    authorRole: 'Health Writer',
    date: '2026-07-28',
    readingTimeMinutes: 4,
    coverImage:
      'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1280',
    sections: [
      {
        paragraphs: [
          'Pharmacists train for years in how medicines work — and unlike a busy clinic, you usually do not need an appointment to speak to one. Bring your medicine list (or your medicine boxes) and ask:',
        ],
      },
      {
        heading: 'The five questions',
        paragraphs: ['Run through this list for anything new:'],
        list: [
          '1. "How should I take this — with food, without, at what time of day?"',
          '2. "Does it interact with anything I already take, including supplements?"',
          '3. "What side effects are common, and which ones mean I should call a doctor?"',
          '4. "What happens if I miss a dose?"',
          '5. "How long until this starts working — and how will I know it is working?"',
        ],
      },
      {
        heading: 'Make it a habit, not a one-off',
        paragraphs: [
          'The value compounds over time. A pharmacist who sees your full medicine list at every visit is far more likely to catch a duplicate ingredient, a dose that crept up, or an interaction that appeared when a new prescription was added.',
          'Between visits, tools like MediScan AI give you a quick way to check new purchases against what you already have at home — but they support, and never replace, a conversation with a professional.',
        ],
      },
    ],
  },
  {
    slug: 'keeping-a-home-medicine-list',
    title: 'Why Every Household Should Keep a Medicine List (and How to Start)',
    excerpt:
      'A simple, current list of the medicines in your home saves time in emergencies, prevents double-dosing, and makes every doctor visit more productive.',
    category: 'Patient Tips',
    tags: ['organization', 'emergency', 'family'],
    author: 'Dr. Ananya Rao',
    authorRole: 'Clinical Pharmacology Reviewer',
    date: '2026-07-12',
    readingTimeMinutes: 5,
    coverImage:
      'https://images.pexels.com/photos/5863391/pexels-photo-5863391.jpeg?auto=compress&cs=tinysrgb&w=1280',
    sections: [
      {
        paragraphs: [
          'Most households accumulate medicines quietly: painkillers from last winter, an unfinished antibiotic course, a relative\'s blood-pressure tablets on holiday. Nobody tracks them — until the moment someone needs to.',
        ],
      },
      {
        heading: 'What a good medicine list contains',
        paragraphs: ['One page is enough. For each item record:'],
        list: [
          'The generic name and strength (not just the brand).',
          'Why it was prescribed or bought, and for whom.',
          'The dose and how often it is taken.',
          'Whether the course was completed or the box is still lying around.',
        ],
      },
      {
        heading: 'Where this pays off',
        paragraphs: ['A maintained list helps in concrete situations:'],
        list: [
          'Emergencies — paramedics and ER staff can see the full picture immediately.',
          'Doctor visits — every consultation starts with better information.',
          'Avoiding duplicates — two products containing the same ingredient are surprisingly easy to buy twice.',
          'Expiry sweeps — you will finally notice what is out of date and dispose of it safely.',
        ],
      },
      {
        heading: 'A shortcut: scan your cabinet',
        paragraphs: [
          'Instead of typing everything by hand, photograph each strip or box with MediScan AI and note the detected names. Ten minutes for a typical cabinet, and your list builds itself — then review it with your doctor or pharmacist at your next visit.',
        ],
      },
    ],
  },
]
