# This script reads a .env file and writes a YAML file for Cloud Run env vars.

import yaml

env_file = ".env"
yaml_file = "env.yaml"

env_vars = {}

with open(env_file, "r") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" in line:
            key, value = line.split("=", 1)
            env_vars[key.strip()] = value.strip()

with open(yaml_file, "w") as f:
    yaml.dump(env_vars, f, default_flow_style=False)

print(f"Converted {env_file} to {yaml_file}")