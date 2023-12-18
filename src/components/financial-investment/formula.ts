export const modifiedDietzMethod = (gainsOrLoss: number, averageCapital: number) => {
    return gainsOrLoss / averageCapital
}

export const gainsOrLoss = (portfolioCapital: number, movements: number[]) => {
    const sumOfMovements = movements.reduce((acc, currentValue) => acc + currentValue, 0);
    return portfolioCapital - sumOfMovements
}


export type Movement = {
    id: number,
    amount: number,
    executionDate: number,
}

export const contributionWeightedOverTime = (today: number, movements: Movement[]) => {
    const movementWithDayCount = movements.map(movement => ({
            amount: movement.amount,
            dayCount: dayBetween(movement.executionDate, today)
        })
    );
    const maxDayCount = movementWithDayCount.reduce((acc, {dayCount}) => Math.max(acc, dayCount), 0)
    return movementWithDayCount.reduce((acc, {
        amount,
        dayCount
    }) => acc + amount * (dayCount / maxDayCount), 0)
}

export const dayBetween = (date1: number, date2: number) => {
    const diffInTime = date1 - date2;
    const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
    return Math.abs(diffInDays);
}

export const absolutePerformance = (invested: number, value: number) => {
    return (value - invested) / invested
}