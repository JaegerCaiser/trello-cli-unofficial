export interface CliChoice<T = string> {
  name: string;
  value: T;
}

export interface MenuAction {
  name: string;
  value: string;
}

export const MENU_ACTIONS = {
  BOARDS: 'boards',
  EXPLORE: 'explore',
  CREATE: 'create',
  CONFIG: 'config',
  EXIT: 'exit',
} as const;

export const CONFIG_ACTIONS = {
  TOKEN: 'token',
  VIEW: 'view',
  RESET: 'reset',
  BACK: 'back',
} as const;

export const CARD_ACTIONS = {
  BACK: 'back',
  EDIT: 'edit',
  DELETE: 'delete',
  MOVE: 'move',
} as const;
