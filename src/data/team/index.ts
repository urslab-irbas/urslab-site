// Ред на показване в „Състав“ — за нов човек: създайте файл по образец и го добавете тук.
import type { Member } from './types';
import madzharov from './madzharov';
import aleksandrov from './aleksandrov';
import georgiev from './georgiev';
import gaidarski from './gaidarski';
import hristozov from './hristozov';
import chehlarova from './chehlarova';

export type { Member };
export const team: Member[] = [madzharov, aleksandrov, georgiev, gaidarski, hristozov, chehlarova];
