import * as React from 'react';
import { getLoadableComponent } from './loadableComponent';

/**
 * use webpackPrefetch comment to enable prefetching
 * use webpackChunkName comment to name the generated chunk
 */
const LoadedComponent = getLoadableComponent(
    () =>
        import(/* webpackPrefetch: true, webpackChunkName: "Test" */ './Test'),
    m => m.Test
);

type AppProps = {};
interface AppState {
    showTest: boolean;
}
export class App extends React.Component<AppProps, AppState> {
    constructor(p: AppProps) {
        super(p);
        this.state = {
            showTest: false
        };
    }
    render() {
        if (this.state.showTest) {
            return <LoadedComponent n={1234} />;
        } else {
            return (
                <section>
                    <button onClick={() => this.setState({ showTest: true })}>
                        Show Loadable Component
                    </button>
                </section>
            );
        }
    }
}
