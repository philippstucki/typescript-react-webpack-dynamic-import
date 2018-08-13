import * as React from 'react';

export const getLoadableComponent = <P, M>(
    importer: () => Promise<M>,
    provider: (m: M) => React.ComponentType<P>,
    loader: (p: P) => React.ReactNode = () => null
): React.ComponentType<P> => {
    interface LoadedComponentState {
        Component: React.ComponentType | null;
        ComponentLoader: Promise<M>;
    }
    return class LoadedComponent extends React.Component<
        P,
        LoadedComponentState
    > {
        constructor(p: P) {
            super(p);
            this.state = {
                ComponentLoader: importer(),
                Component: null
            };
        }
        componentDidMount() {
            this.state.ComponentLoader.then(module => {
                this.setState({ Component: provider(module) });
            });
        }
        render() {
            if (this.state.Component) {
                return React.createElement(this.state.Component, this.props);
            } else {
                return loader(this.props);
            }
        }
    };
};
