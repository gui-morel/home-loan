import React from "react";
import {absolutePerformance} from "./formula";

export type AbsolutePerformanceState = {
    investedCapital: number
    actualCapital: number
}

export const AbsolutePerformance = ({investedCapital, actualCapital}: AbsolutePerformanceState) => {
    const performance = absolutePerformance(investedCapital, actualCapital)
    return <div>
        <figure className="text-center m-3">
            <blockquote className="blockquote">
                <p>You've invested {investedCapital.toLocaleString()} units and now hold a capital
                    of {actualCapital.toLocaleString()}, marking an performance {(performance * 100).toFixed(2)}%.</p>
            </blockquote>
            <figcaption className="blockquote-footer">
                Formula: <a href="https://en.wikipedia.org/wiki/Absolute_return" target="_blank" rel="noopener">Absolute
                return</a>
            </figcaption>
        </figure>
    </div>
}