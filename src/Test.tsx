import * as React from 'react';

interface TestProps {
    n: number;
}
export const Test = (p: TestProps) => (
    <div>
        <h6>Dynamically loaded Component</h6>
        <p>n = {p.n}</p>
    </div>
);
