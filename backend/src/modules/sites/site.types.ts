export interface SiteRow {
  id: string;
  site_name: string;
  location: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSiteDTO {
  siteName: string;
  location?: string;
}

export interface UpdateSiteDTO {
  siteName?: string;
  location?: string;
  isActive?: boolean;
}
