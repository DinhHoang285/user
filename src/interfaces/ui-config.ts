export interface IUIConfig {
  darkmodeLogo: string;
  siteName: string;
  logo: string;
  menus: any[];
  favicon: string;
}

export type IPage = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<any>; // id, profileId, etc...
}
