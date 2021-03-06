import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Tabs, Tab, Input } from 'native-base';
import { SearchBar } from 'react-native-elements';
import constants from '../../../helpers/constants';
import {
    isName,
    isEmail,
    isAddress,
    isPhone,
    isUrl,
} from '../../../helpers/inputValidators';
import { connect } from 'react-redux';
import {
    getInfo,
    stopSearchMe,
    sendSearchErrorMessage,
} from '../../../store/actions';
import { Ionicons } from '@expo/vector-icons';

class SearchForm extends Component {

    state = {
        name: '',
        location: '',
        email: '',
        address: '',
        phone: '',
        url: '',
        tabPage: 0,
        showNoInputMessage: false,
    };

    componentDidUpdate(prevProps, prevState) {

        if (this.props.searchMe && this.props.queryType) {
            this.changeHandler(this.props.queryType, this.props.info);
            this.handleFormSubmit();
            this.props.stopSearchMe();
        }

    }

    changeHandler = (name, text) => {

        const tabPages = { name: 0, email: 1, address: 2, phone: 3, url: 4 };

        this.setState({
            ...this.state,
            [name]: text,
            tabPage: tabPages[name],
        });

    }

    handleFormSubmit = () => {

        let formattedObject = null;

        console.log('this is the state ', this.state);

        let searchType = this.state.tabPage; // number

        let mainValue = '';

        if (searchType == 0) { mainValue = this.state.name }
        else if (searchType == 1) { mainValue = this.state.email }
        else if (searchType == 2) { mainValue = this.state.address }
        else if (searchType == 3) { mainValue = this.state.phone }
        else if (searchType == 4) { mainValue = this.state.url }

        if (mainValue.trim().length == 0) {
            console.log('No search input provided');
            console.log('state now: ', this.state);

            this.setState({ ...this.state, showNoInputMessage: true });
            console.log('state now: ', this.state);
            return;
        }

        if (isName(mainValue)) {
            if (!this.state.tabPage == 0) {
                this.setState({ ...this.state, email: mainValue, location: '', tabPage: 0 });
            }
            searchType = 'name';
            formattedObject = this.formatRequestObject(mainValue, 'name');
        }
        else if (isEmail(mainValue)) {
            if (!this.state.tabPage == 1) {
                this.setState({ ...this.state, email: mainValue, tabPage: 1 });
            }
            searchType = 'email';
            formattedObject = this.formatRequestObject(mainValue, 'email');
        }
        else if (isAddress(mainValue)) {
            if (!this.state.tabPage == 2) {
                this.setState({ ...this.state, address: mainValue, tabPage: 2 });
            }
            searchType = 'address';
            formattedObject = this.formatRequestObject(mainValue, 'address');
        }
        else if (isPhone(mainValue)) {
            if (!this.state.tabPage == 3) {
                this.setState({ ...this.state, phone: mainValue, tabPage: 3 });
            }
            searchType = 'phone';
            formattedObject = this.formatRequestObject(mainValue, 'phone');
        }
        else if (isUrl(mainValue)) {
            if (!this.state.tabPage == 2) {
                this.setState({ ...this.state, url: mainValue, tabPage: 4 });
            }
            searchType = 'url';
            formattedObject = this.formatRequestObject(mainValue, 'url');
        }

        if (formattedObject) {
            this.props.handleSearch(formattedObject, searchType);
        }
        else {
            console.log('formattedObject: error');
            this.props.sendSearchErrorMessage({ mainValue });
        }
    };

    formatRequestObject = (inputValue, type) => {

        const person = {};
        let location;

        console.log('formatRequestObject {} {}', type, inputValue);

        switch (type) {
        case 'name':

            if (this.state.name?.trim().length == 0) {
                console.warn('No name provided');
                return;
            }

            person.names = [];
            person.names.push({ raw: this.state.name });

            location = this.state.location.trim();

            if (location) {
                person.addresses = [];
                person.addresses.push({ raw: location });
            }

            break;

        case 'email':

            person.emails = [];
            person.emails.push({
                address: this.state.email,
            });

            break;

        case 'address':

            person.addresses = [];
            person.addresses.push({ raw: this.state.address });

            break;

        case 'phone':

            person.phones = [];
            person.phones.push({
                number: this.state.phone.replace(/[^0-9]+/g, ''),
            });

            break;

        case 'url':

            person.urls = [];
            person.urls.push({
                url: this.state.url,
            });

            break;

        default:

            break;

        }

        return person;

    };

    startOver = () => {

        this.props.resetReduxState();
        this.setState({
            name: '',
            location: '',
            email: '',
            address: '',
            phone: '',
            url: '',
            showNoInputMessage: false,
            tabPage: 0,
        });

    };

    tabChanged = (event) => {

        console.log('tab index: ', event.i);
        this.setState({ ...this.state, tabPage: event.i });

    }

    render() {

        return (
            <View style={{ marginBottom: 20 }}>
                <Tabs
                    style={styles.container}
                    activeTextStyle={{ color: '#64aab8' }}
                    tabBarUnderlineStyle={{ backgroundColor: '#0279AC' }}
                    page={this.state.tabPage}
                    onChangeTab={(i) => this.tabChanged(i)}
                >
                    <Tab
                        heading="Name"
                        style={[ styles.nameInput, { color: '#64aab8' } ]}
                        activeTextStyle={styles.activeTextStyle}
                        textStyle={styles.textStyle}
                        activeTabStyle={{ backgroundColor: '#fff' }}
                        tabStyle={{ backgroundColor: '#fff' }}
                    >
                        <View style={styles.nameInputFullWidth}>
                            <View style={styles.peopleSearch}>
                                <Input
                                    placeholder="First Middle Last Name"
                                    placeholderTextColor='rgba(24,23,21,.5)'
                                    style={styles.textInput}
                                    value={this.state.name}
                                    onChangeText={(text) => this.changeHandler('name', text)}
                                    lightTheme
                                    autoCapitalize="words"

                                />

                            </View>
                            <View style={styles.peopleSearch}>
                                <Input
                                    placeholder="City, State (Optional)"
                                    placeholderTextColor='rgba(24,23,21,.5)'
                                    style={styles.textInput}
                                    value={this.state.location}
                                    onChangeText={(text) => this.changeHandler('location', text)}
                                    lightTheme
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>
                    </Tab>

                    <Tab
                        heading="Email"
                        activeTextStyle={{ ...styles.activeTextStyle, color: '#0279ac' }}
                        textStyle={styles.textStyle}
                        activeTabStyle={[ { backgroundColor: '#fff' } ]}
                        tabStyle={[ { backgroundColor: '#fff' } ]}
                        style={[ { flex: 0 } ]}
                    >
                        <View style={styles.searchBar}>
                            <SearchBar
                                placeholder="Email Address"
                                placeholderTextColor='rgba(24,23,21,.5)'
                                containerStyle={styles.textInputWide}
                                inputContainerStyle={{ backgroundColor: '#fff' }}
                                inputStyle={{ backgroundColor: '#fff' }}
                                value={this.state.email}
                                onChangeText={(text) => this.changeHandler('email', text)}
                                lightTheme
                                autoCapitalize='none'
                            />
                        </View>
                    </Tab>

                    <Tab
                        heading="Addr."
                        activeTextStyle={styles.activeTextStyle}
                        textStyle={styles.textStyle}
                        activeTabStyle={{ backgroundColor: '#fff' }}
                        tabStyle={{ backgroundColor: '#fff' }}
                    >
                        <View>
                            <SearchBar
                                placeholder="Mailing Address"
                                placeholderTextColor='rgba(24,23,21,.5)'
                                containerStyle={styles.textInputWide}
                                inputContainerStyle={{ backgroundColor: '#fff' }}
                                inputStyle={{ backgroundColor: '#fff' }}
                                value={this.state.address}
                                onChangeText={(text) => this.changeHandler('address', text)}
                                lightTheme
                                autoCapitalize="none"
                            />
                        </View>
                    </Tab>

                    <Tab
                        heading="Phone"
                        activeTextStyle={styles.activeTextStyle}
                        textStyle={styles.textStyle}
                        activeTabStyle={{ backgroundColor: '#fff' }}
                        tabStyle={{ backgroundColor: '#fff' }}
                    >
                        <View>
                            <SearchBar
                                placeholder="Phone Number"
                                placeholderTextColor='rgba(24,23,21,.5)'
                                containerStyle={styles.textInputWide}
                                inputContainerStyle={{ backgroundColor: '#fff' }}
                                inputStyle={{ backgroundColor: '#fff' }}
                                value={this.state.phone}
                                onChangeText={(text) => this.changeHandler('phone', text)}
                                lightTheme
                                autoCapitalize="none"

                            />
                        </View>
                    </Tab>

                    <Tab
                        heading="URL"
                        activeTextStyle={styles.activeTextStyle}
                        textStyle={styles.textStyle}
                        activeTabStyle={{ backgroundColor: '#fff' }}
                        tabStyle={{ backgroundColor: '#fff' }}
                    >
                        <View>
                            <SearchBar
                                placeholder="URL"
                                placeholderTextColor='rgba(24,23,21,.5)'
                                containerStyle={styles.textInputWide}
                                inputContainerStyle={{ backgroundColor: '#fff' }}
                                inputStyle={{ backgroundColor: '#fff' }}
                                value={this.state.url}
                                onChangeText={(text) => this.changeHandler('url', text)}
                                lightTheme
                                autoCapitalize="none"
                            />
                        </View>
                    </Tab>
                </Tabs>
                <View style={{ flexDirection: 'row', margin: 16, justifyContent: 'space-between' }}>
                    <Button style={styles.button} onPress={() => {
                        this.setState({
                            name: `${this.state.name}`,
                            location: `${this.state.location}`,
                            email: this.state.email,
                            address: this.state.address,
                            phone: this.state.phone,
                            url: this.state.url,
                            tabPage: this.state.tabPage || 0,
                            showNoInputMessage: false,
                        }, () => this.handleFormSubmit());
                    }}>
                        <Text style={styles.buttonText}> Search </Text>
                    </Button>

                    <Button style={styles.greyButton} onPress={this.startOver}>
                        <Text style={{ ...styles.buttonText, color: '#0279ac' }}> Clear </Text>
                    </Button>
                </View>

                {(this.state.showNoInputMessage) ? (
                    <View>
                        <Text>Enter a value above to search</Text>
                    </View>
                ) : null }
            </View>
        );

    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#fff',
        margin: 5,
        flex: 0,
    },

    searchBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    textInput: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: .5,
        borderStyle: 'solid',
        borderRadius: 4,
        width: '45%',
        marginRight: 12,
        marginLeft: 12,
        color: 'black',
    },

    textInputWide: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: .5,
        borderStyle: 'solid',
        borderRadius: 4,
        width: '95%',
        marginTop: 45,
        marginRight: 12,
        marginLeft: 12,
        backgroundColor: 'white',
    },

    textInputSmall: {
        flex: 1,
    },

    nameInput: {
        flexDirection: 'row',
    },

    button: {
        marginVertical: 15,
        padding: 10,
        backgroundColor: '#0279AC',
        width: '58%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    tab: {
        backgroundColor: 'white',
    },

    buttonText: {
        color: 'white',
    },

    link: {
        color: '#64aab8',
        lineHeight: 17,
        padding: 15,
        backgroundColor: `${constants.highlightColor}`,
        borderRadius: 10,
        marginBottom: 20,
    },

    matchesText: {
        fontSize: 20,
        color: `${constants.highlightColor}`,
        marginBottom: 20,
    },

    greyButton: {
        backgroundColor: 'white',
        marginVertical: 15,
        padding: 10,
        width: '37%',
        borderWidth: 1,
        borderColor: '#0279AC',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0279AC',
    },

    activeTextStyle: {
        color: '#0279AC',
        fontFamily: constants.lotoFamily,
        fontSize: 16,
    },

    textStyle: {
        color: '#18171568',
        fontFamily: constants.lotoFamily,
        fontSize: 16,
    },

    nameInputFullWidth: {
        width: '100%',
    },

    peopleSearch: {
        flexDirection: 'row',
        paddingTop: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '5%',

    },

});

const mapStateToProps = (state) => {

    const {
        info,
        queryType,
        searchMe,
    } = state.confirmationModal;

    return {
        info,
        queryType,
        searchMe,
    };

};

export default connect(
    mapStateToProps,
    {
        getInfo,
        stopSearchMe,
        sendSearchErrorMessage,
    },
)(SearchForm);
