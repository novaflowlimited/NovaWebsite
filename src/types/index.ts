import type {
  ClientLogo,
  CommunityStory,
  ImpactStat,
  Job,
  MapFeaturedCounty,
  Plan,
  Post,
  Service,
  TeamMember,
  Testimonial,
  ServiceCategory,
  PricingType,
  PlanInterval,
  JobType,
  LogoStripKind,
  StoryCategory,
} from "@prisma/client";

export type {
  ClientLogo,
  CommunityStory,
  ImpactStat,
  Job,
  MapFeaturedCounty,
  Plan,
  Post,
  Service,
  TeamMember,
  Testimonial,
  ServiceCategory,
  PricingType,
  PlanInterval,
  JobType,
  LogoStripKind,
  StoryCategory,
};

export type PostDto = Omit<Post, "tags"> & { tags: string[] };
export type ServiceDto = Omit<Service, "features"> & {
  features: string[];
  plans: PlanDto[];
};
export type PlanDto = Omit<Plan, "features"> & { features: string[] };
export type JobDto = Omit<Job, "requirements" | "benefits"> & {
  requirements: string[];
  benefits: string[];
};

export type PaginatedPosts = {
  data: PostDto[];
  page: number;
  total: number;
  hasMore: boolean;
};

export type ApiListResponse<T> = { data: T[] };
export type ApiItemResponse<T> = { data: T };
