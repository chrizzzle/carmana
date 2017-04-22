import { Action } from 'redux';

export interface Payload extends Action {
  payload?: any;
  error?: any;
  meta?: any;
}