import React, {Component} from 'react';
import {View} from 'react-native';
import {NavigationApps,wazeActions,googleMapsActions} from "react-native-navigation-apps";


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
                    googleMaps={{lat:40.712775,lon:-74.005973,action:googleMapsActions.navigateByLatAndLon}}
                />
            </View>
        );
    }
}


