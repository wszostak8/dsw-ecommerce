import { create } from 'zustand';

type TurnstileState = {
  scriptStatus: 'idle' | 'loading' | 'loaded' | 'error';
  setScriptStatus: (status: TurnstileState['scriptStatus']) => void;
};

export const useTurnstileStore = create<TurnstileState>((set) => ({
  scriptStatus: 'idle',
  setScriptStatus: (status) => set({ scriptStatus: status }),
}));