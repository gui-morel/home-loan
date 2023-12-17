import {describe, it, expect} from 'vitest';
import {contributionWeightedOverTime, dayBetween, gainsOrLoss, modifiedDietzMethod, Movement} from "./formula";

describe('Formula', () => {
    describe('Modified Dietz method - Performance', () => {
        [
            {gainOrLost: 900, averageCapital: 10000, expectedPerformance: 0.09},
            {gainOrLost: 2000, averageCapital: 10000, expectedPerformance: 0.2},
            {gainOrLost: -2000, averageCapital: 10000, expectedPerformance: -0.2},
        ].forEach(({
                       averageCapital,
                       gainOrLost,
                       expectedPerformance
                   }) =>
            it(`gainOrLost=[${gainOrLost}], averageCapital=[${averageCapital}] should equals ${expectedPerformance}`, () => {
                const dietzMethodPerformance = modifiedDietzMethod(gainOrLost, averageCapital);
                expect(dietzMethodPerformance).toEqual(expectedPerformance)
            })
        );

        it(`Dietz method should compute performance of movements flow`, () => {
            const today = new Date('01/01/2020').getTime()
            const givenFlow: Movement[] = [
                {amount: 100000, executionDate: new Date('01/01/2019').getTime()},
                {amount: -50000, executionDate: new Date('05/16/2019').getTime()},
                {amount: 150000, executionDate: new Date('07/29/2019').getTime()},
            ]

            const computedPerformance = modifiedDietzMethod(
                gainsOrLoss(220000, givenFlow.map(it => it.amount)),
                contributionWeightedOverTime(today, givenFlow)
            );

            expect(computedPerformance).toEqual(0.1508264462809917);
        });
    });

    describe('Modified Dietz method - Gains or loss', () => {
        [
            {portfolioCapital: 3000, flow: [2000], expectedGainsOrLoss: 1000},
            {portfolioCapital: 3000, flow: [2000, 300], expectedGainsOrLoss: 700},
            {portfolioCapital: 3000, flow: [2000, -300], expectedGainsOrLoss: 1300},
        ].forEach(({expectedGainsOrLoss, flow, portfolioCapital}) =>
            it(`portfolioCapital=[${portfolioCapital}], flow=[${flow}] should equals ${expectedGainsOrLoss}`, () => {
                const actualGainsOrLoss = gainsOrLoss(portfolioCapital, flow);
                expect(actualGainsOrLoss).toEqual(expectedGainsOrLoss)
            })
        );
    });

    describe('Modified Dietz method - Contribution Weighted Over Time', () => {
        it(`Sum of inflow and outflow weighted over time`, () => {
            const today = new Date('01/01/2020').getTime()
            const givenFlow: Movement[] = [
                {amount: 100000, executionDate: new Date('01/01/2019').getTime()},
                {amount: -50000, executionDate: new Date('05/16/2019').getTime()},
                {amount: 150000, executionDate: new Date('07/29/2019').getTime()},
            ]
            const expectedWeightedOverTime = 132602.73972602742
            const weightedOverTime = contributionWeightedOverTime(today, givenFlow);
            expect(weightedOverTime).toEqual(expectedWeightedOverTime);
        });

        [
            {date1: new Date("06/24/2019"), date2: new Date("07/29/2019"), expectedDays: 35},
            {date1: new Date("07/29/2019"), date2: new Date("06/24/2019"), expectedDays: 35},
            {date1: new Date("07/29/2019"), date2: new Date("07/29/2019"), expectedDays: 0},
        ].forEach(({date1, date2, expectedDays}) =>
            it(`Between ${date1.toLocaleDateString()} and ${date2.toLocaleDateString()} there is ${expectedDays} days`, () => {
                const daysBetween = dayBetween(date1.getTime(), date2.getTime());
                expect(daysBetween).toEqual(expectedDays)
            })
        );
    });

});
