FROM node:20-slim

WORKDIR /app

# Install git (needed for pipeline commits/pushes)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY package.json ./
RUN npm install

# Install the Agent SDK
RUN npm install @anthropic-ai/claude-agent-sdk

COPY . .

# Git config for automated commits
RUN git config --global user.name "Aurigen Pipeline" && \
    git config --global user.email "pipeline@aurigen.io"

# Default: continuous loop mode
ENTRYPOINT ["node", "pipeline/orchestrator.js"]
CMD ["--loop"]
