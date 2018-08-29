import * as React from 'react';

type PromiseWrapperStatus = 'pending' | 'fulfilled' | 'rejected';
interface PromiseWrapper<T> extends Promise<T> {
    status: PromiseWrapperStatus;
    value: T;
}
export const getPromiseWrapper = <T>(p: Promise<T>): PromiseWrapper<T> => {
    let status: PromiseWrapperStatus = 'pending';
    let res = <PromiseWrapper<T>>p.then(
        v => {
            res.status = 'fulfilled';
            res.value = v;
            return v;
        },
        e => {
            res.status = 'rejected';
            throw e;
        }
    );
    res.status = status;
    return res;
};

const awaitAll = <M>(fns: (() => Promise<M>)[]) => {
    const promises = fns.map(f => f());
    return new Promise(resolve => {
        Promise.all(promises).then(() => {
            resolve();
        });
    });
};
let moduleImporters: (() => PromiseWrapper<any>)[] = [];
export const awaitAllImports = () => awaitAll(moduleImporters);

export const getLoadableComponent = <P, M>(
    importer: () => Promise<M>,
    provider: (m: M) => React.ComponentType<P>,
    loader: (p: P) => React.ReactNode = () => 'loading...'
): React.ComponentType<P> => {
    interface LoadedComponentState {
        Component: React.ComponentType | null;
        ComponentLoader: PromiseWrapper<M>;
    }

    let capturedPromiseWrapper: PromiseWrapper<M> | null = null;
    const getCapturedPromiseWrapper = () => {
        if (!capturedPromiseWrapper) {
            capturedPromiseWrapper = getPromiseWrapper(importer());
        }
        return capturedPromiseWrapper;
    };

    moduleImporters.push(getCapturedPromiseWrapper);

    return class LoadedComponent extends React.Component<
        P,
        LoadedComponentState
    > {
        constructor(p: P) {
            super(p);
            this.state = {
                ComponentLoader: getCapturedPromiseWrapper(),
                Component:
                    getCapturedPromiseWrapper().status === 'fulfilled'
                        ? provider(getCapturedPromiseWrapper().value)
                        : null
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
