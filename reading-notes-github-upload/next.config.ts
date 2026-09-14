import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The generated AGENTS.md / CLAUDE.md files are not tracked in this repo.
  agentRules: false,
};

export default nextConfig;
