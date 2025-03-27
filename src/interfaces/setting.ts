export interface IError {
  statusCode: number;
  message: string;
}

export interface IContact {
  email: string;
  message: string;
  name: string;
}

export interface ISettings {
  modelBenefit: string;
  userBenefit: string;
  footerContent: string;
  loginPlaceholderImage: string;
  menus: any;
  favicon: string;
  siteName: string;
  logoUrl: string;
  darkModeLogoUrl: string;
  requireEmailVerification: boolean;
  paymentGateway: string;
  freeSubscriptionEnabled: boolean;
  freeSubscriptionDuration: number;
  minimumSubscriptionPrice: number;
  maximumSubscriptionPrice: number;
  minimumMonthlySubscriptionPrice: number;
  maximumMonthlySubscriptionPrice: number;
  minimumQuarterflySubscriptionPrice: number;
  maximumQuarterflySubscriptionPrice: number;
  minimumHalfYearlySubscriptionPrice: number;
  maximumHalfYearlySubscriptionPrice: number;
  minimumYearlySubscriptionPrice: number;
  maximumYearlySubscriptionPrice: number
  minimumWalletPrice: number;
  maximumWalletPrice: number;
  minimumTipPrice: number;
  maximumTipPrice: number;
  minimumPayoutAmount: number;
  googleReCaptchaSiteKey: string;
  enableGoogleReCaptcha: boolean;
  googleClientId: string;
  twitterClientId: string;
  tokenConversionRate: number;
  metaKeywords: string;
  metaDescription: string;
  enable2StepEmail: boolean;
  enableAdvertisement: boolean;
  advertisementEnalbleIn: number;
  performerReferralCommission: number;
  userReferralCommission: number;
  minimumPpvPrice: number;
  maximumPpvPrice: number;
  googleLoginEnabled: boolean;
  twitterLoginEnabled: boolean;
  googleLoginClientId: string;
  supportedLocales: string[];
  defaultLocale: string;
  countryCode: string;
  i18nextLng: string;
  enable18Popup: boolean;
  content18Popup: any;
  darkmodeLogoUrl: string
}
