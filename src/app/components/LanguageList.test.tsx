import { assert } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';

import { LanguageList } from '@/app/components/LanguageList';

describe('<LanguageList />', () => {
  test('loads all languages', () => {
    const ALL_LANGUAGES = require('@/infrastructure/data/all-languages.json');
    const POPULAR_LANGUAGES = require('@/infrastructure/data/popular-languages.json');
    const HANDLE_SET_LANGUAGE = jest.fn();
    const component = mount(<LanguageList
      selectedLanguageListType='popular'
      selectedLanguage='typescript'
      allLanguageList={ALL_LANGUAGES}
      popularLanguageList={POPULAR_LANGUAGES}
      handleSetLanguage={HANDLE_SET_LANGUAGE}
    />);

    component.setState({  selectedLanguageListType: 'all'});

    assert.lengthOf(component.find('li.language-list-item'), 304);
  });
});
