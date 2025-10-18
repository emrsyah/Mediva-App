export type Memory = {
  timestamp: number;
  content: string;
};

// Note: This is an in-memory store. In production you’d persist to a database.
const memories: Memory[] = [];

export function addMemory(content: string) {
  memories.push({ timestamp: Date.now(), content });
}

export function getMemories() {
  // Return newest first
  return [...memories].sort((a, b) => b.timestamp - a.timestamp);
}
