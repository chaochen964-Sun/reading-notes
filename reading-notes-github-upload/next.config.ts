import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next writes AGENTS.md / CLAUDE.md on dev startup unless this is off; the project
  // keeps its own docs in README.md.
  agentRules: false,
};

export default nextConfig;
