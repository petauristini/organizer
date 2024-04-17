const keys = {
  environment: process.env.ENVIRONMENT,
  nodePort: process.env.NODEPORT,
  pgUser: process.env.POSTGRES_USER,
  pgHost: process.env.POSTGRES_HOST,
  pgDatabase: process.env.POSTGRES_DATABASE,
  pgPassword: process.env.POSTGRES_PASSWORD,
  pgPort: process.env.POSTGRES_PORT,
};

export default keys;
