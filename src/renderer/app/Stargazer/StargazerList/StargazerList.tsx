import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, Route, Router, Switch, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { StargazerDetail } from '@/renderer/app/Stargazer/StargazerList/components/StargazerDetail';
import { UserEntity } from '@/renderer/infrastructure/model/User.entity';
import { formatRoute, Routes } from '@/renderer/Routes';
import { SettingsStore } from '@/renderer/store/Settings/Store';
import {
  RemoveUserFromStargazerListAction,
  RemoveUserFromStargazerListActionType,
} from '@/renderer/store/Stargazer/actions/RemoveUserFromStargazerListAction';
import { StargazerStore } from '@/renderer/store/Stargazer/Store';
import styled from 'styled-components';

interface Props {
  history: Router;
  stargazer: StargazerStore;
  settings: SettingsStore;
  RemoveUserFromStargazerListAction: RemoveUserFromStargazerListActionType;
}

class StargazerList extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.handleSetStargazer = this.handleSetStargazer.bind(this);
    this.handleRemoveStargazer = this.handleRemoveStargazer.bind(this);
  }

  handleSetStargazer(user: UserEntity) {
    const login = user.attributes.login;
    this.props.history.push(formatRoute(Routes.STARGAZER_DETAIL, {login}));
  }

  handleRemoveStargazer(user: UserEntity) {
    this.props.RemoveUserFromStargazerListAction(user.attributes.login);
  }

  get stargazerList() {
    if (!this.props.stargazer.stargazerList) {
      return [];
    }

    const userList = Object.values(this.props.stargazer.stargazerList).map((stargazer) => stargazer.data);

    if (!userList) {
      return [];
    }

    return userList.map((user) => {
      const isAuthenticatedUser = this.props.settings.github
        && this.props.settings.github.user.login === user.attributes.login;

      return <StargazerDetail key={user.id}
                              isLocked={isAuthenticatedUser}
                              handleClickStargazer={() => this.handleSetStargazer(user)}
                              handleRemoveStargazer={() => this.handleRemoveStargazer(user)}
                              user={user}
      />;
    });
  }

  render() {
    return <>
      <Title>Stargazer List</Title>
      {this.stargazerList.length ? this.stargazerList : 'No stargazers'}
    </>;
  }
}

const Title = styled.h1`
`;

function mapStateToProps(state) {
  return {
    stargazer: state.stargazer,
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      RemoveUserFromStargazerListAction,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(StargazerList);
