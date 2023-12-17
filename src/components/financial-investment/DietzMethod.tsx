import {contributionWeightedOverTime, gainsOrLoss, modifiedDietzMethod} from "./formula";
import React from "react";
import {DietzState} from "./Investment";

export const DietzMethod = ({endDate, flow, currentCapital}: DietzState) => {
    const performance = modifiedDietzMethod(
        gainsOrLoss(currentCapital, flow.map(it => it.amount)),
        contributionWeightedOverTime(endDate, flow)
    );
    return <div>
        <figure className="text-center m-3">
            <blockquote className="blockquote">
                <p>The {endDate.toLocaleDateString()} your performance is {(performance * 100).toFixed(2)}%</p>
            </blockquote>
            <figcaption className="blockquote-footer">
                Formula: <a href="https://en.wikipedia.org/wiki/Modified_Dietz_method" target="_blank" rel="noopener">Modified Dietz method</a>
            </figcaption>
        </figure>
    </div>
}