export interface FoodItem {
  id: string;
  name: string;
  active: boolean;
}

export type AppState = 'IDLE' | 'RUNNING' | 'STOPPED';

export interface AiSuggestion {
  name: string;
  reason: string;
}
