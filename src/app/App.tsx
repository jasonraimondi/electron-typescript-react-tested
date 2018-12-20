import { LanguagePicker, ListType } from '@/app/components/LanguagePicker';
import { RepositoryEntity } from '@/models/Repository.entity';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { Normalize } from 'styled-normalize';

import { FrequencyPicker } from '@/app/components/FrequencyPicker';
import { LanguageList } from '@/app/components/LanguageList';
import { RepositoryList } from '@/app/components/RepositoryList';
import { TitleBar } from '@/app/components/TitleBar';
import {
  FetchRepositoryListAction,
  FetchRepositoryListActionType,
} from '@/infrastructure/redux/actions/FetchRepositoryList.action';
import { SetFrequencyAction, SetFrequencyActionType } from '@/infrastructure/redux/actions/SetFrequency.action';
import { SetLanguageAction, SetLanguageActionType } from '@/infrastructure/redux/actions/SetLanguage.action';
import { FrequencyType } from '@/models/Frequency.type';

interface Props {
  repositoryList: { [id: string]: RepositoryEntity };
  frequency: FrequencyType;
  language: string;
  SetLanguageAction: SetLanguageActionType;
  SetFrequencyAction: SetFrequencyActionType;
  FetchRepositoryListAction: FetchRepositoryListActionType;
}

const Main = styled.main`
  height: 100%;
  width: 100%;
  display: grid;
  grid-gap: 0;
  grid-template-areas:
    "title title"
    "sidebar content";
  grid-template-rows: 43px 1fr;
  grid-template-columns: 175px 1fr;
`;

const Title = styled.div`
  grid-area: title;
  -webkit-app-region: drag;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid black;
`;

const LanguageListContainer = styled.div`
  grid-area: sidebar;
  min-height: 0;
  overflow-y: auto;
  border-right: 2px solid black;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
`;

const RepoListContainer = styled.div`
  grid-area: content;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

interface State {
  selectedLanguageListType: 'all'|'popular';
}

class App extends React.Component<Props, State> {
  private readonly ALL_LANGUAGES = require('@/infrastructure/data/all-languages.json');
  private readonly POPULAR_LANGUAGES = require('@/infrastructure/data/popular-languages.json');

  constructor(props) {
    super(props);
    this.handleSetFrequency = this.handleSetFrequency.bind(this);
    this.handleSetLanguage = this.handleSetLanguage.bind(this);
    this.handleSetLanguageList = this.handleSetLanguageList.bind(this);
    this.state = {
      selectedLanguageListType: 'all',
    };
  }

  public componentDidMount() {
    this.props.FetchRepositoryListAction({
      language: this.props.language,
      frequency: this.props.frequency,
    });
  }

  public handleSetFrequency(frequency: FrequencyType) {
    this.props.SetFrequencyAction(frequency);
    this.props.FetchRepositoryListAction({
      language: this.props.language,
      frequency,
    });
  }

  public handleSetLanguage(language: string) {
    this.props.SetLanguageAction(language);
    this.props.FetchRepositoryListAction({
      language,
      frequency: this.props.frequency,
    });
  }
  public handleSetLanguageList(listType: ListType) {
    this.setState({ selectedLanguageListType: listType });
  }

  public render() {
    return (
      <>
        <Normalize/>
        <Main>
          <Title>
            <TitleBar frequency={this.props.frequency} language={this.props.language}/>
          </Title>
          <LanguageListContainer id='language-container'>
            <LanguagePicker selected={this.state.selectedLanguageListType}
                            handleSetLanguageList={this.handleSetLanguageList}
            />
            <LanguageList
              selectedLanguageListType={this.state.selectedLanguageListType}
              selectedLanguage={this.props.language}
              popularLanguageList={this.POPULAR_LANGUAGES}
              allLanguageList={this.ALL_LANGUAGES}
              handleSetLanguage={this.handleSetLanguage}
            />
          </LanguageListContainer>
          <RepoListContainer>
            <FrequencyPicker frequency={this.props.frequency} handleSetFrequency={this.handleSetFrequency}/>
            <RepositoryList repositoryList={this.props.repositoryList}/>
          </RepoListContainer>
        </Main>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.language,
    frequency: state.frequency,
    repositoryList: state.repositoryList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      SetLanguageAction,
      SetFrequencyAction,
      FetchRepositoryListAction,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
