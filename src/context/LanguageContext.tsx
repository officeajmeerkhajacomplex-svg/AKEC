import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ml";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.title": "AKEC LEDGER",
    "home.search": "Search student...",
    "home.all": "All",
    "home.hifz": "Hifz",
    "home.madrassa": "Madrassa",
    "home.dars": "Dars",
    "home.youHave": "YOU HAVE ₹",
    "home.youGot": "YOU GOT ₹",
    "home.noStudents": "No students found.",
    "add.newStudent": "New Student",
    "add.name": "Name",
    "add.class": "Class / Dars",
    "add.phone": "Phone Number",
    "add.cancel": "Cancel",
    "add.save": "Save Student",
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.darkMode": "Dark Mode",
    "settings.privacy": "Privacy & Security",
    "settings.signOut": "Sign Out",
    "settings.edit": "Edit",
    "settings.name": "Name",
    "settings.department": "Department",
    // Add more as needed
  },
  ml: {
    "app.title": "AKEC ലെഡ്ജർ",
    "home.search": "വിദ്യാർത്ഥിയെ തിരയുക...",
    "home.all": "എല്ലാം",
    "home.hifz": "ഹിഫ്സ്",
    "home.madrassa": "മദ്രസ",
    "home.dars": "ദർസ്",
    "home.youHave": "കൊടുക്കാനുള്ളത് ₹",
    "home.youGot": "കിട്ടിയത് ₹",
    "home.noStudents": "വിദ്യാർത്ഥികളെ കണ്ടെത്തിയില്ല.",
    "add.newStudent": "പുതിയ വിദ്യാർത്ഥി",
    "add.name": "പേര്",
    "add.class": "ക്ലാസ് / ദർസ്",
    "add.phone": "ഫോൺ നമ്പർ",
    "add.cancel": "റദ്ദാക്കുക",
    "add.save": "സേവ് ചെയ്യുക",
    "settings.title": "സജ്ജീകരണങ്ങൾ",
    "settings.language": "ഭാഷ (Language)",
    "settings.darkMode": "ഡാർക്ക് മോഡ്",
    "settings.privacy": "സ്വകാര്യത & സുരക്ഷ",
    "settings.signOut": "സൈൻ ഔട്ട്",
    "settings.edit": "തിരുത്തുക",
    "settings.name": "പേര്",
    "settings.department": "വിഭാഗം",
    // Add more as needed
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("akec_language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("akec_language", language);
    if (language === "ml") {
      document.body.classList.add("font-ml");
    } else {
      document.body.classList.remove("font-ml");
    }
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
