import { Language } from '../i18n';



export type AssistantTopicKey =
  | 'greeting'
  | 'next_steps'
  | 'save_evidence'
  | 'protect_account'
  | 'make_report'
  | 'privacy_warning'
  | 'sha256'
  | 'ocr'
  | 'timeline'
  | 'redaction'
  | 'safe_actions'
  | 'official_reporting'
  | 'complaint_tracker'
  | 'selective_sharing'
  | 'create_case'
  | 'emergency_safety'
  | 'legal_boundary'
  | 'privacy_guard_notice'
  | 'general_help';

export interface SahayAssistantRequest {
  userMessage: string;
  language: Language;
  currentPathname: string;
}

export interface SahayAssistantResponse {
  replyText: string;
  topicKey: AssistantTopicKey;
  routeKey: string;
}

export interface AssistantUITranslations {
  buttonLabel: string;
  headerTitle: string;
  headerSubtitle: string;
  closeLabel: string;
  firstMessage: string;
  suggestedHeading: string;
  suggestedQuestions: string[];
  inputPlaceholder: string;
  sendButton: string;
  privacyNote: string;
  typingIndicator: string;
}

export const ASSISTANT_UI_TEXT: Record<Language, AssistantUITranslations> = {
  en: {
    buttonLabel: 'Sahay Assistant',
    headerTitle: 'Sahay Assistant',
    headerSubtitle: 'Your safety companion',
    closeLabel: 'Close Sahay Assistant',
    firstMessage: "Hi! I'm Sahay. I'm here to help you understand what to do next.",
    suggestedHeading: 'Suggested questions',
    suggestedQuestions: [
      'What should I do next?',
      'How do I save evidence?',
      'How do I protect my account?',
      'How do I make a report?',
      'What does this warning mean?',
    ],
    inputPlaceholder: 'Ask a question about Sahay or your next step...',
    sendButton: 'Send',
    privacyNote:
      'Your uploaded evidence and private files are never sent automatically. You stay in control: Recommend → Review → Decide → Execute.',
    typingIndicator: 'Sahay is thinking...',
  },
  hi: {
    buttonLabel: 'सहाय असिस्टेंट',
    headerTitle: 'सहाय असिस्टेंट',
    headerSubtitle: 'आपका सुरक्षा साथी',
    closeLabel: 'सहाय असिस्टेंट बंद करें',
    firstMessage:
      'नमस्ते! मैं सहाय हूँ। मैं यह समझने में आपकी मदद करने के लिए यहाँ हूँ कि आगे क्या करना सुरक्षित रहेगा।',
    suggestedHeading: 'सुझाए गए प्रश्न',
    suggestedQuestions: [
      'मुझे आगे क्या करना चाहिए?',
      'मैं साक्ष्य (Evidence) कैसे सुरक्षित करूँ?',
      'मैं अपना अकाउंट कैसे सुरक्षित रखूँ?',
      'मैं रिपोर्ट कैसे तैयार करूँ?',
      'इस चेतावनी (Warning) का क्या मतलब है?',
    ],
    inputPlaceholder: 'सहाय या अगले सुरक्षित कदम के बारे में पूछें...',
    sendButton: 'भेजें',
    privacyNote:
      'आपके अपलोड किए गए साक्ष्य या निजी फ़ाइलें कभी भी अपने-आप बाहर नहीं भेजी जातीं। हर निर्णय आपका है: सुझाव → समीक्षा → निर्णय → कदम।',
    typingIndicator: 'सहाय उत्तर लिख रहा है...',
  },
  mr: {
    buttonLabel: 'सहाय असिस्टंट',
    headerTitle: 'सहाय असिस्टंट',
    headerSubtitle: 'तुमचा सुरक्षा साथीदार',
    closeLabel: 'सहाय असिस्टंट बंद करा',
    firstMessage:
      'नमस्कार! मी सहाय आहे. पुढे काय करणे सुरक्षित राहील हे समजून घेण्यात मी तुम्हाला मदत करण्यासाठी येथे आहे.',
    suggestedHeading: 'सुचवलेले प्रश्न',
    suggestedQuestions: [
      'मी पुढे काय करावे?',
      'मी पुरावा (Evidence) कसा जतन करू?',
      'मी माझे अकाउंट कसे सुरक्षित ठेवू?',
      'मी अहवाल (Report) कसा तयार करू?',
      'या इशाऱ्याचा (Warning) अर्थ काय आहे?',
    ],
    inputPlaceholder: 'सहाय किंवा पुढील सुरक्षित पावलाबद्दल प्रश्न विचारा...',
    sendButton: 'पाठवा',
    privacyNote:
      'तुमचे अपलोड केलेले पुरावे किंवा खाजगी फाईल्स कधीही आपोआप बाहेर पाठवल्या जात नाहीत. अंतिम निर्णय तुमचाच असतो: शिफारस → पुनरावलोकन → निर्णय → कृती.',
    typingIndicator: 'सहाय उत्तर तयार करत आहे...',
  },
};

export function getRouteKey(pathname: string): string {
  if (pathname.includes('/evidence')) return 'evidence';
  if (pathname.includes('/privacy')) return 'privacy';
  if (pathname.includes('/timeline')) return 'timeline';
  if (pathname.includes('/reports')) return 'reports';
  if (pathname.includes('/sharing')) return 'sharing';
  if (pathname.startsWith('/cases/')) return 'case_detail';
  if (pathname === '/cases') return 'cases';
  if (pathname === '/complaints') return 'complaints';
  if (pathname === '/safety') return 'safety';
  if (pathname === '/settings') return 'settings';
  if (pathname === '/dashboard') return 'dashboard';
  if (pathname === '/login') return 'login';
  return 'landing';
}

export function getPageContextBanner(pathname: string, lang: Language): string {
  const key = getRouteKey(pathname);

  const banners: Record<Language, Record<string, string>> = {
    en: {
      evidence:
        "You're currently viewing your evidence. I can explain how evidence checking works.",
      privacy: 'I can explain what the privacy warnings mean.',
      timeline:
        "You're viewing the timeline. I can explain how dates and linked evidence work.",
      reports:
        "You're on the Report Builder page. I can explain how to prepare a summary or what official reporting involves.",
      sharing:
        "You're viewing Selective Sharing. I can explain how share tokens and redacted copies work.",
      case_detail:
        "You're viewing your case overview and Safe Actions. I can help you review calm next steps.",
      cases: "You're viewing your cases. I can explain how to create or organize a case.",
      complaints:
        "You're on the Complaint Tracker. I can explain how to keep your personal log of reference numbers.",
      safety:
        "You're on the Safety Check page. I can share calm safety steps and helpline numbers.",
      settings:
        "You're viewing Settings. I can explain local storage, privacy scanning, and language options.",
      dashboard:
        "You're on the Dashboard. I can help you decide which step to explore next.",
      login:
        "You're on the workspace entry page. I can explain demo mode and local browser privacy.",
      landing:
        'I can help you explore Sahay and understand how preserving evidence and protecting privacy works.',
    },
    hi: {
      evidence:
        'आप अभी अपने साक्ष्य (Evidence) देख रहे हैं। मैं समझा सकता हूँ कि साक्ष्य की जांच कैसे काम करती है।',
      privacy: 'मैं समझा सकता हूँ कि गोपनीयता चेतावनियों (Privacy Warnings) का क्या मतलब है।',
      timeline:
        'आप घटनाक्रम (Timeline) देख रहे हैं। मैं तारीखों और जुड़े हुए साक्ष्यों के बारे में बता सकता हूँ।',
      reports:
        'आप रिपोर्ट बिल्डर पेज पर हैं। मैं रिपोर्ट तैयार करने और आधिकारिक शिकायत की तैयारी के बारे में समझा सकता हूँ।',
      sharing:
        'आप सेलेक्टिव शेयरिंग पेज पर हैं। मैं शेयर टोकन और रिडैक्टेड कॉपी के बारे में बता सकता हूँ।',
      case_detail:
        'आप मामले का विवरण और सुरक्षित कदम (Safe Actions) देख रहे हैं। मैं अगले कदम चुनने में मदद कर सकता हूँ।',
      cases: 'आप मामलों की सूची देख रहे हैं। मैं नया मामला बनाने का तरीका बता सकता हूँ।',
      complaints:
        'आप शिकायत ट्रैकर पर हैं। मैं बता सकता हूँ कि आप अपने संदर्भ नंबरों का निजी रिकॉर्ड कैसे रख सकते हैं।',
      safety:
        'आप सुरक्षा जांच पेज पर हैं। मैं सुरक्षा उपायों और हेल्पलाइन नंबरों की जानकारी दे सकता हूँ।',
      settings:
        'आप सेटिंग्स पेज पर हैं। मैं लोकल स्टोरेज और गोपनीयता विकल्पों के बारे में समझा सकता हूँ।',
      dashboard:
        'आप डैशबोर्ड पर हैं। मैं यह चुनने में आपकी मदद कर सकता हूँ कि आगे कौन-सा कदम देखना है।',
      login:
        'आप प्रवेश पेज पर हैं। मैं डेमो मोड और लोकल ब्राउज़र गोपनीयता के बारे में बता सकता हूँ।',
      landing:
        'मैं आपको सहाय को समझने और साक्ष्य सुरक्षित रखने व गोपनीयता बचाने के तरीके बताने में मदद कर सकता हूँ।',
    },
    mr: {
      evidence:
        'तुम्ही सध्या तुमचे पुरावे (Evidence) पाहत आहात. पुराव्याची तपासणी कशी चालते हे मी समजावून सांगू शकतो.',
      privacy: 'गोपनीयतेच्या इशाऱ्यांचा (Privacy Warnings) अर्थ काय आहे हे मी सांगू शकतो.',
      timeline:
        'तुम्ही घटनाक्रम (Timeline) पाहत आहात. तारखा आणि जोडलेले पुरावे कसे काम करतात हे मी सांगू शकतो.',
      reports:
        'तुम्ही रिपोर्ट बिल्डर पेजवर आहात. सारांश अहवाल कसा तयार करायचा हे मी समजावून सांगू शकतो.',
      sharing:
        'तुम्ही निवडक शेअरिंग पेजवर आहात. शेअर टोकन आणि रिडॅक्टेड प्रत कशी काम करते हे मी सांगू शकतो.',
      case_detail:
        'तुम्ही प्रकरणाचा आढावा आणि सुरक्षित पावले (Safe Actions) पाहत आहात. मी पुढील पावले समजून घेण्यास मदत करू शकतो.',
      cases: 'तुम्ही प्रकरणांची यादी पाहत आहात. नवीन प्रकरण कसे तयार करायचे हे मी सांगू शकतो.',
      complaints:
        'तुम्ही तक्रार ट्रॅकरवर आहात. संदर्भ क्रमांकांची वैयक्तिक नोंद कशी ठेवावी हे मी सांगू शकतो.',
      safety:
        'तुम्ही सुरक्षा तपासणी पेजवर आहात. मी शांत सुरक्षा पावले आणि हेल्पलाइन क्रमांक सांगू शकतो.',
      settings:
        'तुम्ही सेटिंग्ज पेजवर आहात. मी लोकल स्टोरेज आणि गोपनीयता पर्याय समजावून सांगू शकतो.',
      dashboard:
        'तुम्ही डॅशबोर्डवर आहात. पुढे कोणते पाऊल पाहायचे हे ठरवण्यात मी मदत करू शकतो.',
      login:
        'तुम्ही प्रवेश पेजवर आहात. मी डेमो मोड आणि लोकल ब्राउझर गोपनीयतेबद्दल सांगू शकतो.',
      landing:
        'पुरावे कसे जतन करावे आणि गोपनीयता कशी राखावी हे समजून घेण्यासाठी मी तुम्हाला मदत करू शकतो.',
    },
  };

  return banners[lang]?.[key] || banners.en[key] || banners.en.landing;
}

/**
 * Checks if the user accidentally typed sensitive personal identifiers (phone, email, 12-digit ID)
 * so we never transmit or echo raw personal data.
 */
function containsSensitivePersonalPattern(input: string): boolean {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const indianPhoneRegex = /(?:\+91[\s-]?)?[6-9]\d{9}\b/;
  const aadhaarLikeRegex = /\b\d{4}[\s-]\d{4}[\s-]\d{4}\b/;
  return (
    emailRegex.test(input) ||
    indianPhoneRegex.test(input) ||
    aadhaarLikeRegex.test(input)
  );
}

/**
 * Classifies the user's natural language question (across English, Hindi, and Marathi)
 * into a specific Sahay knowledge topic.
 */
export function classifyAssistantTopic(message: string): AssistantTopicKey {
  const text = message.trim().toLowerCase();

  if (containsSensitivePersonalPattern(text)) {
    return 'privacy_guard_notice';
  }

  // Emergency / immediate danger
  if (
    text.includes('danger') ||
    text.includes('emergency') ||
    text.includes('unsafe') ||
    text.includes('helpline') ||
    text.includes('112') ||
    text.includes('181') ||
    text.includes('1930') ||
    text.includes('खतरा') ||
    text.includes('आपातकाल') ||
    text.includes('हेल्पलाइन') ||
    text.includes('धोका') ||
    text.includes('आपत्कालीन')
  ) {
    return 'emergency_safety';
  }

  // Legal boundary / court / guilt / crime detection
  if (
    text.includes('guilty') ||
    text.includes('court') ||
    text.includes('lawyer') ||
    text.includes('legal advice') ||
    text.includes('admissible') ||
    text.includes('is this a crime') ||
    text.includes('police automatically') ||
    text.includes('अदालत') ||
    text.includes('कानूनी') ||
    text.includes('दोषी') ||
    text.includes('न्यायालय') ||
    text.includes('कायदेशीर')
  ) {
    return 'legal_boundary';
  }

  // SHA-256 / Hash / Fingerprint
  if (
    text.includes('sha-256') ||
    text.includes('sha256') ||
    text.includes('hash') ||
    text.includes('fingerprint') ||
    text.includes('integrity') ||
    text.includes('फ़िंगरप्रिंट') ||
    text.includes('हैश') ||
    text.includes('फिंगरप्रिंट') ||
    text.includes('हॅश')
  ) {
    return 'sha256';
  }

  // OCR
  if (
    text.includes('ocr') ||
    text.includes('extract text') ||
    text.includes('read text from screenshot') ||
    text.includes('स्क्रीनशॉट से टेक्स्ट') ||
    text.includes('मजकूर')
  ) {
    return 'ocr';
  }

  // Redaction
  if (
    text.includes('redact') ||
    text.includes('redaction') ||
    text.includes('mask') ||
    text.includes('hide my number') ||
    text.includes('hide personal') ||
    text.includes('derivative') ||
    text.includes('रिडैक्ट') ||
    text.includes('रिडैक्शन') ||
    text.includes('छुपाएं') ||
    text.includes('रिडॅक्ट') ||
    text.includes('लपवा')
  ) {
    return 'redaction';
  }

  // Warning / Privacy Scanner
  if (
    text.includes('warning') ||
    text.includes('privacy scan') ||
    text.includes('scanner') ||
    text.includes('privacy finding') ||
    text.includes('privacy risk') ||
    text.includes('चेतावनी') ||
    text.includes('गोपनीयता स्कैन') ||
    text.includes('इशाऱ्याचा') ||
    text.includes('इशारा') ||
    text.includes('गोपनीयता')
  ) {
    return 'privacy_warning';
  }

  // Timeline
  if (
    text.includes('timeline') ||
    text.includes('chronological') ||
    text.includes('घटनाक्रम') ||
    text.includes('टाइमलाइन') ||
    text.includes('टाईमलाईन')
  ) {
    return 'timeline';
  }

  // Selective Sharing / Token / Revoke
  if (
    text.includes('share') ||
    text.includes('sharing') ||
    text.includes('token') ||
    text.includes('revoke') ||
    text.includes('expiry') ||
    text.includes('साझा') ||
    text.includes('शेअर') ||
    text.includes('टोकन')
  ) {
    return 'selective_sharing';
  }

  // Complaint Tracker
  if (
    text.includes('complaint tracker') ||
    text.includes('track complaint') ||
    text.includes('acknowledgement') ||
    text.includes('reference number') ||
    text.includes('शिकायत ट्रैकर') ||
    text.includes('तक्रार ट्रॅकर')
  ) {
    return 'complaint_tracker';
  }

  // Official Reporting / NCRP / Cybercrime portal
  if (
    text.includes('official report') ||
    text.includes('ncrp') ||
    text.includes('cybercrime.gov.in') ||
    text.includes('police') ||
    text.includes('cyber cell') ||
    text.includes('आधिकारिक रिपोर्ट') ||
    text.includes('साइबर क्राइम पोर्टल') ||
    text.includes('अधिकृत तक्रार')
  ) {
    return 'official_reporting';
  }

  // Make a report / Report Builder
  if (
    text.includes('make a report') ||
    text.includes('prepare a report') ||
    text.includes('report builder') ||
    text.includes('export report') ||
    text.includes('print pdf') ||
    text.includes('report') ||
    text.includes('रिपोर्ट कैसे') ||
    text.includes('रिपोर्ट') ||
    text.includes('अहवाल कसा') ||
    text.includes('अहवाल')
  ) {
    return 'make_report';
  }

  // Protect account / Safe Actions / MFA / Password
  if (
    text.includes('protect my account') ||
    text.includes('protect account') ||
    text.includes('account security') ||
    text.includes('password') ||
    text.includes('mfa') ||
    text.includes('2fa') ||
    text.includes('active session') ||
    text.includes('अकाउंट कैसे सुरक्षित') ||
    text.includes('अकाउंट सुरक्षा') ||
    text.includes('अकाउंट कसे सुरक्षित')
  ) {
    return 'protect_account';
  }

  if (
    text.includes('safe action') ||
    text.includes('safe-action') ||
    text.includes('सुरक्षित कदम') ||
    text.includes('सुरक्षित पावले')
  ) {
    return 'safe_actions';
  }

  // Save evidence / Evidence Vault / Upload
  if (
    text.includes('save evidence') ||
    text.includes('add evidence') ||
    text.includes('upload') ||
    text.includes('evidence vault') ||
    text.includes('evidence') ||
    text.includes('screenshot') ||
    text.includes('साक्ष्य') ||
    text.includes('एविडेंस') ||
    text.includes('पुरावा') ||
    text.includes('पुरावे')
  ) {
    return 'save_evidence';
  }

  // Create a case
  if (
    text.includes('create a case') ||
    text.includes('new case') ||
    text.includes('make a case') ||
    text.includes('नया मामला') ||
    text.includes('मामला कैसे') ||
    text.includes('नवीन प्रकरण')
  ) {
    return 'create_case';
  }

  // What should I do next?
  if (
    text.includes('what should i do next') ||
    text.includes('next step') ||
    text.includes('what to do') ||
    text.includes('where do i start') ||
    text.includes('आगे क्या करना चाहिए') ||
    text.includes('आगे क्या') ||
    text.includes('पुढे काय करावे') ||
    text.includes('पुढे काय')
  ) {
    return 'next_steps';
  }

  return 'general_help';
}

/**
 * Generates localized, natural, human, trauma-informed responses for any topic & route context.
 */
export function buildLocalizedReply(
  topicKey: AssistantTopicKey,
  routeKey: string,
  lang: Language
): string {
  if (lang === 'hi') {
    return buildHindiReply(topicKey, routeKey);
  }
  if (lang === 'mr') {
    return buildMarathiReply(topicKey, routeKey);
  }
  return buildEnglishReply(topicKey, routeKey);
}

function buildEnglishReply(topic: AssistantTopicKey, routeKey: string): string {
  switch (topic) {
    case 'greeting':
      return "Hi! I'm Sahay. I'm here to help you understand what to do next.";

    case 'next_steps': {
      const routeAdvice: Record<string, string> = {
        evidence:
          "Since you're on the Evidence page, a good next step is to make sure your unedited screenshots or chat logs are uploaded here first. Sahay creates a SHA-256 digital fingerprint for each file without changing your original. After that, you can open the Timeline or Privacy Scanner.",
        privacy:
          "Since you're on the Privacy & Redaction page, you can review any personal details Sahay spotted (like a phone number or address) and create a separate Redacted Copy before sharing with anyone.",
        timeline:
          "Since you're viewing the Timeline, you can add events in the order they happened and link them to your saved files. Even if you only remember an approximate date, you can mark it as approximate.",
        reports:
          "Since you're on the Report Builder page, you can choose which sections to include in your summary, download a .TXT copy or print to PDF, and review the Official Reporting Preparation checklist whenever you feel ready.",
        sharing:
          "Since you're on the Selective Sharing page, consider sharing only Redacted Copies rather than unedited originals when speaking with a counselor or support group, and choose a short expiry window.",
      };
      const contextLine =
        routeAdvice[routeKey] ||
        'Here is a calm way to move step by step:\n1. Check your immediate safety first.\n2. Save your unedited screenshots, links, and messages in the Evidence Vault before blocking or deleting anything.\n3. Use the Privacy Scanner and Redaction tool to hide your phone number or address in a separate copy.\n4. Review Safe Actions and build a structured summary report when you feel ready.';

      return `${contextLine}\n\nRemember: Sahay follows "Recommend → Review → Decide → Execute." I only suggest options—you decide what feels right for you.`;
    }

    case 'save_evidence':
      return 'To save evidence safely:\n1. Open your case (or create one on the Cases page) and go to the Evidence Vault.\n2. Upload your original screenshots, chat logs, or PDFs before cropping, drawing on them, or deleting messages.\n3. Sahay keeps your original file untouched and automatically creates a SHA-256 digital fingerprint so you can check later that the file has not changed.';

    case 'protect_account':
      return 'Here are calm steps you can consider to protect your accounts:\n• Save your evidence first before blocking the sender or deleting messages.\n• Change passwords on your main email and social accounts.\n• Turn on two-step verification (MFA) using an authenticator app.\n• Check the "Where You Are Logged In" / active sessions list in your email and social apps, and sign out of any device you do not recognize.\n• Tighten who can message, tag, or view your profile.\n\nYou can track which of these steps you want to take in the Safe-Action Center inside your case.';

    case 'make_report':
      return 'To make a structured report:\n1. Open your case and go to the "Report Builder" tab.\n2. Check or uncheck the sections you want to include (such as Case Information, Timeline, Evidence List, SHA-256 Fingerprints, Privacy Summary, Redacted Copies, and Notes).\n3. Click "Download Report (.TXT)" or "Print / Save as PDF".\n\nThis summary helps you organize everything in one place so you do not have to repeat your story from scratch. It is an independent summary for your preparation, not an official police report.';

    case 'privacy_warning':
      return 'When Sahay shows a warning, it means: "I found some information that you may want to hide before sharing."\n\nFor example:\n• On the Privacy page, Sahay looks for phone numbers, email addresses, home addresses, PIN codes, Aadhaar-like numbers, or GPS location data inside your files so you don’t accidentally share them.\n• On the Sharing page, the warning reminds you that if you share unredacted originals, or if someone downloads a file before you revoke a link, revoking access later cannot undo what they already saved.\n\nYou can create a separate Redacted Copy to hide those details while keeping your original file safe in the Vault.';

    case 'sha256':
      return 'SHA-256 is like a digital fingerprint for your file. Sahay uses it to help you check later whether the file has changed. Your original file is not changed.\n\nWhenever you click "Verify SHA-256" in the Evidence Vault, Sahay checks the file again in your browser to confirm it still matches the exact fingerprint recorded when you added it.';

    case 'ocr':
      return 'OCR reads visible text from your screenshot so you can read, search, or copy the words without typing everything out by hand.\n\nIf a word is misread, you can fix it in the separate OCR text box. Editing the OCR text never changes your original screenshot.';

    case 'timeline':
      return 'The Timeline helps you put what happened in date order (for example, when the first message arrived and how it escalated).\n\n• You can mark a date as Exact, Approximate, or Unknown—you never have to guess a date you don’t remember.\n• Sahay clearly separates what you wrote ("User-Entered Fact") from linked evidence files.';

    case 'redaction':
      return 'Redaction means hiding sensitive personal details—like your phone number, email, or home address—before showing a file to a counselor, helpline, or support person.\n\nIn Sahay, redaction never changes your original file. Instead, it creates a separate copy labeled "Redacted copy — original preserved" where private text is replaced with [REDACTED] or covered with black bars on a screenshot.';

    case 'safe_actions':
      return 'Safe Actions are calm, practical steps suggested inside your case—such as preserving unedited screenshots first, turning on MFA, checking logged-in devices, or preparing a summary.\n\nSahay never takes actions automatically or contacts anyone on your behalf. You can review each suggestion and mark it as "User selected" or "Completed" when you choose (`Recommend → Review → Decide → Execute`).';

    case 'official_reporting':
      return 'Sahay does not automatically submit complaints or connect to police systems. If and when you decide to report officially:\n• You can open the "Report Builder" tab and scroll to the Official Reporting Preparation checklist.\n• It lists what you may need (unedited originals, dates, account links, and your written summary) and provides a direct link to the official National Cyber Crime Reporting Portal (https://www.cybercrime.gov.in/) and helplines (1930, 112, 181).\n• The choice of whether and when to file is always yours.';

    case 'complaint_tracker':
      return 'The Complaint Tracker is a personal log where you can write down reference or acknowledgement numbers, dates, and notes after you submit a report to a social platform or cyber cell.\n\nEvery status in the tracker (like Prepared, Submitted, or Acknowledged) is entered manually by you—Sahay never fabricates or fetches live government statuses.';

    case 'selective_sharing':
      return 'Selective Sharing lets you create a random share token for specific files—ideally your Redacted Copies—with an expiry time (24 hours, 7 days, or 30 days) and View-Only permissions.\n\nSahay never puts your evidence inside the URL. You can revoke a token anytime, though keep in mind that revoking access cannot undo files someone has already downloaded or screenshotted.';

    case 'create_case':
      return 'To create a case:\n1. Click "Cases" in the left menu and press "Create New Case".\n2. Enter a simple title, choose a category, and pick whether the incident date is exact, approximate, or unknown.\n3. Once created, you can add files to its Evidence Vault, build a Timeline, scan for privacy risks, and prepare a report.';

    case 'emergency_safety':
      return 'Your physical safety comes first. If you feel you are in immediate physical danger right now:\n• Emergency Response Support System (India): Call 112\n• Women Helpline: Call 181\n• National Cyber Crime Helpline: Call 1930\n\nPlease consider reaching out to a trusted family member, friend, or local support service. You can pause using Sahay at any time and come back whenever you feel safe.';

    case 'legal_boundary':
      return 'I cannot determine guilt, decide whether a crime occurred, give legal advice, or certify whether evidence is admissible in court.\n\nSahay is a privacy-first tool to help you organize your files, check SHA-256 fingerprints, hide personal details in separate copies, and prepare a clear summary so you can review your options or speak with a qualified counselor or legal aid professional.';

    case 'privacy_guard_notice':
      return 'To protect your privacy, please avoid pasting personal phone numbers, email addresses, or ID numbers into the chat. You can use the Privacy & Redaction tab inside your case to scan and hide personal information locally in your browser.';

    case 'general_help':
    default:
      return 'I can help you understand any part of Sahay in simple steps:\n• Saving screenshots & checking SHA-256 digital fingerprints\n• Using OCR and building a chronological Timeline\n• Finding personal info with the Privacy Scanner & creating Redacted Copies\n• Reviewing Safe Actions to protect your accounts\n• Preparing a structured Report, Selective Sharing, or logging reference numbers in the Complaint Tracker\n\nWhich of these would you like me to explain?';
  }
}

function buildHindiReply(topic: AssistantTopicKey, routeKey: string): string {
  switch (topic) {
    case 'greeting':
      return 'नमस्ते! मैं सहाय हूँ। मैं यह समझने में आपकी मदद करने के लिए यहाँ हूँ कि आगे क्या करना सुरक्षित रहेगा।';

    case 'next_steps': {
      const routeAdvice: Record<string, string> = {
        evidence:
          'चूंकि आप अभी साक्ष्य (Evidence) पेज पर हैं, इसलिए सबसे अच्छा कदम यह है कि अपने मूल स्क्रीनशॉट या चैट लॉग यहाँ सुरक्षित कर लें। सहाय आपकी मूल फ़ाइल को बदले बिना उसका एक SHA-256 डिजिटल फ़िंगरप्रिंट बना देता है।',
        privacy:
          'चूंकि आप गोपनीयता और रिडैक्शन पेज पर हैं, आप देख सकते हैं कि फ़ाइल में कौन-सी निजी जानकारी (जैसे फ़ोन नंबर या पता) मिली है और साझा करने से पहले एक अलग रिडैक्टेड कॉपी बना सकते हैं।',
        timeline:
          'चूंकि आप घटनाक्रम (Timeline) पेज पर हैं, आप घटनाओं को तारीख के क्रम में जोड़ सकते हैं और उन्हें अपने साक्ष्यों से जोड़ सकते हैं।',
        reports:
          'चूंकि आप रिपोर्ट बिल्डर पेज पर हैं, आप चुन सकते हैं कि रिपोर्ट में कौन-से हिस्से शामिल करने हैं और उसे .TXT या PDF के रूप में सहेज सकते हैं।',
        sharing:
          'चूंकि आप सेलेक्टिव शेयरिंग पेज पर हैं, किसी परामर्शदाता के साथ साझा करते समय मूल फ़ाइलों के बजाय केवल रिडैक्टेड कॉपी चुनने पर विचार करें।',
      };
      const contextLine =
        routeAdvice[routeKey] ||
        'आप शांत तरीके से एक-एक कदम आगे बढ़ सकते हैं:\n1. सबसे पहले अपनी तत्काल सुरक्षा सुनिश्चित करें।\n2. किसी को ब्लॉक करने या चैट डिलीट करने से पहले मूल स्क्रीनशॉट और लिंक साक्ष्य वॉल्ट (Evidence Vault) में सहेजें।\n3. किसी के साथ साझा करने से पहले फ़ोन नंबर या पता छुपाने के लिए रिडैक्टेड कॉपी बनाएं।\n4. अपने अकाउंट की सुरक्षा के लिए सुरक्षित कदम (Safe Actions) देखें।';

      return `${contextLine}\n\nयाद रखें: सहाय "सुझाव → समीक्षा → निर्णय → कदम" (Recommend → Review → Decide → Execute) के सिद्धांत पर काम करता है। अंतिम निर्णय हमेशा आपका होता है।`;
    }

    case 'save_evidence':
      return 'साक्ष्य (Evidence) सुरक्षित करने का आसान तरीका:\n1. अपना मामला (Case) खोलें और "साक्ष्य वॉल्ट" (Evidence Vault) में जाएं।\n2. चैट डिलीट करने या स्क्रीनशॉट को क्रॉप करने से पहले अपनी मूल फ़ाइलें (स्क्रीनशॉट, PDF या टेक्स्ट लॉग) अपलोड करें।\n3. सहाय आपकी मूल फ़ाइल में कोई बदलाव नहीं करता और उसके लिए एक SHA-256 डिजिटल फ़िंगरप्रिंट बना देता है।';

    case 'protect_account':
      return 'अपने अकाउंट को सुरक्षित रखने के लिए आप इन कदमों पर विचार कर सकते हैं:\n• भेजने वाले को ब्लॉक करने या चैट हटाने से पहले साक्ष्य सुरक्षित कर लें।\n• अपने मुख्य ईमेल और सोशल मीडिया अकाउंट का पासवर्ड बदलें।\n• टू-स्टेप वेरिफिकेशन (MFA) चालू करें।\n• अपने ईमेल और सोशल ऐप्स में "Where You Are Logged In" (सक्रिय सेशन) की जांच करें और किसी भी अनजान डिवाइस से लॉग आउट करें।\n• गोपनीयता सेटिंग्स में जाकर तय करें कि कौन आपको मैसेज या टैग कर सकता है।';

    case 'make_report':
      return 'रिपोर्ट तैयार करने के लिए:\n1. अपने मामले के अंदर "रिपोर्ट बिल्डर" (Report Builder) टैब खोलें।\n2. वे हिस्से चुनें जिन्हें आप शामिल करना चाहते हैं (जैसे मामले की जानकारी, घटनाक्रम, साक्ष्य सूची, SHA-256 फ़िंगरप्रिंट, गोपनीयता सारांश और नोट्स)।\n3. "Download Report (.TXT)" या "Print / Save as PDF" पर क्लिक करें।\n\nयह सारांश आपकी अपनी तैयारी और तथ्यों को व्यवस्थित रखने के लिए है—यह कोई पुलिस रिपोर्ट या कानूनी प्रमाण-पत्र नहीं है।';

    case 'privacy_warning':
      return 'जब सहाय कोई चेतावनी दिखाता है, तो इसका सरल मतलब है: "मुझे कुछ ऐसी निजी जानकारी मिली है जिसे आप किसी के साथ साझा करने से पहले छुपाना (Hide) चाह सकते हैं।"\n\nउदाहरण के लिए:\n• गोपनीयता पेज पर यह बताता है कि फ़ाइल में आपका फ़ोन नंबर, ईमेल, घर का पता, पिन कोड या GPS लोकेशन दिख रही है।\n• शेयरिंग पेज पर यह याद दिलाता है कि एक बार किसी द्वारा फ़ाइल डाउनलोड या कॉपी कर लेने के बाद, बाद में एक्सेस रद्द (Revoke) करने से वह पुरानी कॉपी वापस नहीं ली जा सकती।\n\nइसलिए आप एक अलग रिडैक्टेड कॉपी बना सकते हैं जिसमें आपकी मूल फ़ाइल सुरक्षित रहती है।';

    case 'sha256':
      return 'SHA-256 आपकी फ़ाइल के लिए एक डिजिटल फ़िंगरप्रिंट की तरह है। सहाय इसका उपयोग यह जांचने में आपकी मदद के लिए करता है कि फ़ाइल में बाद में कोई बदलाव तो नहीं हुआ है। आपकी मूल फ़ाइल में कोई बदलाव नहीं किया जाता है।';

    case 'ocr':
      return 'OCR आपके स्क्रीनशॉट में दिख रहे शब्दों को पढ़ता है ताकि आपको पूरा टेक्स्ट खुद टाइप न करना पड़े।\n\nयदि कोई शब्द गलत पढ़ा गया हो, तो आप उसे अलग OCR टेक्स्ट बॉक्स में सुधार सकते हैं। इससे आपका मूल स्क्रीनशॉट कभी नहीं बदलता।';

    case 'timeline':
      return 'घटनाक्रम (Timeline) आपको यह व्यवस्थित करने में मदद करता है कि कब क्या हुआ था।\n\n• यदि आपको सटीक तारीख याद नहीं है, तो आप तारीख को "अनुमानित" (Approximate) या "अज्ञात" (Unknown) के रूप में दर्ज कर सकते हैं।\n• सहाय आपके द्वारा लिखी गई बात और साक्ष्य के विवरण को स्पष्ट रूप से अलग रखता है।';

    case 'redaction':
      return 'रिडैक्शन (Redaction) का मतलब है किसी परामर्शदाता या सहायता केंद्र को फ़ाइल दिखाने से पहले उसमें से अपना फ़ोन नंबर, ईमेल या घर का पता छुपाना।\n\nसहाय कभी भी आपकी मूल फ़ाइल को नहीं बदलता। यह हमेशा एक अलग कॉपी बनाता है जिस पर लिखा होता है: "रिडैक्टेड कॉपी — मूल साक्ष्य सुरक्षित।"';

    case 'safe_actions':
      return 'सुरक्षित कदम (Safe Actions) आपके मामले में दिए गए शांत और व्यावहारिक सुझाव हैं—जैसे पहले मूल स्क्रीनशॉट सहेजना, पासवर्ड और MFA की जांच करना, या रिपोर्ट तैयार करना।\n\nसहाय कभी भी अपने-आप कोई कदम नहीं उठाता और न ही किसी से संपर्क करता है। आप अपनी मर्जी से उन्हें चुन सकते हैं।';

    case 'official_reporting':
      return 'सहाय अपने-आप पुलिस या किसी पोर्टल पर शिकायत दर्ज नहीं करता। यदि आप आधिकारिक शिकायत करने का निर्णय लेते हैं:\n• "रिपोर्ट बिल्डर" पेज पर आधिकारिक रिपोर्टिंग तैयारी सूची (Checklist) दी गई है।\n• वहाँ आधिकारिक नेशनल साइबर क्राइम रिपोर्टिंग पोर्टल (https://www.cybercrime.gov.in/) का लिंक और हेल्पलाइन नंबर (1930, 112, 181) उपलब्ध हैं।\n• शिकायत कब और कैसे करनी है, यह निर्णय पूरी तरह आपका है।';

    case 'complaint_tracker':
      return 'शिकायत ट्रैकर आपकी अपनी निजी डायरी की तरह है जहाँ आप किसी प्लेटफ़ॉर्म या साइबर सेल में शिकायत करने के बाद उसका पावती नंबर (Reference Number), तारीख और स्थिति (जैसे Prepared, Submitted, Acknowledged) खुद लिखकर रख सकते हैं।';

    case 'selective_sharing':
      return 'सेलेक्टिव शेयरिंग से आप अपनी चुनी हुई फ़ाइलों (विशेषकर रिडैक्टेड कॉपी) के लिए एक समय-सीमा (24 घंटे, 7 दिन या 30 दिन) वाला शेयर टोकन बना सकते हैं और जब चाहें उसे रद्द (Revoke) कर सकते हैं।';

    case 'create_case':
      return 'नया मामला बनाने के लिए:\n1. बाएं मेनू में "मामले (Cases)" पर क्लिक करें और "नया मामला बनाएं" चुनें।\n2. एक नाम, श्रेणी और घटना की तारीख (सटीक, अनुमानित या अज्ञात) चुनें।\n3. इसके बाद आप उसमें साक्ष्य जोड़ सकते हैं और टाइमलाइन व रिपोर्ट बना सकते हैं।';

    case 'emergency_safety':
      return 'आपकी शारीरिक सुरक्षा सबसे पहले है। यदि आप अभी तत्काल शारीरिक खतरे में हैं:\n• आपातकालीन सहायता (Emergency): 112 पर कॉल करें\n• महिला हेल्पलाइन: 181 पर कॉल करें\n• नेशनल साइबर क्राइम हेल्पलाइन: 1930 पर कॉल करें\n\nकृपया किसी विश्वसनीय परिवारजन या मित्र से संपर्क करने पर विचार करें।';

    case 'legal_boundary':
      return 'मैं किसी को दोषी घोषित नहीं कर सकता, यह तय नहीं कर सकता कि अपराध हुआ है या नहीं, और न ही कानूनी सलाह या अदालत में साक्ष्य की मान्यता का प्रमाण दे सकता हूँ।\n\nसहाय आपको अपने साक्ष्य व्यवस्थित करने, डिजिटल फ़िंगरप्रिंट जांचने और गोपनीयता सुरक्षित रखने में मदद करने वाला एक सहायक टूल है।';

    case 'privacy_guard_notice':
      return 'आपकी गोपनीयता की सुरक्षा के लिए, कृपया चैट में अपना निजी फ़ोन नंबर, ईमेल या पहचान संख्या न लिखें। अपनी फ़ाइलों में निजी जानकारी छुपाने के लिए मामले के अंदर "गोपनीयता और रिडैक्शन" टैब का उपयोग करें।';

    case 'general_help':
    default:
      return 'मैं सरल भाषा में सहाय के किसी भी हिस्से को समझने में आपकी मदद कर सकता हूँ:\n• साक्ष्य (Evidence) सहेजना और SHA-256 डिजिटल फ़िंगरप्रिंट जांचना\n• OCR और घटनाक्रम (Timeline) बनाना\n• गोपनीयता स्कैनर और रिडैक्टेड कॉपी बनाना\n• अकाउंट सुरक्षा और सुरक्षित कदम (Safe Actions)\n• रिपोर्ट तैयार करना, सेलेक्टिव शेयरिंग और शिकायत ट्रैकर\n\nआप इनमें से किसके बारे में जानना चाहेंगे?';
  }
}

function buildMarathiReply(topic: AssistantTopicKey, routeKey: string): string {
  switch (topic) {
    case 'greeting':
      return 'नमस्कार! मी सहाय आहे. पुढे काय करणे सुरक्षित राहील हे समजून घेण्यात मी तुम्हाला मदत करण्यासाठी येथे आहे.';

    case 'next_steps': {
      const routeAdvice: Record<string, string> = {
        evidence:
          'तुम्ही सध्या पुरावा (Evidence) पेजवर आहात, त्यामुळे तुमचे मूळ स्क्रीनशॉट किंवा चॅट लॉग येथे जतन करणे हे एक चांगले पहिले पाऊल आहे. सहाय मूळ फाईल न बदलता तिचा SHA-256 डिजिटल फिंगरप्रिंट तयार करतो.',
        privacy:
          'तुम्ही गोपनीयता आणि रिडॅक्शन पेजवर आहात. तुम्ही फाईलमधील वैयक्तिक माहिती (उदा. फोन नंबर किंवा पत्ता) पाहू शकता आणि शेअर करण्यापूर्वी वेगळी रिडॅक्टेड प्रत तयार करू शकता.',
        timeline:
          'तुम्ही घटनाक्रम (Timeline) पेजवर आहात. तुम्ही घडलेल्या घटना क्रमाने नोंदवू शकता आणि त्यांना पुराव्यांशी जोडू शकता.',
        reports:
          'तुम्ही रिपोर्ट बिल्डर पेजवर आहात. तुम्ही अहवालात कोणते विभाग समाविष्ट करायचे ते निवडून .TXT किंवा PDF स्वरूपात सेव्ह करू शकता.',
        sharing:
          'तुम्ही निवडक शेअरिंग पेजवर आहात. समुपदेशकाशी बोलताना मूळ पुराव्यांऐवजी फक्त रिडॅक्टेड प्रत शेअर करण्याचा विचार करा.',
      };
      const contextLine =
        routeAdvice[routeKey] ||
        'तुम्ही शांतपणे खालीलप्रमाणे पुढील पाऊल उचलू शकता:\n1. सर्वात आधी तुमची तात्काळ सुरक्षितता तपासा.\n2. कोणालाही ब्लॉक करण्यापूर्वी किंवा मेसेज डिलीट करण्यापूर्वी मूळ स्क्रीनशॉट पुरावा व्हॉल्टमध्ये जतन करा.\n3. खाजगी माहिती लपवण्यासाठी गोपनीयता स्कॅनर आणि रिडॅक्शनचा वापर करून वेगळी प्रत तयार करा.\n4. तुमच्या अकाउंटच्या सुरक्षेसाठी सुरक्षित पावले (Safe Actions) पहा.';

      return `${contextLine}\n\nलक्षात ठेवा: सहाय "शिफारस → पुनरावलोकन → निर्णय → कृती" (Recommend → Review → Decide → Execute) या तत्त्वावर चालतो. अंतिम निर्णय नेहमी तुमचाच असतो.`;
    }

    case 'save_evidence':
      return 'पुरावा (Evidence) सुरक्षितपणे जतन करण्यासाठी:\n1. तुमचे प्रकरण (Case) उघडा आणि "पुरावा व्हॉल्ट" (Evidence Vault) मध्ये जा.\n2. मेसेज डिलीट करण्यापूर्वी किंवा स्क्रीनशॉट क्रॉप करण्यापूर्वी तुमचे मूळ स्क्रीनशॉट, चॅट लॉग किंवा PDF अपलोड करा.\n3. सहाय तुमची मूळ फाईल कधीही बदलत नाही आणि तिच्यासाठी आपोआप SHA-256 डिजिटल फिंगरप्रिंट तयार करतो.';

    case 'protect_account':
      return 'तुमचे अकाउंट सुरक्षित ठेवण्यासाठी तुम्ही या पावलांचा विचार करू शकता:\n• समोरच्या व्यक्तीला ब्लॉक करण्यापूर्वी किंवा चॅट हटवण्यापूर्वी पुरावे जतन करा.\n• तुमच्या मुख्य ईमेल आणि सोशल मीडिया अकाउंटचा पासवर्ड बदला.\n• टू-स्टेप व्हेरिफिकेशन (MFA) सुरू करा.\n• ईमेल आणि सोशल ॲप्समध्ये "Where You Are Logged In" (सक्रिय सेशन्स) तपासा आणि अनोळखी डिव्हाइसमधून साइन आउट करा.\n• तुम्हाला कोण मेसेज किंवा टॅग करू शकते यावर गोपनीयता सेटिंग्जमधून मर्यादा घाला.';

    case 'make_report':
      return 'अहवाल (Report) तयार करण्यासाठी:\n1. तुमच्या प्रकरणातील "अहवाल बिल्डर" (Report Builder) टॅबवर जा.\n2. तुम्हाला हवे असलेले विभाग निवडा (उदा. प्रकरणाची माहिती, घटनाक्रम, पुरावा यादी, SHA-256 फिंगरप्रिंट्स, गोपनीयता सारांश आणि टिपा).\n3. "Download Report (.TXT)" किंवा "Print / Save as PDF" वर क्लिक करा.\n\nहा सारांश तुमची माहिती व्यवस्थित ठेवण्यासाठी आहे—हा पोलीस अहवाल किंवा कायदेशीर प्रमाणपत्र नाही.';

    case 'privacy_warning':
      return 'जेव्हा सहाय एखादा इशारा (Warning) दाखवतो, तेव्हा त्याचा साधा अर्थ असा असतो: "मला अशी काही माहिती आढळली आहे जी तुम्ही इतरांशी शेअर करण्यापूर्वी लपवू इच्छिता."\n\nउदाहरणार्थ:\n• गोपनीयता पेजवर हे दर्शवले जाते की फाईलमध्ये तुमचा फोन नंबर, ईमेल, घराचा पत्ता, पिन कोड किंवा GPS लोकेशन दिसत आहे.\n• शेअरिंग पेजवरील इशारा आठवण करून देतो की जर कोणी फाईल आधीच डाउनलोड किंवा कॉपी केली असेल, तर नंतर लिंक रद्द (Revoke) केल्याने आधीच सेव्ह केलेली प्रत परत घेता येत नाही.\n\nम्हणूनच तुम्ही मूळ फाईल सुरक्षित ठेवून एक वेगळी रिडॅक्टेड प्रत तयार करू शकता.';

    case 'sha256':
      return 'SHA-256 हे तुमच्या फाईलच्या डिजिटल फिंगरप्रिंटसारखे आहे. फाईलमध्ये नंतर कोणताही बदल झालेला नाही हे तपासण्यात मदत करण्यासाठी सहाय याचा वापर करतो. तुमची मूळ फाईल बदलली जात नाही.';

    case 'ocr':
      return 'OCR तुमच्या स्क्रीनशॉटमधील दिसणारा मजकूर वाचतो, जेणेकरून तुम्हाला सर्व काही स्वतः टाईप करावे लागत नाही.\n\nजर एखादा शब्द चुकीचा वाचला गेला असेल, तर तुम्ही तो वेगळ्या OCR मजकूर बॉक्समध्ये दुरुस्त करू शकता. यामुळे तुमचा मूळ स्क्रीनशॉट कधीही बदलत नाही.';

    case 'timeline':
      return 'घटनाक्रम (Timeline) तुम्हाला घडलेल्या घटना तारखेनुसार क्रमाने मांडण्यास मदत करतो.\n\n• तुम्हाला नेमकी तारीख आठवत नसेल, तर तुम्ही ती "अंदाजे" (Approximate) किंवा "अज्ञात" (Unknown) म्हणून नोंदवू शकता.\n• तुम्ही लिहिलेली माहिती आणि जोडलेले पुरावे सहाय स्पष्टपणे वेगळे ठेवतो.';

    case 'redaction':
      return 'रिडॅक्शन (Redaction) म्हणजे समुपदेशक किंवा मदत केंद्राला फाईल दाखवण्यापूर्वी त्यातील तुमचा फोन नंबर, ईमेल किंवा घराचा पत्ता लपवणे.\n\nसहाय तुमची मूळ फाईल कधीही बदलत नाही. तो नेहमी एक वेगळी प्रत तयार करतो ज्यावर लिहिलेले असते: "रिडॅक्टेड प्रत — मूळ पुरावा सुरक्षित."';

    case 'safe_actions':
      return 'सुरक्षित पावले (Safe Actions) म्हणजे तुमच्या प्रकरणात सुचवलेले शांत आणि उपयुक्त पर्याय—जसे की आधी मूळ स्क्रीनशॉट जतन करणे, MFA सुरू करणे, लॉग-इन डिव्हाइस तपासणे किंवा अहवाल तयार करणे.\n\nसहाय कधीही आपोआप कोणतीही कृती करत नाही किंवा कोणाशी संपर्क साधत नाही. तुम्ही स्वतः प्रत्येक पर्याय पाहून निर्णय घेऊ शकता.';

    case 'official_reporting':
      return 'सहाय आपोआप पोलिसांकडे किंवा कोणत्याही पोर्टलवर तक्रार सबमिट करत नाही. जेव्हा तुम्हाला अधिकृत तक्रार करायची असेल:\n• "अहवाल बिल्डर" पेजवर अधिकृत तक्रार पूर्वतयारी यादी (Checklist) दिलेली आहे.\n• तिथे अधिकृत नॅशनल सायबर क्राईम रिपोर्टिंग पोर्टल (https://www.cybercrime.gov.in/) ची लिंक आणि हेल्पलाइन क्रमांक (1930, 112, 181) दिले आहेत.\n• तक्रार कधी आणि करायची की नाही, हा निर्णय पूर्णपणे तुमचा आहे.';

    case 'complaint_tracker':
      return 'तक्रार ट्रॅकर ही तुमची वैयक्तिक नोंदवही आहे जिथे तुम्ही प्लॅटफॉर्म किंवा सायबर सेलकडे तक्रार केल्यानंतर मिळालेला पोचपावती क्रमांक (Reference Number), तारीख आणि स्थिती (Prepared, Submitted, Acknowledged) स्वतः नोंदवून ठेवू शकता.';

    case 'selective_sharing':
      return 'निवडक शेअरिंगद्वारे तुम्ही निवडलेल्या फाईल्ससाठी (विशेषतः रिडॅक्टेड प्रतींसाठी) मुदतीसह (24 तास, 7 दिवस किंवा 30 दिवस) एक शेअर टोकन तयार करू शकता आणि कधीही ते रद्द (Revoke) करू शकता.';

    case 'create_case':
      return 'नवीन प्रकरण तयार करण्यासाठी:\n1. डाव्या मेनूमधील "प्रकरणे (Cases)" वर क्लिक करा आणि "नवीन प्रकरण तयार करा" निवडा.\n2. शीर्षक, प्रकार आणि घटनेची तारीख (नेमकी, अंदाजे किंवा अज्ञात) निवडा.\n3. त्यानंतर तुम्ही त्यात पुरावे जोडू शकता आणि घटनाक्रम व अहवाल तयार करू शकता.';

    case 'emergency_safety':
      return 'तुमची शारीरिक सुरक्षा सर्वात महत्त्वाची आहे. जर तुम्हाला आत्ता तात्काळ शारीरिक धोका जाणवत असेल:\n• आपत्कालीन मदत सेवा (Emergency): 112 वर कॉल करा\n• महिला हेल्पलाइन: 181 वर कॉल करा\n• नॅशनल सायबर क्राईम हेल्पलाइन: 1930 वर कॉल करा\n\nकृपया विश्वासू कुटुंबीय किंवा मित्राशी संपर्क साधण्याचा विचार करा.';

    case 'legal_boundary':
      return 'मी कोणालाही दोषी ठरवू शकत नाही, गुन्हा घडला आहे की नाही हे ठरवू शकत नाही, कायदेशीर सल्ला देऊ शकत नाही किंवा न्यायालयात पुरावा ग्राह्य धरला जाईल याचे प्रमाणपत्र देऊ शकत नाही.\n\nसहाय हे तुमचे पुरावे व्यवस्थित ठेवण्यासाठी, डिजिटल फिंगरप्रिंट तपासण्यासाठी आणि खाजगी माहिती सुरक्षित ठेवण्यासाठी मदत करणारे एक साधन आहे.';

    case 'privacy_guard_notice':
      return 'तुमच्या गोपनीयतेच्या रक्षणासाठी, कृपया चॅटमध्ये तुमचा वैयक्तिक फोन नंबर, ईमेल किंवा ओळखपत्र क्रमांक टाकू नका. फाईलमधील खाजगी माहिती लपवण्यासाठी प्रकरणातील "गोपनीयता आणि रिडॅक्शन" टॅबचा वापर करा.';

    case 'general_help':
    default:
      return 'मी सोप्या भाषेत सहायचा कोणताही भाग समजावून सांगण्यास मदत करू शकतो:\n• पुरावे (Evidence) जतन करणे आणि SHA-256 डिजिटल फिंगरप्रिंट तपासणे\n• OCR आणि घटनाक्रम (Timeline) तयार करणे\n• गोपनीयता स्कॅनर आणि रिडॅक्टेड प्रत तयार करणे\n• अकाउंट सुरक्षा आणि सुरक्षित पावले (Safe Actions)\n• अहवाल तयार करणे, निवडक शेअरिंग आणि तक्रार ट्रॅकर\n\nयापैकी कशाबद्दल तुम्हाला जाणून घ्यायला आवडेल?';
  }
}

/**
 * Clean service abstraction for generating Sahay Assistant replies.
 * Privacy-first: Never sends uploaded evidence, OCR text, raw privacy findings, or personal data.
 */
export async function generateSahayAssistantReply(
  request: SahayAssistantRequest
): Promise<SahayAssistantResponse> {
  const routeKey = getRouteKey(request.currentPathname);
  const topicKey = classifyAssistantTopic(request.userMessage);

  // Optional environment-configured server endpoint abstraction (never exposes API keys in client code,
  // and never sends private case data—only the sanitized question, language code, and route key).
  const configuredEndpoint = (
    import.meta as unknown as { env?: Record<string, string | undefined> }
  ).env?.VITE_SAHAY_ASSISTANT_API_URL;

  if (configuredEndpoint && topicKey !== 'privacy_guard_notice') {
    try {
      const res = await fetch(configuredEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: request.userMessage,
          language: request.language,
          routeContext: routeKey,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { reply?: string };
        if (data?.reply && typeof data.reply === 'string') {
          return {
            replyText: data.reply,
            topicKey,
            routeKey,
          };
        }
      }
    } catch {
      // Fall back gracefully to local deterministic Sahay assistant
    }
  }

  const replyText = buildLocalizedReply(topicKey, routeKey, request.language);

  return {
    replyText,
    topicKey,
    routeKey,
  };
}
