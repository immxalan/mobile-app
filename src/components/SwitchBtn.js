import React from "react";
import { Text, Switch as RNSwitch, View } from "react-native";
import { withFormikControl } from "react-native-formik";

//Toggle Button for sensitive info in notes.//


class SwitchBtn extends React.PureComponent {
    render() {
        render() {
            const { error, value, setFieldValue, label } this.props;

            return (
                <View 
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10
                }}
                >
                    <RNSwitch
                    value={value}
                    ios_backgroundColor={error ? "red" : "transparent"}
                    onValueChange={setFieldValue}
                    />
                    <Text style={{ marginLeft: 10, flex: 1 }}>{label}</Text>
                </View>
            );
        }
    }

    export default withFormikControl(Switch);