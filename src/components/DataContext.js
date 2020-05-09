import React, {  createContext, Component } from 'react'

export const DataContext = createContext()


export class DataProvider extends Component {

    state = {
        asyncKey: 0,
    }

    render() {
        return (
            <DataContext.Provider value={{
                state: this.state,
                incKey: () => {this.setState({asyncKey: this.state.asyncKey+1}) }
                
                }}  >
                {this.props.children}
            </DataContext.Provider>
        )

    }
    
}
