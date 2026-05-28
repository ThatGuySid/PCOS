export type AppStrings = {
  settingsTitle: string;
  settingsSectionNotifications: string;
  settingsSectionAccount: string;
  settingsSectionApp: string;
  settingsItemPeriodRemindersTitle: string;
  settingsItemPeriodRemindersSub: string;
  settingsItemMedicineAlertsTitle: string;
  settingsItemMedicineAlertsSub: string;
  settingsItemOvulationAlertsTitle: string;
  settingsItemOvulationAlertsSub: string;
  settingsItemEditProfileTitle: string;
  settingsItemPrivacyTitle: string;
  settingsItemExportTitle: string;
  settingsItemLanguageTitle: string;
  settingsItemAboutTitle: string;
  settingsSignOut: string;

  aboutTitle: string;
  aboutCardTitle: string;
  aboutDescription: string;
  aboutFeaturesTitle: string;
  aboutFeatures: string[];
  aboutInfoTitle: string;
  aboutInfoVersionLabel: string;
  aboutInfoSupportLabel: string;

  privacyTitle: string;
  privacyHeaderTitle: string;
  privacySummary: string;
  privacyPolicyButton: string;
  privacyDataCollectedTitle: string;
  privacyDataCollectedItems: string[];
  privacyUsageTitle: string;
  privacyUsageItems: string[];
  privacyControlsTitle: string;
  privacyControlsItems: string[];

  exportTitle: string;
  exportHeaderTitle: string;
  exportSummary: string;
  exportButton: string;
  exportButtonLoading: string;
  exportIncludedTitle: string;
  exportIncludedItems: string[];
  exportShareDialogTitle: string;
  exportNoShareNotice: string;
  exportErrorNotice: string;

  languageTitle: string;
  languageHeaderTitle: string;
  languageSummaryPrefix: string;
  languageSummarySuffix: string;

  privacyPolicyTitle: string;
  privacyPolicyUpdatedLabel: string;
  privacyPolicyOverviewTitle: string;
  privacyPolicyOverviewBody: string;
  privacyPolicyDataTitle: string;
  privacyPolicyDataBody: string[];
  privacyPolicyUseTitle: string;
  privacyPolicyUseBody: string[];
  privacyPolicyShareTitle: string;
  privacyPolicyShareBody: string;
  privacyPolicySecurityTitle: string;
  privacyPolicySecurityBody: string;
  privacyPolicyChoicesTitle: string;
  privacyPolicyChoicesBody: string[];
  privacyPolicyContactTitle: string;
  privacyPolicyContactBody: string;
};

const EN_STRINGS: AppStrings = {
  settingsTitle: "Settings",
  settingsSectionNotifications: "Notifications",
  settingsSectionAccount: "Account",
  settingsSectionApp: "App",
  settingsItemPeriodRemindersTitle: "Period Reminders",
  settingsItemPeriodRemindersSub: "Get notified before your period",
  settingsItemMedicineAlertsTitle: "Medicine Alerts",
  settingsItemMedicineAlertsSub: "Daily medication reminders",
  settingsItemOvulationAlertsTitle: "Ovulation Alerts",
  settingsItemOvulationAlertsSub: "Track your fertile window",
  settingsItemEditProfileTitle: "Edit Profile",
  settingsItemPrivacyTitle: "Privacy & Security",
  settingsItemExportTitle: "Export Health Data",
  settingsItemLanguageTitle: "Language",
  settingsItemAboutTitle: "About HerFlow",
  settingsSignOut: "Sign Out",

  aboutTitle: "About",
  aboutCardTitle: "HerFlow",
  aboutDescription:
    "HerFlow helps you track your cycle, symptoms, medication, and offers phase-aware guidance for food and workouts. It is designed to support people with PCOS by providing actionable, evidence-informed suggestions and gentle reminders.",
  aboutFeaturesTitle: "Core Features",
  aboutFeatures: [
    "- Cycle and period tracking",
    "- Symptom and mood logging",
    "- Phase-based food and workout guidance",
    "- Medication reminders and logs",
    "- Exportable health data",
  ],
  aboutInfoTitle: "App Info",
  aboutInfoVersionLabel: "Version",
  aboutInfoSupportLabel: "Support",

  privacyTitle: "Privacy & Security",
  privacyHeaderTitle: "Privacy & Security",
  privacySummary:
    "We take your privacy seriously. Personal and health data is stored securely and only used to deliver the features you enable.",
  privacyPolicyButton: "View Privacy Policy",
  privacyDataCollectedTitle: "Data We Collect",
  privacyDataCollectedItems: [
    "- Profile details you provide (age group, cycle preferences)",
    "- Symptom, mood, and period logs you record",
    "- Medication reminders and tracker entries",
  ],
  privacyUsageTitle: "How We Use It",
  privacyUsageItems: [
    "- Personalize cycle predictions and reminders",
    "- Generate phase-aware guidance",
    "- Improve your experience within the app",
  ],
  privacyControlsTitle: "Your Controls",
  privacyControlsItems: [
    "- Export your data from Settings",
    "- Delete your account and data at any time",
  ],

  exportTitle: "Export Health Data",
  exportHeaderTitle: "Export Your Data",
  exportSummary:
    "Generate a JSON export of your profile, cycle snapshot, and recent symptom entries. The file is saved to a temporary folder and shared using your device share sheet.",
  exportButton: "Export JSON",
  exportButtonLoading: "Preparing...",
  exportIncludedTitle: "Included In Export",
  exportIncludedItems: [
    "- Profile details and preferences",
    "- Cycle snapshot and prediction windows",
    "- Period entries and date keys",
    "- Symptom logs and recent symptoms",
    "- Medicine tracker list",
  ],
  exportShareDialogTitle: "Export Health Data",
  exportNoShareNotice: "Your export file was created. Check logs for the path.",
  exportErrorNotice: "Could not prepare export.",

  languageTitle: "Language",
  languageHeaderTitle: "Language",
  languageSummaryPrefix: "Current selection: ",
  languageSummarySuffix:
    ". Your choice is saved and will apply across the app once translations are available.",

  privacyPolicyTitle: "Privacy Policy",
  privacyPolicyUpdatedLabel: "Last updated",
  privacyPolicyOverviewTitle: "Overview",
  privacyPolicyOverviewBody:
    "HerFlow is designed to help you track your cycle and related health information. This policy explains what data we collect and how it is used.",
  privacyPolicyDataTitle: "Data We Collect",
  privacyPolicyDataBody: [
    "- Profile details you provide",
    "- Period, symptom, and mood logs",
    "- Medication reminders and tracker entries",
  ],
  privacyPolicyUseTitle: "How We Use Data",
  privacyPolicyUseBody: [
    "- Provide cycle predictions and reminders",
    "- Personalize in-app guidance",
    "- Improve app performance and reliability",
  ],
  privacyPolicyShareTitle: "Sharing",
  privacyPolicyShareBody:
    "We do not sell your data. We only share data when required by law or to provide a service you explicitly request.",
  privacyPolicySecurityTitle: "Security",
  privacyPolicySecurityBody:
    "We use standard security practices to protect your information, but no system can guarantee absolute security.",
  privacyPolicyChoicesTitle: "Your Choices",
  privacyPolicyChoicesBody: [
    "- Export your data from Settings",
    "- Delete your account and data at any time",
  ],
  privacyPolicyContactTitle: "Contact",
  privacyPolicyContactBody: "Questions? Email support@herflow.app.",
};

const ES_STRINGS: AppStrings = {
  ...EN_STRINGS,
  settingsTitle: "Configuracion",
  settingsSectionNotifications: "Notificaciones",
  settingsSectionAccount: "Cuenta",
  settingsSectionApp: "Aplicacion",
  settingsItemPeriodRemindersTitle: "Recordatorios de periodo",
  settingsItemPeriodRemindersSub: "Recibe alertas antes del periodo",
  settingsItemMedicineAlertsTitle: "Alertas de medicacion",
  settingsItemMedicineAlertsSub: "Recordatorios diarios de medicacion",
  settingsItemOvulationAlertsTitle: "Alertas de ovulacion",
  settingsItemOvulationAlertsSub: "Seguimiento de ventana fertil",
  settingsItemEditProfileTitle: "Editar perfil",
  settingsItemPrivacyTitle: "Privacidad y seguridad",
  settingsItemExportTitle: "Exportar datos de salud",
  settingsItemLanguageTitle: "Idioma",
  settingsItemAboutTitle: "Acerca de HerFlow",
  settingsSignOut: "Cerrar sesion",
  aboutTitle: "Acerca de",
  aboutFeaturesTitle: "Funciones principales",
  aboutInfoTitle: "Informacion de la app",
  aboutInfoVersionLabel: "Version",
  aboutInfoSupportLabel: "Soporte",
  privacyTitle: "Privacidad y seguridad",
  privacyHeaderTitle: "Privacidad y seguridad",
  privacyPolicyButton: "Ver politica de privacidad",
  exportTitle: "Exportar datos de salud",
  exportHeaderTitle: "Exporta tus datos",
  exportButton: "Exportar JSON",
  exportButtonLoading: "Preparando...",
  exportIncludedTitle: "Incluye en exportacion",
  languageTitle: "Idioma",
  languageHeaderTitle: "Idioma",
  languageSummaryPrefix: "Seleccion actual: ",
  languageSummarySuffix:
    ". Tu eleccion se guarda y se aplicara cuando haya traducciones.",
  privacyPolicyTitle: "Politica de privacidad",
  privacyPolicyUpdatedLabel: "Actualizado",
};

const FR_STRINGS: AppStrings = {
  ...EN_STRINGS,
  settingsTitle: "Parametres",
  settingsSectionNotifications: "Notifications",
  settingsSectionAccount: "Compte",
  settingsSectionApp: "Application",
  settingsItemPeriodRemindersTitle: "Rappels de regles",
  settingsItemPeriodRemindersSub: "Recevez des alertes avant les regles",
  settingsItemMedicineAlertsTitle: "Alertes medicaments",
  settingsItemMedicineAlertsSub: "Rappels quotidiens de medicaments",
  settingsItemOvulationAlertsTitle: "Alertes ovulation",
  settingsItemOvulationAlertsSub: "Suivi de la fenetre fertile",
  settingsItemEditProfileTitle: "Modifier le profil",
  settingsItemPrivacyTitle: "Confidentialite et securite",
  settingsItemExportTitle: "Exporter les donnees de sante",
  settingsItemLanguageTitle: "Langue",
  settingsItemAboutTitle: "A propos de HerFlow",
  settingsSignOut: "Se deconnecter",
  aboutTitle: "A propos",
  aboutFeaturesTitle: "Fonctionnalites",
  aboutInfoTitle: "Infos app",
  aboutInfoVersionLabel: "Version",
  aboutInfoSupportLabel: "Support",
  privacyTitle: "Confidentialite et securite",
  privacyHeaderTitle: "Confidentialite et securite",
  privacyPolicyButton: "Voir la politique de confidentialite",
  exportTitle: "Exporter les donnees de sante",
  exportHeaderTitle: "Exporter vos donnees",
  exportButton: "Exporter JSON",
  exportButtonLoading: "Preparation...",
  exportIncludedTitle: "Inclus dans export",
  languageTitle: "Langue",
  languageHeaderTitle: "Langue",
  languageSummaryPrefix: "Selection actuelle: ",
  languageSummarySuffix:
    ". Votre choix est enregistre et s'appliquera quand les traductions seront disponibles.",
  privacyPolicyTitle: "Politique de confidentialite",
  privacyPolicyUpdatedLabel: "Mise a jour",
};

const HI_STRINGS: AppStrings = {
  ...EN_STRINGS,
  settingsTitle: "Settings",
  settingsSectionNotifications: "Notifications",
  settingsSectionAccount: "Account",
  settingsSectionApp: "App",
  settingsItemPeriodRemindersTitle: "Period Reminders",
  settingsItemPeriodRemindersSub: "Get notified before your period",
  settingsItemMedicineAlertsTitle: "Medicine Alerts",
  settingsItemMedicineAlertsSub: "Daily medication reminders",
  settingsItemOvulationAlertsTitle: "Ovulation Alerts",
  settingsItemOvulationAlertsSub: "Track your fertile window",
  settingsItemEditProfileTitle: "Edit Profile",
  settingsItemPrivacyTitle: "Privacy & Security",
  settingsItemExportTitle: "Export Health Data",
  settingsItemLanguageTitle: "Language",
  settingsItemAboutTitle: "About HerFlow",
  settingsSignOut: "Sign Out",
  aboutTitle: "About",
  aboutFeaturesTitle: "Core Features",
  aboutInfoTitle: "App Info",
  aboutInfoVersionLabel: "Version",
  aboutInfoSupportLabel: "Support",
  privacyTitle: "Privacy & Security",
  privacyHeaderTitle: "Privacy & Security",
  privacyPolicyButton: "View Privacy Policy",
  exportTitle: "Export Health Data",
  exportHeaderTitle: "Export Your Data",
  exportButton: "Export JSON",
  exportButtonLoading: "Preparing...",
  exportIncludedTitle: "Included In Export",
  languageTitle: "Language",
  languageHeaderTitle: "Language",
  languageSummaryPrefix: "Current selection: ",
  languageSummarySuffix:
    ". Your choice is saved and will apply across the app once translations are available.",
  privacyPolicyTitle: "Privacy Policy",
  privacyPolicyUpdatedLabel: "Last updated",
};

export type LanguageCode = "en" | "es" | "fr" | "hi";

export const I18N_STRINGS: Record<LanguageCode, AppStrings> = {
  en: EN_STRINGS,
  es: ES_STRINGS,
  fr: FR_STRINGS,
  hi: HI_STRINGS,
};

export function getStrings(language: string | null | undefined): AppStrings {
  if (!language) return EN_STRINGS;
  const normalized = language.toLowerCase() as LanguageCode;
  return I18N_STRINGS[normalized] ?? EN_STRINGS;
}
