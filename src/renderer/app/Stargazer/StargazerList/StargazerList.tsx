import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { StargazerDetail } from '@/renderer/app/Stargazer/StargazerList/components/StargazerDetail';
import StargazerRepositoryList from '@/renderer/app/Stargazer/StargazerList/StargazerRepositoryList/StargazerRepositoryList';
import { UserEntity } from '@/renderer/model/User.entity';
import { formatRoute, Routes } from '@/renderer/Routes';
import { ClearCurrentStargazerAction } from '@/renderer/store/Stargazer/actions/ClearCurrentStargazerAction';
import {
  RemoveUserFromStargazerListAction,
  RemoveUserFromStargazerListActionType,
} from '@/renderer/store/Stargazer/actions/RemoveUserFromStargazerListAction';
import {
  SetCurrentStargazerAction,
  SetCurrentStargazerActionType,
} from '@/renderer/store/Stargazer/actions/SetCurrentStargazerAction';
import { StargazerStore } from '@/renderer/store/Stargazer/Store';

interface Props {
  history: any;
  stargazer: StargazerStore;
  SetCurrentStargazerAction: SetCurrentStargazerActionType;
  ClearCurrentStargazerAction: () => void;
  RemoveUserFromStargazerListAction: RemoveUserFromStargazerListActionType;
}

class StargazerList extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.handleSetStargazer = this.handleSetStargazer.bind(this);
    this.handleRemoveStargazer = this.handleRemoveStargazer.bind(this);
    this.clearStargazerWhenNavigatingToList = this.clearStargazerWhenNavigatingToList.bind(this);
  }

  componentDidMount(): void {
    this.clearStargazerWhenNavigatingToList();
  }

  componentDidUpdate(): void {
    this.clearStargazerWhenNavigatingToList();
  }

  clearStargazerWhenNavigatingToList() {
    if (this.props.history.location.pathname === '/stargazer' && this.props.stargazer.currentUserLogin) {
      this.props.ClearCurrentStargazerAction();
    }
  }

  handleSetStargazer(user: UserEntity) {
    const login = user.attributes.login;
    this.props.SetCurrentStargazerAction(login);
    this.props.history.push(formatRoute(Routes.STARGAZER_DETAIL, {login}));
  }

  handleRemoveStargazer(user: UserEntity) {
    this.props.RemoveUserFromStargazerListAction(user.attributes.login);
  }

  get stargazerList() {
    const userList = this.props.stargazer.userList[this.props.stargazer.currentUserLogin];
    if (!userList) {
      return [];
    }

    return userList[this.props.stargazer.currentUserLogin]
      .map(
        (user) => <StargazerDetail key={user.id}
                                   handleClickStargazer={() => this.handleSetStargazer(user)}
                                   handleRemoveStargazer={() => this.handleRemoveStargazer(user)}
                                   user={user}
        />,
      );
  }

  render() {
    return <>
      {this.stargazerList.length ? this.stargazerList : 'No stargazers'}
      <Route path={Routes.STARGAZER_DETAIL} component={StargazerRepositoryList}/>
    </>;
  }
}

function mapStateToProps(state) {
  return {
    stargazer: state.stargazer,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      SetCurrentStargazerAction,
      ClearCurrentStargazerAction,
      RemoveUserFromStargazerListAction,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(StargazerList);