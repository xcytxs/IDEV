import { useEffect, useRef } from 'react';
import { Agent } from '../types/agent';
import { useAgentStore } from '../store/agentStore';

export function useAgentInitialization(agent: Agent | null) {
  const { setSelectedAgent } = useAgentStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!agent || initialized.current) return;

    setSelectedAgent(agent);
    initialized.current = true;
  }, [agent?.id]);

  return initialized.current;
}