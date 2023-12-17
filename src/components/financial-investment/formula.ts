export const modifiedDietzMethod = (gainsOrLoss: number, averageCapital: number) => {
    return gainsOrLoss / averageCapital
}

export const gainsOrLoss = (portfolioCapital: number, movements: number[]) => {
    const sumOfMovements = movements.reduce((acc, currentValue) => acc + currentValue, 0);
    return portfolioCapital - sumOfMovements
}


export type Movement = {
    amount: number,
    executionDate: Date,
}

export const contributionWeightedOverTime = (today: Date, movements: Movement[]) => {
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

export const dayBetween = (date1: Date, date2: Date) => {
    const diffInTime = date1.getTime() - date2.getTime();
    const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
    return Math.abs(diffInDays);
}