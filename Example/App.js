import React, {Component} from 'react';
import {View} from 'react-native';
import {NavigationApps} from "react-native-navigation-apps";


export default class App extends Component {
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <NavigationApps
                    row
                    modalProps={{animationType: 'slide', transparent: false}}
                    modalBtnCloseTitle={'close modal'}
                    modalBtnOpenTitle={'open modal'}
                    modalBtnCloseTextStyle={{fontSize:20}}
                    modalBtnOpenTextStyle={{fontSize:20}}
                    iconSize={100}
                    viewMode={'view'}
                    address={'new york'}
                />
            </View>
        );
    }
}


