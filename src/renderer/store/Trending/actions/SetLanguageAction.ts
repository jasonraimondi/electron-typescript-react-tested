import { ILanguage } from '@/renderer/app/TrendingRepos/components/LanguageList';
import { ActionResponse } from '@/renderer/store/Interfaces';

export const SET_LANGUAGE = '[LANGUAGE] Set';

export type SetLanguageActionType = (language: ILanguage) => ActionResponse<ILanguage>;

export const SetLanguageAction: SetLanguageActionType = (language: ILanguage) => {
  return {
    type: SET_LANGUAGE,
    payload: language,
  };
};
