import React, {Component} from 'react';
import {
    TouchableOpacity,
    Linking,
    Platform,
    Image,
    View,
    Modal,
    Text,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import {googleMapsActions, mapsActions, wazeActions} from "./NavigationAppsTools";

class NavigationApps extends Component {

    constructor(props) {
        super(props);
        this.state = {
            navApps: {
                'waze': {
                    ...Platform.select({
                        ios: {
                            appDeepLinkUri: 'waze://',
                            appDeepLinkUriToUse: 'waze://?'
                        },
                        android: {
                            appDeepLinkUri: 'waze://',
                            appDeepLinkUriToUse: 'waze://?',
                        }
                    }),
                    title: 'waze',
                    ...Platform.select({
                        ios: {
                            storeUri: 'itms-apps://itunes.apple.com/us/app/id323229106?mt=8',
                        },
                        android: {
                            storeUri: 'market://details?id=com.waze',
                        }
                    }),
                    icon: props.waze.icon ? props.waze.icon : require('./assets/wazeIcon.png'),
                    travelModes: {},
                    navigateByAddress: ({address}) => encodeURI(this.state.navApps.waze.appDeepLinkUriToUse + `q=${address}&navigate=yes`),
                    navigateByLatAndLon: ({lat, lon}) => encodeURI(this.state.navApps.waze.appDeepLinkUriToUse + `ll=${lat},${lon}&navigate=yes`),
                    searchLocationByLatAndLon: ({lat, lon}) => encodeURI(this.state.navApps.waze.appDeepLinkUriToUse + `ll=${lat},${lon}`)
                },
                'googleMaps': {

                    ...Platform.select({
                        ios: {
                            appDeepLinkUri: 'comgooglemaps://',
                            appDeepLinkUriToUse: 'comgooglemaps://?'
                        },
                        android: {
                            appDeepLinkUri: 'geo://',
                            appDeepLinkUriToUse: 'geo://?',
                        }
                    }),
                    title: 'google maps',
                    ...Platform.select({
                        ios: {
                            storeUri: 'itms-apps://itunes.apple.com/us/app/id585027354?mt=8',
                        },
                        android: {
                            storeUri: 'market://details?id=com.google.android.apps.maps',
                        }
                    }),
                    icon: props.googleMaps.icon ? props.googleMaps.icon : require('./assets/googleMapsIcon.png'),
                    navigateByAddress: ({address, travelMode}) => this.state.navApps.googleMaps.appDeepLinkUriToUse + `daddr=${address}&directionsmode=${travelMode}`,
                    navigateByLatAndLon: ({address, travelMode, lan, lon}) => encodeURI(this.state.navApps.maps.appDeepLinkUriToUse + `daddr=${address}&directionsmode=${travelMode}&ll=${lan},${lon}`),
                    searchLocationByLatAndLon: ({lat, lon}) => encodeURI(this.state.navApps.googleMaps.appDeepLinkUriToUse + `search/?api=1&query=${lat},${lon}`)
                },
                ...Platform.select({
                    ios: {
                        'maps': {
                            appDeepLinkUri: 'maps://app',
                            appDeepLinkUriToUse: 'maps://app?',
                            title: 'maps',
                            icon: props.maps.icon ? props.maps.icon : require('./assets/mapsIcon.png'),
                            travelModes: {
                                'car': 'd',
                                'foot': 'w',
                                'publicTransit': 'r'
                            },
                            navigateByAddress: ({address, travelMode}) => encodeURI(this.state.navApps.maps.appDeepLinkUriToUse + `daddr=${address}&dirflg=${travelMode}`),
                            navigateByLatAndLon: ({address, travelMode, lan, lon}) => encodeURI(this.state.navApps.maps.appDeepLinkUriToUse + `daddr=${address}&dirflg=${travelMode}&ll=${lan},${lon}`),
                            searchLocationByLatAndLon: ({lat, lon}) => encodeURI(this.state.navApps.maps.appDeepLinkUriToUse + `ll=${lat},${lon}`)

                        },

                    }
                })

            },
            modalVisible: false
        }
    }

    handleNavApp = (navApp) => {

        const navAppOptions = this.props[navApp];
        const navAppItem = this.state.navApps[navApp];
        const {storeUri, appDeepLinkUri} = navAppItem;
        const address = navAppOptions.address ? navAppOptions.address : this.props.address;
        const lat = navAppOptions.lat ? navAppOptions.lat : '';
        const lon = navAppOptions.lon ? navAppOptions.lon : '';
        const travelMode = navAppOptions.travelMode ? navAppOptions.travelMode : '';
        const navAppUri = navAppItem[navAppOptions.action]({address, lat, lon, travelMode});


        return Linking.canOpenURL(appDeepLinkUri).then(supported => {

            if (!supported) {
                return Linking.openURL(storeUri);
            }
            else {
                return Linking.openURL(navAppUri);
            }

        }).catch(() => err => alert(err))

    };

    renderNavigationApps = () => {
        const {iconSize} = this.props;
        return (
            Object.keys(this.state.navApps).map((navApp, key) => {

                const navAppItem = this.state.navApps[navApp];

                return (
                    <TouchableOpacity onPress={() => this.handleNavApp(navApp)} key={key}>
                        <Image style={{width: iconSize, height: iconSize}} source={navAppItem.icon}/>
                    </TouchableOpacity>
                )

            })
        )
    };

    renderNavigationAppsAsModal = () => {

        const setModalVisible = (visible) => {
            this.setState({modalVisible: visible});
        };
        const renderModalBtnOpen = () => {

            const {modalBtnOpenStyle, modalBtnOpenTitle, modalBtnOpenTextStyle} = this.props;

            return (
                <TouchableOpacity style={modalBtnOpenStyle} onPress={() => {
                    setModalVisible(true)
                }}>
                    <Text style={modalBtnOpenTextStyle}>{modalBtnOpenTitle}</Text>
                </TouchableOpacity>
            )

        };
        const renderModalBtnClose = () => {


            const {modalBtnCloseStyle,modalBtnCloseTitle, modalBtnCloseTextStyle} = this.props;

            return (
                <TouchableOpacity style={modalBtnCloseStyle} onPress={() => {
                    setModalVisible(false)
                }}>
                    <Text style={modalBtnCloseTextStyle}>{modalBtnCloseTitle}</Text>
                </TouchableOpacity>
            )
        };


        const {modalProps, modalContainerStyle, modalCloseBtnContainerStyle} = this.props;
        return (
            <React.Fragment>
                {renderModalBtnOpen()}
                <Modal {...modalProps} visible={this.state.modalVisible}>
                    <View style={styles.modalStyle}>
                        <View style={modalContainerStyle}>
                            {this.renderNavigationAppsView()}
                            <View style={modalCloseBtnContainerStyle}>
                                {renderModalBtnClose()}
                            </View>
                        </View>

                    </View>
                </Modal>
            </React.Fragment>
        )
    };

    renderNavigationAppsView = () => {
        const {row, viewContainerStyle} = this.props;
        return (
            <View style={[{flexDirection: row ? 'row' : 'column'}, viewContainerStyle]}>
                {this.renderNavigationApps()}
            </View>
        )
    };

    render() {
        const {viewMode} = this.props;
        return (
            viewMode === 'view' ? this.renderNavigationAppsView() : this.renderNavigationAppsAsModal()
        )
    }
}

const styles = StyleSheet.create({

    modalStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }

});

NavigationApps.defaultProps = {

    waze: {

        action: wazeActions.navigateByAddress,
        address: '',
        lat: '',
        lon: '',
        icon: null
    },
    googleMaps: {
        action: googleMapsActions.navigateByAddress,
        address: '',
        lat: '',
        lon: '',
        travelMode: 'driving',
        icon: null
    },
    maps: {
        action: mapsActions.navigateByAddress,
        address: '',
        lat: '',
        lon: '',
        travelMode: 'd',
        icon: null
    },
    iconSize: 100,
    viewMode: 'view',
    row: false,
    viewContainerStyle: {},
    modalProps: {},
    modalContainerStyle:{},
    modalBtnOpenTitle: '',
    modalBtnCloseTitle: '',
    modalBtnCloseContainerStyle: {},
    modalBtnCloseStyle: {},
    modalBtnCloseTextStyle: {},
    modalBtnOpenTextStyle: {},
    modalBtnOpenStyle: {},
    address: '',


};
NavigationApps.propTypes = {
    appsOptions: PropTypes.object,
    iconSize: PropTypes.number,
    viewMode: PropTypes.oneOf(['view', 'modal']),
    row: PropTypes.bool,
    address: PropTypes.string,
    containerStyle: View.propTypes.style,
    modalBtnOpenTitle: PropTypes.string,
    modalBtnCloseTitle: PropTypes.string,
    modalBtnCloseContainerStyle: View.propTypes.style,
    modalBtnCloseStyle: View.propTypes.style,
    modalBtnCloseTextStyle: Text.propTypes.style,
    modalBtnOpenTextStyle: Text.propTypes.style,
    modalBtnOpenStyle: View.propTypes.style,
    modalProps: PropTypes.object,
    modalContainerStyle:PropTypes.object
};

export {NavigationApps}