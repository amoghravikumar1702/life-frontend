import { retailConfig } from "./retail";
import { educationConfig } from "./education";
import { servicesConfig } from "./services";
import { healthcareConfig } from "./healthcare";
import { hospitalityConfig } from "./hospitality";
import { manufacturingConfig } from "./manufacturing";
import { fitnessConfig } from "./fitness";
import { nonprofitConfig } from "./nonprofit";

import {
  BusinessConfig,
  BusinessIndustry,
} from "./types";

const registry: Record<BusinessIndustry, BusinessConfig> = {
  retail: retailConfig as BusinessConfig,
  services: servicesConfig as BusinessConfig,
  education: educationConfig as BusinessConfig,
  healthcare: healthcareConfig as BusinessConfig,
  hospitality: hospitalityConfig as BusinessConfig,
  manufacturing: manufacturingConfig as BusinessConfig,
  fitness: fitnessConfig as BusinessConfig,
  nonprofit: nonprofitConfig as BusinessConfig,
};

export function getBusinessConfig(
  industry: string | null | undefined
): BusinessConfig {
  if (!industry) {
    return servicesConfig as BusinessConfig;
  }

  return registry[industry as BusinessIndustry] ?? (servicesConfig as BusinessConfig);
}