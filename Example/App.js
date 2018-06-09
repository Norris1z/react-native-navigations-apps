import React, {Component} from 'react';
import {View} from 'react-native';
import {NavigationApps,googleMapsActions,wazeActions,googleMapsTravelModes,mapsActions} from "./src/components/NavigationApss";


export default class App extends Component {
    render() {
        return (
            <View style={{flex: 1,alignItems:'center',justifyContent:'center',backgroundColor:'black'}}>
                <NavigationApps
                    modalProps={{
                            animationType:'slide',
                            transparent:true
                        }}
                    modalContainerStyle={{
                        height:300 , width:300,backgroundColor:'white',justifyContent:'center',alignItems:'center'
                    }}
                    modalBtnCloseContainerStyle={{}}
                    modalBtnCloseStyle={{borderWidth:1}}
                    modalBtnCloseTextStyle={{fontSize:20}}
                    modalBtnOpenStyle={{borderWidth:1}}
                    modalBtnOpenTextStyle={{fontSize:50,color:'white'}}
                    modalBtnOpenTitle={'open modal'}
                    modalBtnCloseTitle={'close modal'}
                    iconSize={50}
                    row
                    viewMode='modal'
                    address='new york'
                    waze={{action: wazeActions.navigateByAddress}}
                    googleMaps={{action: googleMapsActions.navigateByAddress,travelMode:googleMapsTravelModes.driving}}
                    maps={{action:mapsActions.navigateByAddress}}
                />
            </View>
        );
    }
}


