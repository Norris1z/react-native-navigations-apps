# react-native-navigation-apps

Open & Navigate With External Navigation Apps (Waze,GoogleMaps,iOS Maps) from react native

## Description
This package is a solution to open and use the navigation apps from your react-native app
for now its only support waze google maps and ios maps for ios devices

## Installation

```
npm -i --save react-native-navigation-apps
```
```
yarn add react-native-navigation-apps
```

### Usage
```javascript
import {NavigationApps,googleMapsActions,wazeActions,googleMapsTravelModes} from "./src/components/NavigationApss";

      <NavigationApps
                    modalProps={{animationType:'slide',transparent:true}}
                    modalContainerStyle={{height:300 width:300,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}
                    modalBtnCloseContainerStyle={{}}
                    modalBtnCloseStyle={{borderWidth:1}}
                    modalBtnCloseTextStyle={{fontSize:20}}
                    modalBtnOpenStyle={{borderWidth:1}}
                    modalBtnOpenTextStyle={{fontSize:50,color:'white'}}
                    modalBtnOpenText={'some text'}
                    modalBtnCloseText={'some text'}
                    iconSize={50}
                    row
                    viewMode='modal'
                    address='some default address to navigate'
                    waze={{lat:'',lon:'',action: wazeActions.navigateByAddress}}
                    googleMaps={{lat:'',lon:'',action: googleMapsActions.navigateByAddress,travelMode:googleMapsTravelModes.driving}}
                    maps={{lat:'',lon:'',action: wazeActions.navigateByAddress}}
                />
```


### Details
Each app (waze,google maps,ios maps) has its own configuration an `action` `address` and `lat` `lon`
action can be :
`navigateByAddress` -- navigate to an address by address (text)
`navigateByLatAndLon` -- navigate to an address by Latitude and Longitude
`searchLocationByLatAndLon` -- only search an address (not navigate) by Latitude and Longitude

### Properties

| Prop                  | Description                                                                                                                                                                                                                                                                                                             | Default        |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **`row`**         | align navigation apps as row     | `false` |
| **`viewMode`**       | Set navigation apps display as `modal` or `view` mode  | `view`|
| **`modalProps`**     | react native modal props       | `{}` |
| **`modalContainerStyle`**        | Styling modal container   | `{}`  |
| **`modalBtnCloseContainerStyle`**          | Styling the modal close button container |`{}`
| **`modalBtnCloseStyle`**           | Styling the modal close button   |`{}`|
| **`modalBtnCloseTextStyle`**           | Styling the modal close button text  |`{}`|
| **`modalBtnOpenStyle`**           | Styling the modal open button  |`{}`|
| **`modalBtnOpenTextStyle`**           | Styling the modal open button text  | `{}` |
| **`modalBtnOpenTitle`**           | Title for the the modal open button   |   `''`    |
| **`modalBtnCloseTitle`**           | Title for the modal close button   |   `''`    |
| **`address`**           | Set the default address for the nvigation apps   |   `''`    |
| **`waze`**           | Set configuration for waze : `action` `address` and `lat lon` ... if not set waze will take the address from the default `address` prop |   `address:'',action:navigateByAddress`,`lat`:'',`lon`:''    |
| **`googleMaps`**           |Set configuration for google maps `action` `address` and `lat lon`  ... if not set google maps will take the address from the default `address` prop   | `address:'',action:navigateByAddress`,`lat`:'',`lon`:''     |
| **`maps`**           | Set configuration for ios maps  `action` `address` and `lat lon` for ... if not set ios maps will take the address from the default `address` prop |   `address:'',action:navigateByAddress`,`lat`:'',`lon`:''   |

## IOS Usage 
To use `waze` `google maps` on iOS devices you nust to add this lines to the `info.plist`
```
<key>LSApplicationQueriesSchemes</key>
	<array>
		<string>comgooglemaps</string>
		<string>waze</string>
		<string>geo</string>
	</array>
```

## Android Usage


