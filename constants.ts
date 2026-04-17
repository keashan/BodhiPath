
import { Language, Lesson } from './types';

export const APP_NAME = "BodhiPath";

export const LEGAL_CONTENT = {
  en: {
    terms: {
      title: "Terms & Conditions",
      lastUpdated: "June 2025",
      sections: [
        {
          heading: "1. Nature of the Service",
          content: "BodhiPath is an educational and spiritual companion app. The guidance provided by the AI Monk (Bhante Bodhi) is generated using artificial intelligence based on Theravāda Buddhist texts and should not be considered as professional medical, psychological, or legal advice."
        },
        {
          heading: "2. Personal Responsibility",
          content: "Users are responsible for their own practice and mental well-being. Please approach the teachings with mindfulness and critical thinking (Kalama Sutta principle)."
        },
        {
          heading: "3. Usage Conduct",
          content: "Users agree to interact with the AI guide and the community (if applicable) with respect and right speech."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "June 2025",
      sections: [
        {
          heading: "1. Data We Collect",
          content: "We collect your email (if you sign in), your spiritual goals, and app preferences to personalize your journey."
        },
        {
          heading: "2. How We Use Data",
          content: "Your data is used solely to provide personalized Dhamma guidance and daily reflections. We do not sell or share your personal data with third parties for marketing purposes."
        },
        {
          heading: "3. AI Processing",
          content: "Your chat interactions are processed by Google Gemini API to generate responses. We advise not sharing sensitive personal identifiers in the chat."
        }
      ]
    }
  },
  si: {
    terms: {
      title: "ව්‍යවස්ථා සහ කොන්දේසි",
      lastUpdated: "2025 ජුනි",
      sections: [
        {
          heading: "1. සේවාවේ ස්වභාවය",
          content: "බෝධි මාර්ගය යනු අධ්‍යාපනික සහ අධ්‍යාත්මික සහකාර යෙදුමකි. AI හිමිනම (භන්තේ බෝධි) විසින් ලබා දෙන උපදෙස් ථේරවාද බෞද්ධ ග්‍රන්ථ මත පදනම්ව කෘතිම බුද්ධිය (AI) මගින් උත්පාදනය කරන ලද ඒවා වන අතර, ඒවා වෘත්තීය වෛද්‍ය, මනෝවිද්‍යාත්මක හෝ නීතිමය උපදෙස් ලෙස නොසැලකිය යුතුය."
        },
        {
          heading: "2. පෞද්ගලික වගකීම",
          content: "පරිශීලකයන් තමන්ගේම පුහුණුව සහ මානසික යහපැවැත්ම පිළිබඳව වගකිව යුතුය. කරුණාකර සිහියෙන් යුතුව මෙම දේශනා පරිශීලනය කරන්න (කාලාම සූත්‍ර ප්‍රතිපත්තිය)."
        },
        {
          heading: "3. භාවිතය",
          content: "AI මඟ පෙන්වන්නා සහ ප්‍රජාව සමඟ ගෞරවාන්විතව සහ සම්මා වාචාවෙන් යුතුව අදහස් හුවමාරු කර ගැනීමට පරිශීලකයන් එකඟ වේ."
        }
      ]
    },
    privacy: {
      title: "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
      lastUpdated: "2025 ජුනි",
      sections: [
        {
          heading: "1. අප රැස් කරන දත්ත",
          content: "ඔබේ ගමන පෞද්ගලීකරණය කිරීම සඳහා අපි ඔබේ විද්‍යුත් තැපෑල (ඔබ ඇතුළු වූයේ නම්), ඔබේ අධ්‍යාත්මික අරමුණු සහ යෙදුම් මනාපයන් රැස් කරන්නෙමු."
        },
        {
          heading: "2. අපි දත්ත භාවිතා කරන ආකාරය",
          content: "ඔබේ දත්ත භාවිතා කරනු ලබන්නේ පුද්ගලීකරණය කළ ධර්ම උපදෙස් සහ දෛනික පරාවර්තනයන් සැපයීම සඳහා පමණි. අපි ඔබේ පුද්ගලික දත්ත අලෙවිකරණ අරමුණු සඳහා තෙවන පාර්ශවයන් සමඟ විකුණන්නේ හෝ බෙදා නොගන්නෙමු."
        },
        {
          heading: "3. AI සැකසීම",
          content: "ඔබේ චැට් අන්තර්ක්‍රියා සඳහා පිළිතුරු ලබා ගැනීමට Google Gemini API භාවිතා කරනු ලැබේ. චැට් එක තුළ සංවේදී පුද්ගලික තොරතුරු බෙදා නොගන්නා ලෙස අපි උපදෙස් දෙමු."
        }
      ]
    }
  }
};

export const UI_TEXT = {
  en: {
    welcome: "Welcome to BodhiPath",
    subtitle: "Begin your journey into the Theravāda teachings of the Buddha.",
    startBtn: "Start Your Path",
    langSelect: "Choose your preferred language.",
    goalsTitle: "What brings you here?",
    personalizeTitle: "Would you like BodhiPath to personalize your journey?",
    dailyDropTitle: "Would you like to receive daily Dharma drops?",
    finalTitle: "You are ready.",
    finalSubtitle: "May your path be filled with wisdom and compassion.",
    enterBtn: "Enter BodhiPath",
    
    // Website Navigation
    navHome: "Home",
    navAbout: "About Us",
    navContact: "Contact Us",
    navPortal: "Open App",
    
    // Dashboard
    askMonk: "Ask the AI Monk",
    meditateNow: "Meditate Now",
    karmaJournal: "Karma Journal",
    suttaExplorer: "Sutta Explorer",
    todaysTeaching: "Today's Teaching",
    continuePath: "Continue Your Path",
    dhammaClassroom: "Dhamma Classroom",
    switchLanguage: "Switch Language",
    
    // Navigation
    home: "Home",
    chat: "Chat",
    meditate: "Meditate",
    journal: "Journal",
    temple: "Temple Finder",
    classroom: "Classroom",
    dailyDrops: "Daily Wisdom",
    
    // Legal
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    back: "Back",

    // Data Management
    resetJourney: "Reset Journey",
    resetConfirm: "Are you sure you want to reset your journey?",

    // Chat
    chatPlaceholder: "Ask a question about the Dhamma...",
    monkPersona: "Bhante Bodhi",
    debateMode: "Debate Mode",
    
    // Meditation
    startSession: "Start Session",
    stopSession: "End Session",
    duration: "Duration",
    minutes: "minutes",
    feedbackTitle: "How was your session?",
    feedbackPlaceholder: "Share your experience...",
    selectMethod: "Select Method",
    instructions: "Instructions",
    
    // Journal
    newEntry: "New Entry",
    saveEntry: "Save to Karma Journal",
    entryPlaceholder: "Reflect on your actions today...",

    // Classroom
    askLessonQuestion: "Ask a question about this lesson...",
    askBtn: "Ask",
    lessonQnA: "Lesson Q&A",

    // Sutta Explorer
    suttaSearchPlaceholder: "Search for a Sutta or topic (e.g., 'Metta', 'Anger')...",
    suttaExplorerTitle: "Tipitaka Navigator",
    suttaExplorerSubtitle: "Explore the Pali Canon with AI guidance.",
    suggestedSuttas: "Suggested Readings",

    // Calendar
    buddhistCalendar: "Buddhist Calendar 2025",

    // Invite
    spreadDhamma: "Spread the Dhamma",
    inviteFriends: "Invite Friends",
    shareMessage: "Join me on BodhiPath to learn the Buddha's teachings with AI guidance.",
    linkCopied: "Link copied to clipboard!",

    // Daily Drops View
    wisdomGallery: "Wisdom Gallery",
    previousDrops: "Previous Reflections",
    noHistory: "Your history of wisdom begins today.",
    todayInspiration: "Today's Inspiration"
  },
  si: {
    welcome: "බෝධි මාර්ගයට සාදරයෙන් පිළිගනිමු",
    subtitle: "බුද්ධ ථේරවාද දේශනාවන්ට ඔබේ ගමන ආරම්භ කරන්න.",
    startBtn: "ඔබේ මාර්ගය ආරම්භ කරන්න",
    langSelect: "ඔබ කැමති භාෂාව තෝරන්න.",
    goalsTitle: "ඔබ මෙහි පැමිණියේ කුමන හේතුවක් නිසාද?",
    personalizeTitle: "බෝධි මාර්ගය ඔබේ ගමන පුද්ගලිකව සකස් කර දිය යුතුද?",
    dailyDropTitle: "ඔබට දෛනික ධර්ම පණිවිඩ ලබාගැනීමට අවශ්‍යද?",
    finalTitle: "ඔබ සූදානම්.",
    finalSubtitle: "ඔබේ මාර්ගය ප්‍රඥාව සහ කරුණාවෙන් පිරියි.",
    enterBtn: "බෝධි මාර්ගයට පිවිසෙන්න",

    // Website Navigation
    navHome: "මුල් පිටුව",
    navAbout: "අප ගැන",
    navContact: "සම්බන්ධ වන්න",
    navPortal: "යෙදුමට පිවිසෙන්න",

    // Dashboard
    askMonk: "AI හිමිනමගෙන් විමසන්න",
    meditateNow: "භාවනා කරන්න",
    karmaJournal: "කර්ම සටහන්",
    suttaExplorer: "සූත්‍ර ගවේෂණය",
    todaysTeaching: "අද දහම් පණිවිඩය",
    continuePath: "ඔබේ ගමන යන්න",
    dhammaClassroom: "ධර්ම පන්තිය",
    switchLanguage: "භාෂාව මාරු කරන්න",

    // Navigation
    home: "මුල් පිටුව",
    chat: "සාකච්ඡාව",
    meditate: "භාවනා",
    journal: "සටහන්",
    temple: "විහාර සොයන්න",
    classroom: "පන්ති",
    dailyDrops: "දෛනික ධර්ම",

    // Legal
    terms: "සේවා කොන්දේසි",
    privacy: "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
    back: "ආපසු",

    // Data Management
    resetJourney: "නැවත අරඹන්න",
    resetConfirm: "ඔබට විශ්වාසද?",

    // Chat
    chatPlaceholder: "ධර්මය ගැන ප්‍රශ්නයක් අසන්න...",
    monkPersona: "භන්තේ බෝධි",
    debateMode: "වාද විවාද",

    // Meditation
    startSession: "භාවනාව අරඹන්න",
    stopSession: "අවසන් කරන්න",
    duration: "කාලය",
    minutes: "මිනිත්තු",
    feedbackTitle: "ඔබේ අත්දැකීම කෙසේද?",
    feedbackPlaceholder: "මෙහි සටහන් කරන්න...",
    selectMethod: "භාවනා ක්‍රමය තෝරන්න",
    instructions: "උපදෙස්",

    // Journal
    newEntry: "නව සටහනක්",
    saveEntry: "කර්ම සටහනට එක් කරන්න",
    entryPlaceholder: "අද දින ඔබගේ ක්‍රියාවන් සිහිපත් කරන්න...",

    // Classroom
    askLessonQuestion: "මෙම පාඩම ගැන ප්‍රශ්නයක් අසන්න...",
    askBtn: "අසන්න",
    lessonQnA: "පාඩම ගැන ගැටළු",

    // Sutta Explorer
    suttaSearchPlaceholder: "සූත්‍රයක් හෝ මාතෘකාවක් සොයන්න (උදා: 'මෛත්‍රිය', 'කෝපය')...",
    suttaExplorerTitle: "ත්‍රිපිටක නාවිකයා",
    suttaExplorerSubtitle: "ත්‍රිපිටකය තුළ AI සහායෙන් ගවේෂණය කරන්න.",
    suggestedSuttas: "යෝජිත සූත්‍ර",

    // Calendar
    buddhistCalendar: "බෞද්ධ දින දර්ශනය 2025",

    // Invite
    spreadDhamma: "ධර්මය පතුරුවන්න",
    inviteFriends: "යහළුවන්ට ආරාධනා කරන්න",
    shareMessage: "AI මග පෙන්වීම සමඟ බුද්ධ ධර්මය ඉගෙන ගැනීමට මා සමඟ බෝධි මාර්ගයට එක්වන්න.",
    linkCopied: "සබැඳිය පිටපත් කරන ලදී!",

    // Daily Drops View
    wisdomGallery: "ධර්ම එකතුව",
    previousDrops: "පෙර පණිවිඩ",
    noHistory: "ඔබේ ධර්ම එකතුව අදින් ආරම්භ වේ.",
    todayInspiration: "අද දින පණිවිඩය"
  }
};

export const GOAL_OPTIONS = {
  en: [
    "Learn Theravāda philosophy",
    "Practice Vipassanā meditation",
    "Explore Pali Canon teachings",
    "Daily wisdom & mindfulness"
  ],
  si: [
    "ථේරවාද දර්ශනය ඉගෙනගැනීම",
    "විපස්සනා භාවනා පුහුණුව",
    "ත්‍රිපිටක දේශනා සොයා බැලීම",
    "දෛනික ධර්ම හා මනෝනිවාරණය"
  ]
};

export const MEDITATION_TYPES = [
  {
      id: 'metta',
      title: { en: "Metta (Loving-Kindness)", si: "මෛත්‍රී භාවනාව" },
      desc: { en: "Cultivate boundless love.", si: "අසීමිත මෛත්‍රිය වඩන්න." },
      fullDescription: {
          en: "Metta is the wish for the welfare and happiness of others. It spreads loving-kindness to all beings without exception.",
          si: "අන්‍යයන්ට දුක් නො වෙනවාට සැප ඇති වෙනවාට යහපතක් වෙනවාට අනුන්ගේ යහපත් අදහස් ඉටු වෙනවාට අනුන් දියුණු වෙනවාට උසස් වෙනවාට කැමති බව මෛත්‍රිය ය. අන්‍යයෝ නිදුක් වෙත්වා, නිරෝගි වෙත්වා, සුවපත් වෙත්වා යනාදීන් මෛත්‍රිය අන්‍යයන් කෙරෙහි නැවත නැවත පැතිරවීම: තවත් ක්‍ර‍මයකින් කියත හොත් ස්වකීය චිත්තයෙන් අන්‍යයන්ට සෙත් කිරීම මෛත්‍රී භාවනාව නම් වේ. එය නොබෝ කලකින් ම ඵල දැකිය හැකි වන්නා වූ චතුර්ථ ධ්‍යානය තෙක් ගෙන යා හැක්කා වූ භාවනාවෙකි."
      },
      instructions: {
          en: [
            "May I be free from enmity, affliction, and anxiety. May I be happy.",
            "May my dear ones be free from enmity, affliction, and anxiety. May they be happy.",
            "May my enemies be free from enmity, affliction, and anxiety. May they be happy.",
            "May neutral beings be free from enmity, affliction, and anxiety. May they be happy.",
            "May all beings be free from enmity, affliction, and anxiety. May they be happy."
          ],
          si: [
            "මම වෛර නැත්තේ වෙම් වා, දොම්නස් නැත්තේ වෙම් වා, නිදුක් වෙම් වා, සුවපත් වෙම්වා.",
            "මාගේ හිතවත්හු වෛර නැත්තෝ වෙත්වා, දොම්නස් නැත්තෝ වෙත්වා, නිදුක් වෙත්වා, සුවපත් වෙත්වා.",
            "මාගේ සතුරෝ වෛර නැත්තෝ වෙත්වා, දොම්නස් නැත්තෝ වෙත්වා, නිදුක් වෙත්වා, සුවපත් වෙත්වා.",
            "මා හට මධ්‍යස්ථ සත්ත්වයෝ වෛර නැත්තෝ වෙත්වා, දොම්නස් නැත්තෝ වෙත්වා, නිදුක් වෙත්වා, සුවපත් වෙත්වා.",
            "සකල සත්ත්වයෝ වෛර නැත්තෝ වෙත්වා, දොම්නස් නැත්තෝ වෙත්වා, නිදුක් වෙත්වා, සුවපත් වෙත්වා."
          ]
      },
      icon: 'Heart'
  },
  {
      id: 'anapana',
      title: { en: "Anapanasati (Breath)", si: "ආනාපානසති (හුස්ම)" },
      desc: { en: "Focus on the natural breath.", si: "ස්වභාවික හුස්ම කෙරෙහි අවධානය." },
      fullDescription: {
          en: "Anapanasati involves focusing attention on the breath. It calms the mind and prepares it for deeper insight.",
          si: "ආනාපානසති යනු හුස්ම ඉහළ පහළ යාම පිළිබඳ සිහිය පිහිටුවා ගැනීමයි. මෙය සිත සමාධිගත කිරීමට සහ ප්‍රඥාව වැඩීමට උපකාරී වේ."
      },
      instructions: {
          en: [
            "Find a comfortable sitting posture, keeping your back straight.",
            "Focus your attention at the entrance of your nostrils.",
            "Observe the natural flow of breath coming in and going out.",
            "If your mind wanders, gently bring it back to the breath."
          ],
          si: [
            "සුවපහසු ලෙස හිඳගෙන කය ඍජුව තබාගන්න.",
            "සිහිය නාසිකාග්‍රය හෝ තොල මත පිහිටුවා ගන්න.",
            "ස්වභාවික හුස්ම කෙරෙහි පමණක් අවධානය යොමු කරන්න.",
            "වෙනත් අරමුණු වලට සිත ගියහොත් නැවත හුස්ම වෙත සිත ගෙන එන්න."
          ]
      },
      icon: 'Wind'
  },
  {
      id: 'vipassana',
      title: { en: "Vipassana (Body Scan)", si: "විපස්සනා (ශරීර නිරීක්ෂණය)" },
      desc: { en: "Observe sensations equanimously.", si: "ශරීරයේ දැනීම් උපේක්ෂාවෙන් විඳීම." },
      fullDescription: {
          en: "Vipassana means seeing things as they really are. By observing bodily sensations, one realizes the nature of impermanence.",
          si: "විපස්සනා යනු ඇති දේ ඇති සැටියෙන් දැකීමයි. නාම රූප ධර්මයන්ගේ අනිත්‍ය, දුක්ඛ, අනාත්ම ස්වභාවය අවබෝධ කර ගැනීම මෙහි අරමුණයි."
      },
      instructions: {
          en: [
            "Focus your attention on the top of your head.",
            "Slowly move your attention down through your body.",
            "Observe any sensations (heat, cold, tingling) objectively.",
            "Do not react with craving or aversion; just observe."
          ],
          si: [
            "හිස මුදුනේ සිට පාදාන්තය දක්වා අවධානය යොමු කරන්න.",
            "ශරීරයේ හටගන්නා සංවේදනයන් (උණුසුම, සීතල, හිරි වැටීම) දෙස උපේක්ෂාවෙන් බලන්න.",
            "ඒවායේ ඇති වීම සහ නැති වීම නිරීක්ෂණය කරන්න.",
            "කිසිදු සංවේදනයක් කෙරෙහි ඇලීමක් හෝ ගැටීමක් ඇති කර නොගන්න."
          ]
      },
      icon: 'ScanFace'
  },
  {
      id: 'walking',
      title: { en: "Walking Meditation", si: "සක්මන් භාවනාව" },
      desc: { en: "Mindfulness in motion.", si: "ගමන් කරන විට සිහිය පිහිටුවා ගැනීම." },
      fullDescription: {
        en: "Walking meditation brings mindfulness into movement, focusing on the sensations of walking.",
        si: "සක්මන් භාවනාව යනු ඇවිදින විට සිහිය පවත්වා ගැනීමයි. එය සමාධිය පවත්වා ගැනීමට පහසු ඉරියව්වකි."
      },
      instructions: {
        en: [
            "Walk slowly along a straight path.",
            "Focus on the lifting, moving, and placing of each foot.",
            "Keep your gaze lowered and mind focused on the movement."
        ],
        si: [
            "කෙටි දුරක් සෙමින් ඇවිදින්න.",
            "පාදය එසවීම, ගෙන යාම, සහ තැබීම ගැන අවධානය යොමු කරන්න.",
            "ඇස් පහතට යොමු කර තබා ගන්න.",
            "වෙනත් අරමුණු වලට සිත ගියහොත් නැවත පාදයේ චලනය වෙත සිත ගෙන එන්න."
        ]
      },
      icon: 'Footprints'
  }
];

export const CORE_LESSONS: Lesson[] = [
  // Foundations
  {
    id: 'l1',
    title: { en: "1. The Triple Gem (Tisarana)", si: "1. තෙරුවන් (තිසරණ)" },
    description: { en: "Taking refuge in the Buddha, Dhamma, and Sangha.", si: "බුද්ධ, ධම්ම, සංඝ යන තෙරුවන් සරණ යාම." },
    completed: false
  },
  {
    id: 'l2',
    title: { en: "2. The Five Precepts (Pancha Sila)", si: "2. පංච සීලය" },
    description: { en: "The ethical foundation of Buddhist life.", si: "බෞද්ධ ජීවිතයේ සදාචාරාත්මක පදනම." },
    completed: false
  },
  {
    id: 'l3',
    title: { en: "3. Dana (Generosity)", si: "3. දානය (ත්‍යාගශීලී බව)" },
    description: { en: "The practice of giving and letting go.", si: "දීම සහ අත්හැරීම පුරුදු කිරීම." },
    completed: false
  },
  // Core Wisdom
  {
    id: 'l4',
    title: { en: "4. The Four Noble Truths", si: "4. චතුරාර්ය සත්‍යය" },
    description: { en: "The essence of the Buddha's teaching on suffering.", si: "දුක පිළිබඳ බුදුන් වහන්සේගේ දේශනාවේ සාරය." },
    completed: false
  },
  {
    id: 'l5',
    title: { en: "5. The Noble Eightfold Path", si: "5. ආර්ය අෂ්ටාංගික මාර්ගය" },
    description: { en: "The path leading to the cessation of suffering.", si: "දුක නැති කිරීමේ මාර්ගය." },
    completed: false
  },
  {
    id: 'l6',
    title: { en: "6. The Three Marks of Existence", si: "6. ත්‍රිලක්ෂණය" },
    description: { en: "Impermanence, Suffering, and Non-self.", si: "අනිත්‍ය, දුක්ඛ, අනාත්ම." },
    completed: false
  },
  // Deeper Reality
  {
    id: 'l7',
    title: { en: "7. Kamma & Rebirth", si: "7. කර්මය සහ පුනර්භවය" },
    description: { en: "Action, result, and the cycle of existence.", si: "ක්‍රියාව, විපාකය සහ සසර චක්‍රය." },
    completed: false
  },
  {
    id: 'l8',
    title: { en: "8. Dependent Origination", si: "8. පටිච්චසමුප්පාදය" },
    description: { en: "How suffering arises through causes and conditions.", si: "හේතු ප්‍රත්‍යයන් හරහා දුක හටගන්නා ආකාරය." },
    completed: false
  },
  // Practice
  {
    id: 'l9',
    title: { en: "9. The Four Foundations of Mindfulness", si: "9. සතර සතිපට්ඨානය" },
    description: { en: "Mindfulness of body, feelings, mind, and dhammas.", si: "කය, වේදනාව, සිත සහ ධර්මයන් පිළිබඳ සිහිය." },
    completed: false
  },
  {
    id: 'l10',
    title: { en: "10. The Four Sublime States", si: "10. සතර බ්‍රහ්ම විහරණ" },
    description: { en: "Metta, Karuna, Mudita, Upekkha.", si: "මෛත්‍රී, කරුණා, මුදිතා, උපේක්ෂා." },
    completed: false
  }
];

export const POYA_DAYS_2025 = [
  { date: '2025-01-13', name: 'Duruthu Poya', si: 'දුරුතු පොහොය' },
  { date: '2025-02-12', name: 'Navam Poya', si: 'නවම් පොහොය' },
  { date: '2025-03-13', name: 'Medin Poya', si: 'මැදින් පොහොය' },
  { date: '2025-04-12', name: 'Bak Poya', si: 'බක් පොහොය' },
  { date: '2025-05-12', name: 'Vesak Poya', si: 'වෙසක් පොහොය' },
  { date: '2025-06-10', name: 'Poson Poya', si: 'පොසොන් පොහොය' },
  { date: '2025-07-10', name: 'Esala Poya', si: 'ඇසළ පොහොය' },
  { date: '2025-08-08', name: 'Nikini Poya', si: 'නිකිණි පොහොය' },
  { date: '2025-09-07', name: 'Binara Poya', si: 'බිනර පොහොය' },
  { date: '2025-10-06', name: 'Vap Poya', si: 'වප් පොහොය' },
  { date: '2025-11-05', name: 'Il Poya', si: 'ඉල් පොහොය' },
  { date: '2025-12-04', name: 'Unduvap Poya', si: 'උඳුවප් පොහොය' }
];
