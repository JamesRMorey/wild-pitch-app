const stage: 'local'|'production' = 'local';

type Environment = {
    api_url: string;
}

type StageConfig = {
    local: Environment;
    production: Environment;
}

const STAGE_CONFIG: StageConfig  = {
  local: {
    api_url: 'https://api.wild-pitch.co.uk'
  },
  production: {
    api_url: 'https://api.wild-pitch.co.uk'
  },
};

export const ENVIRONMENT = {
    stage: stage,
    ...STAGE_CONFIG[stage]
}