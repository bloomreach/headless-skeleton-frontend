import React from "react";
import {Cookies} from "react-cookie";

export const simple = 0;
export const advanced = 1;

export const ModeContext = React.createContext({});

const cookies = new Cookies();

export default class ModeProvider extends React.Component {
    constructor(props) {
        super(props);
        // Initialize the state
        const initMode = parseInt(cookies.get(`mode`)) ?? 0;
        cookies.set('mode', initMode, {
            secure: true,
            sameSite: 'none'
        });
        this.state = {
            mode: initMode,
        };
        this.setMode = this.setMode.bind(this);
    }

    setMode = (mode) => {
        cookies.set('mode', mode, {
            secure: true,
            sameSite: 'none'
        });
        this.setState({mode: mode});
    }

    render() {
        return (
            <ModeContext.Provider value={{
                ...this.state,
                setMode: this.setMode,
            }}>
                {this.props.children}
            </ModeContext.Provider>
        );
    }
}



