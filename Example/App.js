import React, {Component} from 'react';
import {View} from 'react-native';
import {NavigationApps} from "react-native-navigation-apps";


export default class App extends Component {
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <NavigationApps
                    row
                    modalProps={{animationType: 'slide', transparent: true}}
                    modalBtnCloseTitle={'close modal'}
                    modalBtnOpenTitle={'open modal'}
                    modalBtnCloseTextStyle={{color:'black',fontSize:20}}
                    modalBtnOpenTextStyle={{color:'black',fontSize:20}}
                />
            </View>
        );
    }
}


