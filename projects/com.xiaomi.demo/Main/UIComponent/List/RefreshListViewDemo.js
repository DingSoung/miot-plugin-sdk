/**
 * Created by sww on 2016/10/20.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ListView
} from 'react-native';
import {
  SwRefreshScrollView,
  SwRefreshListView
} from '../../../CommonModules/swrefresh';
import Logger from '../../Logger';

const { width, height } = Dimensions.get('window');
const SIZE = 20;
export default class RefreshListView extends Component {
  _page = 0;
  _dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });

  constructor(props) {
    super(props);

    let data = [];
    for (let i = 0; i < SIZE; i++) {
      data.push(i);
    }
    // 初始状态
    this.state = {
      dataSource: this._dataSource.cloneWithRows(data)
    };
    Logger.trace(this);
  }

  render() {
    return this._renderListView(); // ListView Demo
  }

  /**
   * scrollVewDemo
   * @returns {XML}
   */
  _renderScrollView() {

    return (
      <SwRefreshScrollView
        onRefresh={this._onRefresh.bind(this)}>
        <View style={styles.content}>
          <Text>下拉刷新ScrollView</Text>
        </View>
      </SwRefreshScrollView >
    );

  }

  /**
   * ListViewDemo
   * @returns {XML}
   * @private
   */
  _renderListView() {
    return (
      <SwRefreshListView
        ref={(ref) => { this.listView = ref; }}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        onRefresh={this._onListRefersh.bind(this)}
        onLoadMore={this._onLoadMore.bind(this)}
        // isShowLoadMore={false}
        renderFooter={() => {
          (<View style={{ backgroundColor: 'white', height: 100 }}>
            <Text>我是footer</Text>
          </View>);
        }}

      />
    );

  }

  _renderRow(rowData) {
    return (
      <View style={styles.cell}>
        <Text>{`这是第${ rowData }行`}</Text>
      </View>);

  }

  /**
   * 模拟刷新
   * @param end
   * @private
   */
  _onRefresh(end) {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      alert('刷新成功');

      end();// 刷新成功后需要调用end结束刷新

    }, 1500);

  }

  /**
   * 模拟刷新
   * @param finishCallback
   * @private
   */
  _onListRefersh(finishCallback) {
    this.refresTimer = setTimeout(() => {
      clearTimeout(this.refresTimer);
      this._page = 0;
      let data = [];
      for (let i = 0; i < SIZE; i++) {
        data.push(i);
      }
      this.setState({
        dataSource: this._dataSource.cloneWithRows(data)
      });
      this.listView.resetStatus(); // 重置上拉加载的状态
      finishCallback();// 刷新成功后需要调用end结束刷新
    }, 1500);
  }

  /**
   * 模拟加载更多
   * @param end
   * @private
   */
  _onLoadMore(end) {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      this._page++;
      let data = [];
      for (let i = 0; i < (this._page + 1) * 10; i++) {
        data.push(i);
      }
      this.setState({
        dataSource: this._dataSource.cloneWithRows(data)
      });
      this.listView.endLoadMore(this._page > 2);
    }, 2000);
  }

  componentDidMount() {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      this.listView.beginRefresh();
    }, 500); // 自动调用刷新 新增方法
  }

  componentWillUnmount() {
    if (this.refresTimer) {
      clearTimeout(this.refresTimer);
    }
  }

}
const styles = StyleSheet.create({
  container: {},
  content: {
    width: width,
    height: height,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pullHeaderContainer: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center'
  },
  pullHeaderText: {
    fontSize: 15,
    color: '#999999',
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cell: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#ececec',
    borderBottomWidth: 1

  }
});
