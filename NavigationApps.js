import React, { Component } from "react";
import {
    TouchableOpacity,
    Linking,
    Platform,
    Image,
    View,
    Modal,
    Text,
    StyleSheet,
    ViewPropTypes
} from "react-native";
import PropTypes from "prop-types";
import {
    googleMapsActions,
    mapsActions,
    wazeActions
} from "./NavigationAppsTools";
import ActionSheet from "react-native-actionsheet";

class NavigationApps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navApps: {
                waze: {
                    ...Platform.select({
                        ios: {
                            appDeepLinkUri: "waze://",
                            appDeepLinkUriToUse: "waze://?"
                        },
                        android: {
                            appDeepLinkUri: "waze://",
                            appDeepLinkUriToUse: "waze://?"
                        }
                    }),
                    title: "waze",
                    ...Platform.select({
                        ios: {
                            storeUri: "itms-apps://itunes.apple.com/us/app/id323229106?mt=8"
                        },
                        android: {
                            storeUri: "market://details?id=com.waze"
                        }
                    }),
                    icon: props.waze.icon
                        ? props.waze.icon
                        : require("./assets/wazeIcon.png"),
                    travelModes: {},
                    navigateByAddress: ({ address }) =>
                        encodeURI(
                            this.state.navApps.waze.appDeepLinkUriToUse +
                            `q=${address}&navigate=yes`
                        ),
                    navigateByLatAndLon: ({ lat, lon }) =>
                        encodeURI(
                            this.state.navApps.waze.appDeepLinkUriToUse +
                            `ll=${lat},${lon}&navigate=yes`
                        ),
                    searchLocationByLatAndLon: ({ lat, lon }) =>
                        encodeURI(
                            this.state.navApps.waze.appDeepLinkUriToUse + `ll=${lat},${lon}`
                        )
                },
                googleMaps: {
                    ...Platform.select({
                        ios: {
                            appDeepLinkUri: "comgooglemaps://",
                            appDeepLinkUriToUse: "comgooglemaps://?"
                        },
                        android: {
                            appDeepLinkUri: "https://www.google.com/maps/",
                            appDeepLinkUriToUse: "https://www.google.com/maps/"
                        }
                    }),
                    title: "google maps",
                    ...Platform.select({
                        ios: {
                            storeUri: "itms-apps://itunes.apple.com/us/app/id585027354?mt=8"
                        },
                        android: {
                            storeUri: "market://details?id=com.google.android.apps.maps"
                        }
                    }),
                    ...Platform.select({
                        ios: {
                            navigateByAddress: ({ address, travelMode }) =>
                                this.state.navApps.googleMaps.appDeepLinkUriToUse +
                                `daddr=${address}&directionsmode=${travelMode}`,
                            navigateByLatAndLon: ({ address, travelMode, lat, lon }) =>
                                encodeURI(
                                    this.state.navApps.googleMaps.appDeepLinkUriToUse +
                                    `q=${address}&center=${lat},${lon}`
                                ),
                            searchLocationByLatAndLon: ({ lat, lon }) =>
                                encodeURI(
                                    this.state.navApps.googleMaps.appDeepLinkUriToUse +
                                    `search/?api=1&query=${lat},${lon}`
                                )
                        },
                        android: {
                            navigateByAddress: ({ address, travelMode }) =>
                                this.state.navApps.googleMaps.appDeepLinkUriToUse +
                                `dir/?api=1&destination=${address}&travelmode=${travelMode}`,
                            navigateByLatAndLon: ({ address, travelMode, lat, lon }) =>
                                encodeURI(
                                    this.state.navApps.googleMaps.appDeepLinkUriToUse +
                                    `search/?api=1&query=${lat},${lon}`
                                ),
                            searchLocationByLatAndLon: ({ lat, lon }) =>
                                encodeURI(
                                    this.state.navApps.googleMaps.appDeepLinkUriToUse +
                                    `search/?api=1&query=${lat},${lon}`
                                )
                        }
                    }),
                    icon: props.googleMaps.icon
                        ? props.googleMaps.icon
                        : require("./assets/googleMapsIcon.png")
                },
                ...Platform.select({
                    ios: {
                        maps: {
                            appDeepLinkUri: "maps://app",
                            appDeepLinkUriToUse: "maps://app?",
                            title: "maps",
                            icon: props.maps.icon
                                ? props.maps.icon
                                : require("./assets/mapsIcon.png"),
                            travelModes: {
                                car: "d",
                                foot: "w",
                                publicTransit: "r"
                            },
                            navigateByAddress: ({ address, travelMode }) =>
                                encodeURI(
                                    this.state.navApps.maps.appDeepLinkUriToUse +
                                    `daddr=${address}&dirflg=${travelMode}`
                                ),
                            navigateByLatAndLon: ({ address, travelMode, lat, lon }) =>
                                encodeURI(
                                    this.state.navApps.maps.appDeepLinkUriToUse +
                                    `daddr=${address}&dirflg=${travelMode}&ll=${llatan},${lon}`
                                ),
                            searchLocationByLatAndLon: ({ lat, lon }) =>
                                encodeURI(
                                    this.state.navApps.maps.appDeepLinkUriToUse +
                                    `ll=${lat},${lon}`
                                )
                        }
                    }
                })
            },
            modalVisible: false
        };
        this.actionSheetRef;
    }

    handleNavApp = navApp => {
        const navAppOptions = this.props[navApp];
        const navAppItem = this.state.navApps[navApp];
        const { storeUri, appDeepLinkUri } = navAppItem;
        const address = navAppOptions.address
            ? navAppOptions.address
            : this.props.address;
        const lat = navAppOptions.lat ? navAppOptions.lat : "";
        const lon = navAppOptions.lon ? navAppOptions.lon : "";
        const travelMode = navAppOptions.travelMode ? navAppOptions.travelMode : "";
        const navAppUri = navAppItem[navAppOptions.action]({
            address,
            lat,
            lon,
            travelMode
        });

        return Linking.canOpenURL(appDeepLinkUri)
            .then(supported => {
                if (!supported) {
                    return Linking.openURL(storeUri);
                } else {
                    return Linking.openURL(navAppUri);
                }
            })
            .catch(() => err => alert(err));
    };

    renderNavigationApps = () => {
        const { iconSize } = this.props;
        return Object.keys(this.state.navApps).map((navApp, key) => {
            const navAppItem = this.state.navApps[navApp];

            return (
                <TouchableOpacity onPress={() => this.handleNavApp(navApp)} key={key}>
                    <Image
                        style={{ width: iconSize, height: iconSize }}
                        source={navAppItem.icon}
                    />
                </TouchableOpacity>
            );
        });
    };

    renderNavigationAppsAsModal = () => {
        const setModalVisible = visible => {
            this.setState({ modalVisible: visible });
        };
        const renderModalBtnOpen = () => {
            const {
                modalBtnOpenStyle,
                modalBtnOpenTitle,
                modalBtnOpenTextStyle,
                modalBtnOpenDisable
            } = this.props;

            return (
                <TouchableOpacity
                    style={modalBtnOpenStyle}
                    onPress={() => (modalBtnOpenDisable ? null : setModalVisible(true))}
                >
                    <Text style={modalBtnOpenTextStyle}>{modalBtnOpenTitle}</Text>
                </TouchableOpacity>
            );
        };
        const renderModalBtnClose = () => {
            const {
                modalBtnCloseStyle,
                modalBtnCloseTitle,
                modalBtnCloseTextStyle
            } = this.props;

            return (
                <TouchableOpacity
                    style={modalBtnCloseStyle}
                    onPress={() => {
                        setModalVisible(false);
                    }}
                >
                    <Text style={modalBtnCloseTextStyle}>{modalBtnCloseTitle}</Text>
                </TouchableOpacity>
            );
        };

        const {
            modalProps,
            modalContainerStyle,
            modalCloseBtnContainerStyle
        } = this.props;
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
        );
    };

    renderNavigationAppsAsActionSheet = () => {
        const renderActionSheetOpenBtn = () => {
            const {
                actionSheetBtnOpenStyle,
                actionSheetBtnOpenTitle,
                actionSheetBtnOpenTextStyle,
                actionSheetBtnOpenDisable
            } = this.props;
            return (
                <TouchableOpacity
                    style={actionSheetBtnOpenStyle}
                    onPress={() =>
                        actionSheetBtnOpenDisable ? null : this.actionSheetRef.show()
                    }
                >
                    {this.props.actionSheetBtnComponent ? (
                        this.props.actionSheetBtnComponent()
                    ) : (
                            <Text style={actionSheetBtnOpenTextStyle}>
                                {actionSheetBtnOpenTitle}
                            </Text>
                        )}
                </TouchableOpacity>
            );
        };
        const actionSheetOptions = () => {
            const { actionSheetBtnCloseTitle } = this.props;
            const actionSheetArray = ["Waze", "Google Maps"];

            if (Platform.OS === "ios") {
                actionSheetArray.push("Maps");
            }
            actionSheetArray.push(actionSheetBtnCloseTitle);
            return actionSheetArray;
        };
        const { actionSheetTitle } = this.props;
        const originalValues = [];
        originalValues["Waze"] = "waze";
        originalValues["Google Maps"] = "googleMaps";
        originalValues["Maps"] = "maps";
        return (
            <React.Fragment>
                {renderActionSheetOpenBtn()}
                <ActionSheet
                    ref={ref => (this.actionSheetRef = ref)}
                    title={actionSheetTitle}
                    options={actionSheetOptions()}
                    cancelButtonIndex={actionSheetOptions().length - 1}
                    destructiveButtonIndex={actionSheetOptions().length - 1}
                    onPress={index => {
                        if (index !== actionSheetOptions().length - 1) {
                            this.handleNavApp(originalValues[actionSheetOptions()[index]]);
                        }
                    }}
                />
            </React.Fragment>
        );
    };

    renderNavigationAppsView = () => {
        const { row, viewContainerStyle } = this.props;
        return (
            <View
                style={[{ flexDirection: row ? "row" : "column" }, viewContainerStyle]}
            >
                {this.renderNavigationApps()}
            </View>
        );
    };

    renderMainView = () => {
        const { viewMode } = this.props;
        switch (viewMode) {
            case "view":
                return this.renderNavigationAppsView();
            case "modal":
                return this.renderNavigationAppsAsModal();
            case "sheet":
                return this.renderNavigationAppsAsActionSheet();
            default:
                return this.renderNavigationAppsView();
        }
    };

    render() {
        return this.renderMainView();
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    }
});

NavigationApps.defaultProps = {
    waze: {
        action: wazeActions.navigateByAddress,
        address: "",
        lat: "",
        lon: "",
        icon: null
    },
    googleMaps: {
        action: googleMapsActions.navigateByAddress,
        address: "",
        lat: "",
        lon: "",
        travelMode: "driving",
        icon: null
    },
    maps: {
        action: mapsActions.navigateByAddress,
        address: "",
        lat: "",
        lon: "",
        travelMode: "d",
        icon: null
    },
    iconSize: 100,
    viewMode: "view",
    row: false,
    viewContainerStyle: {},
    modalProps: {},
    modalContainerStyle: {},
    modalBtnOpenTitle: "open modal",
    modalBtnCloseTitle: "close modal",
    modalBtnCloseContainerStyle: {},
    modalBtnCloseStyle: {},
    modalBtnCloseTextStyle: {},
    modalBtnOpenTextStyle: {},
    modalBtnOpenStyle: {},
    modalBtnDisable: false,
    actionSheetBtnOpenTitle: "open action sheet",
    actionSheetBtnCloseTitle: "close action sheet",
    actionSheetTitle: "choose navigation app",
    actionSheetBtnOpenStyle: {},
    actionSheetBtnOpenTextStyle: {},
    actionSheetBtnOpenDisable: false,
    address: ""
};
NavigationApps.propTypes = {
    appsOptions: PropTypes.object,
    iconSize: PropTypes.number,
    viewMode: PropTypes.oneOf(["view", "modal", "sheet"]),
    row: PropTypes.bool,
    address: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    modalBtnOpenTitle: PropTypes.string,
    modalBtnCloseTitle: PropTypes.string,
    modalBtnCloseContainerStyle: ViewPropTypes.style,
    modalBtnCloseStyle: ViewPropTypes.style,
    modalBtnCloseTextStyle: Text.propTypes.style,
    modalBtnOpenTextStyle: Text.propTypes.style,
    modalBtnOpenStyle: ViewPropTypes.style,
    modalProps: PropTypes.object,
    modalContainerStyle: PropTypes.object,
    actionSheetBtnOpenTitle: PropTypes.string,
    actionSheetBtnCloseTitle: PropTypes.string,
    actionSheetTitle: PropTypes.string,
    actionSheetBtnOpenStyle: ViewPropTypes.style,
    actionSheetBtnOpenTextStyle: Text.propTypes.style,
    actionSheetBtnOpenDisable: PropTypes.bool,
    modalBtnOpenDisable: PropTypes.bool,
    actionSheetBtnComponent: PropTypes.func
};

export { NavigationApps };
