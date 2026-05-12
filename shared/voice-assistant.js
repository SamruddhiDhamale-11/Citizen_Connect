/* ============================================================
   CITIZEN CONNECT - Voice Guide Module (Final Clean Version)
   - Language selection step (English / Hindi / Marathi)
   - Email field included and asked correctly
   - Mic stops when navigating pages
   - Standalone mic buttons for all fields
   - 15s timeout re-asks question
   - Same-as checkbox works
   - Email @ and . parsing
   ============================================================ */
"use strict";

(function VoiceGuide() {

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var SS = window.speechSynthesis || null;
  if (!SR || !SS) { console.info("[VoiceGuide] Not supported."); return; }

  /* ================================================================
     FIELD DEFINITIONS
  ================================================================ */

  var C1 = [
    { id:"c-firstName",  type:"text",  prompt:"Please say your First Name." },
    { id:"c-middleName", type:"text",  prompt:"Say your Middle or Father name. Say skip to leave blank." },
    { id:"c-lastName",   type:"text",  prompt:"Please say your Last Name." },
    { id:"wardConfirm",  type:"radio", name:"wardConfirm",
      prompt:"Are you from this ward? Say Yes or No.",
      options:[
        { value:"yes", labels:["yes","yeah","yep","correct","right","haan","ha","belongs"] },
        { value:"no",  labels:["no","nope","nahi","na","not","dont"] }
      ]
    },
    { id:"residentType", type:"radio", name:"residentType",
      prompt:"Say your Residency Type: Resident, Working Here, Business Owner, Property Owner, or Other.",
      options:[
        { value:"resident",      labels:["resident","residing","live here","living here","i live","i reside"] },
        { value:"working",       labels:["working","working here","work here","employee","i work"] },
        { value:"business",      labels:["business","business owner","shop owner","entrepreneur"] },
        { value:"property_rent", labels:["property","property owner","rent","landlord","owner"] },
        { value:"other",         labels:["other","others","different","else","something else"] }
      ]
    },
    { id:"c-otherResident", type:"text",
      prompt:"Please describe your residency type.",
      conditional: function() {
        var c = document.querySelector("input[name=\"residentType\"]:checked");
        return c && c.value === "other";
      }
    },
    { id:"isVoter", type:"radio", name:"isVoter",
      prompt:"Are you a registered voter? Say Yes or No.",
      options:[
        { value:"yes", labels:["yes","yeah","yep","correct","haan","ha","i am","registered"] },
        { value:"no",  labels:["no","nope","nahi","na","not","i am not","not registered"] }
      ]
    }
  ];

  var C2 = [
    { id:"c-dob",    type:"skip",  prompt:"Please select your Date of Birth using the date picker." },
    { id:"c-gender", type:"select",
      prompt:"Say your Gender: Male, Female, Other, or Prefer not to say.",
      options:[
        { value:"male",       labels:["male","mail","man","boy","he","him","males","i am male","i am a man"] },
        { value:"female",     labels:["female","females","woman","women","girl","she","her","lady","femail","famale","i am female"] },
        { value:"other",      labels:["other","others","non binary","nonbinary","transgender","trans","different"] },
        { value:"prefer_not", labels:["prefer not","prefer not to say","no answer","private","skip","rather not","not say"] }
      ]
    },
    { id:"c-mobile",   type:"phone", prompt:"Please say your 10-digit Mobile Number clearly." },
    { id:"c-whatsapp", type:"phone",
      prompt:"Say your WhatsApp Number, or say same as mobile to copy it.",
      sameAs:{ checkboxId:"c-sameAsMobile", sourceId:"c-mobile" }
    },
    { id:"c-email",    type:"email", prompt:"Say your Email Address. For example: rahul at gmail dot com." }
  ];

  var P1 = [
    { id:"p-firstName",  type:"text",  prompt:"Please say your First Name." },
    { id:"p-middleName", type:"text",  prompt:"Say your Middle or Father name. Say skip to leave blank." },
    { id:"p-lastName",   type:"text",  prompt:"Please say your Last Name." },
    { id:"p-age",        type:"text",  prompt:"Please say your Age in years." },
    { id:"p-gender",     type:"select",
      prompt:"Say your Gender: Male, Female, Other, or Prefer not to say.",
      options:[
        { value:"male",       labels:["male","mail","man","boy","he","him","males","i am male","i am a man"] },
        { value:"female",     labels:["female","females","woman","women","girl","she","her","lady","femail","famale","i am female"] },
        { value:"other",      labels:["other","others","non binary","nonbinary","transgender","trans","different"] },
        { value:"prefer_not", labels:["prefer not","prefer not to say","no answer","private","skip","rather not","not say"] }
      ]
    },
    { id:"p-mobile",     type:"phone", prompt:"Please say your 10-digit Mobile Number clearly." },
    { id:"p-email",      type:"email", prompt:"Say your Email Address. For example: rahul at gmail dot com." },
    { id:"p-address",    type:"text",  prompt:"Please say your full Address." }
  ];

  var P2 = [
    { id:"p-jurisdiction", type:"select",
      prompt:"Say your Jurisdiction Type: Municipal, Legislative Assembly, or Parliamentary.",
      options:[
        { value:"municipal",     labels:["municipal","municipality","municipal corporation","city"] },
        { value:"legislative",   labels:["legislative","legislative assembly","assembly","state","mla"] },
        { value:"parliamentary", labels:["parliamentary","parliament","mp","lok sabha","rajya sabha"] }
      ]
    },
    { id:"p-wardNumber", type:"text", prompt:"Please say your Ward or Constituency Number." },
    { id:"p-wardName",   type:"text", prompt:"Please say your Ward or Constituency Name." },
    { id:"p-position",   type:"select",
      prompt:"Say your Position: MLA, MP, Corporator, Mayor, Sarpanch, or Councillor.",
      options:[
        { value:"mla",        labels:["mla","member of legislative assembly","legislative assembly member"] },
        { value:"mp",         labels:["mp","member of parliament","parliament member"] },
        { value:"corporator", labels:["corporator","corporation member","ward member"] },
        { value:"mayor",      labels:["mayor","city mayor"] },
        { value:"sarpanch",   labels:["sarpanch","village head","gram panchayat head"] },
        { value:"councillor", labels:["councillor","councilor","council member","ward councillor"] }
      ]
    }
  ];

  var STEP_FIELDS = { c1:C1, c2:C2, p1:P1, p2:P2 };

  /* ================================================================
     LANGUAGE CONFIG
     Maps a language key to:
       srLang  — BCP-47 tag used for SpeechRecognition.lang
       ttsLang — BCP-47 tag used for SpeechSynthesisUtterance.lang
       label   — display name shown in the guide bar
  ================================================================ */
  var LANG_CONFIG = {
    english: {
      srLang:  "en-IN",
      ttsLang: "en-IN",
      label:   "English",
      ttsRate:  0.92,
      ttsPitch: 1.0,
      /* Preferred voice name substrings, tried in order (case-insensitive).
         Empty array = let browser pick. */
      voiceHints: []
    },
    hindi: {
      srLang:  "hi-IN",
      ttsLang: "hi-IN",
      label:   "हिंदी",
      ttsRate:  0.90,
      ttsPitch: 1.0,
      voiceHints: ["lekha","google hindi","hindi","hi-in"]
    },
    marathi: {
      srLang:  "mr-IN",
      ttsLang: "mr-IN",
      label:   "मराठी",
      /* Slightly slower rate + marginally lower pitch improves Devanagari
         clarity on both native mr-IN voices and hi-IN fallback voices.
         0.82 gives the engine more time to articulate each syllable. */
      ttsRate:  0.82,
      ttsPitch: 0.95,
      /* Try mr-IN voices first; if none found, fall back to hi-IN voices
         (same Devanagari script, significantly better quality on most
         browsers/OS). Final fallback: browser default for mr-IN. */
      voiceHints: ["mr-in","marathi","google marathi",
                   "lekha","google hindi","hi-in","hindi"]
    }
  };

  /* Language-choice recognition options — always listened in en-US
     so the user can say the name in any natural way */
  var LANG_OPTIONS = [
    { key: "english", labels: ["english","angrezi","inglish","in english","select english","choose english"] },
    { key: "hindi",   labels: ["hindi","hind","in hindi","select hindi","choose hindi","hindhi"] },
    { key: "marathi", labels: ["marathi","marathi","in marathi","select marathi","choose marathi","marati","marathhi"] }
  ];

  /* ================================================================
     MULTILINGUAL PROMPTS
     Keys match field IDs (or special keys for UI strings).
     Each entry has english / hindi / marathi text.
     Option labels per language are appended to the existing English
     labels array so matchOption() works for all three languages.
  ================================================================ */
  var PROMPTS = {
    /* ---- Citizen Step 1 ---- */
    "c-firstName": {
      english: "Please say your First Name.",
      hindi:   "कृपया अपना पहला नाम बोलें।",
      marathi: "कृपया आपले पहिले नाव सांगा।"
    },
    "c-middleName": {
      english: "Say your Middle or Father name. Say skip to leave blank.",
      hindi:   "अपना मध्य नाम या पिता का नाम बोलें। छोड़ने के लिए 'स्किप' बोलें।",
      marathi: "आपले मधले नाव किंवा वडिलांचे नाव सांगा। रिकामे सोडण्यासाठी 'स्किप' बोला।"
    },
    "c-lastName": {
      english: "Please say your Last Name.",
      hindi:   "कृपया अपना अंतिम नाम बोलें।",
      marathi: "कृपया आपले आडनाव सांगा।"
    },
    "wardConfirm": {
      english: "Are you from this ward? Say Yes or No.",
      hindi:   "क्या आप इस वार्ड से हैं? हाँ या नहीं बोलें।",
      marathi: "तुम्ही या वॉर्डमधून आहात का? हो किंवा नाही सांगा।"
    },
    "residentType": {
      english: "Say your Residency Type: Resident, Working Here, Business Owner, Property Owner, or Other.",
      hindi:   "अपना निवास प्रकार बोलें: निवासी, यहाँ काम करता हूँ, व्यवसाय मालिक, संपत्ति मालिक, या अन्य।",
      marathi: "आपला निवास प्रकार सांगा: रहिवासी, येथे काम करतो, व्यवसाय मालक, मालमत्ता मालक, किंवा इतर।"
    },
    "c-otherResident": {
      english: "Please describe your residency type.",
      hindi:   "कृपया अपना निवास प्रकार बताएं।",
      marathi: "कृपया आपला निवास प्रकार सांगा।"
    },
    "isVoter": {
      english: "Are you a registered voter? Say Yes or No.",
      hindi:   "क्या आप एक पंजीकृत मतदाता हैं? हाँ या नहीं बोलें।",
      marathi: "तुम्ही नोंदणीकृत मतदार आहात का? हो किंवा नाही सांगा।"
    },
    /* ---- Citizen Step 2 ---- */
    "c-dob": {
      english: "Please select your Date of Birth using the date picker.",
      hindi:   "कृपया दिनांक चयनकर्ता का उपयोग करके अपनी जन्म तिथि चुनें।",
      marathi: "कृपया दिनांक निवडकर्त्याचा वापर करून आपली जन्मतारीख निवडा।"
    },
    "c-gender": {
      english: "Say your Gender: Male, Female, Other, or Prefer not to say.",
      hindi:   "अपना लिंग बोलें: पुरुष, महिला, अन्य, या बताना नहीं चाहते।",
      marathi: "आपले लिंग सांगा: पुरुष, महिला, इतर, किंवा सांगणे पसंत नाही।"
    },
    "c-mobile": {
      english: "Please say your 10-digit Mobile Number clearly.",
      hindi:   "कृपया अपना 10 अंकों का मोबाइल नंबर स्पष्ट रूप से बोलें।",
      marathi: "कृपया आपला 10 अंकी मोबाइल नंबर स्पष्टपणे सांगा।"
    },
    "c-whatsapp": {
      english: "Say your WhatsApp Number, or say same as mobile to copy it.",
      hindi:   "अपना व्हाट्सएप नंबर बोलें, या कॉपी करने के लिए 'मोबाइल जैसा' बोलें।",
      marathi: "आपला व्हाट्सअॅप नंबर सांगा, किंवा कॉपी करण्यासाठी 'मोबाइल सारखाच' बोला।"
    },
    "c-email": {
      english: "Say your Email Address. For example: rahul at gmail dot com.",
      hindi:   "अपना ईमेल पता बोलें। उदाहरण: राहुल एट जीमेल डॉट कॉम।",
      marathi: "आपला ईमेल पत्ता सांगा। उदाहरण: राहुल एट जीमेल डॉट कॉम।"
    },
    /* ---- Politician Step 1 ---- */
    "p-firstName": {
      english: "Please say your First Name.",
      hindi:   "कृपया अपना पहला नाम बोलें।",
      marathi: "कृपया आपले पहिले नाव सांगा।"
    },
    "p-middleName": {
      english: "Say your Middle or Father name. Say skip to leave blank.",
      hindi:   "अपना मध्य नाम या पिता का नाम बोलें। छोड़ने के लिए 'स्किप' बोलें।",
      marathi: "आपले मधले नाव किंवा वडिलांचे नाव सांगा। रिकामे सोडण्यासाठी 'स्किप' बोला।"
    },
    "p-lastName": {
      english: "Please say your Last Name.",
      hindi:   "कृपया अपना अंतिम नाम बोलें।",
      marathi: "कृपया आपले आडनाव सांगा।"
    },
    "p-age": {
      english: "Please say your Age in years.",
      hindi:   "कृपया अपनी आयु वर्षों में बोलें।",
      marathi: "कृपया आपले वय वर्षांमध्ये सांगा।"
    },
    "p-gender": {
      english: "Say your Gender: Male, Female, Other, or Prefer not to say.",
      hindi:   "अपना लिंग बोलें: पुरुष, महिला, अन्य, या बताना नहीं चाहते।",
      marathi: "आपले लिंग सांगा: पुरुष, महिला, इतर, किंवा सांगणे पसंत नाही।"
    },
    "p-mobile": {
      english: "Please say your 10-digit Mobile Number clearly.",
      hindi:   "कृपया अपना 10 अंकों का मोबाइल नंबर स्पष्ट रूप से बोलें।",
      marathi: "कृपया आपला 10 अंकी मोबाइल नंबर स्पष्टपणे सांगा।"
    },
    "p-email": {
      english: "Say your Email Address. For example: rahul at gmail dot com.",
      hindi:   "अपना ईमेल पता बोलें। उदाहरण: राहुल एट जीमेल डॉट कॉम।",
      marathi: "आपला ईमेल पत्ता सांगा। उदाहरण: राहुल एट जीमेल डॉट कॉम।"
    },
    "p-address": {
      english: "Please say your full Address.",
      hindi:   "कृपया अपना पूरा पता बोलें।",
      marathi: "कृपया आपला पूर्ण पत्ता सांगा।"
    },
    /* ---- Politician Step 2 ---- */
    "p-jurisdiction": {
      english: "Say your Jurisdiction Type: Municipal, Legislative Assembly, or Parliamentary.",
      hindi:   "अपना क्षेत्राधिकार प्रकार बोलें: नगरपालिका, विधान सभा, या संसदीय।",
      marathi: "आपला अधिकारक्षेत्र प्रकार सांगा: महानगरपालिका, विधानसभा, किंवा संसदीय।"
    },
    "p-wardNumber": {
      english: "Please say your Ward or Constituency Number.",
      hindi:   "कृपया अपना वार्ड या निर्वाचन क्षेत्र नंबर बोलें।",
      marathi: "कृपया आपला वॉर्ड किंवा मतदारसंघ क्रमांक सांगा।"
    },
    "p-wardName": {
      english: "Please say your Ward or Constituency Name.",
      hindi:   "कृपया अपना वार्ड या निर्वाचन क्षेत्र का नाम बोलें।",
      marathi: "कृपया आपल्या वॉर्ड किंवा मतदारसंघाचे नाव सांगा।"
    },
    "p-position": {
      english: "Say your Position: MLA, MP, Corporator, Mayor, Sarpanch, or Councillor.",
      hindi:   "अपना पद बोलें: विधायक, सांसद, कॉर्पोरेटर, महापौर, सरपंच, या पार्षद।",
      marathi: "आपले पद सांगा: आमदार, खासदार, नगरसेवक, महापौर, सरपंच, किंवा नगरसेवक।"
    },
    /* ---- UI strings ---- */
    "ui-allDone": {
      english: "All fields completed. Please review and click Next.",
      hindi:   "सभी फ़ील्ड पूर्ण हो गए। कृपया समीक्षा करें और अगला क्लिक करें।",
      marathi: "सर्व फील्ड पूर्ण झाले. कृपया तपासा आणि पुढे क्लिक करा."
    },
    "ui-allDoneBar": {
      english: "All fields done! Review and click Next.",
      hindi:   "सभी फ़ील्ड पूर्ण! समीक्षा करें और अगला क्लिक करें।",
      marathi: "सर्व फील्ड पूर्ण! तपासा आणि पुढे क्लिक करा."
    },
    "ui-noHear": {
      english: "I did not hear you. ",
      hindi:   "मैंने आपको नहीं सुना। ",
      marathi: "मला तुमचे ऐकू आले नाही. "
    },
    "ui-noAnswer": {
      english: "No answer — asking again.",
      hindi:   "कोई उत्तर नहीं — फिर से पूछ रहा हूँ।",
      marathi: "उत्तर नाही — पुन्हा विचारत आहे."
    },
    "ui-micError": {
      english: "Mic error. Please type manually.",
      hindi:   "माइक त्रुटि। कृपया मैन्युअल रूप से टाइप करें।",
      marathi: "मायक्रोफोन त्रुटी. कृपया हाताने टाइप करा."
    },
    "ui-skipped": {
      english: "Skipped.",
      hindi:   "छोड़ दिया।",
      marathi: "वगळले."
    },
    "ui-skipWord": {
      english: "skip",
      hindi:   "छोड़ें",
      marathi: "वगळा"
    },
    "ui-sameAsMobile": {
      english: "Same as mobile copied!",
      hindi:   "मोबाइल जैसा कॉपी हो गया!",
      marathi: "मोबाइल सारखाच कॉपी झाला!"
    },
    "ui-sameWords": {
      english: ["same","same as","same as mobile","same number","same as mobile number","copy","use same","same mobile"],
      hindi:   ["same","same as","same as mobile","same number","same as mobile number","copy","use same","same mobile","मोबाइल जैसा","वही नंबर","कॉपी करो","मोबाइल वाला"],
      marathi: ["same","same as","same as mobile","same number","same as mobile number","copy","use same","same mobile","मोबाइल सारखाच","तोच नंबर","कॉपी करा","मोबाइल वाला"]
    },
    "ui-listeningDigits": {
      english: "Listening for digits... ",
      hindi:   "अंक सुन रहा हूँ... ",
      marathi: "अंक ऐकत आहे... "
    },
    "ui-gotDigits": {
      english: " of 10 digits: ",
      hindi:   " में से 10 अंक: ",
      marathi: " पैकी 10 अंक: "
    },
    "ui-keepGoing": {
      english: " — keep going...",
      hindi:   " — जारी रखें...",
      marathi: " — पुढे सांगा..."
    },
    "ui-gotPhone": {
      english: "Got: ",
      hindi:   "मिला: ",
      marathi: "मिळाले: "
    },
    "ui-listeningEmail": {
      english: "Listening for email... say: rahul at gmail dot com",
      hindi:   "ईमेल सुन रहा हूँ... बोलें: राहुल एट जीमेल डॉट कॉम",
      marathi: "ईमेल ऐकत आहे... सांगा: राहुल एट जीमेल डॉट कॉम"
    },
    "ui-gotEmail": {
      english: "Got email: ",
      hindi:   "ईमेल मिला: ",
      marathi: "ईमेल मिळाला: "
    },
    "ui-gotText": {
      english: "Got: \"",
      hindi:   "मिला: \"",
      marathi: "मिळाले: \""
    },
    "ui-notRecognised": {
      english: "Option not recognised. Please say one of: ",
      hindi:   "विकल्प पहचाना नहीं गया। कृपया इनमें से एक बोलें: ",
      marathi: "पर्याय ओळखला नाही. कृपया यापैकी एक सांगा: "
    },
    "ui-notRecognisedBar": {
      english: "Not recognised. Say: ",
      hindi:   "पहचाना नहीं। बोलें: ",
      marathi: "ओळखले नाही. सांगा: "
    },
    "ui-selected": {
      english: "Selected: \"",
      hindi:   "चुना गया: \"",
      marathi: "निवडले: \""
    },
    "ui-listening": {
      english: "Listening... ",
      hindi:   "सुन रहा हूँ... ",
      marathi: "ऐकत आहे... "
    }
  };

  /* ---- Multilingual option labels for selection fields ----
     These are merged into the existing English labels arrays so
     matchOption() recognises spoken Hindi/Marathi words too.
     Internal option VALUES are never changed.                    */
  var OPTION_LABELS_I18N = {
    /* wardConfirm */
    "wardConfirm-yes": { hindi: ["हाँ","हां","जी हाँ","सही","बिल्कुल"], marathi: ["हो","होय","बरोबर","हाँ"] },
    "wardConfirm-no":  { hindi: ["नहीं","नही","ना","नहीं है"],           marathi: ["नाही","नको","नाहीये"] },
    /* residentType */
    "residentType-resident":      { hindi: ["निवासी","यहाँ रहता हूँ","रहता हूँ"],                    marathi: ["रहिवासी","येथे राहतो","राहतो"] },
    "residentType-working":       { hindi: ["यहाँ काम करता हूँ","काम करता हूँ","कर्मचारी"],          marathi: ["येथे काम करतो","काम करतो","कर्मचारी"] },
    "residentType-business":      { hindi: ["व्यवसाय","व्यवसाय मालिक","दुकानदार","उद्यमी"],          marathi: ["व्यवसाय","व्यवसाय मालक","दुकानदार","उद्योजक"] },
    "residentType-property_rent": { hindi: ["संपत्ति","संपत्ति मालिक","किराया","मकान मालिक"],        marathi: ["मालमत्ता","मालमत्ता मालक","भाडे","जमीनदार"] },
    "residentType-other":         { hindi: ["अन्य","दूसरा","कुछ और"],                                 marathi: ["इतर","वेगळे","दुसरे"] },
    /* isVoter */
    "isVoter-yes": { hindi: ["हाँ","हां","जी हाँ","पंजीकृत","मतदाता हूँ"],  marathi: ["हो","होय","नोंदणीकृत","मतदार आहे"] },
    "isVoter-no":  { hindi: ["नहीं","नही","पंजीकृत नहीं","मतदाता नहीं"],   marathi: ["नाही","नोंदणी नाही","मतदार नाही"] },
    /* gender (shared by c-gender and p-gender) */
    "gender-male":       { hindi: ["पुरुष","मर्द","लड़का"],                                    marathi: ["पुरुष","मुलगा","नर"] },
    "gender-female":     { hindi: ["महिला","औरत","लड़की","स्त्री"],                            marathi: ["महिला","स्त्री","मुलगी"] },
    "gender-other":      { hindi: ["अन्य","ट्रांसजेंडर","दूसरा"],                              marathi: ["इतर","तृतीयपंथी","वेगळे"] },
    "gender-prefer_not": { hindi: ["बताना नहीं चाहते","नहीं बताऊंगा","प्राइवेट"],             marathi: ["सांगणे पसंत नाही","सांगणार नाही","खाजगी"] },
    /* p-jurisdiction */
    "jurisdiction-municipal":     { hindi: ["नगरपालिका","नगर निगम","शहर"],                    marathi: ["महानगरपालिका","नगरपालिका","शहर"] },
    "jurisdiction-legislative":   { hindi: ["विधान सभा","विधानसभा","राज्य","विधायक"],         marathi: ["विधानसभा","राज्य","आमदार"] },
    "jurisdiction-parliamentary": { hindi: ["संसदीय","संसद","सांसद","लोक सभा","राज्य सभा"],  marathi: ["संसदीय","संसद","खासदार","लोकसभा","राज्यसभा"] },
    /* p-position */
    "position-mla":        { hindi: ["विधायक","विधान सभा सदस्य"],                             marathi: ["आमदार","विधानसभा सदस्य"] },
    "position-mp":         { hindi: ["सांसद","संसद सदस्य"],                                   marathi: ["खासदार","संसद सदस्य"] },
    "position-corporator": { hindi: ["कॉर्पोरेटर","निगम सदस्य","वार्ड सदस्य"],               marathi: ["नगरसेवक","महापालिका सदस्य","वॉर्ड सदस्य"] },
    "position-mayor":      { hindi: ["महापौर","मेयर"],                                         marathi: ["महापौर","मेयर"] },
    "position-sarpanch":   { hindi: ["सरपंच","ग्राम प्रधान","ग्राम पंचायत प्रमुख"],          marathi: ["सरपंच","ग्रामप्रमुख","ग्रामपंचायत प्रमुख"] },
    "position-councillor": { hindi: ["पार्षद","नगर पार्षद","काउंसिलर"],                       marathi: ["नगरसेवक","काउन्सिलर","वॉर्ड नगरसेवक"] }
  };

  /* Merge multilingual labels into field option arrays at startup */
  function mergeI18nLabels() {
    function findField(arr, id) {
      for (var i = 0; i < arr.length; i++) { if (arr[i].id === id) return arr[i]; }
      return null;
    }
    function merge(options, prefix) {
      options.forEach(function(opt) {
        var key = prefix + "-" + opt.value;
        var extra = OPTION_LABELS_I18N[key];
        if (!extra) return;
        if (extra.hindi)   opt.labels = opt.labels.concat(extra.hindi);
        if (extra.marathi) opt.labels = opt.labels.concat(extra.marathi);
      });
    }
    var wc = findField(C1, "wardConfirm");   if (wc) merge(wc.options, "wardConfirm");
    var rt = findField(C1, "residentType");  if (rt) merge(rt.options, "residentType");
    var iv = findField(C1, "isVoter");       if (iv) merge(iv.options, "isVoter");
    var cg = findField(C2, "c-gender");      if (cg) merge(cg.options, "gender");
    var pg = findField(P1, "p-gender");      if (pg) merge(pg.options, "gender");
    var pj = findField(P2, "p-jurisdiction");if (pj) merge(pj.options, "jurisdiction");
    var pp = findField(P2, "p-position");    if (pp) merge(pp.options, "position");
  }
  mergeI18nLabels();

  /* ---- Helpers ---- */

  /* Return the localised prompt for a field (falls back to English) */
  function getPrompt(field) {
    var key = field.id || field.name || "";
    var entry = PROMPTS[key];
    if (!entry) return field.prompt; /* fallback to hardcoded English */
    return entry[activeLang] || entry.english || field.prompt;
  }

  /* Return a localised UI string */
  function ui(key) {
    var entry = PROMPTS[key];
    if (!entry) return "";
    if (Array.isArray(entry[activeLang])) return entry[activeLang];
    return entry[activeLang] || entry.english || "";
  }

  /* ================================================================
     STATE
  ================================================================ */
  var guideActive = false;
  var guideFields = [];
  var guideIndex  = 0;
  var guideRecog  = null;
  var guideBar    = null;
  var guideTimer  = null;
  var phoneBuf    = "";
  var activeLang  = "english"; /* set during language-selection step */
  var langChosen  = false;     /* true once user has spoken a language choice */

  /* ================================================================
     PUBLIC API
  ================================================================ */
  window.VoiceGuide = {
    start:    startGuide,
    stop:     stopGuide,
    isActive: function() { return guideActive; }
  };

  /* Expose active language so app.js can localise visible error text.
     Returns "english" | "hindi" | "marathi".
     Safe to call at any time — always returns a valid key.           */
  window.voiceGetLang = function() {
    return activeLang || "english";
  };

  /* Reset the active language — called by app.js when the form is fully
     reset (e.g. after successful registration or role change).          */
  window.voiceResetLang = function() {
    activeLang = "english";
    langChosen = false;
  };

  /* ================================================================
     STOP ON PAGE NAVIGATION
     Hook into app.js nextStep / prevStep so mic stops when user
     moves between steps or leaves the registration form.
  ================================================================ */
  document.addEventListener("click", function(e) {
    if (!guideActive) return;
    var btn = e.target.closest("button");
    if (!btn) return;
    var onclick = btn.getAttribute("onclick") || "";
    /* Stop guide if user clicks Next, Back, Login, or Change Role */
    if (onclick.indexOf("nextStep") !== -1 ||
        onclick.indexOf("prevStep") !== -1 ||
        onclick.indexOf("showLogin") !== -1 ||
        onclick.indexOf("showRegister") !== -1 ||
        btn.classList.contains("role-banner-change")) {
      stopGuide();
    }
  });

  /* ================================================================
     INIT
  ================================================================ */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    injectGuideButtons();
    injectSelectionMics();
  }

  /* ================================================================
     INJECT GUIDE BUTTONS (after step-heading in each panel)
  ================================================================ */
  function injectGuideButtons() {
    var panels = [
      { id:"step1-citizen",    key:"c1" },
      { id:"step2-citizen",    key:"c2" },
      { id:"step1-politician", key:"p1" },
      { id:"step2-politician", key:"p2" }
    ];
    panels.forEach(function(p) {
      var panel = document.getElementById(p.id);
      if (!panel || panel.querySelector(".vg-start-btn")) return;
      var btn = document.createElement("button");
      btn.type      = "button";
      btn.className = "vg-start-btn";
      btn.innerHTML = "&#x1F399;&#xFE0F; Start Voice Guide";
      btn.setAttribute("aria-label", "Start voice guide for this step");
      btn.addEventListener("click", function() { startGuide(p.key); });
      var heading = panel.querySelector(".step-heading");
      if (heading) {
        panel.insertBefore(btn, heading.nextElementSibling || null);
      } else {
        panel.insertBefore(btn, panel.firstChild);
      }
    });
  }

  /* ================================================================
     INJECT STANDALONE MIC BUTTONS
     Text inputs  → injectTextMic  (speak to fill)
     Radio groups → injectRadioMic (speak to select)
     Selects      → injectSelectMic (speak to select)
     Email inputs → injectEmailMic  (speak with @ / . parsing)
  ================================================================ */
  function injectSelectionMics() {

    /* ---- CITIZEN STEP 1 — text inputs ---- */
    injectTextMic("c-firstName",    "Speak First Name");
    injectTextMic("c-middleName",   "Speak Middle / Father Name");
    injectTextMic("c-lastName",     "Speak Last Name");
    injectTextMic("c-otherResident","Speak residency description");

    /* Citizen Step 1 — Ward Yes/No radio */
    injectRadioMic("wardConfirm", [
      { value:"yes", labels:["yes","yeah","yep","correct","right","haan","ha"] },
      { value:"no",  labels:["no","nope","nahi","na","not"] }
    ], "Say Yes or No");

    /* Citizen Step 1 — Residency Type radio */
    injectRadioMic("residentType", [
      { value:"resident",      labels:["resident","residing","live here","living here","i live"] },
      { value:"working",       labels:["working","working here","work here","employee","i work"] },
      { value:"business",      labels:["business","business owner","shop owner","entrepreneur"] },
      { value:"property_rent", labels:["property","property owner","rent","landlord","owner"] },
      { value:"other",         labels:["other","others","different","else"] }
    ], "Say your residency type");

    /* Citizen Step 1 — Registered Voter */
    injectRadioMic("isVoter", [
      { value:"yes", labels:["yes","yeah","yep","correct","haan","ha","i am","registered"] },
      { value:"no",  labels:["no","nope","nahi","na","not","i am not","not registered"] }
    ], "Say Yes or No — registered voter?");

    /* ---- CITIZEN STEP 2 — text / phone inputs ---- */
    injectTextMic("c-mobile",   "Speak 10-digit Mobile Number");
    injectTextMic("c-whatsapp", "Speak WhatsApp Number or say same as mobile");

    /* Citizen Step 2 — Gender select */
    injectSelectMic("c-gender", [
      { value:"male",       labels:["male","mail","man","boy","he","him","males","i am male"] },
      { value:"female",     labels:["female","females","woman","women","girl","she","her","lady","femail","famale"] },
      { value:"other",      labels:["other","others","non binary","nonbinary","transgender","trans"] },
      { value:"prefer_not", labels:["prefer not","prefer not to say","no answer","private","skip","rather not"] }
    ], "Say: Male, Female, Other, or Prefer not to say");

    /* Citizen Step 2 — Email */
    injectEmailMic("c-email", "Say email: e.g. rahul at gmail dot com");

    /* ---- POLITICIAN STEP 1 — text / phone inputs ---- */
    injectTextMic("p-firstName",  "Speak First Name");
    injectTextMic("p-middleName", "Speak Middle / Father Name");
    injectTextMic("p-lastName",   "Speak Last Name");
    injectTextMic("p-age",        "Speak Age in years");

    /* Politician Step 1 — Gender select */
    injectSelectMic("p-gender", [
      { value:"male",       labels:["male","mail","man","boy","he","him","males","i am male"] },
      { value:"female",     labels:["female","females","woman","women","girl","she","her","lady","femail","famale"] },
      { value:"other",      labels:["other","others","non binary","nonbinary","transgender","trans"] },
      { value:"prefer_not", labels:["prefer not","prefer not to say","no answer","private","skip","rather not"] }
    ], "Say: Male, Female, Other, or Prefer not to say");

    injectTextMic("p-mobile",     "Speak 10-digit Mobile Number");
    injectTextMic("p-address",    "Speak full Address");

    /* Politician Step 1 — Email */
    injectEmailMic("p-email", "Say email: e.g. rahul at gmail dot com");

    /* ---- POLITICIAN STEP 2 — text inputs ---- */
    injectTextMic("p-wardNumber", "Speak Ward or Constituency Number");
    injectTextMic("p-wardName",   "Speak Ward or Constituency Name");

    /* Politician Step 2 — Jurisdiction select */
    injectSelectMic("p-jurisdiction", [
      { value:"municipal",     labels:["municipal","municipality","municipal corporation","city"] },
      { value:"legislative",   labels:["legislative","legislative assembly","assembly","state"] },
      { value:"parliamentary", labels:["parliamentary","parliament","mp","lok sabha"] }
    ], "Say: Municipal, Legislative Assembly, or Parliamentary");

    /* Politician Step 2 — Position select */
    injectSelectMic("p-position", [
      { value:"mla",        labels:["mla","member of legislative assembly"] },
      { value:"mp",         labels:["mp","member of parliament","parliament member"] },
      { value:"corporator", labels:["corporator","corporation member","ward member"] },
      { value:"mayor",      labels:["mayor","city mayor"] },
      { value:"sarpanch",   labels:["sarpanch","village head","gram panchayat head"] },
      { value:"councillor", labels:["councillor","councilor","council member"] }
    ], "Say: MLA, MP, Corporator, Mayor, Sarpanch, or Councillor");
  }

  /* ---- Inject mic after a radio group ---- */
  function injectRadioMic(radioName, options, hint) {
    var first = document.querySelector("input[name=\"" + radioName + "\"]");
    if (!first) return;
    var rg = first.closest(".radio-group");
    if (!rg) return;
    if (rg.parentElement.querySelector(".vs-mic-btn[data-group=\"" + radioName + "\"]")) return;
    var btn = makeMicBtn(hint, radioName);
    btn.addEventListener("click", function() {
      runSelectionRecog(btn, options, function(matched) {
        if (!matched) return;
        var radio = document.querySelector("input[name=\"" + radioName + "\"][value=\"" + matched.value + "\"]");
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event("change", { bubbles:true }));
          if (radio.onchange) radio.onchange.call(radio);
          flashRadio(radio);
        }
      });
    });
    rg.parentElement.insertBefore(btn, rg.nextSibling);
  }

  /* ---- Inject mic after a <select> ---- */
  function injectSelectMic(selectId, options, hint) {
    var sel = document.getElementById(selectId);
    if (!sel) return;
    if (document.querySelector(".vs-mic-btn[data-group=\"" + selectId + "\"]")) return;
    var btn = makeMicBtn(hint, selectId);
    btn.addEventListener("click", function() {
      runSelectionRecog(btn, options, function(matched) {
        if (!matched) return;
        sel.value = matched.value;
        sel.dispatchEvent(new Event("change", { bubbles:true }));
        flashSuccess(sel);
      });
    });
    /* If inside form-row-two grid, insert after the grid row */
    var fg      = sel.closest(".form-group");
    var gridRow = fg && fg.closest(".form-row-two");
    if (gridRow) {
      gridRow.parentNode.insertBefore(btn, gridRow.nextElementSibling || null);
    } else if (fg) {
      fg.appendChild(btn);
    } else {
      sel.parentElement.appendChild(btn);
    }
  }

  /* ---- Inject mic button for a plain text / tel input ---- */
  function injectTextMic(inputId, hint) {
    var inp = document.getElementById(inputId);
    if (!inp) return;
    if (document.querySelector(".vs-mic-btn[data-group=\"" + inputId + "\"]")) return;
    var btn = makeMicBtn(hint, inputId);
    btn.addEventListener("click", function() {
      runTextRecog(btn, inp);
    });
    var fg = inp.closest(".form-group");
    /* If inside a form-row-two grid cell, append inside the form-group (not after the grid) */
    if (fg) fg.appendChild(btn);
    else inp.parentElement.appendChild(btn);
  }

  /* ---- Inject email mic button after the email input ---- */
  function injectEmailMic(inputId, hint) {
    var inp = document.getElementById(inputId);
    if (!inp) return;
    if (document.querySelector(".vs-mic-btn[data-group=\"" + inputId + "\"]")) return;
    var btn = makeMicBtn(hint, inputId);
    btn.addEventListener("click", function() {
      runEmailRecog(btn, inp);
    });
    var fg = inp.closest(".form-group");
    if (fg) fg.appendChild(btn);
    else inp.parentElement.appendChild(btn);
  }

  /* ---- Create a mic pill button ---- */
  function makeMicBtn(hint, groupId) {
    var btn = document.createElement("button");
    btn.type      = "button";
    btn.className = "vs-mic-btn";
    btn.setAttribute("data-group", groupId);
    btn.setAttribute("title", hint);
    btn.setAttribute("aria-label", "Voice input: " + hint);
    btn.innerHTML =
      "<span class=\"vs-mic-icon\">&#x1F399;&#xFE0F;</span>" +
      "<span class=\"vs-mic-label\">" + hint + "</span>" +
      "<span class=\"vs-mic-status\"></span>";
    return btn;
  }


  /* ================================================================
     GUIDE FLOW
  ================================================================ */

  function startGuide(key) {
    if (guideActive) stopGuide();
    var fields = STEP_FIELDS[key];
    if (!fields) return;

    guideActive = true;
    createGuideBar();

    /* If the user already chose a language earlier in this session,
       skip the language-selection step and go straight to the fields. */
    if (langChosen) {
      updateBar(LANG_CONFIG[activeLang].label + " — Starting guide", "listening");
      beginGuide(fields);
      return;
    }

    /* First guide start in this session — ask for language */
    activeLang = "english";
    updateBar("Select language: English, Hindi, or Marathi", "listening");

    /* Ask language choice first, then start the real guide */
    askLanguage(key, fields);
  }

  /* ----------------------------------------------------------------
     LANGUAGE SELECTION STEP
     Always spoken in English (en-US) regardless of future choice.
     Listens with en-US so "English / Hindi / Marathi" are recognised
     reliably before the user's preferred language is known.
  ---------------------------------------------------------------- */
  function askLanguage(key, fields) {
    var question = "Which language do you want for registration? Say English, Hindi, or Marathi.";
    updateBar(question, "listening");

    /* Speak the question in English */
    ttsRaw(question, "en-IN", function() {
      if (!guideActive) return;
      listenLanguageChoice(key, fields, 1);
    });
  }

  function listenLanguageChoice(key, fields, attempt) {
    if (!guideActive) return;
    killRecog();

    var recog = new SR();
    recog.lang            = "en-US"; /* always en-US for language name recognition */
    recog.continuous      = false;
    recog.interimResults  = false;
    recog.maxAlternatives = 5;
    guideRecog = recog;

    /* 15-second timeout — re-ask if no answer */
    var langTimer = setTimeout(function() {
      if (!guideActive) return;
      killRecog();
      if (attempt >= 3) {
        /* After 3 failed attempts fall back to English silently */
        activeLang = "english";
        langChosen = true;
        beginGuide(fields);
        return;
      }
      var retry = "I did not hear you. Please say English, Hindi, or Marathi.";
      ttsRaw(retry, "en-IN", function() {
        if (guideActive) listenLanguageChoice(key, fields, attempt + 1);
      });
    }, 15000);

    recog.onresult = function(ev) {
      clearTimeout(langTimer);
      var alts = [];
      for (var i = 0; i < ev.results[0].length; i++) {
        alts.push(ev.results[0][i].transcript.trim());
      }

      var matched = matchLangOption(alts);
      if (!matched) {
        /* Not recognised — ask again */
        var retry = "Sorry, I did not understand. Please say English, Hindi, or Marathi.";
        ttsRaw(retry, "en-IN", function() {
          if (guideActive) listenLanguageChoice(key, fields, attempt + 1);
        });
        return;
      }

      activeLang = matched.key;
      langChosen = true;
      var cfg    = LANG_CONFIG[activeLang];

      /* Confirm the choice in the selected language */
      var confirmMsg = {
        english: "Language set to English. Starting registration.",
        hindi:   "\u092D\u093E\u0937\u093E \u0939\u093F\u0902\u062C\u0940 \u0938\u0947\u091F \u0939\u0941\u0908\u0964 \u092A\u0902\u091C\u0940\u0915\u0930\u0923 \u0936\u0941\u0930\u0942 \u0939\u094B \u0930\u0939\u093E \u0939\u0948\u0964",
        marathi: "\u092D\u093E\u0937\u093E \u092E\u0930\u093E\u0920\u0940 \u0938\u0947\u091F \u0915\u0947\u0932\u0940\u0964 \u0928\u094B\u0902\u0926\u0923\u0940 \u0938\u0941\u0930\u0942 \u0939\u094B\u0924 \u0906\u0939\u0947\u0964"
      }[activeLang];

      updateBar(cfg.label + " \u2014 " + confirmMsg, "success");

      ttsRaw(confirmMsg, cfg.ttsLang, function() {
        if (guideActive) beginGuide(fields);
      });
    };

    recog.onerror = function(ev) {
      clearTimeout(langTimer);
      if (ev.error === "no-speech") {
        if (attempt >= 3) { activeLang = "english"; langChosen = true; beginGuide(fields); return; }
        var retry = "I did not hear you. Please say English, Hindi, or Marathi.";
        ttsRaw(retry, "en-IN", function() {
          if (guideActive) listenLanguageChoice(key, fields, attempt + 1);
        });
      } else if (ev.error !== "aborted") {
        clearTimeout(langTimer);
        /* Mic error — fall back to English and continue */
        activeLang = "english";
        langChosen = true;
        beginGuide(fields);
      }
    };

    recog.onend = function() { guideRecog = null; };

    try {
      recog.start();
    } catch (e) {
      clearTimeout(langTimer);
      console.warn("[VoiceGuide] lang recog start failed:", e);
      activeLang = "english";
      langChosen = true;
      beginGuide(fields);
    }
  }

  /* Match a spoken transcript against the language options */
  function matchLangOption(transcripts) {
    var spoken = transcripts.map(function(t) { return t.toLowerCase().trim(); });
    for (var s = 0; s < spoken.length; s++) {
      for (var o = 0; o < LANG_OPTIONS.length; o++) {
        for (var l = 0; l < LANG_OPTIONS[o].labels.length; l++) {
          var lbl = LANG_OPTIONS[o].labels[l].toLowerCase();
          if (spoken[s] === lbl || spoken[s].indexOf(lbl) !== -1 || lbl.indexOf(spoken[s]) !== -1) {
            return LANG_OPTIONS[o];
          }
        }
      }
    }
    return null;
  }

  /* Called after language is confirmed — runs the actual registration guide */
  function beginGuide(fields) {
    guideFields = fields;
    guideIndex  = 0;
    phoneBuf    = "";
    promptNext();
  }

  function stopGuide() {
    guideActive = false;
    clearTimer();
    killRecog();
    cancelSpeech();
    removeGuideBar();
    clearHighlight();
    guideFields = [];
    guideIndex  = 0;
    phoneBuf    = "";
    /* NOTE: activeLang is intentionally NOT reset here.
       The chosen language must persist across all steps of the registration
       so that validation errors remain in the selected language even after
       the guide stops between steps. activeLang is only reset when a brand
       new guide session starts (see startGuide) or on full form reset. */
  }

  function promptNext() {
    if (!guideActive) return;

    /* skip conditional fields that don't apply */
    while (guideIndex < guideFields.length) {
      var f = guideFields[guideIndex];
      if (f.conditional && !f.conditional()) { guideIndex++; continue; }
      break;
    }

    if (guideIndex >= guideFields.length) {
      tts(ui("ui-allDone"), function() {
        updateBar(ui("ui-allDoneBar"), "done");
        stopGuide();
      });
      return;
    }

    var field = guideFields[guideIndex];
    var prompt = getPrompt(field);
    highlightField(field);
    updateBar(prompt, "listening");

    /* 250ms gap — ensures previous recognition is fully torn down
       before TTS starts (prevents Chrome from dropping the utterance) */
    setTimeout(function() {
      if (!guideActive) return;
      tts(prompt, function() {
        if (!guideActive) return;
        listenField(field);
      });
    }, 250);
  }

  function advance() {
    guideIndex++;
    promptNext();
  }

  /* ================================================================
     15-SECOND TIMEOUT
  ================================================================ */

  function startTimer(field) {
    clearTimer();
    guideTimer = setTimeout(function() {
      if (!guideActive) return;
      killRecog();
      tts(ui("ui-noHear") + getPrompt(field), function() {
        if (!guideActive) return;
        updateBar(ui("ui-noAnswer"), "warn");
        listenField(field);
      });
    }, 15000);
  }

  function clearTimer() {
    if (guideTimer) { clearTimeout(guideTimer); guideTimer = null; }
  }

  /* ================================================================
     LISTEN FOR A FIELD
  ================================================================ */

  function listenField(field) {
    if (!guideActive) return;

    /* Skip fields (date picker etc.) — auto-advance after 3.5s */
    if (field.type === "skip") {
      updateBar(field.prompt, "info");
      startTimer(field);
      setTimeout(function() {
        clearTimer();
        if (guideActive) advance();
      }, 3500);
      return;
    }

    /* Phone fields use continuous mode to accumulate digits */
    if (field.type === "phone") {
      listenPhone(field);
      return;
    }

    /* Email fields use a dedicated handler */
    if (field.type === "email") {
      listenEmail(field);
      return;
    }

    /* Radio / Select / Text */
    killRecog();
    var isSel = (field.type === "radio" || field.type === "select");
    var recog = new SR();
    recog.lang            = LANG_CONFIG[activeLang].srLang;
    recog.continuous      = false;
    recog.interimResults  = false;
    recog.maxAlternatives = isSel ? 5 : 3;
    guideRecog = recog;

    /* Grammar hints for selection fields */
    if (isSel && field.options) {
      try {
        var GL = window.SpeechGrammarList || window.webkitSpeechGrammarList;
        if (GL) {
          var words = field.options.reduce(function(a, o) { return a.concat(o.labels); }, []);
          var g = "#JSGF V1.0; grammar o; public <o> = " + words.join(" | ") + ";";
          var list = new GL();
          list.addFromString(g, 1);
          recog.grammars = list;
        }
      } catch (e) { /* grammar hints not critical */ }
    }

    recog.onresult = function(ev) {
      clearTimer();
      var alts = [];
      for (var i = 0; i < ev.results[0].length; i++) {
        alts.push(ev.results[0][i].transcript.trim());
      }
      if (field.type === "text")        handleText(field, alts[0]);
      else if (field.type === "radio")  handleSelection(field, alts, "radio");
      else if (field.type === "select") handleSelection(field, alts, "select");
    };

    recog.onerror = function(ev) {
      clearTimer();
      if (ev.error === "no-speech") {
        tts(ui("ui-noHear") + getPrompt(field), function() {
          if (guideActive) listenField(field);
        });
      } else if (ev.error !== "aborted") {
        updateBar(ui("ui-micError"), "error");
        guideIndex++;
        setTimeout(function() { if (guideActive) promptNext(); }, 2000);
      }
    };

    recog.onend = function() { guideRecog = null; };

    try {
      recog.start();
      updateBar(ui("ui-listening") + getPrompt(field), "listening");
      startTimer(field);
    } catch (e) { console.warn("[VoiceGuide]", e); }
  }

  /* ================================================================
     PHONE FIELD — continuous, accumulates 10 digits
  ================================================================ */

  function listenPhone(field) {
    if (!guideActive) return;
    killRecog();
    phoneBuf = "";

    if (field.sameAs) {
      updateBar(getPrompt(field), "listening");
    } else {
      updateBar(ui("ui-listeningDigits") + getPrompt(field), "listening");
    }

    var recog = new SR();
    recog.lang            = LANG_CONFIG[activeLang].srLang;
    recog.continuous      = true;
    recog.interimResults  = true;
    recog.maxAlternatives = 1;
    guideRecog = recog;

    recog.onresult = function(ev) {
      clearTimer();
      for (var i = ev.resultIndex; i < ev.results.length; i++) {
        var t = ev.results[i][0].transcript.trim().toLowerCase();

        /* Same-as shortcut — check localised words */
        if (field.sameAs) {
          var sameWords = ui("ui-sameWords"); /* returns array for activeLang */
          for (var s = 0; s < sameWords.length; s++) {
            if (t === sameWords[s] || t.indexOf(sameWords[s]) !== -1) {
              var cb = document.getElementById(field.sameAs.checkboxId);
              if (cb) {
                cb.checked = true;
                if (typeof syncWhatsApp === "function") syncWhatsApp(cb);
              }
              killRecog();
              clearTimer();
              updateBar(ui("ui-sameAsMobile"), "success");
              setTimeout(advance, 900);
              return;
            }
          }
        }

        /* Accumulate digits from final results */
        if (ev.results[i].isFinal) {
          var digits = spokenToDigits(t);
          phoneBuf += digits;

          if (phoneBuf.length >= 10) {
            phoneBuf = phoneBuf.slice(0, 10);
            killRecog();
            clearTimer();
            var inp = document.getElementById(field.id);
            if (inp) {
              inp.value = phoneBuf;
              inp.dispatchEvent(new Event("input",  { bubbles: true }));
              inp.dispatchEvent(new Event("change", { bubbles: true }));
              flashSuccess(inp);
            }
            updateBar(ui("ui-gotPhone") + phoneBuf, "success");
            phoneBuf = "";
            setTimeout(advance, 900);
          } else {
            updateBar(phoneBuf.length + ui("ui-gotDigits") + phoneBuf + ui("ui-keepGoing"), "listening");
            startTimer(field); /* reset 15s after each partial */
          }
        }
      }
    };

    recog.onerror = function(ev) {
      clearTimer();
      if (ev.error === "no-speech") {
        phoneBuf = "";
        tts(ui("ui-noHear") + getPrompt(field), function() {
          if (guideActive) listenPhone(field);
        });
      } else if (ev.error !== "aborted") {
        updateBar(ui("ui-micError"), "error");
        guideIndex++;
        setTimeout(function() { if (guideActive) promptNext(); }, 2000);
      }
    };

    recog.onend = function() { guideRecog = null; };

    try {
      recog.start();
      startTimer(field);
    } catch (e) { console.warn("[VoiceGuide]", e); }
  }

  /* ================================================================
     EMAIL FIELD — single utterance, parse spoken symbols
  ================================================================ */

  function listenEmail(field) {
    if (!guideActive) return;
    killRecog();
    updateBar(ui("ui-listeningEmail"), "listening");

    var recog = new SR();
    /* Email addresses are always Latin characters — force en-IN regardless
       of the active language so the recogniser returns ASCII text.
       The user can still say symbol words in Hindi/Marathi (e.g. "डॉट",
       "एट") — parseEmail handles those translations.                    */
    recog.lang            = "en-IN";
    recog.continuous      = false;
    recog.interimResults  = false;
    recog.maxAlternatives = 3;
    guideRecog = recog;

    recog.onresult = function(ev) {
      clearTimer();
      var transcript = ev.results[0][0].transcript.trim();
      var email = parseEmail(transcript);
      var inp = document.getElementById(field.id);
      if (inp) {
        inp.value = email;
        inp.dispatchEvent(new Event("input",  { bubbles: true }));
        inp.dispatchEvent(new Event("change", { bubbles: true }));
        flashSuccess(inp);
      }
      updateBar(ui("ui-gotEmail") + email, "success");
      setTimeout(advance, 900);
    };

    recog.onerror = function(ev) {
      clearTimer();
      if (ev.error === "no-speech") {
        tts(ui("ui-noHear") + getPrompt(field), function() {
          if (guideActive) listenEmail(field);
        });
      } else if (ev.error !== "aborted") {
        updateBar(ui("ui-micError"), "error");
        guideIndex++;
        setTimeout(function() { if (guideActive) promptNext(); }, 2000);
      }
    };

    recog.onend = function() { guideRecog = null; };

    try {
      recog.start();
      /* Email gets 20 seconds — longer phrase */
      clearTimer();
      guideTimer = setTimeout(function() {
        if (!guideActive) return;
        killRecog();
        tts(ui("ui-noHear") + getPrompt(field), function() {
          if (guideActive) listenEmail(field);
        });
      }, 20000);
    } catch (e) { console.warn("[VoiceGuide]", e); }
  }

  /* ================================================================
     TEXT RESULT
  ================================================================ */

  function handleText(field, transcript) {
    var inp = document.getElementById(field.id);
    if (!inp) { advance(); return; }

    /* Accept "skip" in any active language */
    var skipWord = ui("ui-skipWord");
    var t = transcript.toLowerCase().trim();
    if (t === "skip" || t === skipWord.toLowerCase()) {
      updateBar(ui("ui-skipped"), "info");
      setTimeout(advance, 800);
      return;
    }

    var val = cleanText(transcript, field.id);
    inp.value = val;
    inp.dispatchEvent(new Event("input",  { bubbles: true }));
    inp.dispatchEvent(new Event("change", { bubbles: true }));
    updateBar(ui("ui-gotText") + val + "\"", "success");
    flashSuccess(inp);
    setTimeout(advance, 900);
  }

  /* ================================================================
     SELECTION RESULT (radio / select)
  ================================================================ */

  function handleSelection(field, transcripts, type) {
    var matched = matchOption(field.options, transcripts);
    if (!matched) {
      var names = field.options.map(function(o) { return o.labels[0]; }).join(", ");
      tts(ui("ui-notRecognised") + names, function() {
        updateBar(ui("ui-notRecognisedBar") + names, "warn");
        if (guideActive) listenField(field);
      });
      return;
    }

    if (type === "radio") {
      var radio = document.querySelector(
        "input[name=\"" + field.name + "\"][value=\"" + matched.value + "\"]"
      );
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
        if (radio.onchange) radio.onchange.call(radio);
        flashRadio(radio);
      }
    } else {
      var sel = document.getElementById(field.id);
      if (sel) {
        sel.value = matched.value;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        flashSuccess(sel);
      }
    }

    updateBar(ui("ui-selected") + matched.labels[0] + "\"", "success");
    setTimeout(advance, 900);
  }

  /* ================================================================
     STANDALONE SELECTION MIC RECOGNITION
  ================================================================ */

  function runSelectionRecog(btn, options, onMatch) {
    if (btn.classList.contains("vs-active")) {
      stopBtnRecog(btn);
      return;
    }
    document.querySelectorAll(".vs-mic-btn.vs-active").forEach(function(b) {
      stopBtnRecog(b);
    });

    btn.classList.add("vs-active");
    setVsStatus(btn, "Listening\u2026");

    var recog = new SR();
    recog.lang            = LANG_CONFIG[activeLang].srLang;
    recog.continuous      = false;
    recog.interimResults  = false;
    recog.maxAlternatives = 5;
    btn._recog = recog;

    /* Grammar hints */
    try {
      var GL = window.SpeechGrammarList || window.webkitSpeechGrammarList;
      if (GL) {
        var words = options.reduce(function(a, o) { return a.concat(o.labels); }, []);
        var g = "#JSGF V1.0; grammar o; public <o> = " + words.join(" | ") + ";";
        var list = new GL();
        list.addFromString(g, 1);
        recog.grammars = list;
      }
    } catch (e) { /* not critical */ }

    var btnTimer = setTimeout(function() {
      stopBtnRecog(btn);
      setVsStatus(btn, "No answer. Try again.");
      setTimeout(function() { setVsStatus(btn, ""); }, 3000);
    }, 15000);

    recog.onresult = function(ev) {
      clearTimeout(btnTimer);
      var alts = [];
      for (var i = 0; i < ev.results[0].length; i++) {
        alts.push(ev.results[0][i].transcript.trim());
      }
      var matched = matchOption(options, alts);
      if (matched) {
        setVsStatus(btn, "\u2705 " + matched.labels[0]);
        onMatch(matched);
        setTimeout(function() { btn.classList.remove("vs-active"); setVsStatus(btn, ""); }, 2000);
      } else {
        var names = options.map(function(o) { return o.labels[0]; }).join(", ");
        setVsStatus(btn, "\u2753 Not recognised. Try: " + names);
        setTimeout(function() { btn.classList.remove("vs-active"); setVsStatus(btn, ""); }, 4000);
      }
    };

    recog.onerror = function(ev) {
      clearTimeout(btnTimer);
      if (ev.error !== "aborted") {
        setVsStatus(btn, ev.error === "no-speech" ? "No speech." : ev.error);
        setTimeout(function() { btn.classList.remove("vs-active"); setVsStatus(btn, ""); }, 3000);
      }
    };

    recog.onend = function() {
      clearTimeout(btnTimer);
      btn._recog = null;
      btn.classList.remove("vs-active");
    };

    try { recog.start(); } catch (e) { btn.classList.remove("vs-active"); }
  }

  /* ================================================================
     STANDALONE TEXT MIC RECOGNITION
     For plain text / tel / number inputs
  ================================================================ */

  function runTextRecog(btn, inp) {
    if (btn.classList.contains("vs-active")) {
      stopBtnRecog(btn);
      return;
    }
    document.querySelectorAll(".vs-mic-btn.vs-active").forEach(function(b) {
      stopBtnRecog(b);
    });

    btn.classList.add("vs-active");
    setVsStatus(btn, "Listening\u2026");

    var id    = inp.id;
    var isMob = (id === "c-mobile" || id === "p-mobile" || id === "c-whatsapp");

    var recog = new SR();
    recog.lang            = LANG_CONFIG[activeLang].srLang;
    recog.continuous      = isMob ? true : false;  /* phone: keep open for digits */
    recog.interimResults  = isMob ? true : false;
    recog.maxAlternatives = 1;
    btn._recog = recog;

    var phoneBuf = "";

    var btnTimer = setTimeout(function() {
      stopBtnRecog(btn);
      setVsStatus(btn, "No answer. Try again.");
      setTimeout(function() { setVsStatus(btn, ""); }, 3000);
    }, isMob ? 20000 : 15000);

    recog.onresult = function(ev) {
      clearTimeout(btnTimer);

      if (isMob) {
        /* Accumulate digits for phone fields */
        for (var i = ev.resultIndex; i < ev.results.length; i++) {
          var t = ev.results[i][0].transcript.trim().toLowerCase();

          /* Same-as shortcut for WhatsApp */
          if (id === "c-whatsapp") {
            var sameWords = ["same","same as","same as mobile","same number","copy","use same"];
            for (var s = 0; s < sameWords.length; s++) {
              if (t === sameWords[s] || t.indexOf(sameWords[s]) !== -1) {
                var mob = document.getElementById("c-mobile");
                if (mob && mob.value) {
                  var cb = document.getElementById("c-sameAsMobile");
                  if (cb) { cb.checked = true; if (typeof syncWhatsApp === "function") syncWhatsApp(cb); }
                  inp.value = mob.value;
                }
                stopBtnRecog(btn);
                setVsStatus(btn, "\u2705 Same as mobile");
                setTimeout(function() { setVsStatus(btn, ""); }, 2000);
                return;
              }
            }
          }

          if (ev.results[i].isFinal) {
            phoneBuf += spokenToDigits(t);
            if (phoneBuf.length >= 10) {
              phoneBuf = phoneBuf.slice(0, 10);
              inp.value = phoneBuf;
              inp.dispatchEvent(new Event("input",  { bubbles: true }));
              inp.dispatchEvent(new Event("change", { bubbles: true }));
              flashSuccess(inp);
              stopBtnRecog(btn);
              setVsStatus(btn, "\u2705 " + phoneBuf);
              setTimeout(function() { setVsStatus(btn, ""); }, 2000);
              return;
            } else {
              setVsStatus(btn, phoneBuf.length + "/10 digits: " + phoneBuf);
              /* Reset timer for next chunk */
              clearTimeout(btnTimer);
              btnTimer = setTimeout(function() {
                stopBtnRecog(btn);
                setVsStatus(btn, "No answer. Try again.");
                setTimeout(function() { setVsStatus(btn, ""); }, 3000);
              }, 15000);
            }
          }
        }
        return;
      }

      /* Non-phone text field */
      var transcript = ev.results[0][0].transcript.trim();
      var val = cleanTextVal(transcript, id);
      inp.value = val;
      inp.dispatchEvent(new Event("input",  { bubbles: true }));
      inp.dispatchEvent(new Event("change", { bubbles: true }));
      flashSuccess(inp);
      setVsStatus(btn, "\u2705 " + val);
      setTimeout(function() { btn.classList.remove("vs-active"); setVsStatus(btn, ""); }, 2000);
    };

    recog.onerror = function(ev) {
      clearTimeout(btnTimer);
      if (ev.error !== "aborted") {
        setVsStatus(btn, ev.error === "no-speech" ? "No speech." : ev.error);
        setTimeout(function() { btn.classList.remove("vs-active"); setVsStatus(btn, ""); }, 3000);
      }
    };

    recog.onend = function() {
      clearTimeout(btnTimer);
      btn._recog = null;
      if (!isMob) btn.classList.remove("vs-active");
    };

    try { recog.start(); } catch (e) { btn.classList.remove("vs-active"); }
  }

  /* Clean a spoken transcript for a given field ID (standalone mic buttons) */
  function cleanTextVal(text, id) {
    var t = text.trim();
    /* Age — spoken words → digits */
    if (id === "p-age") return spokenToDigits(t);
    /* Ward number — spoken words → digits, preserve alphanumeric codes */
    if (id === "p-wardNumber") {
      var digits = spokenToDigits(t);
      return digits.length > 0 ? t.toUpperCase().replace(/[^\dA-Z]/g, "") : t.toUpperCase();
    }
    t = t.charAt(0).toUpperCase() + t.slice(1);
    t = t.replace(/\.$/, "");
    return t;
  }

  /* ================================================================
     STANDALONE EMAIL MIC RECOGNITION
  ================================================================ */

  function runEmailRecog(btn, inp) {
    if (btn.classList.contains("vs-active")) {
      stopBtnRecog(btn);
      return;
    }
    document.querySelectorAll(".vs-mic-btn.vs-active").forEach(function(b) {
      stopBtnRecog(b);
    });

    btn.classList.add("vs-active");
    setVsStatus(btn, "Listening\u2026");

    var recog = new SR();
    /* Email addresses are always Latin — force en-IN so the recogniser
       returns ASCII text regardless of the active language.            */
    recog.lang            = "en-IN";
    recog.continuous      = false;
    recog.interimResults  = false;
    recog.maxAlternatives = 3;
    btn._recog = recog;

    var btnTimer = setTimeout(function() {
      stopBtnRecog(btn);
      setVsStatus(btn, "No answer. Try again.");
      setTimeout(function() { setVsStatus(btn, ""); }, 3000);
    }, 20000);

    recog.onresult = function(ev) {
      clearTimeout(btnTimer);
      var transcript = ev.results[0][0].transcript.trim();
      var email = parseEmail(transcript);
      inp.value = email;
      inp.dispatchEvent(new Event("input",  { bubbles: true }));
      inp.dispatchEvent(new Event("change", { bubbles: true }));
      flashSuccess(inp);
      setVsStatus(btn, "\u2705 " + email);
      setTimeout(function() { btn.classList.remove("vs-active"); setVsStatus(btn, ""); }, 2500);
    };

    recog.onerror = function(ev) {
      clearTimeout(btnTimer);
      if (ev.error !== "aborted") {
        setVsStatus(btn, ev.error === "no-speech" ? "No speech." : ev.error);
        setTimeout(function() { btn.classList.remove("vs-active"); setVsStatus(btn, ""); }, 3000);
      }
    };

    recog.onend = function() {
      clearTimeout(btnTimer);
      btn._recog = null;
      btn.classList.remove("vs-active");
    };

    try { recog.start(); } catch (e) { btn.classList.remove("vs-active"); }
  }

  function stopBtnRecog(btn) {
    if (btn._recog) { try { btn._recog.stop(); } catch (e) {} btn._recog = null; }
    btn.classList.remove("vs-active");
    setVsStatus(btn, "");
  }

  function setVsStatus(btn, text) {
    var s = btn.querySelector(".vs-mic-status");
    if (s) s.textContent = text;
  }

  /* ================================================================
     OPTION MATCHING — 4-pass priority
  ================================================================ */

  function matchOption(options, transcripts) {
    var spoken = transcripts.map(function(t) { return t.toLowerCase().trim(); });

    /* Pass 1 — exact */
    for (var s = 0; s < spoken.length; s++)
      for (var o = 0; o < options.length; o++)
        for (var l = 0; l < options[o].labels.length; l++)
          if (spoken[s] === options[o].labels[l].toLowerCase()) return options[o];

    /* Pass 2 — starts-with */
    for (var s = 0; s < spoken.length; s++)
      for (var o = 0; o < options.length; o++)
        for (var l = 0; l < options[o].labels.length; l++) {
          var lbl = options[o].labels[l].toLowerCase();
          if (spoken[s].indexOf(lbl) === 0 || lbl.indexOf(spoken[s]) === 0) return options[o];
        }

    /* Pass 3 — spoken contains label (label >= 4 chars) */
    for (var s = 0; s < spoken.length; s++)
      for (var o = 0; o < options.length; o++)
        for (var l = 0; l < options[o].labels.length; l++) {
          var lbl = options[o].labels[l].toLowerCase();
          if (lbl.length >= 4 && spoken[s].indexOf(lbl) !== -1) return options[o];
        }

    /* Pass 4 — label contains spoken (spoken >= 4 chars) */
    for (var s = 0; s < spoken.length; s++) {
      if (spoken[s].length < 4) continue;
      for (var o = 0; o < options.length; o++)
        for (var l = 0; l < options[o].labels.length; l++) {
          var lbl = options[o].labels[l].toLowerCase();
          if (lbl.indexOf(spoken[s]) !== -1) return options[o];
        }
    }

    return null;
  }

  /* ================================================================
     EMAIL PARSER — converts spoken words to valid English email format
     Handles English, Hindi, and Marathi spoken words.
     Recognition for email fields is always forced to en-IN (see
     listenEmail / runEmailRecog) so the transcript is mostly Latin,
     but users may still say symbol words in their chosen language.
  ================================================================ */

  function parseEmail(raw) {
    var t = raw.toLowerCase().trim();

    /* ---- Step 1: Normalise spoken symbol words → ASCII symbols ----
       Order matters: longer phrases before shorter ones to avoid
       partial matches (e.g. "at the rate" before "at").            */

    /* @ symbol — English */
    t = t.replace(/\bat the rate\b/g, "@");
    t = t.replace(/\bat\b/g,          "@");
    /* @ symbol — Hindi */
    t = t.replace(/\bएट\b/g,          "@");
    t = t.replace(/\bएट द रेट\b/g,    "@");
    t = t.replace(/\bऐट\b/g,          "@");
    /* @ symbol — Marathi */
    t = t.replace(/\bएट\b/g,          "@");   /* same as Hindi */

    /* . (dot) — English */
    t = t.replace(/\bdot\b/g,         ".");
    t = t.replace(/\bpoint\b/g,       ".");
    /* . (dot) — Hindi */
    t = t.replace(/\bडॉट\b/g,         ".");
    t = t.replace(/\bडोट\b/g,         ".");
    t = t.replace(/\bबिंदु\b/g,       ".");
    /* . (dot) — Marathi */
    t = t.replace(/\bडॉट\b/g,         ".");   /* same as Hindi */
    t = t.replace(/\bठिपका\b/g,       ".");

    /* _ (underscore) — all languages */
    t = t.replace(/\bunderscore\b/g,  "_");
    t = t.replace(/\bअंडरस्कोर\b/g,  "_");
    t = t.replace(/\bअंडरस्कोअर\b/g, "_");

    /* - (hyphen/dash) — all languages */
    t = t.replace(/\bhyphen\b/g,      "-");
    t = t.replace(/\bdash\b/g,        "-");
    t = t.replace(/\bहाइफन\b/g,       "-");
    t = t.replace(/\bडॅश\b/g,         "-");

    /* + (plus) — all languages */
    t = t.replace(/\bplus\b/g,        "+");
    t = t.replace(/\bप्लस\b/g,        "+");

    /* ---- Step 2: Transliterate Devanagari domain/name words ----
       When the recogniser returns Devanagari for common email parts,
       map them to their Latin equivalents.
       Only the most common patterns are covered — the recogniser
       should return Latin for most words when lang is en-IN.       */
    var DEVA_TO_LATIN = [
      /* Common domain names */
      ["जीमेल",    "gmail"],   ["गूगल",     "google"],
      ["याहू",     "yahoo"],   ["हॉटमेल",   "hotmail"],
      ["आउटलुक",   "outlook"], ["रेडिफ",    "rediff"],
      ["रेडिफमेल", "rediffmail"],
      /* Common TLDs */
      ["कॉम",      "com"],     ["इन",       "in"],
      ["ओआरजी",    "org"],     ["नेट",      "net"],
      ["एडु",      "edu"],     ["गव",       "gov"],
      /* Common name parts that may appear in email usernames */
      ["राहुल",    "rahul"],   ["अमित",     "amit"],
      ["सुनील",    "sunil"],   ["प्रिया",   "priya"],
      ["नेहा",     "neha"],    ["विकास",    "vikas"],
      ["अनिल",     "anil"],    ["सुमित",    "sumit"],
      ["रोहन",     "rohan"],   ["पूजा",     "pooja"],
      ["अजय",      "ajay"],    ["विजय",     "vijay"],
      ["संजय",     "sanjay"],  ["रमेश",     "ramesh"],
      ["सुरेश",    "suresh"],  ["महेश",     "mahesh"],
      ["दिनेश",    "dinesh"],  ["गणेश",     "ganesh"],
      ["राजेश",    "rajesh"],  ["नरेश",     "naresh"],
      ["मोहन",     "mohan"],   ["सोहन",     "sohan"],
      ["किरण",     "kiran"],   ["शिवम",     "shivam"],
      ["आकाश",     "aakash"],  ["दीपक",     "deepak"],
      ["अर्जुन",   "arjun"],   ["कार्तिक",  "kartik"],
      ["श्रेया",   "shreya"],  ["अनुष्का",  "anushka"],
      ["स्वाती",   "swati"],   ["रेखा",     "rekha"],
      ["लता",      "lata"],    ["गीता",     "geeta"],
      ["सीता",     "seeta"],   ["मीना",     "meena"],
      ["रीना",     "reena"],   ["शीला",     "sheela"],
      ["काव्या",   "kavya"],   ["दिव्या",   "divya"],
      ["तन्वी",    "tanvi"],   ["मयूर",     "mayur"],
      ["संदेश",    "sandesh"], ["प्रकाश",   "prakash"],
      ["सागर",     "sagar"],   ["समीर",     "sameer"],
      ["नितिन",    "nitin"],   ["सचिन",     "sachin"],
      ["विनोद",    "vinod"],   ["प्रमोद",   "pramod"],
      ["सुभाष",    "subhash"], ["मनोज",     "manoj"],
      ["राजू",     "raju"],    ["बाबू",     "babu"],
      ["शर्मा",    "sharma"],  ["वर्मा",    "verma"],
      ["पाटील",    "patil"],   ["जाधव",     "jadhav"],
      ["देशमुख",   "deshmukh"],["कुलकर्णी", "kulkarni"],
      ["जोशी",     "joshi"],   ["गुप्ता",   "gupta"],
      ["सिंह",     "singh"],   ["यादव",     "yadav"],
      ["पांडे",    "pandey"],  ["तिवारी",   "tiwari"],
      ["मिश्रा",   "mishra"],  ["चौधरी",    "chaudhary"],
      ["खान",      "khan"],    ["अली",      "ali"],
      ["शेख",      "shaikh"],  ["अंसारी",   "ansari"],
      ["नंबर",     "number"],  ["नं",       "no"],
      ["इन्फो",    "info"],    ["मेल",      "mail"]
    ];

    for (var i = 0; i < DEVA_TO_LATIN.length; i++) {
      var deva   = DEVA_TO_LATIN[i][0];
      var latin  = DEVA_TO_LATIN[i][1];
      var escaped = deva.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      t = t.replace(new RegExp(escaped, "g"), latin);
    }

    /* ---- Step 3: Remove all remaining spaces ---- */
    t = t.replace(/\s+/g, "");

    /* ---- Step 4: Fix double domain suffixes from speech recognition ---- */
    t = t.replace(/(gmail|yahoo|hotmail|outlook|rediff)\.com\.com/g, "$1.com");

    /* ---- Step 5: Strip any remaining non-email-safe characters ----
       Keep: a-z 0-9 @ . _ - +
       This removes any Devanagari characters that weren't transliterated. */
    t = t.replace(/[^a-z0-9@._\-+]/g, "");

    return t;
  }

  /* ================================================================
     TEXT CLEANER
  ================================================================ */

  /* ----------------------------------------------------------------
     SPOKEN DIGIT NORMALISER
     Converts spoken number words (English / Hindi / Marathi) into
     their numeric digit equivalents, then strips all non-digit chars.
     Called by every code path that needs digits from voice input:
       • listenPhone (guide flow)
       • runTextRecog (standalone mic, phone/age fields)
       • cleanText (guide flow text handler)
       • cleanTextVal (standalone mic text handler)
  ---------------------------------------------------------------- */
  var SPOKEN_DIGIT_MAP = [
    /* ---- English ---- */
    { word: "zero",      digit: "0" }, { word: "oh",         digit: "0" },
    { word: "one",       digit: "1" }, { word: "two",        digit: "2" },
    { word: "three",     digit: "3" }, { word: "four",       digit: "4" },
    { word: "five",      digit: "5" }, { word: "six",        digit: "6" },
    { word: "seven",     digit: "7" }, { word: "eight",      digit: "8" },
    { word: "nine",      digit: "9" },
    /* ---- Hindi ---- */
    { word: "शून्य",     digit: "0" }, { word: "सिफर",      digit: "0" },
    { word: "एक",        digit: "1" }, { word: "दो",         digit: "2" },
    { word: "तीन",       digit: "3" }, { word: "चार",        digit: "4" },
    { word: "पाँच",      digit: "5" }, { word: "पांच",       digit: "5" },
    { word: "छह",        digit: "6" }, { word: "छः",         digit: "6" },
    { word: "सात",       digit: "7" }, { word: "आठ",         digit: "8" },
    { word: "नौ",        digit: "9" },
    /* ---- Marathi ---- */
    { word: "शून्य",     digit: "0" }, { word: "सून्य",      digit: "0" },
    /* एक is shared with Hindi — already covered above */
    { word: "दोन",       digit: "2" }, { word: "तीन",        digit: "3" },
    { word: "चार",       digit: "4" }, { word: "पाच",        digit: "5" },
    { word: "सहा",       digit: "6" }, { word: "सात",        digit: "7" },
    { word: "आठ",        digit: "8" }, { word: "नऊ",         digit: "9" }
  ];

  function spokenToDigits(text) {
    var t = text.trim().toLowerCase();
    /* Replace each known spoken word with its digit.
       Sort by word length descending so longer words match first
       (e.g. "twenty" before "two") — future-proofing for multi-digit words. */
    var sorted = SPOKEN_DIGIT_MAP.slice().sort(function(a, b) {
      return b.word.length - a.word.length;
    });
    for (var i = 0; i < sorted.length; i++) {
      /* Use a global replace so repeated words all convert */
      var escaped = sorted[i].word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      t = t.replace(new RegExp(escaped, "g"), sorted[i].digit);
    }
    /* Strip everything that is not a digit */
    return t.replace(/\D/g, "");
  }

  function cleanText(text, id) {
    var t = text.trim();

    /* Phone/mobile — spoken words → digits, max 10 */
    if (id === "c-mobile" || id === "p-mobile" || id === "c-whatsapp") {
      return spokenToDigits(t).slice(0, 10);
    }

    /* Age — spoken words → digits */
    if (id === "p-age") {
      return spokenToDigits(t);
    }

    /* Ward number — may contain digits spoken as words */
    if (id === "p-wardNumber") {
      var digits = spokenToDigits(t);
      /* If the whole input resolved to digits, return uppercase of original
         (preserves alphanumeric ward codes like "23A") */
      return digits.length > 0 ? t.toUpperCase().replace(/[^\dA-Z]/g, "") : t.toUpperCase();
    }

    /* Default — capitalise first letter, strip trailing period */
    t = t.charAt(0).toUpperCase() + t.slice(1);
    t = t.replace(/\.$/, "");
    return t;
  }

  /* ================================================================
     SPEECH SYNTHESIS (TTS)
     tts()    — uses activeLang settings (rate, pitch, voice)
     ttsRaw() — explicit lang tag; used for the language-selection step
                which must always speak in English regardless of choice.
                Accepts an optional cfg override for rate/pitch/voiceHints.
  ================================================================ */

  /* Cache the voice list once it loads — getVoices() is async on some
     browsers and returns [] on the first call until the voiceschanged event. */
  var _voiceCache = null;
  if (SS) {
    SS.addEventListener("voiceschanged", function() { _voiceCache = null; });
  }

  function _getVoices() {
    if (_voiceCache) return _voiceCache;
    _voiceCache = SS ? (SS.getVoices() || []) : [];
    return _voiceCache;
  }

  /* Pick the best available voice for a given lang tag and hint list.
     Tries each hint substring against voice.name and voice.lang (case-
     insensitive). Returns null if nothing matches — browser will use its
     default for the lang tag set on the utterance. */
  function _pickVoice(langTag, hints) {
    var voices = _getVoices();
    if (!voices.length || !hints || !hints.length) return null;
    for (var h = 0; h < hints.length; h++) {
      var hint = hints[h].toLowerCase();
      for (var v = 0; v < voices.length; v++) {
        var name = (voices[v].name  || "").toLowerCase();
        var lang = (voices[v].lang  || "").toLowerCase();
        if (name.indexOf(hint) !== -1 || lang.indexOf(hint) !== -1) {
          return voices[v];
        }
      }
    }
    return null;
  }

  function tts(text, onEnd) {
    var cfg = LANG_CONFIG[activeLang] || LANG_CONFIG.english;
    ttsRaw(text, cfg.ttsLang, onEnd, cfg);
  }

  /* lang     — BCP-47 tag for the utterance
     onEnd    — callback fired when speech ends or errors
     cfg      — optional { ttsRate, ttsPitch, voiceHints } override;
                when omitted the function uses safe defaults            */
  function ttsRaw(text, lang, onEnd, cfg) {
    if (!SS) { if (onEnd) setTimeout(onEnd, 0); return; }
    if (SS.speaking) SS.cancel();
    /* 200 ms gap after cancel prevents Chrome dropping the new utterance */
    setTimeout(function() {
      var utt    = new SpeechSynthesisUtterance(text);
      utt.lang   = lang || "en-IN";
      utt.rate   = (cfg && cfg.ttsRate  != null) ? cfg.ttsRate  : 0.92;
      utt.pitch  = (cfg && cfg.ttsPitch != null) ? cfg.ttsPitch : 1.0;
      utt.volume = 1;

      /* Apply best available voice for this language */
      var hints = (cfg && cfg.voiceHints) ? cfg.voiceHints : [];
      var voice = _pickVoice(lang, hints);
      if (voice) utt.voice = voice;

      utt.onend   = function() { if (onEnd) onEnd(); };
      utt.onerror = function() { if (onEnd) onEnd(); };
      SS.speak(utt);
    }, 200);
  }

  function cancelSpeech() {
    if (SS && SS.speaking) SS.cancel();
  }

  /* ================================================================
     GUIDE BAR
  ================================================================ */

  function createGuideBar() {
    removeGuideBar();
    guideBar = document.createElement("div");
    guideBar.className = "vg-bar vg-bar--listening";
    guideBar.innerHTML =
      "<span class=\"vg-bar-icon\">&#x1F399;&#xFE0F;</span>" +
      "<span class=\"vg-bar-text\">Voice Guide active\u2026</span>" +
      "<button class=\"vg-bar-stop\" onclick=\"VoiceGuide.stop()\" " +
      "title=\"Stop voice guide\" aria-label=\"Stop\">\u2715</button>";
    var panel = document.querySelector(".step-panel:not(.hidden)");
    if (panel) panel.insertBefore(guideBar, panel.firstChild);
  }

  function updateBar(text, state) {
    if (!guideBar) return;
    var el = guideBar.querySelector(".vg-bar-text");
    if (el) el.textContent = text;
    guideBar.className = "vg-bar vg-bar--" + (state || "listening");
  }

  function removeGuideBar() {
    if (guideBar && guideBar.parentNode) guideBar.parentNode.removeChild(guideBar);
    guideBar = null;
  }

  /* ================================================================
     FIELD HIGHLIGHT
  ================================================================ */

  function highlightField(field) {
    clearHighlight();
    var el = (field.type === "radio")
      ? document.querySelector("input[name=\"" + field.name + "\"]")
      : document.getElementById(field.id);
    if (!el) return;
    var target = el.closest(".form-group") || el.parentElement;
    if (target) target.classList.add("vg-field-active");
    if (field.type === "text" || field.type === "phone" || field.type === "email") {
      el.focus();
    }
  }

  function clearHighlight() {
    document.querySelectorAll(".vg-field-active").forEach(function(el) {
      el.classList.remove("vg-field-active");
    });
  }

  /* ================================================================
     FLASH FEEDBACK
  ================================================================ */

  function flashSuccess(el) {
    el.classList.add("vg-field-success");
    setTimeout(function() { el.classList.remove("vg-field-success"); }, 1500);
  }

  function flashRadio(radio) {
    var lbl = radio.closest(".radio-label");
    if (lbl) {
      lbl.classList.add("vg-radio-success");
      setTimeout(function() { lbl.classList.remove("vg-radio-success"); }, 1500);
    }
  }

  /* ================================================================
     HELPERS
  ================================================================ */

  function killRecog() {
    if (guideRecog) {
      try { guideRecog.stop(); } catch (e) { /* ignore */ }
      guideRecog = null;
    }
  }

  /* ================================================================
     VOICE WARNINGS (only when guide is active)
  ================================================================ */

  /* ----------------------------------------------------------------
     VALIDATION MESSAGE TABLE
     Keys match the message keys used by app.js showErrorWithVoice().
     Each entry has english / hindi / marathi text.
     The english text is also used as the fallback.
  ---------------------------------------------------------------- */
  var VALIDATION_MSGS = {
    /* ---- Step 1 — Citizen ---- */
    "err-name-required": {
      english: "Please enter your First Name and Last Name.",
      hindi:   "कृपया अपना पहला नाम और अंतिम नाम दर्ज करें।",
      marathi: "कृपया आपले पहिले नाव आणि आडनाव प्रविष्ट करा."
    },
    "err-ward-required": {
      english: "Please confirm whether you belong to this ward.",
      hindi:   "कृपया पुष्टि करें कि आप इस वार्ड से हैं या नहीं।",
      marathi: "कृपया पुष्टी करा की तुम्ही या वॉर्डमधून आहात की नाही."
    },
    "err-resident-required": {
      english: "Please select your residency type.",
      hindi:   "कृपया अपना निवास प्रकार चुनें।",
      marathi: "कृपया आपला निवास प्रकार निवडा."
    },
    "err-resident-other": {
      english: "Please specify your residency type.",
      hindi:   "कृपया अपना निवास प्रकार निर्दिष्ट करें।",
      marathi: "कृपया आपला निवास प्रकार निर्दिष्ट करा."
    },
    "err-voter-required": {
      english: "Please indicate whether you are a registered voter.",
      hindi:   "कृपया बताएं कि आप पंजीकृत मतदाता हैं या नहीं।",
      marathi: "कृपया सांगा की तुम्ही नोंदणीकृत मतदार आहात की नाही."
    },
    /* ---- Step 1 — Politician ---- */
    "err-fields-required": {
      english: "Please fill all required fields before proceeding.",
      hindi:   "कृपया आगे बढ़ने से पहले सभी आवश्यक फ़ील्ड भरें।",
      marathi: "कृपया पुढे जाण्यापूर्वी सर्व आवश्यक फील्ड भरा."
    },
    "err-age-invalid": {
      english: "Age must be at least 25 years to register as a Politician.",
      hindi:   "राजनेता के रूप में पंजीकरण के लिए आयु कम से कम 25 वर्ष होनी चाहिए।",
      marathi: "राजकारणी म्हणून नोंदणीसाठी वय किमान 25 वर्षे असणे आवश्यक आहे."
    },
    "err-mobile-invalid": {
      english: "Mobile number must be exactly 10 digits.",
      hindi:   "मोबाइल नंबर ठीक 10 अंकों का होना चाहिए।",
      marathi: "मोबाइल नंबर नक्की 10 अंकी असणे आवश्यक आहे."
    },
    "err-email-invalid": {
      english: "Please enter a valid email address.",
      hindi:   "कृपया एक वैध ईमेल पता दर्ज करें।",
      marathi: "कृपया एक वैध ईमेल पत्ता प्रविष्ट करा."
    },
    /* ---- Step 2 — Citizen ---- */
    "err-dob-invalid": {
      english: "Date of Birth must be earlier than today's date.",
      hindi:   "जन्म तिथि आज की तारीख से पहले होनी चाहिए।",
      marathi: "जन्मतारीख आजच्या तारखेपेक्षा आधीची असणे आवश्यक आहे."
    },
    "err-whatsapp-invalid": {
      english: "WhatsApp number must be exactly 10 digits.",
      hindi:   "व्हाट्सएप नंबर ठीक 10 अंकों का होना चाहिए।",
      marathi: "व्हाट्सअॅप नंबर नक्की 10 अंकी असणे आवश्यक आहे."
    },
    /* ---- Step 3 — Password / Submit ---- */
    "err-password-required": {
      english: "Please fill all required fields before proceeding.",
      hindi:   "कृपया आगे बढ़ने से पहले सभी आवश्यक फ़ील्ड भरें।",
      marathi: "कृपया पुढे जाण्यापूर्वी सर्व आवश्यक फील्ड भरा."
    },
    "err-password-short": {
      english: "Password must be at least 6 characters long.",
      hindi:   "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
      marathi: "पासवर्ड किमान 6 अक्षरांचा असणे आवश्यक आहे."
    },
    "err-password-mismatch": {
      english: "Passwords do not match. Please re-enter.",
      hindi:   "पासवर्ड मेल नहीं खाते। कृपया फिर से दर्ज करें।",
      marathi: "पासवर्ड जुळत नाहीत. कृपया पुन्हा प्रविष्ट करा."
    },
    "err-idproof-required": {
      english: "Please upload your ID proof document.",
      hindi:   "कृपया अपना पहचान प्रमाण दस्तावेज़ अपलोड करें।",
      marathi: "कृपया आपला ओळखपत्र दस्तऐवज अपलोड करा."
    },
    "err-idproof-type": {
      english: "Invalid file type. Please upload a PDF, JPG, or PNG.",
      hindi:   "अमान्य फ़ाइल प्रकार। कृपया PDF, JPG, या PNG अपलोड करें।",
      marathi: "अवैध फाइल प्रकार. कृपया PDF, JPG, किंवा PNG अपलोड करा."
    },
    "err-idproof-size": {
      english: "File size must not exceed 5 MB.",
      hindi:   "फ़ाइल का आकार 5 MB से अधिक नहीं होना चाहिए।",
      marathi: "फाइलचा आकार 5 MB पेक्षा जास्त नसावा."
    },
    "err-terms-required": {
      english: "You must accept the Terms & Conditions to register.",
      hindi:   "पंजीकरण के लिए आपको नियम और शर्तें स्वीकार करनी होंगी।",
      marathi: "नोंदणीसाठी तुम्हाला अटी व शर्ती स्वीकारणे आवश्यक आहे."
    },
    "err-captcha-required": {
      english: "Please enter the captcha code to complete registration.",
      hindi:   "पंजीकरण पूरा करने के लिए कृपया कैप्चा कोड दर्ज करें।",
      marathi: "नोंदणी पूर्ण करण्यासाठी कृपया कॅप्चा कोड प्रविष्ट करा."
    },
    "err-captcha-invalid": {
      english: "Invalid captcha. Please try again.",
      hindi:   "अमान्य कैप्चा। कृपया पुनः प्रयास करें।",
      marathi: "अवैध कॅप्चा. कृपया पुन्हा प्रयत्न करा."
    },
    /* ---- voiceValidatePhone / voiceValidateEmail ---- */
    "err-phone-digits": {
      english: " must be 10 digits. Please say it again.",
      hindi:   " 10 अंकों का होना चाहिए। कृपया फिर से बोलें।",
      marathi: " 10 अंकी असणे आवश्यक आहे. कृपया पुन्हा सांगा."
    },
    "err-email-voice": {
      english: "Email address is not valid. Please say it again.",
      hindi:   "ईमेल पता मान्य नहीं है। कृपया फिर से बोलें।",
      marathi: "ईमेल पत्ता वैध नाही. कृपया पुन्हा सांगा."
    }
  };

  /* Return a localised validation message for the current activeLang.
     Falls back to English if the key or language is not found.       */
  window.voiceValidationMsg = function(key) {
    var entry = VALIDATION_MSGS[key];
    if (!entry) return key; /* return key itself as last-resort fallback */
    return entry[activeLang] || entry.english || key;
  };

  /* Speak a warning message and update the guide bar (if visible).
     Fires whenever a language has been chosen this session — does NOT
     require the guide to be actively running a field question.
     This is the key fix: submit-time validation errors are spoken even
     after the guide has stopped between steps.                        */
  window.voiceWarn = function(msg) {
    if (!langChosen) return;   /* no language selected yet — stay silent */
    tts(msg);
    if (guideBar) updateBar("\u26A0\uFE0F " + msg, "error");
  };

  window.voiceValidatePhone = function(value, label) {
    if (!langChosen) return true;
    if (!/^\d{10}$/.test(value || "")) {
      var msg = (label || "Mobile number") + window.voiceValidationMsg("err-phone-digits");
      tts(msg);
      if (guideBar) updateBar("\u26A0\uFE0F " + msg, "error");
      return false;
    }
    return true;
  };

  window.voiceValidateEmail = function(value) {
    if (!langChosen) return true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "")) {
      var msg = window.voiceValidationMsg("err-email-voice");
      tts(msg);
      if (guideBar) updateBar("\u26A0\uFE0F " + msg, "error");
      return false;
    }
    return true;
  };

})();
